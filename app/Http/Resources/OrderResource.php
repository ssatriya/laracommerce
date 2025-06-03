<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class OrderResource extends JsonResource
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
            "user_id" => $this->user_id,
            "total_price" => $this->total_price,
            "status" => Str::title($this->status),
            "shipping_address" => $this->shipping_address,
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
