import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

interface Product {
    id: number;
    name: string;
    short_description: string;
    price: number;
    category: string;
    preview_image?: string;
    seller: {
        name: string;
    };
}

interface ProductsIndexProps {
    products: {
        data: Product[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    categories: string[];
    filters: {
        search?: string;
        category?: string;
    };
    [key: string]: unknown;
}

export default function ProductsIndex({ products, categories, filters }: ProductsIndexProps) {
    const { auth } = usePage<SharedData>().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('products.index'), {
            search: searchTerm,
            category: selectedCategory,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        router.get(route('products.index'), {
            search: searchTerm,
            category: category,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <>
            <Head title="Browse Products" />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Link 
                                    href={route('home')}
                                    className="flex items-center space-x-2"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">📱</span>
                                    </div>
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">DigitalStore</span>
                                </Link>
                                <span className="text-gray-400 dark:text-gray-600">/</span>
                                <span className="text-gray-700 dark:text-gray-300">Products</span>
                            </div>

                            <nav className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <Link
                                            href={route('login')}
                                            className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Page Title */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            🛍️ Digital Products Marketplace
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Discover amazing digital products from talented creators
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label htmlFor="search" className="sr-only">Search products</label>
                                <input
                                    type="text"
                                    id="search"
                                    placeholder="🔍 Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Results */}
                    <div className="mb-6">
                        <p className="text-gray-600 dark:text-gray-400">
                            {products.meta.total} product{products.meta.total !== 1 ? 's' : ''} found
                        </p>
                    </div>

                    {/* Products Grid */}
                    {products.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {products.data.map((product) => (
                                <Link
                                    key={product.id}
                                    href={route('products.show', product.id)}
                                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 overflow-hidden"
                                >
                                    {/* Product Image */}
                                    <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center">
                                        {product.preview_image ? (
                                            <img
                                                src={`/storage/${product.preview_image}`}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-4xl opacity-60">📦</span>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {product.name}
                                        </h3>
                                        
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                            {product.short_description}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {formatCurrency(product.price)}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    by {product.seller.name}
                                                </p>
                                            </div>
                                            
                                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                                {product.category}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                No products found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Try adjusting your search criteria or browse all categories
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('');
                                    router.get(route('products.index'));
                                }}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {products.links && products.meta.last_page > 1 && (
                        <div className="flex justify-center">
                            <nav className="flex items-center space-x-2">
                                {products.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => link.url && router.visit(link.url)}
                                        disabled={!link.url}
                                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                            link.active
                                                ? 'bg-indigo-600 text-white'
                                                : link.url
                                                ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}