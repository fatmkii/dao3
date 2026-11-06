<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('threads', function (Blueprint $table) {
            $table->dateTime('scheduled_at')->nullable();
            $table->index(['is_delay', 'scheduled_at']);
        });
    }

    public function down(): void
    {
        Schema::table('threads', function (Blueprint $table) {
            $table->dropIndex(['is_delay', 'scheduled_at']);
            $table->dropColumn('scheduled_at');
        });
    }
};
