<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GiftCardTemplate extends Model
{
    protected $fillable = [
        'title',
        'description',
        'amount',
        'image_path',
        'active',
        'sort_order',
    ];

    protected $casts = [
        'active'  => 'boolean',
        'amount'  => 'float',
    ];

    public function vouchers(): HasMany
    {
        return $this->hasMany(Voucher::class, 'gift_card_template_id');
    }

    public function getImageUrl(): string
    {
        return $this->image_path
            ? asset('storage/' . $this->image_path)
            : asset('images/gift-card-placeholder.png');
    }
}
