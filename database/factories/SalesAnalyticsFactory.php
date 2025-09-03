<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SalesAnalytics>
 */
class SalesAnalyticsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'date' => fake()->dateTimeBetween('-30 days')->format('Y-m-d'),
            'total_sales' => fake()->numberBetween(0, 50),
            'total_revenue' => fake()->randomFloat(2, 0, 5000),
            'new_customers' => fake()->numberBetween(0, 20),
            'page_views' => fake()->numberBetween(100, 1000),
            'unique_visitors' => fake()->numberBetween(50, 500),
        ];
    }

    /**
     * Indicate high sales day.
     */
    public function highSales(): static
    {
        return $this->state(fn (array $attributes) => [
            'total_sales' => fake()->numberBetween(30, 100),
            'total_revenue' => fake()->randomFloat(2, 2000, 10000),
            'new_customers' => fake()->numberBetween(15, 50),
            'page_views' => fake()->numberBetween(500, 2000),
            'unique_visitors' => fake()->numberBetween(200, 1000),
        ]);
    }

    /**
     * Indicate low sales day.
     */
    public function lowSales(): static
    {
        return $this->state(fn (array $attributes) => [
            'total_sales' => fake()->numberBetween(0, 5),
            'total_revenue' => fake()->randomFloat(2, 0, 500),
            'new_customers' => fake()->numberBetween(0, 3),
            'page_views' => fake()->numberBetween(20, 200),
            'unique_visitors' => fake()->numberBetween(10, 100),
        ]);
    }
}