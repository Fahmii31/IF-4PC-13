<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use PhpMqtt\Client\MqttClient;

class RelayController extends Controller
{
    public function control(Request $request)
    {
        $request->validate([
            'state' => 'required|in:ON,OFF'
        ]);

        $mqtt = new MqttClient(
            'broker.hivemq.com',
            1883,
            'laravel-relay-' . rand(1000,9999)
        );

        $mqtt->connect();

        $mqtt->publish(
            'smartenergy/relay',
            $request->state,
            0
        );

        $mqtt->disconnect();

        return response()->json([
            'success' => true,
            'relay' => $request->state
        ]);
    }
}