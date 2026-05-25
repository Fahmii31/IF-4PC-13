<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Otp;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\OtpMail;

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
            // username
            'username.required' => 'Username is required',
            'username.max' => 'Username must not exceed 20 characters',

            // email
            'email.required' => 'Email is required',
            'email.email' => 'Invalid email format',
            'email.ends_with' => 'Email must use @gmail.com domain',
            'email.unique' => 'Email is already registered',

            // password
            'password.required' => 'Password is required',
            'password.min' => 'Password must be at least 8 characters',
            'password.regex' => 'Password must contain at least one uppercase letter and one number',

            // phone
            'phone.required' => 'Phone number is required'
        ]);

        $user = User::create([
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'],
        ]);

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

        $remember = $request->boolean('remember');

        $credentials = [
            'username' => $validated['username'],
            'password' => $validated['password'],
        ];

        // AUTH ATTEMPT
        if (!Auth::attempt($credentials, $remember)) {

            return response()->json([
                'message' => 'Invalid username or password'
            ], 401);
        }

        // REGENERATE SESSION
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

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {

            return response()->json([
                'message' => 'Email not found'
            ], 404);

        }

        // GENERATE OTP 6 DIGIT
        $otp = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

        // SIMPAN / UPDATE OTP
        Otp::updateOrCreate(

            ['email' => $validated['email']],

            [
                'otp' => $otp,
                'expired_at' => now()->addMinutes(5),
                'is_verified' => false
            ]

        );

        try {

            // KIRIM EMAIL
            Mail::to($validated['email'])
                ->send(new OtpMail($otp));

            return response()->json([
                'message' => 'OTP sent to email'
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Failed to send OTP email',
                'error' => $e->getMessage()
            ], 500);

        }
    }

    // VERIFY OTP
    public function verifyOtp(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'otp' => 'required'
        ]);

        $record = Otp::where('email', $validated['email'])
            ->where('otp', $validated['otp'])
            ->first();

        if (!$record) {
            return response()->json([
                'message' => 'OTP invalid'
            ], 400);
        }

        if (now()->gt($record->expired_at)) {
            return response()->json([
                'message' => 'OTP expired'
            ], 400);
        }

        $record->update([
            'is_verified' => true
        ]);

        return response()->json([
            'message' => 'OTP successfully verified'
        ]);
    }

    // RESET PASSWORD
    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => [
                'required',
                'min:8',
                'regex:/[A-Z]/',
                'regex:/[0-9]/'
            ]
        ], [
            'email.required' => 'Email is required',
            'email.email' => 'Invalid email format',

            'password.required' => 'Password is required',
            'password.min' => 'Password must be at least 8 characters',
            'password.regex' => 'Password must contain at least one uppercase letter and one number'
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        $otp = Otp::where('email', $validated['email'])
            ->where('is_verified', true)
            ->first();

        if (!$otp) {
            return response()->json([
                'message' => 'OTP is not verified'
            ], 400);
        }

        if (Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'New password cannot be the same as the old password'
            ], 400);
        }

        $user->update([
            'password' => Hash::make($validated['password'])
        ]);

        $otp->delete();

        return response()->json([
            'message' => 'Password has been successfully updated'
        ]);
    }

    // Update Profile (Hanya Username & Phone)
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'username' => 'required|string|max:20|unique:users,username,' . $user->id,
            'phone' => 'required|numeric'
        ]);

        $user->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    // Change Password (Logout setelah sukses)
    // Change Password (Logout setelah sukses)
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

        // cek password lama
        if (!Hash::check($request->current_password, $user->password)) {

            return response()->json([
                'message' => 'Current password incorrect'
            ], 400);
        }

        // password baru tidak boleh sama
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
}