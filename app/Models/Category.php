<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Category extends Model
{
    protected $appends = ['image_url'];
    protected $fillable = [
        'name',
         'description',
        'parent_id',
        'department_id',
        'active',
        'image', // make sure this is included
        'slug'
    ];
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
    public function products()
    {
        return $this->hasMany(Product::class, 'category_id');
    }

    public function getImageUrlAttribute()
    {
        return $this->image ? Storage::disk('r2')->url($this->image) : null;
    }

    public function categoryGroups()
    {
        return $this->belongsToMany(CategoryGroup::class, 'category_group_category');
    }
}
