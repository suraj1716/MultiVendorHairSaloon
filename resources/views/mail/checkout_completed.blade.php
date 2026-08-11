[x-mail::message]

<div style="text-align:center; margin-bottom:28px;">
    <a
        href="{{ config('app.url') }}"
        style="display:inline-block; text-decoration:none;"
    >
        <img
            src="https://pub-52e671ba26c14bb5b10e0e3d0f45dfac.r2.dev/logo/logo.png"
            alt="{{ config('app.name') }}"
            style="display:block; max-width:180px; max-height:60px; width:auto; height:auto; border:0; margin:0 auto;"
        >
    </a>
</div>

# Order Confirmation

Thank you for your order. Your receipt is below.

@foreach ($orders as $order)

@php
    /*
     * Gross amount before any discount.
     */
    $grossTotal = $order->orderItems->sum(function ($item) {
        return (float) $item->price;
    });

    /*
     * Discount applied to this order.
     * Combines voucher-based discounts and any other discount_amount
     * (e.g. promo codes, manual staff discounts) so the receipt is
     * accurate regardless of which mechanism produced the discount.
     */
    $voucherDiscount = (float) ($order->voucher_discount ?? 0);
    $discountAmount  = (float) ($order->discount_amount ?? 0);
    $totalDiscount   = $voucherDiscount + $discountAmount;

    /*
     * Final amount actually charged to the card/payment method.
     */
    $cardAmount = (float) ($order->total_price ?? 0);

    /*
     * Amount covered by discount.
     *
     * Normally this equals totalDiscount, but this calculation
     * also protects against unusual data.
     */
    $voucherAmount = min($totalDiscount, $grossTotal);

    /*
     * Payment label.
     */
    if ($order->voucher_id && $totalDiscount > 0 && $cardAmount > 0) {
        $paymentLabel = 'Voucher + Card';
    } elseif ($order->voucher_id && $totalDiscount > 0 && $cardAmount <= 0) {
        $paymentLabel = 'Voucher';
    } elseif ($order->payment_method === 'gift_card') {
        $paymentLabel = 'Gift Card';
    } else {
        $paymentLabel = ucfirst($order->payment_method);
    }
@endphp

<!-- Order Header -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="
        width:100%;
        border-collapse:collapse;
        margin-bottom:20px;
        background:#F7F4EF;
        border:1px solid #E8E0D5;
    "
>
    <tr>
        <td
            style="
                padding:18px 20px;
                border-bottom:1px solid #E8E0D5;
            "
        >
            <div
                style="
                    font-size:20px;
                    font-weight:600;
                    color:#2F2A26;
                    margin-bottom:5px;
                "
            >
                Order #{{ $order->id }}
            </div>

            <div
                style="
                    font-size:13px;
                    color:#6B6560;
                "
            >
                {{ $order->created_at->format('F j, Y \a\t g:i A') }}
            </div>
        </td>

        <td
            align="right"
            style="
                padding:18px 20px;
                border-bottom:1px solid #E8E0D5;
            "
        >
            <div
                style="
                    font-size:13px;
                    color:#6B6560;
                    margin-bottom:5px;
                "
            >
                {{ $order->vendorUser?->vendor?->store_name ?? config('app.name') }}
            </div>

            <div
                style="
                    font-size:13px;
                    font-weight:600;
                    color:#2F2A26;
                "
            >
                {{ $paymentLabel }}
            </div>
        </td>
    </tr>
</table>

@if ($order->booking)

<!-- Booking Details -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="
        width:100%;
        border-collapse:collapse;
        margin-bottom:20px;
    "
>
    <tr>
        <td
            style="
                padding:14px 16px;
                background:#F7F4EF;
                border-left:3px solid #B28A5A;
            "
        >
            <div
                style="
                    font-size:11px;
                    text-transform:uppercase;
                    letter-spacing:0.08em;
                    color:#6B6560;
                    margin-bottom:5px;
                "
            >
                Booking Date
            </div>

            <div
                style="
                    font-size:14px;
                    color:#2F2A26;
                "
            >
                {{ \Carbon\Carbon::parse($order->booking->booking_date)->format('l, F j, Y') }}
                &middot;
                {{ $order->booking->time_slot }}
            </div>
        </td>
    </tr>
