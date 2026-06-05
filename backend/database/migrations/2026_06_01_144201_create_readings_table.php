<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('readings', function (Blueprint $table) {
            $table->id('reading_id');
            $table->unsignedBigInteger('device_id');
            
            $table->foreign('device_id')
                ->references('device_id')
                ->on('devices')
                ->cascadeOnDelete();

            $table->decimal('arus_ampere', 8, 2);
            $table->decimal('tegangan_volt', 8, 2);
            $table->decimal('daya_watt', 8, 2);
            $table->decimal('energi_kwh', 10, 3);
            $table->decimal('estimasi_biaya', 12, 2);
            $table->timestamps();

            $table->index('device_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('readings');
    }
};