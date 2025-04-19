<?php

namespace App\Actions\Persons;

use App\Models\Person;
use App\Models\User; // Para tipar el usuario autenticado
use Illuminate\Support\Facades\Auth; // Para obtener el usuario por defecto
use Illuminate\Support\Facades\Log;

class CreatePersonAction
{
    /**
     * Crea una nueva persona en la base de datos.
     *
     * @param array $data Datos validados del StorePersonRequest.
     * @param User|null $creator El usuario que realiza la acción (opcional, por defecto el autenticado).
     * @return Person La instancia de Person recién creada.
     * @throws \Exception Si ocurre un error durante la creación.
     */
    public function execute(array $data, ?User $creator = null): Person
    {
        // Determina quién es el creador
        $creatorId = $creator ? $creator->id : Auth::id(); // Usa el usuario pasado o el autenticado

        // Añade el ID del creador a los datos
        $data['created_by_user_id'] = $creatorId;

        try {
            $person = Person::create($data);
            return $person;
        } catch (\Exception $e) {
            // Puedes loguear el error aquí si quieres
            Log::error("Error en CreatePersonAction: " . $e->getMessage(), ['data' => $data]);
            // Relanza la excepción para que el controlador la maneje o maneja aquí
            throw $e;
        }
    }
}