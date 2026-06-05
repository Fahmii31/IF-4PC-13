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
    Schema::create('settings', function (Blueprint $table) {
        $table->id('setting_id');
        
        // TAMBAHKAN KOLOM USER_ID DI SINI
        $table->unsignedBigInteger('user_id'); 
        $table->unsignedBigInteger('device_id');
        $table->unsignedBigInteger('tarif_id')->nullable();

        // TAMBAHKAN FOREIGN KEY UNTUK USER_ID
        $table->foreign('user_id')
            ->references('id') // sesuaikan dengan primary key tabel users Abang (biasanya 'id')
            ->on('users')
            ->cascadeOnDelete();

        $table->foreign('device_id')
            ->references('device_id')
            ->on('devices')
            ->cascadeOnDelete();

        $table->foreign('tarif_id')
            ->references('tarif_id')
            ->on('tariffs');

        $table->integer('batas_daya_watt')->nullable();
        $table->decimal('batas_biaya', 12, 2)->nullable();
        $table->timestamp('configured_at')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
