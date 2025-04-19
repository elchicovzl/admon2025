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
        Schema::create('persons', function (Blueprint $table) {
            $table->id();

            $table->string('type')->index();
            $table->string('identification_type')->index();
            $table->string('identification_number')->index();

            $table->unique('identification_number');

            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->date('date_of_birth')->nullable();

            $table->string('company_name')->nullable();

            $table->string('email')->unique()->nullable();
            $table->text('address')->nullable();
            $table->string('phone')->nullable();

            $table->string('city')->nullable()->index();
            $table->string('department')->nullable()->index();

            $table->string('occupation')->nullable();
            $table->decimal('salary', 15, 2)->nullable();

            $table->foreignId('created_by_user_id')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null');

            $table->foreignId('user_id')
                ->nullable()
                ->unique()
                ->constrained('users')
                ->onDelete('set null');

            $table->timestamps();

            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('persons');
    }
};
