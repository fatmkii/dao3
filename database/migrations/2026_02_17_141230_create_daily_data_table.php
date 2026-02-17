<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('daily_data', function (Blueprint $table) {
            $table->id();
            $table->date('date')->unique(); // 日期，唯一索引
            $table->integer('login_count')->default(0); // 当日登录binggan数
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_data');
    }
};
