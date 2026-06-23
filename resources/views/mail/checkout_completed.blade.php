<x-mail::message>
# 🛍️ Your Order Has Been Completed!

@foreach($orders as $order)

Your order has been successfully placed! 🎉 Here are your order details:

<x-mail::panel>
**Order Information**
🔖 **Order ID:** {{ $order->id }}
🗓 **Order Date:** {{ $order->created_at->format('F j, Y - g:i A') }}
💳 **Payment Method:** {{ $order->payment_method }}
**Store:** <a href="{{ url('/') }}">{{ $order->vendorUser->vendor->store_name }}</a>
</x-mail::panel>

## 📦 Ordered Items:

<table width="100%" style="border-collapse: collapse; margin-bottom: 20px;">
    <thead>
        <tr>
            <th align="left" style="border-bottom: 1px solid #ddd; padding: 8px;">Product</th>
            <th align="center" style="border-bottom: 1px solid #ddd; padding: 8px;">Quantity</th>
            <th align="right" style="border-bottom: 1px solid #ddd; padding: 8px;">Price</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($order->orderItems as $orderItem)
        <tr>
            <td style="padding: 8px; display: flex; align-items: center;">
                <img src="{{ $orderItem->product->getImageForOptions($orderItem->variation_type_option_ids) }}" alt="{{ $orderItem->product->title }}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
                {{ $orderItem->product->title }}
            </td>
            <td align="center" style="padding: 8px;">{{ $orderItem->quantity }}</td>
            <td align="right" style="padding: 8px;">${{ number_format($orderItem->price, 2) }}</td>
        </tr>
        @endforeach
    </tbody>
</table>

---

## 💰 Order Total:

<table width="100%" style="margin-bottom: 20px;">
    <tbody>
        <tr>
            <td>🧾 <strong>Total Price:</strong></td>
            <td align="right"><strong>${{ number_format($order->total_price, 2) }}</strong></td>
        </tr>
    </tbody>
</table>

📦 **Shipping Address:**
{{ $order->shipping_address }}

---

Your order will be processed and shipped soon. You will receive an update when it's on its way!
If you have any questions or concerns, feel free to contact us.

<x-mail::button :url="route('orders.show', $order->id)" color="success">
🔍 View Order Details
</x-mail::button>

Thank you for shopping with us!
**{{ config('app.name') }} Team**

@endforeach
</x-mail::message>
