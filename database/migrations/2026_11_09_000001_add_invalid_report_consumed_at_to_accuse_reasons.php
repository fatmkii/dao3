<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('accuse_reasons', function (Blueprint $table) {
            $table->timestamp('invalid_report_consumed_at')->nullable();
            $table->index(['reporter_user_id', 'invalid_report_consumed_at', 'created_at'], 'accuse_reasons_invalid_report_index');
        });
    }

    public function down(): void
    {
        Schema::table('accuse_reasons', function (Blueprint $table) {
            $table->dropIndex('accuse_reasons_invalid_report_index');
            $table->dropColumn('invalid_report_consumed_at');
        });
    }
};
