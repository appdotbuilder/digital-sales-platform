<?php

namespace App\Services;

use App\Models\Order;
use App\Models\User;

class OrderAuthService
{
    /**
     * Check if user can view the order.
     */
    public static function canView(User $user, Order $order): bool
    {
        return $user->isAdmin() || $user->id === $order->buyer_id;
    }

    /**
     * Check if user can download from the order.
     */
    public static function canDownload(User $user, Order $order): bool
    {
        return ($user->id === $order->buyer_id && $order->status === 'completed') || $user->isAdmin();
    }
}