<?php

use App\Enums\RolesEnum;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ShippingAddressController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\VendorController;
use App\Http\Resources\ProductListResource;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\GoogleController;




Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile/shipping-addresses', [ShippingAddressController::class, 'index'])->name('shipping.index');
    Route::post('/shipping-addresses', [ShippingAddressController::class, 'store'])->name('shipping-addresses.store');
    Route::patch('/shipping-addresses/{address}/default', [ShippingAddressController::class, 'setDefault'])->name('shipping-addresses.set-default');
    Route::put('/shipping-addresses/{shippingAddress}', [ShippingAddressController::class, 'update'])->name('shipping-addresses.update');
    Route::delete('/shipping-addresses/{id}', [ShippingAddressController::class, 'destroy'])->name('shipping-addresses.destroy');
});
Route::get('/', [ProductController::class, 'home'])->name('dashboard');
Route::get('/products/{product:slug}', [ProductController::class, 'show'])->name('product.show');

Route::get('/category/{category}', [CategoryController::class, 'show'])->name('category.show');
Route::get('/product-groups/{productGroup}', [ProductController::class, 'showProductGroup'])->name('productGroup.show');


Route::get('/search-suggestions', function (Request $request) {
    $keyword = $request->query('keyword');
    $products = Product::query()
        ->forWebsite()
        ->with([
            'category',
            'department',
            'user.vendor',
            'variationTypes.options.media',
            'variations',
            'reviews'
        ])
        ->where('slug', 'LIKE', "%{$keyword}%")
        ->limit(10)
        ->get();

    return ProductListResource::collection($products);
});


Route::get('/d/{department:slug}', [ProductController::class, 'byDepartment'])
    ->name('product.byDepartment');

Route::get('/shop', [ProductController::class, 'search'])->name('shop.search');

Route::get('/seller/{vendor:store_name}', [VendorController::class, 'profile'])
    ->name('vendor.profile');


Route::get('/check-auth', function () {
    return [
        'auth_id' => Auth::id(),
        'user' => Auth::user(),
    ];
});

// Route::controller(CartController::class)->group(function () {
//     Route::get('/cart', 'index')->name('cart.index');
//     Route::post('/cart/add/{product}', 'store')->name('cart.store');
//     Route::put('/cart/{product}', 'update')->name('cart.update');
//     Route::delete('/cart/{product}', 'destroy')->name('cart.destroy');
// });


Route::post('/stripe/webhook', [StripeController::class, 'webhook'])->name('stripe.webhook');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/orders-history', [OrderController::class, 'index'])->name('orders.history');
    Route::get('/orders/{order}', [OrderController::class, 'show']);



Route::post('/admin/orders/{order}/refund', [OrderController::class, 'refund'])
    ->name('admin.orders.refund')
    ->middleware(['auth', 'role:Admin']); // adjust middleware as needed


    Route::middleware(['verified'])->group(function () {

        Route::controller(CartController::class)->group(function () {
            Route::get('/cart', 'index')->name('cart.index');
            Route::post('/cart/add/{product}', 'store')->name('cart.store');
            Route::put('/cart/{product}', 'update')->name('cart.update');
            Route::delete('/cart/{product}', 'destroy')->name('cart.destroy');
        });
        Route::post('/cart/checkout', [CartController::class, 'checkout'])->name('cart.checkout');


        Route::get('/stripe/success', [StripeController::class, 'success'])->name('stripe.success');
        Route::get('/stripe/failure', [StripeController::class, 'failure'])->name('stripe.failure');
        Route::post('/become-a-vendor', [VendorController::class, 'store'])->name('vendor.store');

        //    connect from user profile
        // Route::post('/stripe/connect', [StripeController::class, 'connect'])
        //     ->name('stripe.connect')
        //     ->middleware(['role:' . RolesEnum::Vendor->value]);


        // connect from admin dash board
        // In web.php
        Route::get('/stripe/connect/{user?}', [StripeController::class, 'connect'])->name('stripe.connect');
    });
});




// RESTful resource routes for BookingController (index, store, update, destroy)
Route::middleware('auth')->group(function () {
    Route::get('/bookings', [BookingController::class, 'index'])->name('bookings.index');
    Route::get('/booking-history', [BookingController::class, 'history'])->name('bookings.history');

    Route::post('/bookings/store', [BookingController::class, 'store'])->name('bookings.store');
    Route::put('/bookings/{booking}', [BookingController::class, 'update'])->name('bookings.update');
    Route::delete('/bookings/{booking}', [BookingController::class, 'destroy'])->name('bookings.destroy');

    // Additional routes for confirm and cancel actions
    Route::post('/bookings/{booking}/confirm', [BookingController::class, 'confirm'])->name('bookings.confirm');
    Route::post('/bookings/{booking}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');
    Route::get('/booking/available-slots', [BookingController::class, 'getAvailableSlots'])
        ->name('available-slots');
});

Route::get('/contact', [ContactController::class, 'index'])->name('contact.index');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');


Route::get('auth/google', [GoogleController::class, 'redirectToGoogle'])->name('google.login');
Route::get('auth/google-callback', [GoogleController::class, 'handleGoogleCallback']);
// Route::get('/auth/google/redirect', [GoogleController::class, 'redirectToGoogle']);
// Route::get('/auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);


Route::middleware('auth')->group(function () {
    Route::post('/products/{product}/reviews', [ReviewController::class, 'store'])->name('reviews.store');
});



// Route::fallback(function () {
//     return Inertia::render('ErrorPage', [
//         'statusCode' => 404,
//         'message' => 'Page not found.'
//     ])->toResponse(request())->setStatusCode(404);
// });


require __DIR__ . '/auth.php';
