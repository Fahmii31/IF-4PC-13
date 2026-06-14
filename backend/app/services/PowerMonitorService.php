<?php

namespace App\Services;

use App\Models\Reading;
use App\Models\Setting;
use App\Models\Notification;

class PowerMonitorService
{
    /**
     * Cek daya_watt terakhir dan buat Power Alert
     */
    public function checkAndCreatePowerAlert(int $deviceId): bool
    {
        $setting = Setting::where('device_id', $deviceId)->first();

        if (!$setting) {
            return false;
        }

        // Alert belum dikonfigurasi
if (
    !$setting->batas_daya_watt ||
    $setting->batas_daya_watt <= 0
) {
    return false;
}

        // Ambil reading terakhir hari ini
        $latestReading = Reading::where('device_id', $deviceId)
            ->whereDate('created_at', now()->toDateString())
            ->latest()
            ->first();

        if (!$latestReading) {
            return false;
        }

        $currentWatt = $latestReading->daya_watt;

        // Jika watt <= batas, reset flag agar bisa kirim lagi nanti
        if ($currentWatt <= $setting->batas_daya_watt) {
            if ($setting->is_power_alert_active) {
                $setting->update(['is_power_alert_active' => false]);
            }
            return false;
        }

        // Jika watt > batas dan belum aktif alert bulan ini
        if (!$setting->is_power_alert_active && $currentWatt > $setting->batas_daya_watt) {

            Notification::create([
                'user_id' => $setting->user_id,
                'device_id' => $deviceId,
                'jenis_notif' => 'Power Alert',
                'pesan' => "Power consumption exceeded limit! Current usage: {$currentWatt} W (limit: {$setting->batas_daya_watt} W).",
                'media' => 'System',
                'status_kirim' => true
            ]);

            $setting->update(['is_power_alert_active' => true]);

            return true;
        }

        return false;
    }
}