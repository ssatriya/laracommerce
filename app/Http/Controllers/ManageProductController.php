<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Services\CategoryService;
use App\Http\Services\ProductService;
use App\Models\Image;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class ManageProductController extends Controller
{
    protected ProductService $productService;
    protected CategoryService $categoryService;

    public function __construct(
        ProductService $productService,
        CategoryService $categoryService
    ) {
        $this->productService = $productService;
        $this->categoryService = $categoryService;
    }

    public function index()
    {
        $product = $this->productService->getProducts();

        return Inertia::render('dashboard/products/index', [
            'product' => $product
        ]);
    }

    public function create()
    {
        $categories = $this->categoryService->categoryOption();

        return Inertia::render('dashboard/products/create/index', [
            'categories' => $categories
        ]);
    }


    public function store(StoreProductRequest $request)
    {
        try {
            DB::transaction(function () use ($request) {
                $validated = $request->validated();

                $product = Product::create($validated);

                Image::whereIn('id', $validated['images'])->update(['product_id' => $product->id]);
            });

            return to_route('dashboard.products.index');
        } catch (\Throwable $e) {
            return to_route('dashboard.products.index')->withErrors('Something went wrong', $e->getMessage());
        }
    }

    public function edit(Request $request, Product $product)
    {
        $product = $this->productService->getProductById($product->id);
        $categories = $this->categoryService->categoryOption();

        return Inertia::render('dashboard/products/edit/index', [
            'product' => $product,
            'categories' => $categories
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        try {
            DB::transaction(function () use ($request, $product) {
                $product->update($request->validated());
            });

            return to_route('dashboard.products.index', $product->id);
        } catch (\Throwable $e) {
            return to_route('dashboard.products.index', $product->id)->withErrors('Something went wrong', $e->getMessage());
        }
    }
}
