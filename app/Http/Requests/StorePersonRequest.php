<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule; // Rule todavía se puede usar para 'in'

class StorePersonRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        // Mantenemos la autorización que tenías o simplemente true por ahora
        return true;
        // O si usas roles como en tu ejemplo de User:
        // return $this->user()->hasAnyRole(['admin','super-admin']);
    }

    /**
     * Get the validation rules that apply to the request.
     * REGLAS MÍNIMAS PARA DEBUGGING DE TIMEOUT
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // dd('Ejecutando rules() simplificadas...'); // Puedes poner un dd aquí si quieres

        // Quitamos unique, prohibited_if y complejidad innecesaria para la prueba
        return [
            'type' => 'required|in:natural,juridica',

            'identification_type' => 'required|string|in:CC,NIT,CE,PAS,TI',
            'identification_number' => 'required|unique:persons|string|min:1|max:25', // SIN unique

            // --- Condicionales Mínimos ---
            // required_if asegura que el campo exista si el tipo coincide.
            // nullable permite que no exista si el tipo NO coincide.
            'first_name' => 'required_if:type,natural|nullable|string|max:255',
            'last_name' => 'required_if:type,natural|nullable|string|max:255',
            'company_name' => 'required_if:type,juridica|nullable|string|max:255',

            // --- Otros campos MUY simplificados (solo tipo básico o nullable) ---
            'date_of_birth' => 'nullable|date_format:Y-m-d',
            'email' => 'nullable|email|max:255', // SIN unique
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
            'occupation' => 'nullable|string',
            'salary' => 'nullable|numeric',
        ];
    }

    /**
     * Get custom messages for validator errors.
     * (Puedes mantener este método como estaba o simplificarlo también si quieres)
     * @return array<string, string>
     */
    public function messages(): array
    {
        // Mantenemos los mensajes básicos
        return [
            'type.required' => 'El campo tipo de persona es obligatorio.',
            'identification_type.required' => 'El tipo de identificación es obligatorio.',
            'identification_number.required' => 'El número de identificación es obligatorio.',
            'identification_number.unique' => 'El número de identificación ya existe.',
            'first_name.required_if' => 'El nombre es obligatorio para personas naturales.',
            'last_name.required_if' => 'Los apellidos son obligatorios para personas naturales.',
            'company_name.required_if' => 'La razón social es obligatoria para personas jurídicas.',
            'email.email' => 'El formato del correo electrónico no es válido.',
            'salary.numeric' => 'El salario debe ser un número.',
            'date_of_birth.date_format' => 'La fecha de nacimiento debe tener el formato AAAA-MM-DD.',
        ];
    }

    /**
     * Get the validated data from the request, ensuring consistency based on type.
     *
     * @param  string|null  $key
     * @param  mixed  $default
     * @return mixed
     */
    public function validated($key = null, $default = null): mixed
    {
        // Llama al método validated() original para obtener los datos
        // que pasaron las reglas definidas en rules()
        $validatedData = parent::validated();

        $type = $validatedData['type'] ?? null;

        // Aplica la misma lógica de limpieza que tenías en after()
        if ($type === 'natural') {
            $validatedData['company_name'] = null;
            // Asegúrate de que otros campos específicos de jurídica sean null si existen
        } elseif ($type === 'juridica') {
            $validatedData['first_name'] = null;
            $validatedData['last_name'] = null;
            $validatedData['date_of_birth'] = null;
            $validatedData['occupation'] = null;
            $validatedData['salary'] = null;
             // Asegúrate de que otros campos específicos de natural sean null si existen
        }

        // Devuelve todos los datos limpios o una clave específica si se solicitó
        if ($key !== null) {
            // Usa Arr::get para devolver una clave específica de forma segura
            return Arr::get($validatedData, $key, $default);
        }

        // Devuelve el array completo de datos validados y limpios
        return $validatedData;
    }
}