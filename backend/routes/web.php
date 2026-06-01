<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);

Route::post('/logout', [AuthController::class, 'logout']);

Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);

Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// GOOGLE LOGIN
Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);

Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

Route::middleware('auth:sanctum')->get('/me', function () {
    return auth()->user();
});

Route::get('/session-test', function (\Illuminate\Http\Request $request) {

    $request->session()->put('test', 'SESSION_OK');

    return response()->json([
        'session' => $request->session()->get('test')
    ]);
});