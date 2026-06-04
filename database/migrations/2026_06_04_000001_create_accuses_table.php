<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('accuses', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->integer('thread_id')->index();
            $table->integer('post_id')->unique();
            $table->integer('forum_id')->index();
            $table->integer('floor')->index();
            $table->string('target_binggan')->nullable()->index();
            $table->string('thread_title');
            $table->string('status')->default('pending')->index();
            $table->boolean('uncertain')->default(false);
            $table->unsignedBigInteger('handled_by_user_id')->nullable();
            $table->timestamp('handled_at')->nullable();
            $table->string('handle_action')->nullable();
            $table->string('handle_note')->nullable();
            $table->boolean('handle_reduce_olo')->default(false);
        });

        Schema::create('accuse_reasons', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('accuse_id')->constrained('accuses')->cascadeOnDelete();
            $table->integer('post_id')->index();
            $table->unsignedBigInteger('reporter_user_id')->index();
            $table->string('reason', 500);
            $table->unique(['post_id', 'reporter_user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accuse_reasons');
        Schema::dropIfExists('accuses');
    }
};
