<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Device;
use App\Models\Reading;
use App\Models\Setting;
use App\Models\History;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getDashboardOverview(Request $request)
    {
        $user = $request->user();

        // 1. Inisialisasi Device
        $device = Device::where('user_id', $user->id)->first();
        if (!$device) {
            $device = Device::create([
                'user_id' => $user->id,
                'nama_perangkat' => 'VoltCore Device',
                'kode_device' => 'DEV-' . strtoupper(bin2hex(random_bytes(3))),
                'status_relay' => 0, 
                'is_online' => true,
                'last_seen' => Carbon::now()
            ]);
        }

        // 2. LOGIKA HISTORY: Pindahkan data kemaren ke tabel histories, lalu hapus
        $this->archiveOldReadings($device->device_id);

        // 3. Cek Konfigurasi (HANYA CEK VA / tarif_id)
        $settings = Setting::where('user_id', $user->id)->first();
        $isConfigured = $settings && !is_null($settings->tarif_id);

        if (!$isConfigured) {
            return response()->json([
                'device' => [
                    'nama_perangkat' => $device->nama_perangkat,
                    'kode_device'    => $device->kode_device,
                    'status_relay'   => false,
                    'is_online'      => (bool) $device->is_online,
                    'last_seen'      => 'Waiting for configuration'
                ],
                'metrics' => [
                    'arus_ampere' => 0.0, 
                    'daya_watt' => 0.0, 
                    'tegangan_volt' => 0.0, 
                    'energi_kwh' => 0.0, 
                    'estimasi_biaya' => 0.0
                ],
                'chart_trend' => [['time' => Carbon::now()->format('H:i:s'), 'kwh' => 0.0, 'watt' => 0.0]]
            ]);
        }

        // 4. Simulasi Reading HARI INI jika Relay ON
        if ((bool)$device->status_relay) {
            $latestReading = Reading::where('device_id', $device->device_id)
                ->whereDate('created_at', Carbon::today())
                ->latest()->first();

            $previousKwh = $latestReading ? (float) $latestReading->energi_kwh : 0.00;
            
            $volt = rand(218, 228);
            $ampere = rand(120, 550) / 100; 
            $watt = round($volt * $ampere, 2);
            $newKwh = round($previousKwh + (rand(1, 5) / 100), 4);
            $biaya = round($newKwh * 1444.70, 2);

            Reading::create([
                'device_id' => $device->device_id,
                'arus_ampere' => $ampere,
                'tegangan_volt' => $volt,
                'daya_watt' => $watt,
                'energi_kwh' => $newKwh,
                'estimasi_biaya' => $biaya,
                'created_at' => now()
            ]);
        }

        // 5. Ambil metrik HARI INI
        $latestReadingToday = Reading::where('device_id', $device->device_id)
            ->whereDate('created_at', Carbon::today())
            ->latest()->first();

        $trendReadings = Reading::where('device_id', $device->device_id)
            ->whereDate('created_at', Carbon::today())
            ->orderBy('created_at', 'asc')->get()
            ->map(fn($i) => ['time' => $i->created_at->format('H:i:s'), 'kwh' => (float)$i->energi_kwh, 'watt' => (float)$i->daya_watt]);

        return response()->json([
            'device' => [
                'nama_perangkat' => $device->nama_perangkat,
                'kode_device'    => $device->kode_device,
                'status_relay'   => (bool) $device->status_relay,
                'is_online'      => (bool) $device->is_online,
                'last_seen'      => $device->last_seen ? Carbon::parse($device->last_seen)->diffForHumans() : 'Just now'
            ],
            'metrics' => [
                'arus_ampere' => $latestReadingToday->arus_ampere ?? 0,
                'daya_watt' => $latestReadingToday->daya_watt ?? 0,
                'tegangan_volt' => $latestReadingToday->tegangan_volt ?? 0,
                'energi_kwh' => $latestReadingToday->energi_kwh ?? 0,
                'estimasi_biaya' => $latestReadingToday->estimasi_biaya ?? 0,
            ],
            'chart_trend' => $trendReadings->isEmpty() ? [['time' => now()->format('H:i:s'), 'kwh' => 0, 'watt' => 0]] : $trendReadings
        ]);
    }

    public function toggleRelay(Request $request)
    {
        $device = Device::where('user_id', $request->user()->id)->first();
        $device->status_relay = $request->input('status_relay') ? 1 : 0;
        $device->save();

        return response()->json(['message' => 'Relay updated', 'status_relay' => (bool)$device->status_relay]);
    }

    private function archiveOldReadings($deviceId)
{
    // 1. Ambil batasan hari ini tepat pada jam 00:00:00 waktu Jakarta
    $todayStart = Carbon::today()->toDateTimeString();

    // 2. Ambil data lama sebelum hari ini
    $oldReadings = Reading::where('device_id', $deviceId)
        ->where('created_at', '<', $todayStart)
        ->orderBy('created_at', 'asc')
        ->get();

    if ($oldReadings->isEmpty()) {
        return;
    }

    // Kelompokkan data berdasarkan string tanggal murni (YYYY-MM-DD)
    $groupedByDate = $oldReadings->groupBy(function($reading) {
        return Carbon::parse($reading->created_at)->toDateString();
    });

    // 3. Iterasi setiap tanggal untuk dipindahkan ke histories
    foreach ($groupedByDate as $date => $readingsInDay) {
        
        try {
            DB::transaction(function () use ($deviceId, $date, $readingsInDay) {
                
                $cleanDate = Carbon::parse($date)->toDateString();

                // PERBAIKAN: Gunakan perbandingan nilai langsung tanpa fungsi whereDate 
                // karena kolom 'tanggal' pada model dibaca sebagai string biasa
                $exists = History::where('device_id', $deviceId)
                    ->where('tanggal', $cleanDate)
                    ->exists();

                if (!$exists) {
                    // Ambil data pembacaan paling terakhir di hari tersebut
                    $maxData = $readingsInDay->sortByDesc('created_at')->first();

                    // Hitung rata-rata data sepanjang hari itu
                    $totalRows = $readingsInDay->count();
                    $avgAmpere  = $readingsInDay->sum('arus_ampere') / $totalRows;
                    $avgVolt    = $readingsInDay->sum('tegangan_volt') / $totalRows;
                    $avgWatt    = $readingsInDay->sum('daya_watt') / $totalRows;

                    if ($maxData) {
                        // Gunakan Query Builder dasar untuk menjamin bypass proteksi Eloquent
                        DB::table('histories')->insert([
                            'device_id'     => $deviceId,
                            'tanggal'       => $cleanDate,
                            'total_kwh'     => $maxData->energi_kwh,
                            'arus_ampere'   => round($avgAmpere, 2),  
                            'tegangan_volt' => round($avgVolt, 2),    
                            'daya_watt'     => round($avgWatt, 2),        
                            'total_biaya'   => $maxData->estimasi_biaya,
                            'created_at'    => Carbon::now(),
                            'updated_at'    => Carbon::now()
                        ]);

                        // Hapus data pembacaan HANYA setelah insert dipastikan berhasil tanpa interupsi
                        Reading::where('device_id', $deviceId)
                            ->whereDate('created_at', $cleanDate)
                            ->delete();
                    }
                } else {
                    // Data histories sudah aman ada di database, bersihkan sisa readings yang menggantung
                    Reading::where('device_id', $deviceId)
                        ->whereDate('created_at', $cleanDate)
                        ->delete();
                }
            });
        } catch (\Exception $e) {
            // Jika terjadi kegagalan sistem, catat log error tanpa menghentikan aplikasi secara crash
            \Log::error("Gagal melakukan arsip data VoltCore tanggal {$date}: " . $e->getMessage());
            continue;
        }
    }
}
}