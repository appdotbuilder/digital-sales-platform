<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\OrderAuthService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $orders = auth()->user()->orders()
            ->with(['items.product'])
            ->latest()
            ->paginate(10);

        return Inertia::render('orders/index', [
            'orders' => $orders
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request)
    {
        $data = $request->validated();
        
        // Get products and calculate total
        $productIds = collect($data['products'])->pluck('id');
        $products = Product::whereIn('id', $productIds)->get();
        
        $totalAmount = $products->sum('price');

        // Create order
        $order = Order::create([
            'order_number' => Order::generateOrderNumber(),
            'buyer_id' => auth()->id(),
            'total_amount' => $totalAmount,
            'payment_method' => $data['payment_method'],
            'status' => 'pending',
        ]);

        // Create order items
        foreach ($products as $product) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'price' => $product->price,
            ]);
        }

        // Simulate payment processing (95% success rate for demo)
        if (fake()->boolean(95)) {
            $order->markAsCompleted();
            $order->update(['payment_reference' => 'PAY-' . strtoupper(uniqid())]);
            
            return redirect()->route('orders.show', $order)
                ->with('success', 'Order completed successfully! You can now download your products.');
        } else {
            $order->update(['status' => 'failed']);
            
            return redirect()->back()
                ->with('error', 'Payment failed. Please try again.');
        }
    }



    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        if (!OrderAuthService::canView(auth()->user(), $order)) {
            abort(403, 'Unauthorized to view this order.');
        }

        $order->load(['items.product', 'buyer']);

        return Inertia::render('orders/show', [
            'order' => $order
        ]);
    }


}