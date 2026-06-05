<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Otp;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\OtpMail;
use Laravel\Socialite\Facades\Socialite;
use App\Models\Device;
use App\Models\Setting;

class AuthController extends Controller
{
    // REGISTER
    public function register(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:20',

            'email' => 'required|email|ends_with:gmail.com|unique:users',

            'password' => [
                'required',
                'min:8',
                'regex:/[A-Z]/',
                'regex:/[0-9]/'
            ],

            'phone' => 'required'
        ], [
            'username.required' => 'Username is required',
            'username.max' => 'Username must not exceed 20 characters',

            'email.required' => 'Email is required',
            'email.email' => 'Invalid email format',
            'email.ends_with' => 'Email must use @gmail.com domain',
            'email.unique' => 'Email is already registered',

            'password.required' => 'Password is required',
            'password.min' => 'Password must be at least 8 characters',
            'password.regex' => 'Password must contain at least one uppercase letter and one number',

            'phone.required' => 'Phone number is required'
        ]);

        $user = User::create([
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'],
        ]);
        $this->createDefaultDeviceAndSetting($user);

        return response()->json([
            'message' => 'Register success',
            'user' => $user
        ]);
    }

    // LOGIN
    public function login(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $user = User::where(
            'username',
            $validated['username']
        )->first();

        if (!$user) {

            return response()->json([
                'message' => 'Invalid username or password'
            ], 401);
        }

        // JIKA AKUN GOOGLE MURNI
        if ($user->is_google_user) {

            return response()->json([
                'message' => 'This account uses Google Sign-In'
            ], 400);
        }

        $remember = $request->boolean('remember');

        $credentials = [
            'username' => $validated['username'],
            'password' => $validated['password'],
        ];

        if (!Auth::attempt($credentials, $remember)) {

            return response()->json([
                'message' => 'Invalid username or password'
            ], 401);
        }

        $request->session()->regenerate();

        return response()->json([
            'message' => 'Login success',
            'user' => Auth::user(),
        ]);
    }

    // LOGOUT
    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user) {
            $user->setRememberToken(null);
            $user->save();
        }
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json([
            'message' => 'Logout success'
        ]);
    }
    // FORGOT PASSWORD
    public function forgotPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where(
            'email',
            $validated['email']
        )->first();

        if (!$user) {

            return response()->json([
                'message' => 'Email not found'
            ], 404);
        }

        // GOOGLE ACCOUNT
        if ($user->is_google_user) {

            return response()->json([
                'message' => 'This account uses Google Sign-In'
            ], 400);
        }

        // SIMPAN EMAIL KE SESSION
        session([
            'password_reset_email' =>
                $validated['email']
        ]);

        // GENERATE OTP
        $otp = str_pad(
            random_int(0, 999999),
            6,
            '0',
            STR_PAD_LEFT
        );

        // SIMPAN OTP HASH
        Otp::updateOrCreate(

            [
                'email' => $validated['email']
            ],

            [
                'otp' => Hash::make($otp),
                'expired_at' => now()->addMinutes(5),
                'is_verified' => false,
                'attempts' => 0,
                'locked_until' => null
            ]
        );

        try {

            Mail::to($validated['email'])
                ->queue(new OtpMail($otp));

            return response()->json([
                'message' => 'OTP sent to email'
            ]);

        } catch (\Exception $e) {

            \Log::error(
                'OTP MAIL ERROR: ' .
                $e->getMessage()
            );

            return response()->json([
                'message' =>
                    'Failed to send OTP email'
            ], 500);
        }
    }

    // VERIFY OTP
    public function verifyOtp(Request $request)
    {
        $validated = $request->validate([
            'otp' => 'required|digits:6'
        ]);

        // AMBIL EMAIL DARI SESSION
        $email = session(
            'password_reset_email'
        );

        if (!$email) {

            return response()->json([
                'message' => 'Session expired'
            ], 403);
        }

        $record = Otp::where(
            'email',
            $email
        )->first();

        if (!$record) {

            return response()->json([
                'message' => 'OTP invalid'
            ], 400);
        }

        // CEK LOCK
        if (
            $record->locked_until &&
            now()->lt($record->locked_until)
        ) {

            return response()->json([
                'message' =>
                    'Too many attempts. Please try again later.'
            ], 429);
        }

        // OTP SUDAH DIGUNAKAN
        if ($record->is_verified) {

            return response()->json([
                'message' => 'OTP already used'
            ], 400);
        }

        // OTP EXPIRED
        if (now()->gt($record->expired_at)) {

            return response()->json([
                'message' => 'OTP expired'
            ], 400);
        }

        // CEK HASH OTP
        if (
            !Hash::check(
                $validated['otp'],
                $record->otp
            )
        ) {

            $record->increment('attempts');

            if (($record->attempts + 1) >= 5) {

                $record->update([
                    'locked_until' =>
                        now()->addMinutes(10)
                ]);
            }

            return response()->json([
                'message' => 'OTP invalid'
            ], 400);
        }

        // VERIFY OTP
        $record->update([
            'is_verified' => true,
            'attempts' => 0,
            'locked_until' => null
        ]);

        // SESSION VERIFIED
        session([
            'otp_verified' => true
        ]);

        return response()->json([
            'message' =>
                'OTP successfully verified'
        ]);
    }

    // RESET PASSWORD
    public function resetPassword(Request $request)
    {
        // CEK SESSION
        if (
            !session('password_reset_email') ||
            !session('otp_verified')
        ) {

            return response()->json([
                'message' => 'Unauthorized access'
            ], 403);
        }

        $validated = $request->validate([
            'password' => [
                'required',
                'min:8',
                'regex:/[A-Z]/',
                'regex:/[0-9]/'
            ]
        ], [

            'password.required' =>
                'Password is required',

            'password.min' =>
                'Password must be at least 8 characters',

            'password.regex' =>
                'Password must contain uppercase and number'
        ]);

        $email = session('password_reset_email');

        $user = User::where(
            'email',
            $email
        )->first();

        if (!$user) {

            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        // CEK PASSWORD LAMA
        if (
            Hash::check(
                $validated['password'],
                $user->password
            )
        ) {

            return response()->json([
                'message' =>
                    'New password cannot be the same as old password'
            ], 400);
        }

        $user->update([
            'password' => Hash::make(
                $validated['password']
            )
        ]);

        // HAPUS OTP
        Otp::where(
            'email',
            $email
        )->delete();

        // HAPUS SESSION RESET
        session()->forget([
            'password_reset_email',
            'otp_verified'
        ]);

        return response()->json([
            'message' =>
                'Password has been successfully updated'
        ]);
    }
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([

            'username' => [
                'required',
                'string',
                'max:20',
                'unique:users,username,' . $user->id
            ],

            'phone' => [
                'required',
                'numeric'
            ]

        ], [

            'username.required' =>
                'Username is required',

            'username.max' =>
                'Username must not exceed 20 characters',

            'username.unique' =>
                'Username is already in use',

            'phone.required' =>
                'Phone number is required',

            'phone.numeric' =>
                'Phone number must contain numbers only'

        ]);

        $user->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    public function changePassword(Request $request)
    {
        $user = $request->user();
        $request->validate([
            'current_password' => 'required',
            'new_password' => [
                'required',
                'min:8',
                'regex:/[A-Z]/',
                'regex:/[0-9]/'
            ],
        ], [
            'new_password.min' => 'Password must be at least 8 characters',
            'new_password.regex' => 'Password must contain at least one uppercase letter and one number'
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Current password incorrect'
            ], 400);
        }

        if (Hash::check($request->new_password, $user->password)) {
            return response()->json([
                'message' => 'New password cannot be the same as the old one'
            ], 400);
        }
        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        // logout session
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json([
            'message' => 'Password updated. Please login again.'
        ]);
    }

    // REDIRECT GOOGLE
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    // GOOGLE CALLBACK
    public function handleGoogleCallback(Request $request)
    {
        try {
            $googleUser =
                Socialite::driver('google')->user();

            $user = User::where(
                'email',
                $googleUser->getEmail()
            )->first();

            if (!$user) {

                $baseUsername = explode(
                    '@',
                    $googleUser->getEmail()
                )[0];

                $username = $baseUsername;

                $counter = 1;

                while (
                    User::where(
                        'username',
                        $username
                    )->exists()
                ) {

                    $username =
                        $baseUsername . $counter;

                    $counter++;
                }

                $user = User::create([
                    'username' => $username,
                    'email' => $googleUser->getEmail(),
                    'password' => bcrypt(uniqid()),
                    'phone' => '-',
                    'provider' => 'google',
                    'provider_id' => $googleUser->getId(),
                    'is_google_user' => true,
                ]);
                $this->createDefaultDeviceAndSetting($user);
            } else {
                $user->update([
                    'provider' => 'google',
                    'provider_id' => $googleUser->getId(),
                ]);
            }
            
            // LOGIN USER
            Auth::login($user, true);
            $request->session()->regenerate();
            return redirect(
                'http://localhost:3000/dashboard'
            );

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Google login failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function checkResetSession()
    {
        return response()->json([
            'valid' => session()->has('password_reset_email')
        ]);
    }
    public function checkOtpSession()
    {
        return response()->json([
            'valid' =>
                session()->has('password_reset_email') &&
                session('otp_verified')
        ]);
    }

    private function createDefaultDeviceAndSetting(User $user)
{
    // Buat device
    $device = Device::create([
        'user_id' => $user->id,
        'kode_device' => 'DEV-' . strtoupper(substr(uniqid(), -6)),
        'nama_perangkat' => 'VoltCore Device',
        'last_seen' => now(),
    ]);

    // Buat setting - PAKE $device->device_id (Sesuai Primary Key)
    Setting::create([
        'user_id'         => $user->id,    
        'device_id'       => $device->device_id, 
        'tarif_id'        => null,
        'batas_daya_watt' => null,
        'batas_biaya'     => null,
        'configured_at'   => null,
    ]);
}
}