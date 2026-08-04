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
    $category->load('department');

    $products = Product::query()
        ->where('category_id', $category->id)
        ->filterApproved()
        ->with([
            'department',
            'user.vendor',
            'variationTypes.options.media',
            'variations',
            'media',
            'reviews.user',
        ])
        ->withAvg('reviews', 'rating')
        ->withCount('reviews')
        ->latest()
        ->paginate(12)
        ->withQueryString();

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




    public function products(Category $category)
{
    $products = Cache::remember("category:{$category->id}:products", 300, function () use ($category) {
        return $category->products()
            ->published()
            ->vendorApproved()
            ->select('id', 'title', 'price', 'category_id', 'created_by')
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'title' => $product->title,
                    'price' => $product->price,
                    'image' => $product->getFirstImageUrl(),
                ];
            });
    });

    return response()->json(['products' => $products]);
}
    

}
