<?php

namespace Tests\Unit\Actions;

use App\Actions\CreateUserAction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CreateUserActionTest extends TestCase
{
    use RefreshDatabase;

    public function test_creates_user_and_profile_successfully(): void
    {
        Role::create(['name' => 'user']);

        $userData = [
            'email' => 'test@example.com',
            'full_name' => 'Test User',
            'password' => 'password123',
            'identification' => '123456789',
            'type_identification' => 'CC', // From migration comment: CC, NIT, CE, etc.
            'type_user' => 'independiente', // From user_profiles migration: 'empleado', 'empresa', 'independiente'
            'phone' => null,
            'notes' => null,
        ];

        $action = new CreateUserAction();
        $user = $action->execute($userData);

        $this->assertInstanceOf(User::class, $user);

        $this->assertDatabaseHas('users', [
            'email' => $userData['email'],
            'name' => $userData['full_name'], // User model uses 'name', action maps 'full_name' to 'name'
        ]);

        $this->assertTrue(Hash::check($userData['password'], $user->password));

        $this->assertDatabaseHas('user_profiles', [
            'user_id' => $user->id,
            'identification' => $userData['identification'],
            'type_identification' => $userData['type_identification'],
            'full_name' => $userData['full_name'],
            'type_user' => $userData['type_user'],
        ]);

        $this->assertTrue($user->hasRole('user'));
    }
}
