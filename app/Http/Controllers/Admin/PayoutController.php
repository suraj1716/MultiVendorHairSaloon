<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\VendorPayoutMail;
use App\Models\Order;
use App\Models\Payout;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class PayoutController extends Controller
{
    public function index(Request $request)
    {
        $payouts = Payout::with('vendor')
            ->withCount('orders')
            ->when($request->vendor_id, fn ($q, $v) => $q->where('vendor_id', $v))
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        // Only vendors who are actually payable show up in the dropdown.
        $vendors = Vendor::eligibleForPayout()
            ->select('vendors.user_id', 'vendors.store_name')
            ->orderBy('vendors.store_name')
            ->get();

        return Inertia::render('Admin/Payouts/Index', [
            'payouts' => $payouts,
            'vendors' => $vendors,
            'filters' => $request->only(['vendor_id']),
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    /**
     * AJAX: suggest a payout amount for a vendor + date range,
     * based on vendor_subtotal already computed by the Stripe webhook.
     */
    public function preview(Request $request)
    {
        $request->validate([
            'vendor_id'     => 'required|exists:vendors,user_id',
            'starting_from' => 'required|date',
            'until'         => 'required|date|after_or_equal:starting_from',
        ]);

        $suggested = $this->calculateAmount(
            $request->vendor_id,
            $request->starting_from,
            $request->until
        );

        return response()->json(['suggested_amount' => round($suggested, 2)]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'vendor_id'     => 'required|exists:vendors,user_id',
            'amount'        => 'required|numeric|min:0',
            'starting_from' => 'required|date',
            'until'         => 'required|date|after_or_equal:starting_from',
        ]);

        $payout = Payout::create($data);
        $payout->load('vendor.user');

        // Claim the orders this payout covers so they're never double-counted
        // in a future payout's calculateAmount() sum.
        Order::where('vendor_user_id', $data['vendor_id'])
            ->where('is_paid', true)
            ->whereNull('refunded_at')
            ->whereNull('payout_id')
            ->whereBetween('created_at', [$data['starting_from'], $data['until'] . ' 23:59:59'])
            ->update(['payout_id' => $payout->id]);

        $recipient = $payout->vendor?->user?->email;

        try {
            if ($recipient) {
                Mail::to($recipient)->send(new VendorPayoutMail($payout));
            } else {
                Log::warning("Payout #{$payout->id} created but vendor has no email on file.");
            }
        } catch (\Exception $e) {
            Log::error('Payout receipt email failed: ' . $e->getMessage());
        }

        return back()->with(
            'success',
            "Payout of A\${$payout->amount} recorded" . ($recipient ? ' and receipt emailed.' : ' (no vendor email found — receipt not sent).')
        );
    }

    public function show(Payout $payout)
    {
        $payout->load([
            'vendor.user',
            'orders' => fn ($q) => $q->with('user:id,name,email')->orderBy('created_at'),
        ]);

        return Inertia::render('Admin/Payouts/Invoice', [
            'payout' => $payout,
        ]);
    }

    public function destroy(Payout $payout)
    {
        // Release the orders this payout had claimed so they're eligible again.
        Order::where('payout_id', $payout->id)->update(['payout_id' => null]);

        $payout->delete();

        return back()->with('success', 'Payout record deleted and its orders released.');
    }

    /**
     * Sum vendor_subtotal for this vendor's paid, non-refunded, not-yet-paid-out
     * orders in the window. orders.vendor_user_id stores the vendor's user_id
     * directly, so no join needed. whereNull('payout_id') prevents an order
     * from being counted in two different payouts.
     */
    private function calculateAmount($vendorId, $from, $until)
    {
        return Order::where('vendor_user_id', $vendorId)
            ->where('is_paid', true)
            ->whereNull('refunded_at')
            ->whereNull('payout_id')
            ->whereBetween('created_at', [$from, $until . ' 23:59:59'])
            ->sum('vendor_subtotal');
    }
}
