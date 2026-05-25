<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::get('/test', function () {
    return response()->json([
        'message' => 'API Laravel jalan 🚀'
    ]);
});

// PUBLIC
Route::post('/register', [AuthController::class, 'register']);

// PROTECTED
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', function (Illuminate\Http\Request $request) {
        return $request->user();
    });

    Route::put('/update-profile', [AuthController::class, 'updateProfile']);

    Route::post('/change-password', [AuthController::class, 'changePassword']);
});