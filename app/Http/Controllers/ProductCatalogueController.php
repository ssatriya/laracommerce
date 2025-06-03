<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Http\Services\CategoryService;
use App\Http\Services\ProductService;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductCatalogueController extends Controller
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
        $product = $this->productService->getProductCatalogues();

        return Inertia::render('products/index', [
            'product' => $product
        ]);
    }

    public function show(Product $product)
    {
        $product->load('images', 'category');

        return Inertia::render('products/show/index', [
            'product' => new ProductResource($product)
        ]);
    }
}
