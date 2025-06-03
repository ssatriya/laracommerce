<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Http\Services\OrderService;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class OrderController extends Controller
{
    protected OrderService $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function userOrders()
    {
        $order = $this->orderService->getOrders();

        return Inertia::render('dashboard/user-orders/index', [
            'order' => $order
        ]);
    }

    public function manageOrders()
    {
        $order = $this->orderService->getOrders();

        return Inertia::render('dashboard/manage-orders/index', [
            'order' => $order
        ]);
    }

    public function updateStatusOrder(Request $request, Order $order)
    {
        try {
            DB::transaction(function () use ($request, $order) {
                $order->status = $request->input('status');
                $order->save();
            });

            return to_route('dashboard.orders.manage.orders')
                ->with('success', 'Order status updated successfully');
        } catch (\Exception $e) {
            Log::error('Failed to update order status', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
                'request_data' => $request->safe()->toArray()
            ]);

            return back()
                ->withInput()
                ->withErrors(['status' => 'Failed to update order status. Please try again.']);
        }
    }

    public function placeOrder(StoreOrderRequest $request)
    {
        try {
            DB::transaction(function () use ($request) {
                $order = Order::create($request->validated());

                foreach ($request->validated('product_list') as $productItem) {
                    $product = Product::lockForUpdate()->findOrFail($productItem['id']);

                    if ($product->quantity < $productItem['quantity']) {
                        throw new \Exception("Not enough stock for product: {$product->name}");
                    }

                    OrderDetail::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'quantity' => $productItem['quantity'],
                        'price' => $product->price * $productItem['quantity'],
                    ]);

                    $product->decrement('quantity', $productItem['quantity']);
                }
            });

            return to_route('dashboard.index')
                ->with('success', 'Order placed successfully');
        } catch (\Exception $e) {
            Log::error('Failed to place order', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
                'request_data' => $request->safe()->toArray()
            ]);

            return back()
                ->withInput()
                ->withErrors(['order' => 'Failed to place order. Please try again.']);
        }
    }
}
