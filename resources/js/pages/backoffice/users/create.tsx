import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Users', href: '/dashboard/users' },
  { title: 'Crear', href: '' },
];

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    password_confirmation: '',
    identification: '',
    type_identification: '',
    full_name: '',
    phone: '',
    type_user: '',
    notes: '',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post(route('users.store'));
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Crear Usuario" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <Link href={route('users.index')} className="text-sm underline">← Volver</Link>
            <h1 className="text-2xl font-semibold">Crear Nuevo Usuario</h1>

            <form onSubmit={submit} className="space-y-4">
            {[
                { name: 'email', label: 'Email', type: 'email' },
                { name: 'password', label: 'Contraseña', type: 'password' },
                { name: 'password_confirmation', label: 'Confirmar Contraseña', type: 'password' },
                { name: 'full_name', label: 'Nombre completo / Razón social' },
                { name: 'type_identification', label: 'Tipo de identificación' },
                { name: 'identification', label: 'Número de identificación' },
                { name: 'phone', label: 'Teléfono', type: 'tel' },
            ].map(field => (
                <div key={field.name}>
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                    id={field.name}
                    type={field.type ?? 'text'}
                    value={data[field.name as keyof typeof data]}
                    onChange={e => setData(field.name, e.target.value)}
                />
                {errors[field.name] && <p className="text-red-600 text-sm">{errors[field.name]}</p>}
                </div>
            ))}

            <div>
                <Label htmlFor="type_user">Tipo de usuario</Label>
                <Select value={data.type_user} onValueChange={value => setData('type_user', value)}>
                <SelectTrigger id="tipo_usuario">
                    <SelectValue placeholder="Selecciona…" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="empleado">Empleado</SelectItem>
                    <SelectItem value="empresa">Empresa</SelectItem>
                    <SelectItem value="independiente">Independiente</SelectItem>
                </SelectContent>
                </Select>
                {errors.type_user && <p className="text-red-600 text-sm">{errors.type_user}</p>}
            </div>

            <div>
                <Label htmlFor="notas">Notas</Label>
                <Textarea
                id="notas"
                value={data.notes}
                onChange={e => setData('notes', e.target.value)}
                />
                {errors.notes && <p className="text-red-600 text-sm">{errors.notes}</p>}
            </div>

            <Button type="submit" disabled={processing}>Crear Usuario</Button>
            </form>
      </div>
    </AppLayout>
  );
}
