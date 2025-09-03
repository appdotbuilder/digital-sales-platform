import React from 'react';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900">
                {/* Header */}
                <header className="relative z-50 bg-white/80 backdrop-blur-md border-b dark:bg-gray-900/80 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">📱</span>
                                </div>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">DigitalStore</span>
                            </div>
                            
                            <nav className="flex items-center space-x-4">
                                <Link
                                    href={route('products.index')}
                                    className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors"
                                >
                                    Browse Products
                                </Link>
                                {auth.user ? (
                                    <div className="flex items-center space-x-4">
                                        <Link
                                            href={route('dashboard')}
                                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                                        >
                                            Dashboard
                                        </Link>
                                    </div>
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
                                            Get Started
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <div className="text-center">
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                                🚀 Digital Marketplace
                                <span className="block text-indigo-600 dark:text-indigo-400">
                                    For Creators & Buyers
                                </span>
                            </h1>
                            
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
                                The ultimate platform where digital creators sell premium products and buyers discover 
                                amazing digital assets. From e-books to software, templates to courses - everything digital, 
                                all in one place.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                                <Link
                                    href={route('products.index')}
                                    className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                                >
                                    🛒 Start Shopping
                                </Link>
                                {!auth.user && (
                                    <Link
                                        href={route('register')}
                                        className="bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-4 rounded-xl text-lg font-medium hover:bg-indigo-50 transform hover:scale-105 transition-all duration-200 dark:bg-gray-800 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-gray-700"
                                    >
                                        💼 Become a Seller
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Features Grid */}
                        <div className="grid md:grid-cols-3 gap-8 mb-20">
                            {/* For Sellers */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-6">
                                    <span className="text-2xl">📊</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    For Sellers
                                </h3>
                                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                    <li>📈 Real-time sales dashboard</li>
                                    <li>🎯 Product management tools</li>
                                    <li>💰 Instant payment processing</li>
                                    <li>📊 Detailed analytics & insights</li>
                                </ul>
                            </div>

                            {/* For Buyers */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
                                    <span className="text-2xl">🛍️</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    For Buyers
                                </h3>
                                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                    <li>🔍 Easy product browsing</li>
                                    <li>💳 Secure payment options</li>
                                    <li>📱 Mobile-friendly checkout</li>
                                    <li>⬇️ Instant digital downloads</li>
                                </ul>
                            </div>

                            {/* Platform Features */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-6">
                                    <span className="text-2xl">⚡</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    Platform Features
                                </h3>
                                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                    <li>🌙 Dark/light mode toggle</li>
                                    <li>📊 Advanced search & filters</li>
                                    <li>🔒 Secure user authentication</li>
                                    <li>⚡ Lightning-fast performance</li>
                                </ul>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                💳 Secure Payment Options
                            </h3>
                            <div className="flex flex-wrap justify-center items-center gap-8">
                                <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg">
                                    <span className="text-2xl">💰</span>
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">E-Wallet</span>
                                </div>
                                <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg">
                                    <span className="text-2xl">📱</span>
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">Mobile Banking</span>
                                </div>
                                <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg">
                                    <span className="text-2xl">📸</span>
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">QR Code</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="flex items-center space-x-2 mb-4 md:mb-0">
                                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded flex items-center justify-center">
                                    <span className="text-white font-bold text-xs">📱</span>
                                </div>
                                <span className="text-lg font-bold text-gray-900 dark:text-white">DigitalStore</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Built with ❤️ for the digital creator economy
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}