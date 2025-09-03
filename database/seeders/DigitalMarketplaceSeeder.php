<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\SalesAnalytics;
use App\Models\User;
use Illuminate\Database\Seeder;

class DigitalMarketplaceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::factory()->admin()->create([
            'name' => 'Digital Store Admin',
            'email' => 'admin@digitalstore.com',
            'password' => bcrypt('password'),
        ]);

        // Create sellers
        $sellers = User::factory()->seller()->count(5)->create();

        // Create buyers
        $buyers = User::factory()->buyer()->count(20)->create();

        // Create products for each seller
        foreach ($sellers as $seller) {
            $products = Product::factory()
                ->count(random_int(3, 8))
                ->create(['seller_id' => $seller->id]);

            // Create some orders for these products
            foreach ($buyers->random(random_int(3, 8)) as $buyer) {
                $order = Order::factory()->create([
                    'buyer_id' => $buyer->id,
                    'status' => fake()->randomElement(['completed', 'pending', 'completed', 'completed']), // More completed orders
                ]);

                // Add 1-3 products to each order
                $orderProducts = $products->random(random_int(1, 3));
                $totalAmount = 0;

                foreach ($orderProducts as $product) {
                    $orderItem = OrderItem::factory()->create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'price' => $product->price,
                    ]);
                    $totalAmount += $product->price;
                }

                // Update order total
                $order->update(['total_amount' => $totalAmount]);

                // Mark as completed if status is completed
                if ($order->status === 'completed') {
                    $order->markAsCompleted();
                }
            }
        }

        // Generate sales analytics for the last 30 days
        for ($i = 29; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            
            $completedOrders = Order::completed()
                ->whereDate('completed_at', $date)
                ->get();

            $totalSales = $completedOrders->count();
            $totalRevenue = $completedOrders->sum('total_amount');
            $newCustomers = User::whereDate('created_at', $date)->count();

            SalesAnalytics::create([
                'date' => $date,
                'total_sales' => $totalSales,
                'total_revenue' => $totalRevenue,
                'new_customers' => $newCustomers,
                'page_views' => random_int(50, 500),
                'unique_visitors' => random_int(20, 200),
            ]);
        }
    }
}