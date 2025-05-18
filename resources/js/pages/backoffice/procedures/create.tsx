import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Tramites', href: '/dashboard/tramites' },
  { title: 'Crear', href: '' },
];

export default function Create() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Tramite" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            </div>
         </AppLayout>
    )
}