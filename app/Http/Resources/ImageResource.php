<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            "id" => $this->id,
            "filename" => $this->filename,
            "path" => Storage::url($this->path),
            "order" => $this->order,
            "product_id" => $this->product_id,
            "created_at" => $this->created_at,
        ];

        return $this->arrayKeysToCamelCase($data);
    }

    protected function arrayKeysToCamelCase(array $array): array
    {
        return collect($array)
            ->mapWithKeys(function ($value, $key) {
                return [Str::camel($key) => $value];
            })
            ->toArray();
    }
}
