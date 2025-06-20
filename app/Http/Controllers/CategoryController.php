<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductListResource;
use App\Models\Category;
use App\Models\CategoryGroup;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{

  public function show(Category $category)
{
    $category->load(['department', 'products.user', 'products.department', 'products.options']);

  $products = Product::with(['user', 'department', 'options'])
    ->where('category_id', $category->id)
    ->distinct('id')       // Ensure distinct product IDs at DB level
    ->get()
    ->unique('id')        // Extra safety on collection level
    ->values();

    $groups = CategoryGroup::with([
        'categories' => function ($query) {
            $query->select(
                'categories.id',
                'categories.name',
                'categories.image',
                'categories.department_id',
                'categories.parent_id',
                'categories.active'
            )->with('department');
        }
    ])->where('active', true)->get();

    return Inertia::render('Category/Show', [
        'category' => $category,
        'department' => $category->department,
        'products' => ProductListResource::collection($products),
        'categoryGroups' => $groups,
    ]);
}

}
