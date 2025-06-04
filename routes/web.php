<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\ProductCatalogueController;
use App\Http\Controllers\ManageProductController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [ProductCatalogueController::class, 'index'])->name('products.index');

Route::post('/order', [OrderController::class, 'placeOrder'])->name('order');

Route::get('/products/cart', function () {
    return Inertia::render('products/cart/index');
})->name('products.cart');

Route::get('/products/{product:slug}', [ProductCatalogueController::class, 'show'])->name('products.show');


Route::middleware(['auth', 'verified'])->group(function () {

    Route::prefix('dashboard')->name('dashboard.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('dashboard/index');
        })->name('index');

        Route::prefix('/my-orders')->name('orders.')->middleware('role:user')->group(function () {
            Route::get('/', [OrderController::class, 'userOrders'])->name('user.orders');
        });

        Route::prefix('/manage-orders')->name('orders.')->middleware('role:admin')->group(function () {
            Route::get('/', [OrderController::class, 'manageOrders'])->name('manage.orders');

            Route::patch('/{order}', [OrderController::class, 'updateStatusOrder'])->name('update.status');
        });

        Route::prefix('/categories')->name('categories.')->middleware('role:admin')->group(function () {
            Route::get('/', [CategoryController::class, 'index'])->name('index');

            Route::post('/store', [CategoryController::class, 'store'])->name('store');

            Route::patch('/update/{category}', [CategoryController::class, 'update'])->name('update');

            Route::delete('/destroy/{category}', [CategoryController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('/products')->name('products.')->middleware('role:admin')->group(function () {
            Route::get('/', [ManageProductController::class, 'index'])->name('index');

            Route::get('/create', [ManageProductController::class, 'create'])->name('create');

            Route::post('/store',   [ManageProductController::class, 'store'])->name('store');

            Route::get('/{product}/edit',   [ManageProductController::class, 'edit'])->name('edit');

            Route::patch('/update/{product}', [ManageProductController::class, 'update'])->name('update');

            Route::delete('/destroy/{product}', [ManageProductController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('/images')->name('images.')->middleware('role:admin')->group(function () {
            Route::post('/upload', [ImageController::class, 'upload'])->name('upload');

            Route::post('/existing/upload/{product}', [ImageController::class, 'uploadForProduct'])->name('upload.existing');

            Route::put('/reorder', [ImageController::class, 'reorder'])->name('reorder');

            Route::put('/existing/reorder/{product}', [ImageController::class, 'reorderForProduct'])->name('reorder.existing');
        });
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
