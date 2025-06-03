<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Services\CategoryService;
use App\Models\Category;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CategoryController extends Controller
{
    protected CategoryService $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index()
    {
        $category = $this->categoryService->getCategories();

        return Inertia::render(
            'dashboard/categories/index',
            [
                'category' => $category
            ]
        );
    }

    public function store(StoreCategoryRequest  $request)
    {
        try {
            DB::transaction(function () use ($request) {
                Category::create($request->validated());
            });

            return to_route('dashboard.categories.index');
        } catch (\Throwable $e) {
            return to_route('dashboard.categories.index')->withErrors('Something went wrong', $e->getMessage());
        }
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        try {
            DB::transaction(function () use ($request, $category) {
                $category->update($request->validated());
            });

            return to_route('dashboard.categories.index');
        } catch (\Throwable $e) {
            return to_route('dashboard.categories.index')->withErrors('Something went wrong', $e->getMessage());
        }
    }

    public function destroy(Category $category)
    {
        try {
            DB::transaction(function () use ($category) {
                $category->delete();
            });

            return to_route('dashboard.categories.index');
        } catch (\Throwable $e) {
            return to_route('dashboard.categories.index')->withErrors('Something went wrong', $e->getMessage());
        }
    }
}
