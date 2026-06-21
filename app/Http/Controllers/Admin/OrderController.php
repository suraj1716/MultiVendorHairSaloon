<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Models\Vendor;
use App\Services\RefundService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class OrderController extends Controller
{
    /* ══════════════════════════════════════════
       INDEX
    ══════════════════════════════════════════ */
    public function index(Request $request)
    {
        $query = Order::with('user', 'vendorUser.vendor', 'booking')->latest();

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('id', $s)
                    ->orWhereHas(
                        'user',
                        fn($q) =>
                        $q->where('name', 'like', "%$s%")
                            ->orWhere('email', 'like', "%$s%")
                            ->orWhere('phone', 'like', "%$s%")
                    );
            });
        }

        if ($request->filled('status'))    $query->where('status', $request->status);
        if ($request->filled('is_paid'))   $query->where('is_paid', (bool) $request->is_paid);
        if ($request->filled('date_from')) $query->whereDate('created_at', '>=', $request->date_from);
        if ($request->filled('date_to'))   $query->whereDate('created_at', '<=', $request->date_to);

        $orders = $query->paginate(25)->through(fn($o) => [
            'id'             => $o->id,
            'customer'       => $o->user?->name ?? '—',
            'customer_email' => $o->user?->email ?? '—',
            'customer_phone' => $o->user?->phone ?? '—',
            'vendor'         => $o->vendorUser?->vendor?->store_name ?? '—',
            'vendor_type'    => $o->vendorUser?->vendor?->vendor_type?->value ?? '—',
            'total_price'    => $o->total_price,
            'status'         => $o->status,
            'is_paid'        => $o->is_paid,
            'payment_method' => $o->payment_method ?? null,
            'payment_intent' => $o->payment_intent,
            'refunded_at'    => $o->refunded_at?->format('d M Y H:i'),
            'refund_amount'  => $o->refund_amount,
            'has_booking'    => !is_null($o->booking),
            'created_at'     => $o->created_at?->format('d M Y H:i'),
        ]);

        return Inertia::render('Admin/Orders/Index', [
            'orders'   => $orders,
            'filters'  => $request->only(['search', 'status', 'is_paid', 'date_from', 'date_to']),
            'statuses' => ['draft', 'paid', 'shipped', 'delivered', 'cancelled'],
            'flash'    => ['success' => session('success'), 'error' => session('error')],
        ]);
    }

    /* ══════════════════════════════════════════
       SHOW
    ══════════════════════════════════════════ */
    public function show(Order $order)
    {
        if (!$order->is_read) {
            $order->update(['is_read' => true]);
        }
        $order->load('user', 'vendorUser.vendor', 'booking', 'orderItems.product');

        return Inertia::render('Admin/Orders/Show', [
            'order' => [
                'id'             => $order->id,
                'customer'       => $order->user?->name ?? '—',
                'customer_email' => $order->user?->email ?? '—',
                'customer_phone' => $order->user?->phone ?? '—',
                'vendor'         => $order->vendorUser?->vendor?->store_name ?? '—',
                'vendor_type'    => $order->vendorUser?->vendor?->vendor_type?->value ?? '—',
                'total_price'    => $order->total_price,
                'booking_fee'    => $order->booking_fee ?? 0,
                'status'         => $order->status,
                'is_paid'        => $order->is_paid,
                'payment_method' => $order->payment_method ?? null,
                'manual_paid_at' => $order->manual_paid_at?->format('d M Y H:i'),
                'payment_intent' => $order->payment_intent,
                'refunded_at'    => $order->refunded_at?->format('d M Y H:i'),
                'refund_amount'  => $order->refund_amount,
                'created_at'     => $order->created_at?->format('d M Y H:i'),
                'booking' => $order->booking ? [
                    'id'           => $order->booking->id,
                    'booking_date' => $order->booking->booking_date,
                    'time_slot'    => $order->booking->time_slot,
                ] : null,
                'items' => $order->orderItems->map(fn($i) => [
                    'id'       => $i->id,
                    'title'    => $i->product?->title ?? '—',
                    'image'    => $i->product?->image,
                    'quantity' => $i->quantity,
                    'price'    => $i->price,
                    'subtotal' => $i->quantity * $i->price,
                ]),
            ],
            'statuses' => ['draft', 'paid', 'shipped', 'delivered', 'cancelled'],
            'flash'    => ['success' => session('success'), 'error' => session('error')],
        ]);
    }

    /* ══════════════════════════════════════════
       CREATE (walk-in POS)
    ══════════════════════════════════════════ */
    public function create()
    {
        $products = Product::where('status', 'published')
            ->get(['id', 'title', 'price'])
            ->map(function ($product) {
                return [
                    'id'    => $product->id,
                    'title' => $product->title,
                    'price' => $product->price,
                    'image' => $product->getFirstMediaUrl('products'),
                ];
            });

        $users = User::orderBy('name')
            ->get(['id', 'name', 'email', 'phone']);

        $vendors = Vendor::with('user')->get();

        $statuses = [
            'draft',
            'paid',
            'shipped',
            'delivered',
            'cancelled',
        ];

        return Inertia::render('Admin/Orders/Create', [
            'users'          => $users,
            'vendors'        => $vendors,
            'products'       => $products,
            'statuses'       => $statuses,
            'vendor_user_id' => Auth::id(),
            'vendor_name'    => Auth::user()->name,
            'flash'          => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    /* ══════════════════════════════════════════
       PHONE LOOKUP (JSON)
    ══════════════════════════════════════════ */
    public function lookupPhone(Request $request)
    {
        $request->validate(['phone' => 'required|string|min:6']);
        $user = User::where('phone', $request->phone)->first();

        if (!$user) return response()->json(['found' => false]);

        return response()->json([
            'found' => true,
            'user'  => ['id' => $user->id, 'name' => $user->name, 'email' => $user->email, 'phone' => $user->phone],
        ]);
    }

    /* ══════════════════════════════════════════
       STORE (walk-in)
    ══════════════════════════════════════════ */
    public function store(Request $request)
    {
        $request->validate([
            'user_id'           => 'nullable|exists:users,id',
            'new_name'          => 'required_without:user_id|string|max:255',
            'new_email'         => 'nullable|email|max:255',
            'new_phone'         => 'required_without:user_id|string|max:30',
            'vendor_user_id'    => 'required|exists:users,id',
            'payment_method'    => 'required|in:cash,eftpos,other',
            'is_paid'           => 'boolean',
            'notes'             => 'nullable|string|max:500',
            'items'             => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'  => 'required|integer|min:1',
            'items.*.price'     => 'required|numeric|min:0',
            'add_booking'       => 'boolean',
            'booking_date'      => 'required_if:add_booking,true|date',
            'booking_time_slot' => 'required_if:add_booking,true|string',
        ]);

        DB::beginTransaction();
        try {
            // Resolve or create customer
            if ($request->filled('user_id')) {
                $user = User::findOrFail($request->user_id);
            } else {
                if ($request->filled('new_email') && User::where('email', $request->new_email)->exists()) {
                    return back()->withErrors(['new_email' => 'Email already belongs to another account.']);
                }
                $user = User::create([
                    'name'              => $request->new_name,
                    'email'             => $request->new_email ?? ($request->new_phone . '@walkin.local'),
                    'phone'             => $request->new_phone,
                    'password'          => Hash::make(Str::random(16)),
                    'email_verified_at' => now(),
                ]);
            }

            $total = collect($request->items)->sum(fn($i) => $i['quantity'] * $i['price']);

            $order = Order::create([
                'user_id'                   => $user->id,
                'vendor_user_id'            => $request->vendor_user_id,
                'total_price'               => $total,
                'booking_fee'               => 0,
                'status'                    => $request->boolean('is_paid') ? 'paid' : 'draft',
                'is_paid'                   => $request->boolean('is_paid'),
                'payment_method'            => $request->payment_method,
                'manual_paid_at'            => $request->boolean('is_paid') ? now() : null,
                'online_payment_comission'  => 0,
                'website_payment_comission' => 0,
                'vendor_subtotal'           => $total,
            ]);

            foreach ($request->items as $item) {
                OrderItem::create([
                    'order_id'   => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity'],
                    'price'      => $item['price'],
                ]);
            }

            if ($request->boolean('add_booking')) {
                Booking::create([
                    'user_id'      => $user->id,
                    'order_id'     => $order->id,
                    'booking_date' => $request->booking_date,
                    'time_slot'    => $request->booking_time_slot,
                ]);
            }

            DB::commit();
            return redirect()->route('admin.orders.show', $order->id)
                ->with('success', "Walk-in order #{$order->id} created for {$user->name}.");
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Order failed: ' . $e->getMessage()]);
        }
    }

    /* ══════════════════════════════════════════
       EDIT
    ══════════════════════════════════════════ */
    public function edit(Order $order)
    {

        $order->load('orderItems.product', 'booking');
        $products = Product::where('status', 'published')->get(['id', 'title', 'price']);
        $users    = User::orderBy('name')->get(['id', 'name', 'email', 'phone']);

        $payload = [
            'order' => [
                'id'             => $order->id,
                'user_id'        => $order->user_id,
                'vendor_user_id' => $order->vendor_user_id,
                'status'         => $order->status,
                'is_paid'        => (bool) $order->is_paid,
                'payment_method' => $order->payment_method ?? 'cash',
                'total_price'    => $order->total_price,
                'notes'          => $order->notes ?? '',
                'booking' => $order->booking ? [
                    'id'           => $order->booking->id,
                    'booking_date' => $order->booking->booking_date,
                    'time_slot'    => $order->booking->time_slot,
                ] : null,
                'items' => $order->orderItems->map(fn($i) => [
                    'product_id' => $i->product_id,
                    'title'      => $i->product?->title ?? '—',
                    'quantity'   => $i->quantity,
                    'price'      => $i->price,
                ]),
            ],
            'products' => $products,
            'users'    => $users,
            'statuses' => ['draft', 'paid', 'shipped', 'delivered', 'cancelled'],
            'flash'    => ['success' => session('success'), 'error' => session('error')],
        ];


        return Inertia::render('Admin/Orders/Edit', $payload);
    }

    /* ══════════════════════════════════════════
       UPDATE
    ══════════════════════════════════════════ */
  public function update(Request $request, Order $order)
{
    $request->validate([
        'status'            => 'required|in:draft,paid,shipped,delivered,cancelled',
        'is_paid'           => 'boolean',
        'payment_method'    => 'nullable|in:cash,eftpos,other,stripe',
        'notes'             => 'nullable|string|max:500',
        'user_id'           => 'nullable|exists:users,id',   // ← add validation
        'items'             => 'required|array|min:1',
        'items.*.product_id' => 'required|exists:products,id',
        'items.*.quantity'  => 'required|integer|min:1',
        'items.*.price'     => 'required|numeric|min:0',
        'booking_date'      => 'nullable|date',
        'booking_time_slot' => 'nullable|string',
    ]);

    $total = collect($request->items)->sum(fn($i) => $i['quantity'] * $i['price']);

    $order->update([
        'status'         => $request->status,
        'is_paid'        => $request->boolean('is_paid'),
        'payment_method' => $request->payment_method,
        'total_price'    => $total,
        'user_id'        => $request->user_id ?? $order->user_id,  // ← add this line
        'manual_paid_at' => $request->boolean('is_paid') && !$order->manual_paid_at ? now() : $order->manual_paid_at,
    ]);

    // Rebuild items
    $order->orderItems()->delete();
    foreach ($request->items as $item) {
        OrderItem::create([
            'order_id'   => $order->id,
            'product_id' => $item['product_id'],
            'quantity'   => $item['quantity'],
            'price'      => $item['price'],
        ]);
    }

    // Update or create booking
    if ($request->filled('booking_date') && $request->filled('booking_time_slot')) {
        $order->booking()->updateOrCreate(
            ['order_id' => $order->id],
            [
                'user_id'        => $request->user_id ?? $order->user_id,  // ← also fix here, was using stale $order->user_id
                'booking_date'   => $request->booking_date,
                'time_slot'      => $request->booking_time_slot,
            ]
        );
    }

    return redirect()->route('admin.orders.show', $order->id)
        ->with('success', "Order #{$order->id} updated.");
}

    /* ══════════════════════════════════════════
       UPDATE STATUS (inline from index)
    ══════════════════════════════════════════ */
    public function updateStatus(Request $request, Order $order)
    {
        $request->validate(['status' => 'required|in:draft,paid,shipped,delivered,cancelled']);
        $order->update(['status' => $request->status]);
        return back()->with('success', 'Status updated.');
    }

    /* ══════════════════════════════════════════
       REFUND
    ══════════════════════════════════════════ */
    public function refund(Order $order)
    {
        Log::info("Refund requested for Order #{$order->id}", [
            'payment_method' => $order->payment_method,
            'payment_intent' => $order->payment_intent,
            'refunded_at'    => $order->refunded_at,
            'total_price'    => $order->total_price,
            'status'         => $order->status,
            'has_booking'    => (bool) $order->booking,
        ]);

        if ($order->refunded_at) {
            return back()->withErrors(['error' => 'Already refunded.']);
        }

        try {
            $refundService = app(RefundService::class);

            if ($order->payment_method === 'stripe') {
                if (empty($order->payment_intent)) {
                    return back()->withErrors(['error' => 'Stripe order missing payment intent — cannot refund.']);
                }
                $amount = $order->booking
                    ? $refundService->refundBookingAndOrder($order)
                    : $refundService->refundOrder($order);
            } elseif (in_array($order->payment_method, ['cash', 'eftpos'])) {
                $amount = $refundService->refundManual($order);
            } else {
                return back()->withErrors(['error' => 'No valid payment method for refund.']);
            }

            Log::info("Order #{$order->id} refund returned amount: {$amount}");

            if ($amount <= 0) {
                return back()->withErrors(['error' => 'Refund failed — nothing was refunded.']);
            }

            return back()->with('success', "Refunded \${$amount} successfully.");
        } catch (\Exception $e) {
            Log::error("Refund exception for Order #{$order->id}: " . $e->getMessage());
            return back()->withErrors(['error' => 'Refund failed: ' . $e->getMessage()]);
        }
    }

    /* ══════════════════════════════════════════
       DESTROY
    ══════════════════════════════════════════ */
    public function destroy(Order $order)
    {
        $order->booking?->delete();
        $order->orderItems()->delete();
        $order->delete();
        return redirect()->route('admin.orders.index')->with('success', "Order #{$order->id} deleted.");
    }
}
