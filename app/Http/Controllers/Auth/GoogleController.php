<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Contracts\Factory as SocialiteFactory;

class GoogleController extends Controller
{
  public function redirectToGoogle(SocialiteFactory $socialite)
{
    /** @var GoogleProvider $google */
    $google = $socialite->driver('google');

    return $google->with(['prompt' => 'select_account'])->redirect();
}

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            // Find or create user
            $user = User::updateOrCreate(
        ['email' => $googleUser->getEmail()],
        [
            'name'        => $googleUser->getName(),
            'google_id'   => $googleUser->getId(),
            'avatar'      => $googleUser->getAvatar(),
            'given_name'  => $googleUser->user['given_name'] ?? null,
            'family_name' => $googleUser->user['family_name'] ?? null,
            'locale'      => $googleUser->user['locale'] ?? null,
        ]
    );
// dd($user);
            Auth::login($user);

            // Redirect to your app's home/dashboard page
            return redirect()->intended('/');
        } catch (\Exception $e) {
            return redirect('/login')->withErrors('Unable to login with Google.');
        }
    }
}
