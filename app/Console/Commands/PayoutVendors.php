<?php

namespace App\Console\Commands;

use App\Enums\OrderStatusEnum;
use App\Models\Order;
use App\Models\Payout;
use App\Models\Vendor;
use Carbon\Carbon;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PayoutVendors extends Command
{
    protected $signature = 'payout:vendors {--today : Include up to today in the payout window, for testing only — do not use in production}';

    protected $description = 'Perform vendors payout';

    public function handle()
    {
        Log::info('Payout process started');
        $this->info('starting monthly payout process for vendors...');

        if ($this->option('today')) {
            $this->warn('Running with --today: payout window extended through today. Testing only.');
        }

        Log::info('Start fetching vendors...');
        $vendors = Vendor::eligibleForPayout()->with('user')->get();
        Log::info('Fetched vendors count: ' . $vendors->count());

        foreach ($vendors as $vendor) {
            $this->processPayout($vendor, $this->option('today'));
        }

        $this->info('monthly payout process completed');
        Log::info('Payout process completed');
        return Command::SUCCESS;
    }

    public function processPayout(Vendor $vendor, bool $includeToday = false)
    {
        $this->info('processing payout for vendors [Id=' . $vendor->user->id . '] - "' . $vendor->store_name . '"');
        Log::info('Processing payout for vendor', ['vendor_id' => $vendor->user->id, 'store_name' => $vendor->store_name]);

        try {
            DB::beginTransaction();
            $startingFrom = Payout::where('vendor_id', $vendor->user_id)
                ->orderBy('until', 'desc')
                ->value('until');

            $startingFrom = $startingFrom ?: Carbon::make('1970-1-1');

            $until = $includeToday
                ? Carbon::now()->endOfDay()
                : Carbon::now()->subMonthNoOverflow()->startOfMonth();

            $vendorSubtotal = Order::query()
                ->where('vendor_user_id', $vendor->user_id)
                ->where('status', OrderStatusEnum::Paid->value)
                ->whereBetween('created_at', [$startingFrom, $until])
                ->sum('vendor_subtotal');

            if ($vendorSubtotal) {
                $this->info('Payout made with the amount: ' . $vendorSubtotal);
                Payout::create([
                    'vendor_id' => $vendor->user_id,
                    'amount' => $vendorSubtotal,
                    'starting_from' => $startingFrom,
                    'until' => $until
                ]);

                if ($vendor->user->isStripeAccountActive() && $vendor->user->getStripeAccountId()) {
                    $vendor->user->transfer((int)($vendorSubtotal * 100), config('app.currency'));
                    Log::info('Stripe transfer successful', ['vendor_id' => $vendor->user->id]);
                }
            } else {
                Log::info('Payout skipped: no eligible order subtotal for period', ['vendor_id' => $vendor->user->id]);
                $this->info('Nothing to process');
            }

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            $this->error($e->getMessage());
        }
    }
}
