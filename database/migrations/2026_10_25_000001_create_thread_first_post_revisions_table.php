<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('thread_first_post_revisions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('thread_id');
            $table->unsignedBigInteger('post_id');
            $table->unsignedInteger('version');
            $table->mediumText('content');
            $table->dateTime('version_at');
            $table->uuid('request_id')->nullable();
            $table->unique(['thread_id', 'version']);
            $table->unique(['thread_id', 'request_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('thread_first_post_revisions');
    }
};
