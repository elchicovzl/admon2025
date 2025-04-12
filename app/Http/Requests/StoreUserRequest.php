<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['admin','super-admin']);
    }

    public function rules(): array
    {
        return [
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6|confirmed',
            'identification' => 'required|unique:user_profiles',
            'type_identification' => 'required|string',
            'full_name' => 'required|string',
            'phone' => 'nullable|string',
            'type_user' => 'required|in:empleado,empresa,independiente',
            'notes' => 'nullable|string',
        ];
    }
}
