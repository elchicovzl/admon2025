<?php

namespace App\Http\Controllers;

use App\Actions\CreateUserAction;
use App\Http\Requests\StoreUserRequest;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class UserController extends Controller
{

    public function create()
    {
        return Inertia::render('backoffice/users/create');
    }

    public function store(StoreUserRequest $request, CreateUserAction $action)
    {
        try {
            $action->execute($request->validated());

            return redirect()->route('users.index')
                            ->with('success', 'Usuario creado correctamente.');
        }
        catch (QueryException $e) {
            Log::error('Error creando usuario: '.$e->getMessage());

            return redirect()->back()
                ->withErrors(['general' => 'Ocurrió un error al guardar. Por favor inténtalo de nuevo.'])
                ->withInput();
        }
        catch (\Throwable $e) {
            Log::critical('Error inesperado creando usuario: '.$e->getMessage());

            return Inertia::render('backoffice/users/Create', [
                'errors' => ['general' => 'Error interno — contacta al administrador.']
            ])->toResponse($request);
        }
    }
}
