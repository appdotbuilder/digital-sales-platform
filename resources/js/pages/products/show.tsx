import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

interface Product {
    id: number;
    name: string;
    description: string;
    short_description: string;
    price: number;
    category: string;
    preview_image?: string;
    tags?: string[];
    download_limit: number;
    seller: {
        id: number;
        name: string;
        bio?: string;
    };
}

interface RelatedProduct {
    id: number;
    name: string;
    price: number;
    preview_image?: string;
    seller: {
        name: string;
    };
}

interface ProductShowProps {
    product: Product;
    relatedProducts: RelatedProduct[];
    [key: string]: unknown;
}

export default function ProductShow({ product, relatedProducts }: ProductShowProps) {
    const { auth } = usePage<SharedData>().props;
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'ewallet' | 'mobile_banking' | 'qr_code'>('ewallet');
    const [showCheckout, setShowCheckout] = useState(false);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const handlePurchase = () => {
        if (!auth.user) {
            router.visit(route('login'));
            return;
        }

        router.post(route('orders.store'), {
            products: [{ id: product.id }],
            payment_method: selectedPaymentMethod,
        });
    };

    const paymentMethods = [
        { id: 'ewallet', name: 'E-Wallet', icon: '💰', description: 'Fast & secure digital payment' },
        { id: 'mobile_banking', name: 'Mobile Banking', icon: '📱', description: 'Direct bank transfer' },
        { id: 'qr_code', name: 'QR Code', icon: '📸', description: 'Scan to pay' },
    ];

    return (
        <>
            <Head title={product.name} />
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
                                <Link
                                    href={route('products.index')}
                                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                >
                                    Products
                                </Link>
                                <span className="text-gray-400 dark:text-gray-600">/</span>
                                <span className="text-gray-700 dark:text-gray-300 truncate max-w-xs">
                                    {product.name}
                                </span>
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
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Product Image */}
                        <div>
                            <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-xl flex items-center justify-center overflow-hidden">
                                {product.preview_image ? (
                                    <img
                                        src={`/storage/${product.preview_image}`}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-8xl opacity-60">📦</span>
                                )}
                            </div>
                        </div>

                        {/* Product Details */}
                        <div>
                            <div className="mb-6">
                                <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 mb-4">
                                    {product.category}
                                </span>
                                
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                    {product.name}
                                </h1>

                                <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                                    {product.short_description}
                                </p>

                                <div className="flex items-center justify-between mb-6">
                                    <div className="text-4xl font-bold text-gray-900 dark:text-white">
                                        {formatCurrency(product.price)}
                                    </div>
                                    
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            by <span className="font-medium">{product.seller.name}</span>
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-500">
                                            {product.download_limit} downloads included
                                        </p>
                                    </div>
                                </div>

                                {/* Tags */}
                                {product.tags && product.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {product.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Purchase Section */}
                            {!showCheckout ? (
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => setShowCheckout(true)}
                                        className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg mb-4"
                                    >
                                        🛒 Purchase Now - {formatCurrency(product.price)}
                                    </button>
                                    
                                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                        <p>✅ Instant download after payment</p>
                                        <p>🔒 Secure checkout process</p>
                                        <p>💳 Multiple payment options</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        💳 Choose Payment Method
                                    </h3>
                                    
                                    <div className="space-y-3 mb-6">
                                        {paymentMethods.map((method) => (
                                            <label
                                                key={method.id}
                                                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                                                    selectedPaymentMethod === method.id
                                                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="payment_method"
                                                    value={method.id}
                                                    checked={selectedPaymentMethod === method.id}
                                                    onChange={(e) => setSelectedPaymentMethod(e.target.value as 'ewallet' | 'mobile_banking' | 'qr_code')}
                                                    className="sr-only"
                                                />
                                                <div className="flex items-center space-x-3 flex-1">
                                                    <span className="text-2xl">{method.icon}</span>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {method.name}
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {method.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                {selectedPaymentMethod === method.id && (
                                                    <div className="text-indigo-600 dark:text-indigo-400">
                                                        ✅
                                                    </div>
                                                )}
                                            </label>
                                        ))}
                                    </div>

                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => setShowCheckout(false)}
                                            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            ← Back
                                        </button>
                                        <button
                                            onClick={handlePurchase}
                                            className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                                        >
                                            Complete Purchase 🚀
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Description */}
                    <div className="mt-12 grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    📝 Product Description
                                </h2>
                                <div className="prose dark:prose-invert max-w-none">
                                    {product.description.split('\n').map((paragraph, index) => (
                                        <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Seller Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 h-fit">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                👤 About the Seller
                            </h3>
                            
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold">
                                        {product.seller.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {product.seller.name}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Digital Creator
                                    </p>
                                </div>
                            </div>

                            {product.seller.bio && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    {product.seller.bio}
                                </p>
                            )}

                            <div className="text-xs text-gray-500 dark:text-gray-500">
                                💎 Verified Seller
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                🔗 Related Products
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((relatedProduct) => (
                                    <Link
                                        key={relatedProduct.id}
                                        href={route('products.show', relatedProduct.id)}
                                        className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 overflow-hidden"
                                    >
                                        <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center">
                                            {relatedProduct.preview_image ? (
                                                <img
                                                    src={`/storage/${relatedProduct.preview_image}`}
                                                    alt={relatedProduct.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-3xl opacity-60">📦</span>
                                            )}
                                        </div>

                                        <div className="p-4">
                                            <h3 className="font-medium text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {relatedProduct.name}
                                            </h3>
                                            
                                            <div className="flex items-center justify-between">
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {formatCurrency(relatedProduct.price)}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    by {relatedProduct.seller.name}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}