<x-mail::message>

# New Order Alert

**Order #{{ $order->id }}** — {{ $order->created_at->format('F j, Y \a\t g:i A') }}
Customer: {{ $order->user->name ?? 'N/A' }}

## Shipping Address

@if ($order->shippingAddress)
{{ $order->shippingAddress->full_name }}
{{ $order->shippingAddress->address_line1 }}@if($order->shippingAddress->address_line2), {{ $order->shippingAddress->address_line2 }}@endif
{{ $order->shippingAddress->city }}, {{ $order->shippingAddress->state }} {{ $order->shippingAddress->postal_code }}
{{ $order->shippingAddress->country }}
Phone: {{ $order->shippingAddress->phone }}
@else
No shipping address on file for this order.
@endif

## Ordered Items

@foreach ($order->orderItems as $orderItem)
- {{ $orderItem->product?->title ?? 'Item' }} — Qty {{ $orderItem->quantity }} — ${{ number_format((float) $orderItem->price, 2) }}
@endforeach

**Total Price: ${{ number_format((float) $order->total_price, 2) }}**

---

**Payout Breakdown**

Payment Processing Fee: ${{ number_format((float) ($order->online_payment_comission ?? 0), 2) }}
Platform Fee: ${{ number_format((float) ($order->website_payment_comission ?? 0), 2) }}
Your Earnings: ${{ number_format((float) ($order->vendor_subtotal ?? 0), 2) }}

<x-mail::button :url="route('orders.show', $order->id)">
View Full Order
</x-mail::button>

If you have any questions or need assistance, feel free to reach out to us.

Thanks for being a trusted partner,
{{ config('app.name') }} Team

</x-mail::message>
