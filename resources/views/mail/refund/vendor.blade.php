<h2>Order Refund Notification</h2>
<p>Dear {{ $order->vendorUser->name }},</p>
<p>A refund has been issued for <strong>Order #{{ $order->id }}</strong>.</p>
<p><strong>Refunded Amount:</strong> ${{ number_format($order->refund_amount, 2) }}</p>
<p>Please log in to your dashboard to review details.</p>
