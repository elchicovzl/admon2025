<?php

namespace App\Models;

use App\Enums\PersonTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Person extends Model
{
    use HasFactory;
    use SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'persons';

    /**
     * The attributes that are mass assignable.
     *
     * Lista todos los campos que pueden ser llenados masivamente
     * usando Person::create() o $person->update(). Deben coincidir
     * con los campos que recibes validados desde tus Form Requests.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'type',
        'identification_type',
        'identification_number',
        'first_name',
        'last_name',
        'date_of_birth',
        'company_name',
        'email',
        'address',
        'phone',
        'occupation',
        'salary',
        'created_by_user_id', // Importante para asignar el creador
        'user_id',            // Importante para enlazar la cuenta de usuario (Fase 2)
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * Útil si quieres ocultar ciertos campos cuando el modelo se convierte a JSON/array.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        // Puedes ocultar campos si es necesario, por ejemplo:
        // 'salary',
    ];

    /**
     * The attributes that should be cast.
     *
     * Define cómo ciertos atributos deben ser convertidos a tipos de datos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date_of_birth' => 'date:Y-m-d', // Convierte a objeto Carbon o string Y-m-d
        'salary' => 'decimal:2',        // Convierte a float/string con 2 decimales para mostrar
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime', // Si usas SoftDeletes
        'type' => PersonTypeEnum::class, // Si usas un Enum para el tipo
    ];

    //--------------------------------------------------------------------------
    // Relaciones Eloquent
    //--------------------------------------------------------------------------

    /**
     * Obtiene el usuario (Administrador) que creó este registro de persona.
     * Relación: persons.created_by_user_id -> users.id
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    /**
     * Obtiene la cuenta de usuario asociada a esta persona (para login - Fase 2).
     * Relación: persons.user_id -> users.id
     */
    public function userAccount(): BelongsTo
    {
        // Es importante que esta relación pueda ser null si user_id es nullable
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Si tienes un modelo Address y una relación (ej. one-to-many)
     */
    // public function addresses(): HasMany
    // {
    //     return $this->hasMany(Address::class);
    // }

    /**
     * Si tienes un modelo Procedure y una relación (ej. one-to-many)
     */
    // public function procedures(): HasMany
    // {
    //     return $this->hasMany(Procedure::class);
    // }


    //--------------------------------------------------------------------------
    // Accessors & Mutators (Atributos Calculados / Modificadores)
    //--------------------------------------------------------------------------

    /**
     * Obtiene el nombre completo (para Natural) o Razón Social (para Jurídica).
     * Ejemplo de uso: $person->display_name
     */
    protected function displayName(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->type === 'natural'
                            ? trim($this->first_name . ' ' . $this->last_name)
                            : $this->company_name,
        );
    }

    /**
     * Verifica si la persona es de tipo natural.
     * Ejemplo: if ($person->is_natural) { ... }
     */
    protected function isNatural(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->type === 'natural',
        );
    }

     /**
     * Verifica si la persona es de tipo jurídica.
     * Ejemplo: if ($person->is_juridica) { ... }
     */
    protected function isJuridica(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->type === 'juridica',
        );
    }


    //--------------------------------------------------------------------------
    // Scopes (Consultas reutilizables)
    //--------------------------------------------------------------------------

    /**
     * Scope para filtrar personas por tipo.
     * Uso: Person::ofType('natural')->get();
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $type ('natural' o 'juridica')
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope para obtener solo personas naturales.
     * Uso: Person::natural()->get();
     */
    public function scopeNatural($query)
    {
        return $query->where('type', 'natural');
    }

    /**
     * Scope para obtener solo personas jurídicas.
     * Uso: Person::juridica()->get();
     */
    public function scopeJuridica($query)
    {
        return $query->where('type', 'juridica');
    }
}
