<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $casts = [
        'variation_type_option_ids' => 'array',
        'total_price' => 'float',
         'refunded_at' => 'datetime',
    'manual_paid_at' => 'datetime',
    'created_at' => 'datetime',
    'updated_at' => 'datetime',

    ];

    protected $fillable = [
         'is_read' => 'boolean',
        'stripe_session_id',
        'user_id',
        'vendor_user_id',
        'total_price',
        'booking_fee', // ✅ make sure this is included
        'status',
        'shipping_address_id',
        'payment_intent',
        'online_payment_comission',
        'website_payment_comission',
        'vendor_subtotal',
        'is_paid',
        'manual_paid_at',
        'payment_method',

    ];


    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function vendor(): BelongsTo
    {
        // return $this->belongsTo(Vendor::class );

        return $this->belongsTo(Vendor::class, 'vendor_user_id', 'user_id');
    }



    public function vendorUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'vendor_user_id');
    }

    public function shippingAddress(): BelongsTo
    {
        return $this->belongsTo(ShippingAddress::class, 'shipping_address_id');
    }
    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function booking()
    {
        return $this->hasOne(Booking::class, 'order_id');
    }


    public function voucherUsage()
    {
        return $this->hasOne(VoucherUsage::class);
    }
}
