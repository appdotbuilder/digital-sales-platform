<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->text('short_description')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('category');
            $table->string('file_path')->comment('Path to the digital file');
            $table->string('preview_image')->nullable()->comment('Product preview image');
            $table->json('tags')->nullable()->comment('Product tags for search');
            $table->boolean('is_active')->default(true);
            $table->integer('download_limit')->default(5)->comment('Number of allowed downloads');
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            
            $table->index('name');
            $table->index('category');
            $table->index('price');
            $table->index(['is_active', 'created_at']);
            $table->index(['seller_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};