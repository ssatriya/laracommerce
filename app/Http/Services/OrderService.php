<?php

namespace App\Http\Services;

use App\Facades\DataTable;
use App\Http\Resources\OrderResource;
use App\Models\Order;

class OrderService
{
    public function getOrders()
    {
        $sort = str_replace(
            ['status', 'created_at'],
            ['status', 'created_at'],
            request()->get('col')
        );

        $result = DataTable::query(Order::query())
            ->searchable(['id', 'status'])
            ->applySort($sort)
            ->allowedSorts(['status', 'created_at'])
            ->make();

        return OrderResource::collection($result);
    }
}
