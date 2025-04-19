<?php

namespace App\Actions\Persons;

use App\Models\Person;
use Illuminate\Support\Facades\Log;

class UpdatePersonAction
{
    /**
     * Actualiza una persona con los datos dados.
     *
     * @param Person $person
     * @param array $data
     * @return Person
     */
    public function execute(Person $person, array $data): Person
    {
        try {
            // Puedes personalizar aquí la lógica de actualización si necesitas hooks, eventos, etc.
            $person->update($data);
            return $person;
        } catch (\Exception $e) {
            Log::error("Error en UpdatePersonAction: " . $e->getMessage(), ['person_id' => $person->id, 'data' => $data]);
            throw $e;
        }
    }
}
