<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'product_id' => Product::factory(),
            'price' => fake()->randomFloat(2, 9.99, 299.99),
            'downloads_used' => fake()->numberBetween(0, 3),
        ];
    }

    /**
     * Indicate that downloads have been used.
     */
    public function withDownloads(): static
    {
        return $this->state(fn (array $attributes) => [
            'downloads_used' => fake()->numberBetween(1, 5),
        ]);
    }

    /**
     * Indicate that no downloads have been used.
     */
    public function noDownloads(): static
    {
        return $this->state(fn (array $attributes) => [
            'downloads_used' => 0,
        ]);
    }
}