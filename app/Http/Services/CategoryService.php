<?php

namespace App\Http\Services;

use App\Facades\DataTable;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\SelectOptionResource;
use App\Models\Category;

class CategoryService
{
    public function getCategories()
    {
        $sort = str_replace(
            ['label', 'created_at'],
            ['label', 'created_at'],
            request()->get('col')
        );

        $result = DataTable::query(Category::query())
            ->searchable(['label'])
            ->applySort($sort)
            ->allowedSorts(['label', 'created_at'])
            ->make();

        return CategoryResource::collection($result);
    }

    public function categoryOption($limit = 8)
    {
        $result = DataTable::query(Category::query())
            ->searchable(['label'])
            ->perPage($limit)
            ->type('collection')
            ->make();

        return SelectOptionResource::collection($result);
    }
}
