<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $userTest = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => '12345678',
        ]);

        $superAdmin = User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'password' => '12345678',
        ]);

        $admin = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => '12345678',
        ]);


        // $role1 = Role::create(['name' => 'super-admin']);
        // $role2 = Role::create(['name' => 'admin']);
        // $role3 = Role::create(['name' => 'user']);

        $userTest->assignRole('user');
        $superAdmin->assignRole('super-admin');
        $admin->assignRole('admin');
    }
}
