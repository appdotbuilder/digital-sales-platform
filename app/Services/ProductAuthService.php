<?php

namespace App\Services;

use App\Models\Product;
use App\Models\User;

class ProductAuthService
{
    /**
     * Check if user can view the product.
     */
    public static function canView(User $user, Product $product): bool
    {
        return $product->is_active || $user->isAdmin() || $user->id === $product->seller_id;
    }

    /**
     * Check if user can create products.
     */
    public static function canCreate(User $user): bool
    {
        return $user->isSeller() || $user->isAdmin();
    }

    /**
     * Check if user can update the product.
     */
    public static function canUpdate(User $user, Product $product): bool
    {
        return $user->isAdmin() || $user->id === $product->seller_id;
    }

    /**
     * Check if user can delete the product.
     */
    public static function canDelete(User $user, Product $product): bool
    {
        return $user->isAdmin() || $user->id === $product->seller_id;
    }
}