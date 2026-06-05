<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Device;
use App\Models\History;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class HistoryController extends Controller
{
    // 1. Ambil data Harian (Untuk halaman Consumption)
    public function getDailyHistory(Request $request)
    {
        $user = $request->user();
        $device = Device::where('user_id', $user->id)->first();

        if (!$device) {
            return response()->json([], 200);
        }

        $histories = History::where('device_id', $device->device_id)
            ->orderBy('tanggal', 'desc')
            ->get();

        return response()->json($histories);
    }

    // 2. Ambil data Bulanan (Untuk halaman Analytics - Tab Monthly)
    // 2. Ambil data Bulanan (Untuk halaman Analytics - Tab Monthly)
    public function getAnalyticsHistory(Request $request)
    {
        // 1. Tangkap parameter filter dari Next.js
        $year = $request->query('year', date('Y'));
        $month = $request->query('month', 'ALL');
        
        // Ambil User dan samakan cara panggil Device seperti fungsi dailyHistory lu
        $user = $request->user();
        $device = Device::where('user_id', $user->id)->first();

        // Jika device tidak ada, langsung stop dan beri respon kosongan yang aman
        if (!$device) {
            return response()->json([
                'status' => 'success',
                'kpis' => ['accumulated_energy' => 0, 'total_cost' => 0, 'avg_base_load' => 0],
                'chart' => [],
                'table' => []
            ]);
        }

        // 2. Query Utama: Gunakan device_id dan kolom 'tanggal' sesuai DB asli lu
        $query = DB::table('histories')
            ->where('device_id', $device->device_id)
            ->whereYear('tanggal', $year);

        // Jika user memilih bulan spesifik
        if ($month !== 'ALL') {
            $query->whereMonth('tanggal', $month);
        }

        // Grup dan Agregasi data harian menggunakan kolom 'tanggal'
        $monthlyData = $query->select(
            DB::raw('MONTH(tanggal) as month_num'),
            DB::raw('SUM(total_kwh) as total_kwh'),
            DB::raw('SUM(total_biaya) as total_cost'),
            DB::raw('AVG(arus_ampere) as avg_current'),
            DB::raw('AVG(tegangan_volt) as avg_voltage'),
            DB::raw('AVG(daya_watt) as avg_power')
        )
        ->groupBy(DB::raw('MONTH(tanggal)'))
        ->get()
        ->keyBy('month_num');

        // 3. Generate 12 bulan penuh (Jan - Des)
        $monthsMapping = [
            1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr', 5 => 'Mei', 6 => 'Jun',
            7 => 'Jul', 8 => 'Agu', 9 => 'Sep', 10 => 'Okt', 11 => 'Nov', 12 => 'Des'
        ];

        $chartData = [];
        $tableData = [];
        
        $accumulatedEnergy = 0;
        $totalCost = 0;
        $totalPowerForAvg = 0;
        $activeMonthsCount = 0;

        foreach ($monthsMapping as $num => $name) {
            $hasData = $monthlyData->has($num);
            $data = $hasData ? $monthlyData->get($num) : null;

            $chartData[] = [
                'month' => $name,
                'total_kwh' => $hasData ? round($data->total_kwh, 2) : 0
            ];

            if ($hasData) {
                $accumulatedEnergy += $data->total_kwh;
                $totalCost += $data->total_cost;
                $totalPowerForAvg += $data->avg_power;
                $activeMonthsCount++;

                $tableData[] = [
                    'month_num' => $num,
                    'month_name' => $name,
                    'avg_current' => round($data->avg_current, 2),
                    'avg_voltage' => round($data->avg_voltage, 1),
                    'avg_power' => round($data->avg_power, 1),
                    'total_cost' => $data->total_cost
                ];
            }
        }

        $avgBaseLoad = $activeMonthsCount > 0 ? round($totalPowerForAvg / $activeMonthsCount, 1) : 0;

        return response()->json([
            'status' => 'success',
            'meta' => [
                'filtered_year' => $year,
                'filtered_month' => $month
            ],
            'kpis' => [
                'accumulated_energy' => round($accumulatedEnergy, 2),
                'total_cost' => $totalCost,
                'avg_base_load' => $avgBaseLoad
            ],
            'chart' => $chartData,
            'table' => $tableData
        ]);
    }
}