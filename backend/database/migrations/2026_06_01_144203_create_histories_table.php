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
        Schema::create('histories', function (Blueprint $table) {
            $table->id('history_id');
            
            $table->unsignedBigInteger('device_id');
            $table->foreign('device_id')
                  ->references('device_id')
                  ->on('devices')
                  ->cascadeOnDelete();

            $table->date('tanggal');

            $table->decimal('total_kwh', 10, 4); // Diubah ke 4 desimal agar akurat
            
            // TAMBAHAN: Kolom untuk metrik kelistrikan harian
            $table->decimal('arus_ampere', 8, 2)->default(0);
            $table->decimal('tegangan_volt', 8, 2)->default(0);
            $table->decimal('daya_watt', 10, 2)->default(0);

            $table->decimal('total_biaya', 12, 2);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('histories');
    }
};