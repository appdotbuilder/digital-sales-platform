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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['buyer', 'seller', 'admin'])->default('buyer')->after('email');
            $table->boolean('is_active')->default(true)->after('role');
            $table->string('avatar_url')->nullable()->after('is_active');
            $table->text('bio')->nullable()->after('avatar_url');
            
            $table->index('role');
            $table->index(['role', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'is_active', 'avatar_url', 'bio']);
        });
    }
};