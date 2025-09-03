<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DownloadController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Home page - Digital Marketplace Welcome
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Public product browsing
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard - role-based
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Product management (sellers and admins only)
    Route::resource('products', ProductController::class)->except(['index', 'show']);
    
    // Order management
    Route::resource('orders', OrderController::class)->except(['edit', 'update', 'destroy']);
    Route::post('/orders/{order}/download/{orderItem}', [DownloadController::class, 'store'])
        ->name('orders.download');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
