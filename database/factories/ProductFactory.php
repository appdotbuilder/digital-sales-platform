<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['ebooks', 'software', 'templates', 'graphics', 'audio', 'video', 'courses'];
        $tags = ['business', 'design', 'education', 'marketing', 'productivity', 'creative', 'tech'];

        return [
            'name' => fake()->sentence(3),
            'description' => fake()->paragraphs(3, true),
            'short_description' => fake()->sentence(10),
            'price' => fake()->randomFloat(2, 9.99, 299.99),
            'category' => fake()->randomElement($categories),
            'file_path' => 'products/' . fake()->uuid() . '.zip',
            'preview_image' => fake()->boolean(70) ? 'previews/' . fake()->uuid() . '.jpg' : null,
            'tags' => fake()->randomElements($tags, fake()->numberBetween(1, 4)),
            'is_active' => fake()->boolean(90),
            'download_limit' => fake()->randomElement([3, 5, 10, 20]),
            'seller_id' => User::factory(),
        ];
    }

    /**
     * Indicate that the product is premium.
     */
    public function premium(): static
    {
        return $this->state(fn (array $attributes) => [
            'price' => fake()->randomFloat(2, 199.99, 999.99),
            'name' => 'Premium ' . fake()->sentence(2),
            'download_limit' => 10,
        ]);
    }

    /**
     * Indicate that the product is on sale.
     */
    public function onSale(): static
    {
        return $this->state(fn (array $attributes) => [
            'price' => fake()->randomFloat(2, 4.99, 49.99),
            'tags' => array_merge($attributes['tags'] ?? [], ['sale', 'discount']),
        ]);
    }

    /**
     * Indicate that the product is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}