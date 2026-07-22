<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Device;
use App\Models\History;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class HistoryController extends Controller
{
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

    public function getAnalyticsHistory(Request $request)
    {
        $year = $request->query('year', date('Y'));
        $month = $request->query('month', 'ALL');
        
        $user = $request->user();
        $device = Device::where('user_id', $user->id)->first();

        if (!$device) {
            return response()->json([
                'status' => 'success',
                'kpis' => ['accumulated_energy' => 0, 'total_cost' => 0, 'avg_base_load' => 0],
                'chart' => [],
                'table' => []
            ]);
        }

        $query = DB::table('histories')
            ->where('device_id', $device->device_id)
            ->whereYear('tanggal', $year);

        if ($month !== 'ALL') {
            $query->whereMonth('tanggal', $month);
            $dataFromDb = $query->select(
                DB::raw('DAY(tanggal) as label_num'),
                DB::raw('SUM(total_kwh) as total_kwh'),
                DB::raw('SUM(total_biaya) as total_cost'),
                DB::raw('AVG(arus_ampere) as avg_current'),
                DB::raw('AVG(tegangan_volt) as avg_voltage'),
                DB::raw('AVG(daya_watt) as avg_power')
            )->groupBy(DB::raw('DAY(tanggal)'))->get()->keyBy('label_num');

            $daysInMonth = Carbon::createFromDate($year, $month, 1)->daysInMonth;
            
            $chartData = [];
            $tableData = [];
            $accumulatedEnergy = 0; $totalCost = 0; $totalPowerForAvg = 0; $activeMonthsCount = 0;

            for ($i = 1; $i <= $daysInMonth; $i++) {
                $hasData = $dataFromDb->has($i);
                $data = $hasData ? $dataFromDb->get($i) : null;

                $chartData[] = [
                    'label' => (string)$i,
                    'total_kwh' => $hasData ? round($data->total_kwh, 2) : 0,
                    'avg_power' => $hasData ? round($data->avg_power, 2) : 0,
                ];

                if ($hasData) {
                    $accumulatedEnergy += $data->total_kwh;
                    $totalCost += $data->total_cost;
                    $totalPowerForAvg += $data->avg_power;
                    $activeMonthsCount++;

                    $tableData[] = [
                        'label' => "$i " . Carbon::createFromDate($year, $month, 1)->format('M') . " $year",
                        'total_kwh' => round($data->total_kwh, 2),
                        'avg_current' => round($data->avg_current, 2),
                        'avg_voltage' => round($data->avg_voltage, 2),
                        'avg_power' => round($data->avg_power, 2),
                        'total_cost' => round($data->total_cost, 2),
                    ];
                }
            }
        } else {
            $dataFromDb = $query->select(
                DB::raw('MONTH(tanggal) as label_num'),
                DB::raw('SUM(total_kwh) as total_kwh'),
                DB::raw('SUM(total_biaya) as total_cost'),
                DB::raw('AVG(arus_ampere) as avg_current'),
                DB::raw('AVG(tegangan_volt) as avg_voltage'),
                DB::raw('AVG(daya_watt) as avg_power')
            )->groupBy(DB::raw('MONTH(tanggal)'))->get()->keyBy('label_num');

            $monthsMapping = [
                1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr', 5 => 'May', 6 => 'Jun',
                7 => 'Jul', 8 => 'Aug', 9 => 'Sep', 10 => 'Oct', 11 => 'Nov', 12 => 'Dec'
            ];

            $chartData = [];
            $tableData = [];
            $accumulatedEnergy = 0; $totalCost = 0; $totalPowerForAvg = 0; $activeMonthsCount = 0;

            foreach ($monthsMapping as $num => $name) {
                $hasData = $dataFromDb->has($num);
                $data = $hasData ? $dataFromDb->get($num) : null;

                $chartData[] = [
                    'label' => $name,
                    'total_kwh' => $hasData ? round($data->total_kwh, 2) : 0,
                    'avg_power' => $hasData ? round($data->avg_power, 2) : 0,
                ];

                if ($hasData) {
                    $accumulatedEnergy += $data->total_kwh;
                    $totalCost += $data->total_cost;
                    $totalPowerForAvg += $data->avg_power;
                    $activeMonthsCount++;

                    $tableData[] = [
                        'label' => "$name $year",
                        'total_kwh' => round($data->total_kwh, 2),
                        'avg_current' => round($data->avg_current, 2),
                        'avg_voltage' => round($data->avg_voltage, 2),
                        'avg_power' => round($data->avg_power, 2),
                        'total_cost' => round($data->total_cost, 2)
                    ];
                }
            }
        }

        $avgBaseLoad = $activeMonthsCount > 0 ? round($totalPowerForAvg / $activeMonthsCount, 2) : 0;

        return response()->json([
            'status' => 'success',
            'meta' => ['filtered_year' => $year, 'filtered_month' => $month],
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