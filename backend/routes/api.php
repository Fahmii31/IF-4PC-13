<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DummyDataController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\HistoryController;

Route::get('/test', function () {
    return response()->json([
        'message' => 'API Laravel jalan 🚀'
    ]);
});

// PUBLIC
Route::post('/register', [AuthController::class, 'register']);

Route::get('/reset-session', [AuthController::class, 'checkResetSession']);

Route::get('/otp-session', [AuthController::class, 'checkOtpSession']);

Route::get('/generate-dummy',[DummyDataController::class, 'generate']);

// PROTECTED
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', function (Illuminate\Http\Request $request) {
        return $request->user(); });

    Route::get('/dashboard/overview', [DashboardController::class, 'getDashboardOverview']);
    
    Route::patch('/device/toggle-relay', [DashboardController::class, 'toggleRelay']);

    Route::put('/update-profile', [AuthController::class, 'updateProfile']);

    Route::post('/change-password', [AuthController::class, 'changePassword']);

    Route::get('/settings',[SettingController::class, 'getSetting']);

    Route::put('/settings', [SettingController::class, 'updateSetting']);

    Route::get('/tariffs', [SettingController::class, 'getTariffs']);

    Route::get('/history/daily', [HistoryController::class, 'getDailyHistory']);
    Route::get('/history/analytics', [HistoryController::class, 'getAnalyticsHistory']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::delete('/notifications/clear-all', [NotificationController::class, 'clearAll']);
});