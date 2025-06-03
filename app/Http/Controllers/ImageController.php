<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReorderImageRequest;
use App\Http\Requests\UploadImageRequest;
use App\Http\Services\ImageService;
use App\Models\Image;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;

class ImageController extends Controller
{
    public function __construct(
        private readonly ImageService $imageService
    ) {}


    public function upload(UploadImageRequest $request)
    {
        try {
            $image = DB::transaction(function () use ($request) {
                $imageData = $this->imageService->processImageUpload(
                    $request->file('image'),
                    $request->validated()
                );

                return Image::create($imageData);
            });

            Log::info('Image uploaded successfully', [
                'image_id' => $image->id,
                'filename' => $image->name,
                'user_id' => Auth::id()
            ]);

            return to_route('dashboard.products.create')
                ->with('success', 'Image uploaded successfully');
        } catch (\Exception $e) {
            Log::error('Image upload failed', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
                'request_data' => $request->safe()->toArray()
            ]);

            return back()
                ->withInput()
                ->withErrors(['image' => 'Failed to upload image. Please try again.']);
        }
    }

    public function uploadForProduct(UploadImageRequest $request, Product $product)
    {
        try {
            $image = DB::transaction(function () use ($request, $product) {
                $imageData = $this->imageService->processImageUpload(
                    $request->file('image'),
                    $request->validated()
                );

                $imageData['product_id'] = $product->id;

                return Image::create($imageData);
            });

            Log::info('Image uploaded to existing product successfully', [
                'image_id' => $image->id,
                'filename' => $image->name,
                'user_id' => Auth::id()
            ]);

            return to_route('dashboard.products.edit', $product->id)
                ->with('success', 'Image uploaded to existing product successfully');
        } catch (\Exception $e) {
            Log::error('Image upload failed', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
                'request_data' => $request->safe()->toArray()
            ]);

            return back()
                ->withInput()
                ->withErrors(['image' => 'Failed to upload image. Please try again.']);
        }
    }


    public function reorder(ReorderImageRequest $request)
    {
        try {
            $updatedCount = DB::transaction(function () use ($request) {
                return $this->imageService->bulkUpdateImageOrder(
                    $request->validated('items')
                );
            });

            Log::info('Images reordered successfully', [
                'updated_count' => $updatedCount,
                'user_id' => Auth::id()
            ]);

            return to_route('dashboard.products.create')
                ->with('success', "Successfully reordered {$updatedCount} images");
        } catch (\Exception $e) {
            Log::error('Image reorder failed', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
                'request_data' => $request->safe()->toArray()
            ]);

            return back()
                ->withInput()
                ->withErrors(['items' => 'Failed to reorder images. Please try again.']);
        }
    }

    public function reorderForProduct(ReorderImageRequest $request, Product $product)
    {
        try {
            $updatedCount = DB::transaction(function () use ($request, $product) {
                $items = collect($request->validated('items'))
                    ->filter(function ($item) use ($product) {
                        return Image::where('id', $item['id'])
                            ->where('product_id', $product->id)
                            ->exists();
                    })
                    ->toArray();

                return $this->imageService->bulkUpdateImageOrder(
                    $items
                );
            });

            Log::info('Images reordered for existing product successfully', [
                'updated_count' => $updatedCount,
                'user_id' => Auth::id()
            ]);

            return to_route('dashboard.products.edit', $product->id)
                ->with('success', "Successfully reordered for existing product {$updatedCount} images");
        } catch (\Exception $e) {
            Log::error('Image reorder failed', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
                'request_data' => $request->safe()->toArray()
            ]);

            return back()
                ->withInput()
                ->withErrors(['items' => 'Failed to reorder images. Please try again.']);
        }
    }
}
