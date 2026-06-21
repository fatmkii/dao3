<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('accuses', function (Blueprint $table) {
            $table->string('target_type')->default('post')->after('id')->index();
            $table->integer('post_id')->nullable()->change();
            $table->unsignedBigInteger('loudspeaker_id')->nullable()->after('post_id')->unique();
            $table->string('loudspeaker_content', 500)->nullable()->after('thread_title');
            $table->string('loudspeaker_color', 8)->nullable()->after('loudspeaker_content');
            $table->unsignedInteger('loudspeaker_thread_id')->nullable()->after('loudspeaker_color');
        });

        Schema::table('accuse_reasons', function (Blueprint $table) {
            $table->integer('post_id')->nullable()->change();
            $table->unsignedBigInteger('loudspeaker_id')->nullable()->after('post_id')->index();
            $table->unique(['loudspeaker_id', 'reporter_user_id']);
        });
    }

    public function down(): void
    {
        Schema::table('accuse_reasons', function (Blueprint $table) {
            $table->dropUnique(['loudspeaker_id', 'reporter_user_id']);
            $table->dropColumn('loudspeaker_id');
            $table->integer('post_id')->nullable(false)->change();
        });

        Schema::table('accuses', function (Blueprint $table) {
            $table->dropUnique(['loudspeaker_id']);
            $table->dropColumn([
                'target_type',
                'loudspeaker_id',
                'loudspeaker_content',
                'loudspeaker_color',
                'loudspeaker_thread_id',
            ]);
            $table->integer('post_id')->nullable(false)->change();
        });
    }
};
