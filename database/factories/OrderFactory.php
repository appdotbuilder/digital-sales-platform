<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $paymentMethods = ['ewallet', 'mobile_banking', 'qr_code'];
        $status = fake()->randomElement(['pending', 'completed', 'failed']);

        return [
            'order_number' => Order::generateOrderNumber(),
            'buyer_id' => User::factory(),
            'total_amount' => fake()->randomFloat(2, 9.99, 499.99),
            'payment_method' => fake()->randomElement($paymentMethods),
            'status' => $status,
            'payment_reference' => $status !== 'failed' ? fake()->uuid() : null,
            'completed_at' => $status === 'completed' ? fake()->dateTimeBetween('-30 days') : null,
        ];
    }

    /**
     * Indicate that the order is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'completed_at' => fake()->dateTimeBetween('-30 days'),
            'payment_reference' => fake()->uuid(),
        ]);
    }

    /**
     * Indicate that the order is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'completed_at' => null,
            'payment_reference' => null,
        ]);
    }

    /**
     * Indicate that the order failed.
     */
    public function failed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'failed',
            'completed_at' => null,
            'payment_reference' => null,
        ]);
    }
}