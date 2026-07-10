<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Device;
use App\Models\Reading;
use App\Models\Setting;
use App\Models\History;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use PhpMqtt\Client\Facades\MQTT;
use App\Services\CostMonitorService;
use App\Services\PowerMonitorService;

class DashboardController extends Controller
{
    public function getDashboardOverview(Request $request)
    {
        $user = $request->user();

        // 1. Inisialisasi Device
        $device = Device::where('user_id', $user->id)->first();
        if (!$device) {
            $device = Device::create([
                'user_id'        => $user->id,
                'nama_perangkat' => 'VoltCore Device',
                'kode_device'    => 'DEV-' . strtoupper(bin2hex(random_bytes(3))),
                'status_relay'   => 0,
                'is_online'      => true,
                'last_seen'      => Carbon::now(),
            ]);
        }

        // 2. Arsip data lama ke tabel histories
        $this->archiveOldReadings($device->device_id);

        // 3. Cek Konfigurasi (tarif_id wajib ada)
        $settings = Setting::where('user_id', $user->id)->first();
        $isConfigured = $settings && !is_null($settings->tarif_id);

        if (!$isConfigured) {
            return response()->json([
                'device' => [
                    'device_id'      => $device->device_id,
                    'nama_perangkat' => $device->nama_perangkat,
                    'kode_device'    => $device->kode_device,
                    'status_relay'   => false,
                    'is_online'      => (bool) $device->is_online,
                    'last_seen'      => 'Waiting for configuration',
                ],
                'metrics' => [
                    'arus_ampere'    => 0.0,
                    'daya_watt'      => 0.0,
                    'tegangan_volt'  => 0.0,
                    'energi_kwh'     => 0.0,
                    'estimasi_biaya' => 0.0,
                ],
                'chart_trend' => [[
                    'time' => Carbon::now()->format('H:i:s'),
                    'kwh'  => 0.0,
                    'watt' => 0.0,
                ]],
            ]);
        }

        // 4. Ambil data sensor terbaru dari readings
        $latestReading = Reading::where('device_id', $device->device_id)
            ->whereDate('created_at', Carbon::today())
            ->latest()
            ->first();

        // 5. Hitung estimasi biaya berdasarkan tarif
        $tarifPerKwh = 1444.70;
        if (isset($settings->tarif) && isset($settings->tarif->harga_per_kwh)) {
            $tarifPerKwh = $settings->tarif->harga_per_kwh;
        }

        $estimasiBiaya = 0;
        if ($latestReading) {
            $estimasiBiaya = round((float) $latestReading->energi_kwh * $tarifPerKwh, 2);
        }

        // 6. Power Alert & Cost Alert
        app(PowerMonitorService::class)->checkAndCreatePowerAlert($device->device_id);
        app(CostMonitorService::class)->checkAndCreateCostAlert($device->device_id);

        // 7. Ambil trend data hari ini untuk grafik
        $trendReadings = Reading::where('device_id', $device->device_id)
            ->whereDate('created_at', Carbon::today())
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(fn($i) => [
                'time' => $i->created_at->format('H:i:s'),
                'kwh'  => (float) $i->energi_kwh,
                'watt' => (float) $i->daya_watt,
            ]);

        return response()->json([
            'device' => [
                'device_id'      => $device->device_id,
                'nama_perangkat' => $device->nama_perangkat,
                'kode_device'    => $device->kode_device,
                'status_relay'   => (bool) $device->status_relay,
                'is_online'      => (bool) $device->is_online,
                'last_seen'      => $device->last_seen
                    ? Carbon::parse($device->last_seen)->diffForHumans()
                    : 'Just now',
            ],
            'metrics' => [
                'arus_ampere'    => $latestReading?->arus_ampere ?? 0,
                'daya_watt'      => $latestReading?->daya_watt ?? 0,
                'tegangan_volt'  => $latestReading?->tegangan_volt ?? 0,
                'energi_kwh'     => $latestReading?->energi_kwh ?? 0,
                'estimasi_biaya' => $estimasiBiaya,
            ],
            'chart_trend' => $trendReadings->isEmpty()
                ? [['time' => now()->format('H:i:s'), 'kwh' => 0, 'watt' => 0]]
                : $trendReadings,
        ]);
    }

    public function toggleRelay(Request $request)
    {
        $device = Device::where('user_id', $request->user()->id)->first();

        if (!$device) {
            return response()->json(['message' => 'Device tidak ditemukan'], 404);
        }

        $statusRelay = $request->input('status_relay') ? 1 : 0;

        $device->update(['status_relay' => $statusRelay]);

        // Publish ke MQTT → ESP32
        $command = $statusRelay ? 'ON' : 'OFF';
        MQTT::publish('smartenergy/relay', $command);

        return response()->json([
            'message'      => 'Relay updated successfully',
            'status_relay' => (bool) $statusRelay,
            'mqtt_command' => $command,
        ]);
    }

    private function archiveOldReadings($deviceId)
    {
        $todayStart = Carbon::today()->toDateTimeString();

        $oldReadings = Reading::where('device_id', $deviceId)
            ->where('created_at', '<', $todayStart)
            ->orderBy('created_at', 'asc')
            ->get();

        if ($oldReadings->isEmpty()) {
            return;
        }

        $groupedByDate = $oldReadings->groupBy(function ($reading) {
            return Carbon::parse($reading->created_at)->toDateString();
        });

        foreach ($groupedByDate as $date => $readingsInDay) {
            try {
                DB::transaction(function () use ($deviceId, $date, $readingsInDay) {
                    $cleanDate = Carbon::parse($date)->toDateString();

                    $exists = History::where('device_id', $deviceId)
                        ->where('tanggal', $cleanDate)
                        ->exists();

                    if (!$exists) {
                        $maxData   = $readingsInDay->sortByDesc('created_at')->first();
                        $totalRows = $readingsInDay->count();

                        $avgAmpere = $readingsInDay->sum('arus_ampere') / $totalRows;
                        $avgVolt   = $readingsInDay->sum('tegangan_volt') / $totalRows;
                        $avgWatt   = $readingsInDay->sum('daya_watt') / $totalRows;

                        if ($maxData) {
                            DB::table('histories')->insert([
                                'device_id'     => $deviceId,
                                'tanggal'       => $cleanDate,
                                'total_kwh'     => $maxData->energi_kwh,
                                'arus_ampere'   => round($avgAmpere, 2),
                                'tegangan_volt' => round($avgVolt, 2),
                                'daya_watt'     => round($avgWatt, 2),
                                'total_biaya'   => $maxData->estimasi_biaya,
                                'created_at'    => Carbon::now(),
                                'updated_at'    => Carbon::now(),
                            ]);

                            Reading::where('device_id', $deviceId)
                                ->whereDate('created_at', $cleanDate)
                                ->delete();
                        }
                    } else {
                        // History sudah ada, bersihkan readings yang menggantung
                        Reading::where('device_id', $deviceId)
                            ->whereDate('created_at', $cleanDate)
                            ->delete();
                    }
                });
            } catch (\Exception $e) {
                \Log::error("Gagal melakukan arsip data VoltCore tanggal {$date}: " . $e->getMessage());
            }
        }
    }
}