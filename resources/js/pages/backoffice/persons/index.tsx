import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { DataTable } from './table/data-table';
import PersonSheet from "./components/PersonSheet";
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Personas',
        href: '/dashboard/persons',
    },
];

export default function DashboardPersons() {
    const { data } = usePage().props

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    className="btn btn-primary"
                    onClick={() => router.visit(route('persons.create'))}
                  >
                    Nueva Persona
                  </Button>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min">
                    <div className="container mx-auto py-10">
                        <DataTable  
                            data={data} 
                            paginationMeta={{
                                pageIndex: data.current_page - 1,
                                pageCount: data.last_page,
                                total: data.total,
                                pageSize: data.per_page
                            }} 
                            filters={data.filters}
                        />
                        <PersonSheet />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
