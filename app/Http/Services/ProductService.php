<?php

namespace App\Http\Services;

use App\Facades\DataTable;
use App\Http\Resources\ProductResource;
use App\Models\Product;

class ProductService
{
    public function getProducts()
    {
        $sort = str_replace(
            ['name', 'created_at'],
            ['name', 'created_at'],
            request()->get('col')
        );

        $result = DataTable::query(Product::with(['category:id,label,slug', 'images' => function ($query) {
            $query->where('order', 0)->limit(1);
        }]))
            ->searchable(['name'])
            ->applySort($sort)
            ->allowedSorts(['name', 'created_at'])
            ->make();

        return ProductResource::collection($result);
    }

    public function getProductById(string $id)
    {
        $result = Product::with(['images', 'category'])->findOrFail($id);

        return new ProductResource($result);
    }

    public function getProductCatalogues()
    {
        $sort = str_replace(
            ['name', 'created_at'],
            ['name', 'created_at'],
            request()->get('col')
        );

        $result = DataTable::query(Product::with(['category:id,label,slug', 'images' => function ($query) {
            $query->orderBy('order');
        }]))
            ->searchable(['name'])
            ->applySort($sort)
            ->allowedSorts(['name', 'created_at'])
            ->make();

        return ProductResource::collection($result);
    }
}