</table>

@endif

<!-- Items -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="
        width:100%;
        border-collapse:collapse;
        margin-bottom:20px;
    "
>
    <thead>
        <tr>
            <th
                align="left"
                style="
                    padding:10px 0;
                    border-bottom:1px solid #E8E0D5;
                    font-size:12px;
                    color:#6B6560;
                    text-transform:uppercase;
                    letter-spacing:0.05em;
                "
            >
                Item
            </th>

            <th
                align="right"
                style="
                    padding:10px 0;
                    border-bottom:1px solid #E8E0D5;
                    font-size:12px;
                    color:#6B6560;
                    text-transform:uppercase;
                    letter-spacing:0.05em;
                "
            >
                Price
            </th>
        </tr>
    </thead>

    <tbody>

        @foreach ($order->orderItems as $orderItem)

        <tr>
            <td
                style="
                    padding:12px 0;
                    border-bottom:1px solid #F0EBE4;
                    font-size:14px;
                    color:#2F2A26;
                "
            >
                {{ $orderItem->product?->title ?? 'Item' }}
            </td>

            <td
                align="right"
                style="
                    padding:12px 0;
                    border-bottom:1px solid #F0EBE4;
                    font-size:14px;
                    color:#2F2A26;
                "
            >
                ${{ number_format((float) $orderItem->price, 2) }}
            </td>
        </tr>

        @endforeach

    </tbody>
</table>

<!-- Payment Calculation -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="
        width:100%;
        border-collapse:collapse;
        margin-bottom:24px;
        background:#F7F4EF;
        border:1px solid #E8E0D5;
    "
>
    <!-- Subtotal -->
    <tr>
        <td
            style="
                padding:10px 16px;
                font-size:14px;
                color:#6B6560;
            "
        >
            Items Subtotal
        </td>

        <td
            align="right"
            style="
                padding:10px 16px;
                font-size:14px;
                color:#2F2A26;
            "
        >
            ${{ number_format($grossTotal, 2) }}
        </td>
    </tr>


    @if ($totalDiscount > 0)

    <!-- Discount -->
    <tr>
        <td
            style="
                padding:10px 16px;
                font-size:14px;
                color:#6B6560;
            "
        >
            Discount
        </td>

        <td
            align="right"
            style="
                padding:10px 16px;
                font-size:14px;
                color:#8B5E3C;
            "
        >
            − ${{ number_format($totalDiscount, 2) }}
        </td>
    </tr>

    @endif


    <!-- Divider -->
    <tr>
        <td
            colspan="2"
            style="
                padding:0 16px;
            "
        >
            <div
                style="
                    border-top:1px solid #E8E0D5;
                    height:1px;
                "
            ></div>
        </td>
    </tr>


    <!-- Final Total -->
    <tr>
        <td
            style="
                padding:14px 16px;
                font-size:16px;
                font-weight:600;
                color:#2F2A26;
            "
        >
            Total
        </td>

        <td
            align="right"
            style="
                padding:14px 16px;
                font-size:18px;
                font-weight:600;
                color:#B28A5A;
            "
        >
            ${{ number_format($cardAmount, 2) }}
        </td>
    </tr>
</table>

@if ($totalDiscount > 0)

<!-- Payment Breakdown -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="
        width:100%;
        border-collapse:collapse;
        margin-bottom:24px;
    "
