<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\SalesAnalytics
 *
 * @property int $id
 * @property string $date
 * @property int $total_sales
 * @property float $total_revenue
 * @property int $new_customers
 * @property int $page_views
 * @property int $unique_visitors
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|SalesAnalytics newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesAnalytics newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesAnalytics query()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesAnalytics whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesAnalytics whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesAnalytics whereTotalSales($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesAnalytics whereTotalRevenue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesAnalytics whereNewCustomers($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesAnalytics wherePageViews($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesAnalytics whereUniqueVisitors($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesAnalytics whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesAnalytics whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesAnalytics forDateRange(string $startDate, string $endDate)
 * @method static \Database\Factories\SalesAnalyticsFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class SalesAnalytics extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'date',
        'total_sales',
        'total_revenue',
        'new_customers',
        'page_views',
        'unique_visitors',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date',
        'total_sales' => 'integer',
        'total_revenue' => 'decimal:2',
        'new_customers' => 'integer',
        'page_views' => 'integer',
        'unique_visitors' => 'integer',
    ];

    /**
     * Scope a query to filter by date range.
     */
    public function scopeForDateRange($query, string $startDate, string $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }

    /**
     * Create or update analytics for a specific date.
     */
    public static function updateForDate(string $date, array $data): self
    {
        return self::updateOrCreate(
            ['date' => $date],
            $data
        );
    }

    /**
     * Get analytics summary for a date range.
     */
    public static function getSummary(string $startDate, string $endDate): array
    {
        $analytics = self::forDateRange($startDate, $endDate)->get();

        return [
            'total_sales' => $analytics->sum('total_sales'),
            'total_revenue' => $analytics->sum('total_revenue'),
            'new_customers' => $analytics->sum('new_customers'),
            'page_views' => $analytics->sum('page_views'),
            'unique_visitors' => $analytics->sum('unique_visitors'),
            'avg_order_value' => $analytics->sum('total_sales') > 0 
                ? $analytics->sum('total_revenue') / $analytics->sum('total_sales') 
                : 0,
        ];
    }
}