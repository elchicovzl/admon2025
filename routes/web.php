<?php

use App\Http\Controllers\PersonController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('front/welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::middleware(['redirectRole:admin,super-admin'])->group(function () {

        Route::get('dashboard', function () {
            return Inertia::render('backoffice/dashboard');
        })->name('backoffice.index');

        Route::get('dashboard/users', function () {
            return Inertia::render('backoffice/users/index');
        })->name('users.index');



        // Nueva ruta para crear usuario
        Route::get('dashboard/users/create', [UserController::class, 'create'])->name('users.create');
        Route::post('dashboard/users', [UserController::class, 'store'])->name('users.store');


        Route::get('dashboard/persons', [PersonController::class, 'index'])->name('persons.index');

        Route::get('dashboard/persons/create', [PersonController::class, 'create'])->name('persons.create');
        Route::post('dashboard/persons', [PersonController::class, 'store'])->name('persons.store');
        Route::put('dashboard/persons/{person}', [PersonController::class, 'update'])->name('persons.update');
        Route::delete('dashboard/persons/{person}', [PersonController::class, 'destroy'])->name('persons.destroy');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
