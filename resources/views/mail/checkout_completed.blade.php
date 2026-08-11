<x-mail::message>
<a href="{{ config('app.url') }}" style="display:inline-block; text-decoration:none;"><img src="https://pub-52e671ba26c14bb5b10e0e3d0f45dfac.r2.dev/logo/logo.png" alt="{{ config('app.name') }}" style="display:block; max-width:180px; max-height:60px; width:auto; height:auto; border:0;"></a>

# Order Confirmation

Thank you for your order. Your receipt is below.

@foreach ($orders as $order)

<x-mail::panel>
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td style="padding:0; border:0;">
<strong>Order #{{ $order->id }}</strong><br>
<span style="color:#6B6560; font-size:13px;">{{ $order->created_at->format('F j, Y \a\t g:i A') }}</span>
</td>
<td align="right" style="padding:0; border:0;">
<span style="color:#6B6560; font-size:13px;">{{ $order->vendorUser->vendor->store_name }}</span><br>
<span style="color:#6B6560; font-size:13px;">{{ ucfirst($order->payment_method) }}</span>
</td>
</tr>
</table>
</x-mail::panel>

@if ($order->booking)
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
<tr>
<td style="padding:0; border:0;">
<span style="color:#6B6560; font-size:12px; text-transform:uppercase; letter-spacing:0.05em;">Booking Date</span><br>
<span style="font-size:14px;">{{ \Carbon\Carbon::parse($order->booking->booking_date)->format('l, F j, Y') }} &middot; {{ $order->booking->time_slot }}</span>
</td>
</tr>
</table>
@endif

<div class="table">
<table width="100%" cellpadding="0" cellspacing="0">
    <thead>
        <tr>
            <th align="left">Item</th>
            <th align="right">Price</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($order->orderItems as $orderItem)
        <tr>
            <td>{{ $orderItem->product->title }}</td>
            <td align="right">${{ number_format($orderItem->price, 2) }}</td>
        </tr>
        @endforeach
    </tbody>
    <tfoot>
        <tr>
            <td align="right" style="border-top:1px solid #E8E0D5; padding-top:14px;"><strong>Total</strong></td>
            <td align="right" style="border-top:1px solid #E8E0D5; padding-top:14px;"><strong>${{ number_format($order->total_price, 2) }}</strong></td>
        </tr>
    </tfoot>
</table>
</div>

@if ($order->shipping_address)
<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
<tr>
<td style="padding:0; border:0;">
<span style="color:#6B6560; font-size:12px; text-transform:uppercase; letter-spacing:0.05em;">Shipping Address</span><br>
<span style="font-size:14px;">{{ $order->shipping_address }}</span>
</td>
</tr>
</table>
@endif

<x-mail::button :url="route('orders.show', $order->id)" color="success">
View Order
</x-mail::button>

@if (!$loop->last)
---
@endif

@endforeach

If you have any questions about your order, simply reply to this email.

{{ config('app.name') }}
</x-mail::message>
