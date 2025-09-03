<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\Services\ProductAuthService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::with('seller')
            ->active()
            ->latest();

        // Filter by category if provided
        if ($request->filled('category')) {
            $query->byCategory($request->category);
        }

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%")
                  ->orWhere('short_description', 'LIKE', "%{$search}%");
            });
        }

        $products = $query->paginate(12);

        // Get categories for filter
        $categories = Product::active()
            ->distinct()
            ->pluck('category')
            ->sort()
            ->values();

        return Inertia::render('products/index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (!ProductAuthService::canCreate(auth()->user())) {
            abort(403, 'Unauthorized to create products.');
        }

        return Inertia::render('products/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        if (!ProductAuthService::canCreate(auth()->user())) {
            abort(403, 'Unauthorized to create products.');
        }

        $data = $request->validated();
        $data['seller_id'] = auth()->id();

        // Handle file upload
        if ($request->hasFile('digital_file')) {
            $data['file_path'] = $request->file('digital_file')->store('products', 'private');
        }

        // Handle preview image upload
        if ($request->hasFile('preview_image')) {
            $data['preview_image'] = $request->file('preview_image')->store('previews', 'public');
        }

        $product = Product::create($data);

        return redirect()->route('products.show', $product)
            ->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load('seller');

        // Get related products from the same category
        $relatedProducts = Product::active()
            ->where('category', $product->category)
            ->where('id', '!=', $product->id)
            ->with('seller')
            ->limit(4)
            ->get();

        return Inertia::render('products/show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        if (!ProductAuthService::canUpdate(auth()->user(), $product)) {
            abort(403, 'Unauthorized to edit this product.');
        }

        return Inertia::render('products/edit', [
            'product' => $product
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        if (!ProductAuthService::canUpdate(auth()->user(), $product)) {
            abort(403, 'Unauthorized to update this product.');
        }

        $data = $request->validated();

        // Handle file upload
        if ($request->hasFile('digital_file')) {
            $data['file_path'] = $request->file('digital_file')->store('products', 'private');
        }

        // Handle preview image upload
        if ($request->hasFile('preview_image')) {
            $data['preview_image'] = $request->file('preview_image')->store('previews', 'public');
        }

        $product->update($data);

        return redirect()->route('products.show', $product)
            ->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        if (!ProductAuthService::canDelete(auth()->user(), $product)) {
            abort(403, 'Unauthorized to delete this product.');
        }

        $product->delete();

        return redirect()->route('dashboard')
            ->with('success', 'Product deleted successfully.');
    }
}