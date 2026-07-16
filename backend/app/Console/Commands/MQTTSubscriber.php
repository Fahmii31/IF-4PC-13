<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use PhpMqtt\Client\MqttClient;
use App\Models\Reading;
use App\Models\Device;
use App\Models\Tariff;

class MQTTSubscriber extends Command
{
    protected $signature = 'mqtt:listen';

    protected $description = 'Listen MQTT Sensor Data';

    public function handle()
    {
        $server = env('MQTT_CONNECTIONS_LOCAL_HOST', 'broker.hivemq.com');
        $port = env('MQTT_CONNECTIONS_LOCAL_PORT', 1883);

        $clientId = 'laravel_subscriber_' . rand(1000, 9999);

        $mqtt = new MqttClient($server, $port, $clientId);

        $mqtt->connect();

        $this->info('MQTT Connected');

        $mqtt->subscribe('smartenergy/pzem', function ($topic, $message) {

            echo "\n==============================\n";
            echo "Message Received!\n";
            echo "Topic   : {$topic}\n";
            echo "Payload : {$message}\n";
            echo "==============================\n";

            $data = json_decode($message, true);

            if (!$data) {
                echo "Invalid JSON\n";
                return;
            }

            $deviceId = 3;

            // Ambil device beserta setting
            $device = Device::with('setting')->find($deviceId);

            if (!$device) {
                echo "Device not found\n";
                return;
            }

            if (!$device->setting) {
                echo "Setting not found for device {$deviceId}\n";
                return;
            }

            // Ambil tarif berdasarkan tarif_id
            $tariff = Tariff::find($device->setting->tarif_id);

            if (!$tariff) {
                echo "Tariff ID {$device->setting->tarif_id} not found\n";
                return;
            }

            $energy = $data['energy'] ?? 0;
            $estimatedCost = $energy * $tariff->tarif_per_kwh;

            try {
                Reading::create([
                    'device_id'      => $deviceId,
                    'arus_ampere'    => $data['current'] ?? 0,
                    'tegangan_volt'  => $data['voltage'] ?? 0,
                    'daya_watt'      => $data['power'] ?? 0,
                    'energi_kwh'     => $energy,
                    'estimasi_biaya' => $estimatedCost,
                ]);

                echo "✅ Data saved successfully\n";

            } catch (\Exception $e) {
                echo "Database Error\n";
                echo $e->getMessage() . PHP_EOL;
            }

        }, 0);

        $mqtt->loop(true);
    }
}