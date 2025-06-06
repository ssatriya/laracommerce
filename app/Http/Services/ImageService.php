<?php

namespace App\Http\Services;

use App\Models\Image;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    private const ALLOWED_EXTENSIONS = ['jpeg', 'jpg', 'png', 'gif', 'webp', 'avif'];
    private const STORAGE_DISK = 'public';
    private const IMAGES_DIRECTORY = 'images';

    /**
     * Process image upload and return data for database storage
     */
    public function processImageUpload(UploadedFile $file, array $validatedData, ?string $directory = null): array
    {
        $this->validateImageFile($file);

        $filename = $this->generateUniqueFilename($file);
        $path = $this->storeImageFile($file, $filename, $directory);

        // Get image dimensions
        [$width, $height] = getimagesize($file->getPathname());

        return [
            'id' => $validatedData['id'],
            'filename' => $filename,
            'path' => $path,
            'order' => intval($validatedData['order']) ?? 0,
            'product_id' => $validatedData['product_id'] ?? null,
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'width' => $width,
            'height' => $height,
        ];
    }

    /**
     * Process avatar upload and return data for database storage
     */
    public function processAvatarUpload(UploadedFile $file,  ?string $directory = null): array
    {
        $this->validateImageFile($file);

        $filename = $this->generateUniqueFilename($file);
        $path = $this->storeImageFile($file, $filename, $directory);

        // Get image dimensions
        [$width, $height] = getimagesize($file->getPathname());

        return [
            'filename' => $filename,
            'path' => $path,
            'width' => $width,
            'height' => $height,
        ];
    }


    /**
     * Get publicly accessible URL for an image path
     */
    public function getImageUrl(string $path): string
    {
        if (empty($path)) {
            throw new \InvalidArgumentException('Image path cannot be empty');
        }

        return Storage::disk(self::STORAGE_DISK)->get($path);
    }

    /**
     * Bulk update image order
     */
    public function bulkUpdateImageOrder(array $items): int
    {
        $updatedCount = 0;
        $ids = collect($items)->pluck('id')->toArray();

        // Verify existence in single query
        $existingCount = Image::whereIn('id', $ids)->count();
        if ($existingCount !== count($ids)) {
            throw new \InvalidArgumentException('One or more images do not exist');
        }

        // Single transaction for all updates
        DB::transaction(function () use ($items, &$updatedCount) {
            foreach ($items as $item) {
                $updated = Image::where('id', $item['id'])
                    ->update(['order' => $item['order']]);
                $updatedCount += $updated;
            }
        });

        return $updatedCount;
    }

    /**
     * Delete image file and database record
     */
    public function deleteImage(string $imageId): bool
    {
        return DB::transaction(function () use ($imageId) {
            $image = Image::findOrFail($imageId);

            // Delete file from storage if exists
            if ($image->path && Storage::disk(self::STORAGE_DISK)->exists($image->path)) {
                Storage::disk(self::STORAGE_DISK)->delete($image->path);
            }

            return $image->delete();
        });
    }

    /**
     * Validate uploaded image file
     */
    private function validateImageFile(UploadedFile $file): void
    {
        if (!$file->isValid()) {
            throw new \InvalidArgumentException('Invalid file upload');
        }

        $extension = strtolower($file->getClientOriginalExtension());
        if (!in_array($extension, self::ALLOWED_EXTENSIONS)) {
            throw new \InvalidArgumentException(sprintf(
                'Unsupported file type. Allowed: %s',
                implode(', ', self::ALLOWED_EXTENSIONS)
            ));
        }

        // Additional validation for actual file content
        try {
            getimagesize($file->getPathname());
        } catch (\Exception $e) {
            throw new \InvalidArgumentException('Invalid image file');
        }
    }

    /**
     * Generate unique filename for uploaded image
     */
    private function generateUniqueFilename(UploadedFile $file): string
    {
        $extension = strtolower($file->getClientOriginalExtension());
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);

        return sprintf(
            '%s_%s_%s.%s',
            now()->format('YmdHis'),
            Str::random(8),
            Str::slug($originalName),
            $extension
        );
    }

    /**
     * Store image file to disk
     */
    private function storeImageFile(UploadedFile $file, string $filename, ?string $directory = null): string
    {
        $targetDirectory = $directory ?? self::IMAGES_DIRECTORY;

        return Storage::disk(self::STORAGE_DISK)
            ->putFileAs(
                $targetDirectory,
                $file,
                $filename
            ) ?: throw new \RuntimeException('Failed to store image file');
    }
}
