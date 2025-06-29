<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
class ProductGroup extends Model
{
    protected $fillable = ['name', 'slug', 'images', 'active'];
     public $products;
     protected $casts = [
    'images' => 'array',
];

  public function products()
{
    return $this->belongsToMany(Product::class, 'product_group_product');
}
public function groupedProducts()
{
    return $this->belongsToMany(Product::class, 'product_group_product');
}
 public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null; // or a placeholder URL
        }
        return asset('storage/' . $this->image);
    }

    public function getRouteKeyName()
{
    return 'slug';
}

}
