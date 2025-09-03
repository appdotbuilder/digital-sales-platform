import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface DashboardProps {
    stats: {
        totalProducts?: number;
        activeProducts?: number;
        totalSales?: number;
        totalRevenue?: string;
        totalOrders?: number;
        completedOrders?: number;
        totalSpent?: string;
    };
    recentOrders: Array<{
        id: number;
        order_number: string;
        total_amount: number;
        status: string;
        created_at: string;
        buyer?: {
            name: string;
            email: string;
        };
        items: Array<{
            product: {
                name: string;
                price: number;
            };
        }>;
    }>;

    topProducts?: Array<{
        id: number;
        name: string;
        price: number;
        order_items_count: number;
    }>;
    recommendedProducts?: Array<{
        id: number;
        name: string;
        price: number;
        category: string;
        seller: {
            name: string;
        };
    }>;
    userRole: 'buyer' | 'seller' | 'admin';
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ 
    stats, 
    recentOrders, 
    topProducts = [], 
    recommendedProducts = [],
    userRole 
}: DashboardProps) {
    const { auth } = usePage<SharedData>().props;

    const formatCurrency = (amount: number | string) => {
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(num);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'failed':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Welcome Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                    <h1 className="text-2xl font-bold mb-2">
                        Welcome back, {auth.user?.name}! 👋
                    </h1>
                    <p className="text-indigo-100">
                        {userRole === 'seller' || userRole === 'admin' 
                            ? 'Here\'s your business overview and recent activity.'
                            : 'Discover new digital products and manage your purchases.'}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid auto-rows-min gap-6 md:grid-cols-3">
                    {userRole === 'seller' || userRole === 'admin' ? (
                        <>
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalProducts || 0}</p>
                                        <p className="text-sm text-green-600 dark:text-green-400">
                                            {stats.activeProducts || 0} active
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">📦</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sales</p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalSales || 0}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">orders</p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">📊</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                            ${stats.totalRevenue || '0.00'}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">total earnings</p>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">💰</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalOrders || 0}</p>
                                        <p className="text-sm text-green-600 dark:text-green-400">
                                            {stats.completedOrders || 0} completed
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">📋</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                            ${stats.totalSpent || '0.00'}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">on digital products</p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">💳</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Link 
                                            href={route('products.index')} 
                                            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                                        >
                                            Browse Products
                                        </Link>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                                            Discover More
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Find amazing digital products</p>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">🛍️</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Recent Orders
                            </h3>
                            <Link 
                                href={route('orders.index')} 
                                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                View All
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {recentOrders.length > 0 ? (
                                recentOrders.slice(0, 5).map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {order.order_number}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                                {order.buyer && ` • ${order.buyer.name}`}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(order.total_amount)}
                                            </p>
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                                    No orders yet
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Top Products or Recommendations */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {userRole === 'seller' || userRole === 'admin' ? 'Top Products' : 'Recommended for You'}
                            </h3>
                            <Link 
                                href={route('products.index')} 
                                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                {userRole === 'seller' || userRole === 'admin' ? 'Manage Products' : 'View All'}
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {(userRole === 'seller' || userRole === 'admin' ? topProducts : recommendedProducts).length > 0 ? (
                                (userRole === 'seller' || userRole === 'admin' ? topProducts : recommendedProducts).slice(0, 5).map((product) => (
                                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {product.name}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {'category' in product && product.category}
                                                {'seller' in product && product.seller && ` • by ${product.seller.name}`}
                                                {'order_items_count' in product && ` • ${product.order_items_count} sales`}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(product.price)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                                    {userRole === 'seller' || userRole === 'admin' 
                                        ? 'No products yet'
                                        : 'No recommendations available'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Quick Actions
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {userRole === 'seller' || userRole === 'admin' ? (
                            <>
                                <Link
                                    href={route('products.create')}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    ➕ Add New Product
                                </Link>
                                <Link
                                    href={route('products.index')}
                                    className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    📦 Manage Products
                                </Link>
                                <Link
                                    href={route('orders.index')}
                                    className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    📊 View Orders
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={route('products.index')}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    🛍️ Browse Products
                                </Link>
                                <Link
                                    href={route('orders.index')}
                                    className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    📋 My Orders
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}