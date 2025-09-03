import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

interface OrderItem {
    id: number;
    price: number;
    downloads_used: number;
    product: {
        id: number;
        name: string;
        download_limit: number;
    };
}

interface Order {
    id: number;
    order_number: string;
    total_amount: number;
    status: string;
    payment_method: string;
    created_at: string;
    completed_at?: string;
    items: OrderItem[];
}

interface OrdersIndexProps {
    orders: {
        data: Order[];
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
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Orders',
        href: '/orders',
    },
];

export default function OrdersIndex({ orders }: OrdersIndexProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return '✅';
            case 'pending':
                return '⏳';
            case 'failed':
                return '❌';
            default:
                return '❓';
        }
    };

    const getPaymentIcon = (method: string) => {
        switch (method) {
            case 'ewallet':
                return '💰';
            case 'mobile_banking':
                return '📱';
            case 'qr_code':
                return '📸';
            default:
                return '💳';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Orders" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            📋 My Orders
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {orders.meta.total} order{orders.meta.total !== 1 ? 's' : ''} found
                        </p>
                    </div>

                    <Link
                        href={route('products.index')}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        🛍️ Browse Products
                    </Link>
                </div>

                {/* Orders List */}
                {orders.data.length > 0 ? (
                    <div className="space-y-6">
                        {orders.data.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                            >
                                {/* Order Header */}
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-2xl">{getStatusIcon(order.status)}</span>
                                            <div>
                                                <Link
                                                    href={route('orders.show', order.id)}
                                                    className="text-lg font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                                >
                                                    {order.order_number}
                                                </Link>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Placed on {formatDate(order.created_at)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                {formatCurrency(order.total_amount)}
                                            </p>
                                            <div className="flex items-center space-x-2">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {getPaymentIcon(order.payment_method)} {order.payment_method.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                        Items ({order.items.length})
                                    </h4>
                                    <div className="space-y-3">
                                        {order.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                            >
                                                <div className="flex-1">
                                                    <Link
                                                        href={route('products.show', item.product.id)}
                                                        className="font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                                    >
                                                        {item.product.name}
                                                    </Link>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {item.downloads_used} of {item.product.download_limit} downloads used
                                                    </p>
                                                </div>

                                                <div className="flex items-center space-x-3">
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {formatCurrency(item.price)}
                                                    </p>

                                                    {order.status === 'completed' && (
                                                        <button
                                                            onClick={() => router.post(route('orders.download', [order.id, item.id]))}
                                                            className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 transition-colors"
                                                        >
                                                            ⬇️ Download
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-4 flex justify-end space-x-3">
                                        <Link
                                            href={route('orders.show', order.id)}
                                            className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                                        >
                                            View Details
                                        </Link>

                                        {order.status === 'failed' && (
                                            <button
                                                onClick={() => {
                                                    // Retry payment logic would go here
                                                    alert('Payment retry functionality coming soon!');
                                                }}
                                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                                            >
                                                🔄 Retry Payment
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No orders yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Start shopping to see your orders here
                        </p>
                        <Link
                            href={route('products.index')}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            🛍️ Browse Products
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {orders.links && orders.meta.last_page > 1 && (
                    <div className="flex justify-center">
                        <nav className="flex items-center space-x-2">
                            {orders.links.map((link, index) => (
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
        </AppLayout>
    );
}