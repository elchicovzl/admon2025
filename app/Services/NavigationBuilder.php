<?php

namespace App\Services;

use Illuminate\Http\Request;

class NavigationBuilder
{
    /**
     * Build the navigation menu structure for the authenticated user.
     * This method is easily extensible for roles, modules, permissions, or dynamic items.
     *
     * @param Request $request
     * @return array
     */
    public static function build(Request $request): array
    {
        $user = $request->user();
        $nav = [];

        // Base menu (visible to todos)
        $nav[] = self::makeItem('Dashboard', '/dashboard');

        // Admin menus
        if ($user?->hasRole('super-admin') || $user?->hasRole('admin')) {
            $nav[] = self::makeItem('Usuarios', '/dashboard/users');
            $nav[] = self::makeItem('Personas', '/dashboard/persons');
        }

        // Ejemplo: menú por permiso
        // if ($user?->can('view reports')) {
        //     $nav[] = self::makeItem('Reportes', '/dashboard/reports');
        // }

        // Ejemplo: menú por módulo activado
        // if (config('modules.crm')) {
        //     $nav[] = self::makeItem('CRM', '/dashboard/crm');
        // }

        return $nav;
    }

    /**
     * Helper para crear un ítem de menú.
     */
    protected static function makeItem(string $title, string $url, array $children = []): array
    {
        return [
            'title' => $title,
            'url' => $url,
            'children' => $children,
        ];
    }
}
