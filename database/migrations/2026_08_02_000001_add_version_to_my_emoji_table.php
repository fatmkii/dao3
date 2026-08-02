<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('my_emoji', function (Blueprint $table) {
            $table->uuid('version')->nullable()->after('emojis');
        });

        DB::table('my_emoji')
            ->whereNull('version')
            ->update(['version' => (string) Str::uuid()]);
    }

    public function down(): void
    {
        Schema::table('my_emoji', function (Blueprint $table) {
            $table->dropColumn('version');
        });
    }
};
