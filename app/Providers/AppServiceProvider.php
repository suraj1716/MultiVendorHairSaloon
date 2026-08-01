<?php

namespace App\Providers;

use App\Http\Resources\AuthUserResource;
use App\Models\Department;
use App\Services\CartService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Filament\Support\Components\Badge;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\URL;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(CartService::class, function ($app) {
            return new CartService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
Model::preventSilentlyDiscardingAttributes(true);

        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }
 Inertia::share('auth', function () {
        return [
            'user' => Auth::user() ? new AuthUserResource(Auth::user()) : null,
        ];
    });

        Schedule::command('payout:vendors')
        ->monthlyOn(15,'17:50')
        ->withoutOverlapping();

        Vite::prefetch(concurrency: 3);
    }
}
