<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->uuid('mobile_session_id')->nullable()->after('tokenable_id');
            $table->string('client_type', 20)->default('web')->after('mobile_session_id');
            $table->foreign('mobile_session_id')->references('id')->on('mobile_sessions')->cascadeOnDelete();
            $table->index(['mobile_session_id', 'client_type']);
        });
    }

    public function down(): void
    {
        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->dropForeign(['mobile_session_id']);
            $table->dropIndex(['mobile_session_id', 'client_type']);
            $table->dropColumn(['mobile_session_id', 'client_type']);
        });
    }
};
