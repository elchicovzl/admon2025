import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Tramites',
        href: '/dashboard/tramites',
    },
];

export default function DashboardProcedures() {
    const { data } = usePage().props

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tramites" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    className="btn btn-primary"
                    onClick={() => router.visit(route('procedures.create'))}
                  >
                    Nuevo Tramite
                  </Button>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <PlaceholderPattern />
                </div>
            </div>
        </AppLayout>
    );
}
