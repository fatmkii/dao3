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
        Schema::create('admin_actives', function (Blueprint $table) {
            $table->id();
            $table->string('user_id')->index();
            $table->string('binggan');
            $table->string('name');
            $table->unsignedTinyInteger('admin_level');
            $table->string('active');
            $table->string('active_type');
            $table->tinyText('content')->nullable();
            $table->integer('olo')->nullable();
            $table->unsignedInteger('post_id')->nullable();
            $table->unsignedInteger('thread_id')->nullable();
            $table->string('thread_title')->nullable();
            $table->unsignedInteger('floor')->nullable();
            $table->unsignedInteger('user_id_target')->nullable();
            $table->string('binggan_target')->nullable();
            $table->boolean('is_rollbacked')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_actives');
    }
};
