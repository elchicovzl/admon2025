import React, { useEffect } from 'react'; // <--- 1. Importa useEffect
import { usePage } from '@inertiajs/react'; // <--- 2. Importa usePage
import { toast, Toaster } from 'sonner'; // <--- 3. Importa la función toast

import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';

// 4. Define una interfaz para las props compartidas por Inertia (ajusta según tus necesidades)
//    Es importante definir la estructura del objeto 'flash'.
interface PageProps {
    flash: {
        success?: string; // El 'success' debe coincidir con la clave usada en ->with('success', ...) en Laravel
        error?: string;   // Coincide con ->with('error', ...)
        warning?: string; // Si usas ->with('warning', ...)
        info?: string;    // Si usas ->with('info', ...)
    };
    // Incluye otras props compartidas si las necesitas en el layout (ej. auth.user)
    auth?: {
        user: { id: number; name: string; email: string; /* ...otros campos de user */ };
    };
    // Permite cualquier otra prop que pueda venir
    [key: string]: any;
}

interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    // Renombramos 'props' a 'forwardedProps' para evitar conflicto con las props de usePage
    // Asegúrate de pasar explícitamente las props que AppLayoutTemplate necesita
}

// Usamos 'forwardedProps' para pasar las props restantes a AppLayoutTemplate
export default ({ children, breadcrumbs, ...forwardedProps }: AppLayoutProps) => {

    // 5. Obtén las props de la página actual usando el hook usePage
    //    Tipamos con PageProps para obtener IntelliSense y seguridad de tipos.
    const { props } = usePage<PageProps>();

    // 6. Usa useEffect para reaccionar a los cambios en los mensajes flash
    //    Este hook se ejecutará cada vez que cambie el objeto props.flash
    useEffect(() => {
        const flash = props.flash; // Accede al objeto flash

        if (flash?.success) { // Verifica si existe el mensaje de éxito
            toast.success(flash.success);
        }
        if (flash?.error) { // Verifica si existe el mensaje de error
            toast.error(flash.error);
        }
        if (flash?.warning) { // Verifica si existe el mensaje de advertencia
            toast.warning(flash.warning);
        }
        if (flash?.info) { // Verifica si existe el mensaje de información
            toast.info(flash.info);
        }
        // Añade más 'if' si definiste otros tipos de mensajes flash en Laravel

    // El array de dependencias: El efecto se ejecuta cuando el objeto 'flash' cambia.
    // Si Inertia/Laravel siempre envían un nuevo objeto 'flash' cuando hay un mensaje,
    // esto funciona bien. Si solo cambian las propiedades internas, podrías listar
    // las propiedades individuales: [props.flash.success, props.flash.error, ...]
    }, [props.flash]);

    // El componente Toaster ya está renderizado correctamente aquí abajo
    return (
        // Pasa las 'forwardedProps' al template
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...forwardedProps}>
            {/* Toaster ya está aquí, listo para recibir llamadas de `toast()` */}
            <Toaster position="top-right" richColors closeButton />
            {children}
        </AppLayoutTemplate>
    );
};