<?php

namespace App\Http\Controllers;

use App\Actions\Persons\CreatePersonAction;
use App\Actions\Persons\UpdatePersonAction;
use App\Http\Requests\StorePersonRequest;
use App\Http\Requests\UpdatePersonRequest;
use App\Models\Person;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Throwable;

class PersonController extends Controller
{
    public function index()
    {
        $perPage = request('perPage', 10);
        $search = request('search');

        $query = Person::query();

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('identification_number', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $persons = $query->latest()->paginate($perPage)->withQueryString();

        return Inertia::render('backoffice/persons/index', [
            'data' => $persons,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
    
    public function create()
    {
        return Inertia::render('backoffice/persons/create');
    }

    public function store(StorePersonRequest $request, CreatePersonAction $createPersonAction)
    {
        try {
            $person = $createPersonAction->execute($request->validated());

            return back()->with('success', "Persona '{$person->first_name} {$person->last_name}{$person->company_name}' creada exitosamente.");

        } catch (Throwable $e) {
            Log::error("Error creando persona desde PersonController: " . $e->getMessage());
            return back()->withErrors(['general' => 'Ocurrió un error interno al guardar la persona.'])->withInput();
        }
    }

    public function update(UpdatePersonRequest $request, Person $person, UpdatePersonAction $updatePersonAction)
    {
        try {
            $data = $request->validated();
            $updatePersonAction->execute($person, $data);
            return redirect()->back()->with('success', 'Persona actualizada.');
        } catch (Throwable $e) {
            Log::error("Error actualizando persona desde PersonController: " . $e->getMessage());
            return back()->withErrors(['general' => 'Ocurrió un error interno al actualizar la persona.'])->withInput();
        }
    }

    public function destroy(Person $person)
    {
        $person->delete();
        return redirect()->back()->with('success', 'Persona eliminada.');
    }
}