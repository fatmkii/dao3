<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('android_registration_devices', function (Blueprint $table) {
            $table->id();
            $table->char('device_key', 64)->unique();
            $table->unsignedTinyInteger('claim_count')->default(0);
            $table->boolean('is_banned')->default(false);
            $table->timestamp('banned_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('android_registration_devices');
    }
};
