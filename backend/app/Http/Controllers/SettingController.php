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
        $device = Device::where('user_id', $user->id)->first();

        if (!$device) {
            return response()->json(['message' => 'Device not found'], 404);
        }

        $currentSetting = Setting::where('device_id', $device->device_id)->first();

        if ($currentSetting && $currentSetting->tarif_id != $validated['tarif_id']) {
            
            DB::table('readings')
                ->where('device_id', $device->device_id)
                ->whereDate('created_at', Carbon::today())
                ->delete();
        }

        // Update atau buat konfigurasi baru dengan menyertakan user_id
        $setting = Setting::updateOrCreate(
            [
                'device_id'       => $device->device_id
            ],
            [
                'user_id'         => $user->id, // 🛠️ REVISI: Mengikat user_id yang sedang login agar tidak Error 1364
                'tarif_id'        => $validated['tarif_id'],
                'batas_daya_watt' => $validated['batas_daya_watt'],
                'batas_biaya'     => $validated['batas_biaya'],
                'configured_at'   => now()
            ]
        );

        return response()->json([
            'message' => 'Settings updated successfully',
            'data'    => $setting
        ]);
    }

    // GET ALL TARIFF OPTIONS
    public function getTariffs()
    {
        return response()->json(
            Tariff::orderBy('daya_va')->get()
        );
    }
}