>
    <tr>
        <td
            colspan="2"
            style="
                padding-bottom:10px;
                font-size:12px;
                text-transform:uppercase;
                letter-spacing:0.08em;
                color:#6B6560;
            "
        >
            Payment Breakdown
        </td>
    </tr>

    <tr>
        <td
            style="
                padding:8px 0;
                font-size:14px;
                color:#6B6560;
            "
        >
            Order value
        </td>

        <td
            align="right"
            style="
                padding:8px 0;
                font-size:14px;
                color:#2F2A26;
            "
        >
            ${{ number_format($grossTotal, 2) }}
        </td>
    </tr>

    <tr>
        <td
            style="
                padding:8px 0;
                font-size:14px;
                color:#6B6560;
            "
        >
            Discount
        </td>

        <td
            align="right"
            style="
                padding:8px 0;
                font-size:14px;
                color:#8B5E3C;
            "
        >
            − ${{ number_format($voucherAmount, 2) }}
        </td>
    </tr>

    <tr>
        <td
            style="
                padding:12px 0 0;
                border-top:1px solid #E8E0D5;
                font-size:14px;
                font-weight:600;
                color:#2F2A26;
            "
        >
            Charged to {{ $cardAmount > 0 ? 'Card' : 'Voucher' }}
        </td>

        <td
            align="right"
            style="
                padding:12px 0 0;
                border-top:1px solid #E8E0D5;
                font-size:16px;
                font-weight:600;
                color:#B28A5A;
            "
        >
            ${{ number_format($cardAmount, 2) }}
        </td>
    </tr>
</table>

@endif

@if ($totalDiscount > 0 && $cardAmount > 0)

<!-- Easy-to-understand explanation -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="
        width:100%;
        border-collapse:collapse;
        margin-bottom:24px;
    "
>
    <tr>
        <td
            style="
                padding:14px 16px;
                background:#F7F4EF;
                border:1px solid #E8E0D5;
                font-size:13px;
                line-height:1.6;
                color:#6B6560;
            "
        >
            <strong style="color:#2F2A26;">
                Payment summary:
            </strong>
            Your order was
            <strong style="color:#2F2A26;">
                ${{ number_format($grossTotal, 2) }}
            </strong>.

            Your discount covered
            <strong style="color:#8B5E3C;">
                ${{ number_format($voucherAmount, 2) }}
            </strong>.

            The remaining
            <strong style="color:#B28A5A;">
                ${{ number_format($cardAmount, 2) }}
            </strong>
            was charged to your card.
        </td>
    </tr>
</table>

@elseif ($totalDiscount > 0 && $cardAmount <= 0)

<!-- Fully covered -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="
        width:100%;
        border-collapse:collapse;
        margin-bottom:24px;
    "
>
    <tr>
        <td
            style="
                padding:14px 16px;
                background:#F7F4EF;
                border:1px solid #E8E0D5;
                font-size:13px;
                line-height:1.6;
                color:#6B6560;
            "
        >
            <strong style="color:#2F2A26;">
                Payment summary:
            </strong>
            Your discount covered the full order amount of
            <strong style="color:#8B5E3C;">
                ${{ number_format($grossTotal, 2) }}
            </strong>.

            No card payment was required.
        </td>
    </tr>
</table>

@endif

@if ($order->shipping_address)

<!-- Shipping Address -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="
        width:100%;
        border-collapse:collapse;
        margin-bottom:24px;
    "
>
    <tr>
        <td
            style="
                padding:14px 16px;
                background:#F7F4EF;
                border:1px solid #E8E0D5;
            "
        >
            <div
                style="
                    font-size:11px;
                    text-transform:uppercase;
                    letter-spacing:0.08em;
                    color:#6B6560;
                    margin-bottom:6px;
                "
            >
                Shipping Address
            </div>

            <div
                style="
                    font-size:14px;
                    color:#2F2A26;
                "
            >
                {{ $order->shipping_address }}
            </div>
        </td>
    </tr>
</table>

@endif

<x-mail::button :url="route('orders.show', $order->id)" color="success">
View Order
</x-mail::button>

@if (!$loop->last)

<div
    style="
        border-top:1px solid #E8E0D5;
        margin:28px 0;
    "
></div>

@endif

@endforeach

If you have any questions about your order, simply reply to this email.

{{ config('app.name') }}

[/x-mail::message]
