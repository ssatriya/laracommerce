<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class CategoryResource extends JsonResource
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
            "label" => $this->label,
            "slug" => $this->slug,
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
