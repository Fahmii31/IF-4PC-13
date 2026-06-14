<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Device;
use App\Models\Setting;
use App\Models\Tariff;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SettingController extends Controller
{
    // GET DEVICE SETTINGS
    public function getSetting(Request $request)
    {
        $device = Device::with(['setting.tariff'])
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$device) {
            return response()->json([
                'message' => 'Device not found'
            ], 404);
        }

        return response()->json([
            'device_id'       => $device->device_id,
            'tarif_id'        => $device->setting?->tarif_id,
            'daya_va'         => $device->setting?->tariff?->daya_va,
            'batas_daya_watt' => $device->setting?->batas_daya_watt,
            'batas_biaya'     => $device->setting?->batas_biaya,
            'configured_at'   => $device->setting?->configured_at
        ]);
    }

    // UPDATE DEVICE SETTINGS
   public function updateSetting(Request $request)
{
    $validated = $request->validate([
        'tarif_id'        => 'required|exists:tariffs,tarif_id',
        'batas_daya_watt' => 'required|numeric|min:0',
        'batas_biaya'     => 'required|numeric|min:0'
    ]);

    $user = $request->user();

    $device = Device::where(
        'user_id',
        $user->id
    )->first();

    if (!$device) {
        return response()->json([
            'message' => 'Device not found'
        ], 404);
    }

    $currentSetting = Setting::where(
        'device_id',
        $device->device_id
    )->first();

    // CEK APAKAH TARIF BERUBAH, JIKA YA MAKA HAPUS READING HARI INI
    if (
        $currentSetting &&
        $currentSetting->tarif_id != $validated['tarif_id']
    ) {

        DB::table('readings')
            ->where(
                'device_id',
                $device->device_id
            )
            ->whereDate(
                'created_at',
                Carbon::today()
            )
            ->delete();
    }

// CEK APAKAH BATAS BIAYA ATAU BATAS DAYA BERUBAH
    $costLimitChanged =
        $currentSetting &&
        $currentSetting->batas_biaya != $validated['batas_biaya'];

    $powerLimitChanged =
        $currentSetting &&
        $currentSetting->batas_daya_watt != $validated['batas_daya_watt'];

// UPDATE OR CREATE SETTING
    $updateData = [

        'user_id' => $user->id,

        'tarif_id' => $validated['tarif_id'],

        'batas_daya_watt' =>
            $validated['batas_daya_watt'],

        'batas_biaya' =>
            $validated['batas_biaya'],

        'configured_at' => now(),
    ];

// RESET COST ALERT 
    if ($costLimitChanged) {

        $updateData['is_cost_alert_active'] = false;

        $updateData['last_cost_alert_month'] = null;

    } else {

        $updateData['is_cost_alert_active'] =
            $currentSetting->is_cost_alert_active
            ?? false;

        $updateData['last_cost_alert_month'] =
            $currentSetting->last_cost_alert_month
            ?? null;
    }

// RESET POWER ALERT
    if ($powerLimitChanged) {

        $updateData['is_power_alert_active'] = false;

        $updateData['last_power_alert_month'] = null;

    } else {

        $updateData['is_power_alert_active'] =
            $currentSetting->is_power_alert_active
            ?? false;

        $updateData['last_power_alert_month'] =
            $currentSetting->last_power_alert_month
            ?? null;
    }

    $setting = Setting::updateOrCreate(
        [
            'device_id' => $device->device_id
        ],
        $updateData
    );

    return response()->json([
        'message' => 'Settings updated successfully',
        'data' => $setting
    ]);
}

public function getTariffs()
{
    $tariffs = Tariff::all();
    return response()->json($tariffs);
}

}