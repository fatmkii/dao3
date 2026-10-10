<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_recordings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->index();
            $table->unsignedBigInteger('thread_id');
            $table->unsignedBigInteger('post_id')->nullable();
            $table->string('object_key')->unique();
            $table->string('status')->default('pending');
            $table->unsignedInteger('size_bytes');
            $table->string('content_md5', 24);
            $table->unsignedInteger('duration_ms');
            $table->timestamp('uploaded_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
            $table->unique(['thread_id', 'post_id']);
        });
        foreach (Schema::getTableListing() as $name) {
            if (preg_match('/^posts_\d+$/', $name)) {
                Schema::table($name, fn (Blueprint $table) => $table->unsignedBigInteger('recording_id')->nullable()->index());
            }
        }
    }

    public function down(): void
    {
        foreach (Schema::getTableListing() as $name) {
            if (preg_match('/^posts_\d+$/', $name) && Schema::hasColumn($name, 'recording_id')) {
                Schema::table($name, function (Blueprint $table) {
                    $table->dropIndex(['recording_id']);
                    $table->dropColumn('recording_id');
                });
            }
        }
        Schema::dropIfExists('post_recordings');
    }
};
