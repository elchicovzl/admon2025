<?php

namespace App\Actions;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Throwable;

class CreateUserAction
{
    public function execute(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'email' => $data['email'],
                'name' => $data['full_name'],
                'password' => Hash::make($data['password']),
            ]);

            $user->assignRole('user');

            $user->profile()->create([
                'identification' => $data['identification'],
                'type_identification' => $data['type_identification'],
                'full_name' => $data['full_name'],
                'phone' => $data['phone'] ?? null,
                'type_user' => $data['type_user'],
                'notes' => $data['notes'] ?? null,
            ]);

            return $user;
        });
    }
}
