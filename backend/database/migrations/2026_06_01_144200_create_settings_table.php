<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id('setting_id');

            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('device_id');
            $table->unsignedBigInteger('tarif_id')->nullable();

            $table->foreign('user_id')
                ->references('id')
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

            $table->boolean('is_cost_alert_active')->default(false);
            $table->boolean('is_power_alert_active')->default(false);

            $table->string('last_cost_alert_month')
                ->nullable()
                ->comment('Format: YYYY-MM');

            $table->timestamp('configured_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};