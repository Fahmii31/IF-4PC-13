<?php

namespace App\Services;

use App\Models\History;
use App\Models\Reading;
use App\Models\Setting;
use App\Models\Notification;
use Carbon\Carbon;
use App\Models\User;
use App\Services\WhatsAppService;

class CostMonitorService
{
    public function getCurrentMonthCost(int $deviceId): float
    {
        $startMonth = Carbon::now()->startOfMonth();
        $endMonth   = Carbon::now()->endOfMonth();

        $historyCost = History::where('device_id', $deviceId)
            ->whereBetween('tanggal', [$startMonth, $endMonth])
            ->sum('total_biaya');

        $todayReading = Reading::where('device_id', $deviceId)
            ->whereDate('created_at', Carbon::today())
            ->latest()
            ->first();

        $todayCost = $todayReading
            ? (float) $todayReading->estimasi_biaya
            : 0;

        return round($historyCost + $todayCost, 2);
    }

    public function checkCostLimit(int $deviceId): bool
    {
        $setting = Setting::where('device_id', $deviceId)->first();

        if (!$setting) {
            return false;
        }

        $monthlyCost = $this->getCurrentMonthCost($deviceId);

        return $monthlyCost >= $setting->batas_biaya;
    }
   public function checkAndCreateCostAlert(
    int $deviceId
): bool
{
    $setting = Setting::where(
        'device_id',
        $deviceId
    )->first();

    if (!$setting) {
        return false;
    }

    // Alert belum dikonfigurasi
if (
    !$setting->batas_biaya ||
    $setting->batas_biaya <= 0
) {
    return false;
}

    $currentMonth = now()->format('Y-m');

// RESET ALERT SETIAP BULAN BARU
    if (
        $setting->last_cost_alert_month &&
        $setting->last_cost_alert_month !== $currentMonth
    ) {

        $setting->update([
            'is_cost_alert_active' => false
        ]);

        $setting->refresh();
    }

// ALERT AKTIF BULAN INI -> TIDAK PERLU CEK LAGI
    if ($setting->is_cost_alert_active) {
        return false;
    }

    $monthlyCost = $this->getCurrentMonthCost(
        $deviceId
    );

    if ($monthlyCost < $setting->batas_biaya) {
        return false;
    }

// KIRIM NOTIFIKASI
    Notification::create([
        'user_id' => $setting->user_id,
        'device_id' => $deviceId,

        'jenis_notif' => 'Cost Alert',

        'pesan' =>
            'Monthly electricity spending has exceeded the configured budget limit.',

        'media' => 'WA',

        'status_kirim' => true
    ]);

// KIRIM WHATSAPP
    $user = User::find(
        $setting->user_id
    );

    if ($user && $user->phone) {

        $phone = preg_replace(
            '/[^0-9]/',
            '',
            $user->phone
        );

        if (substr($phone, 0, 1) === '0') {
            $phone = '62' . substr($phone, 1);
        }

        $exceededAmount =
            $monthlyCost - $setting->batas_biaya;

        $message =
            "⚡ VoltCore Energy Notification\n\n" .

            "Budget Alert Triggered\n\n" .

            "Your electricity spending for " .
            now()->translatedFormat('F Y') .
            " has exceeded the configured budget limit.\n\n" .

            "━━━━━━━━━━━━━━━\n\n" .

            "💰 Current Cost\n" .
            "Rp " .
            number_format(
                $monthlyCost,
                0,
                ',',
                '.'
            ) .
            "\n\n" .

            "🎯 Budget Limit\n" .
            "Rp " .
            number_format(
                $setting->batas_biaya,
                0,
                ',',
                '.'
            ) .
            "\n\n" .

            "📈 Exceeded By\n" .
            "Rp " .
            number_format(
                $exceededAmount,
                0,
                ',',
                '.'
            ) .
            "\n\n" .

            "━━━━━━━━━━━━━━━\n\n" .

            "Please monitor your electricity consumption to avoid unnecessary expenses.\n\n" .

            "VoltCore\n" .
            "Smart Energy Intelligence";

        app(
            WhatsAppService::class
        )->sendMessage(
            $phone,
            $message
        );
    }

// UPDATE STATUS ALERT
    $setting->update([
        'is_cost_alert_active' => true,
        'last_cost_alert_month' => $currentMonth
    ]);

    return true;
}
}