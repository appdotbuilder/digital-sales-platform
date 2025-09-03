<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard based on user role.
     */
    public function index(Request $request)
    {
        $user = auth()->user();

        if ($user->isSeller() || $user->isAdmin()) {
            // Seller/Admin Dashboard
            $query = $user->isAdmin() 
                ? Product::query() 
                : $user->products();

            $totalProducts = $query->count();
            $activeProducts = $query->where('is_active', true)->count();

            // Sales data
            $salesQuery = $user->isAdmin() 
                ? Order::where('status', 'completed') 
                : Order::where('status', 'completed')->whereHas('items.product', function ($q) use ($user) {
                    $q->where('seller_id', $user->id);
                });

            $totalSales = $salesQuery->count();
            $totalRevenue = $salesQuery->sum('total_amount');

            // Recent orders
            $recentOrders = $user->isAdmin() 
                ? Order::with(['buyer', 'items.product'])->latest()->limit(5)->get()
                : Order::with(['buyer', 'items.product'])
                    ->whereHas('items.product', function ($q) use ($user) {
                        $q->where('seller_id', $user->id);
                    })
                    ->latest()
                    ->limit(5)
                    ->get();

            // Top products
            $topProducts = $user->isAdmin()
                ? Product::withCount(['orderItems' => function ($q) {
                    $q->whereHas('order', function ($q) {
                        $q->where('status', 'completed');
                    });
                }])
                ->orderBy('order_items_count', 'desc')
                ->limit(5)
                ->get()
                : $user->products()
                    ->withCount(['orderItems' => function ($q) {
                        $q->whereHas('order', function ($q) {
                            $q->where('status', 'completed');
                        });
                    }])
                    ->orderBy('order_items_count', 'desc')
                    ->limit(5)
                    ->get();

            return Inertia::render('dashboard', [
                'stats' => [
                    'totalProducts' => $totalProducts,
                    'activeProducts' => $activeProducts,
                    'totalSales' => $totalSales,
                    'totalRevenue' => number_format($totalRevenue, 2),
                ],
                'recentOrders' => $recentOrders,
                'topProducts' => $topProducts,
                'userRole' => $user->role,
            ]);
        }

        // Buyer Dashboard
        $totalOrders = $user->orders()->count();
        $completedOrders = $user->orders()->where('status', 'completed')->count();
        $totalSpent = $user->orders()->where('status', 'completed')->sum('total_amount');

        // Recent orders
        $recentOrders = $user->orders()
            ->with(['items.product'])
            ->latest()
            ->limit(5)
            ->get();

        // Recommended products (based on categories of previously purchased products)
        $purchasedCategories = $user->orders()
            ->where('status', 'completed')
            ->with('items.product')
            ->get()
            ->pluck('items.*.product.category')
            ->flatten()
            ->unique()
            ->toArray();

        $recommendedProducts = Product::active()
            ->whereIn('category', $purchasedCategories)
            ->whereNotIn('id', function ($query) use ($user) {
                $query->select('product_id')
                    ->from('order_items')
                    ->whereIn('order_id', function ($subQuery) use ($user) {
                        $subQuery->select('id')
                            ->from('orders')
                            ->where('buyer_id', $user->id)
                            ->where('status', 'completed');
                    });
            })
            ->with('seller')
            ->limit(6)
            ->get();

        // If no previous purchases, show popular products
        if ($recommendedProducts->isEmpty()) {
            $recommendedProducts = Product::active()
                ->withCount(['orderItems' => function ($q) {
                    $q->whereHas('order', function ($q) {
                        $q->where('status', 'completed');
                    });
                }])
                ->orderBy('order_items_count', 'desc')
                ->with('seller')
                ->limit(6)
                ->get();
        }

        return Inertia::render('dashboard', [
            'stats' => [
                'totalOrders' => $totalOrders,
                'completedOrders' => $completedOrders,
                'totalSpent' => number_format($totalSpent, 2),
            ],
            'recentOrders' => $recentOrders,
            'recommendedProducts' => $recommendedProducts,
            'userRole' => $user->role,
        ]);
    }
}