<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\OrderAuthService;

class DownloadController extends Controller
{
    /**
     * Download a product from an order.
     */
    public function store(Order $order, OrderItem $orderItem)
    {
        if (!OrderAuthService::canDownload(auth()->user(), $order)) {
            abort(403, 'Unauthorized to download from this order.');
        }

        if ($order->status !== 'completed') {
            return redirect()->back()
                ->with('error', 'Order must be completed to download products.');
        }

        if (!$orderItem->hasDownloadsAvailable()) {
            return redirect()->back()
                ->with('error', 'Download limit exceeded for this product.');
        }

        $orderItem->incrementDownload();

        // In a real application, you would return the actual file
        // return Storage::disk('private')->download($orderItem->product->file_path);
        
        return redirect()->back()
            ->with('success', 'Download started! (' . $orderItem->remaining_downloads . ' downloads remaining)');
    }
}