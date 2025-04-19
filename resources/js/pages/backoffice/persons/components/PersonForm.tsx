import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';

import { 
    personCreateSchema,
    personUpdateSchema,
    PersonCreateFormData,
    PersonUpdateFormData
} from '@/types/schemas/person'; // Ajusta la ruta

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // Utilidad de Shadcn para clases condicionales
import { usePersonSheetStore } from '@/store/personSheetStore';

interface PersonFormProps {
    person?: PersonCreateFormData & { id?: number };
    className?: string;
}

export function PersonForm({ person, className }: PersonFormProps) {
    const isEditing = !!person?.id;
    const currentSchema = isEditing ? personUpdateSchema : personCreateSchema;
    const { closeSheet } = usePersonSheetStore();


    // 3. Inicializa React Hook Form con el resolver de Zod
    const form = useForm<PersonCreateFormData | PersonUpdateFormData>({
        resolver: zodResolver(currentSchema),
        defaultValues: person || {
            type: 'natural',
            identification_type: undefined, // O un valor por defecto como 'CC'
            identification_number: '',
            first_name: '', // Importante inicializar con null/undefined si Zod lo espera
            last_name: '',
            date_of_birth: '', // Usa '' si tu date picker maneja strings vacíos
            company_name: '',
            email: '',
            address: '',
            phone: '',
            occupation: '',
            salary: undefined,
        },
    });

    // 4. Observa el campo 'type' para renderizar campos condicionales
    const personType = form.watch('type');

    // 5. Define la función onSubmit
    function onSubmit(data: PersonCreateFormData | PersonUpdateFormData) {
        console.log('Datos validados por Zod:', data);

        // Define la URL y el método para Inertia
        const url = isEditing ? `/dashboard/persons/${person.id}` : '/dashboard/persons';
        // Inertia mapea estos métodos a las peticiones HTTP correctas (POST con _method para PUT/PATCH)
        const method = isEditing ? 'put' : 'post';

        router[method](url, data, {
            preserveScroll: true, // Mantiene la posición de scroll
            onSuccess: () => {
                // Acciones en caso de éxito (ej. mostrar notificación, cerrar modal)
                console.log('Operación exitosa!');
                if (!isEditing) {
                    form.reset(); // Limpia el formulario después de crear
                    router.visit('/dashboard/persons');
                }else {
                    router.visit('/dashboard/persons', {
                        replace: true,
                        only: ['data'],
                        preserveScroll: true,
                    });
                }
            },
            onError: (errors) => {
                // Errores de validación del *backend* (Laravel)
                console.error('Errores del Backend:', errors);
                // RHF y Shadcn/ui <FormMessage /> usualmente muestran los errores
                // si los nombres de los campos coinciden con las claves del objeto 'errors'.
                // Puedes mapearlos manualmente si es necesario con form.setError:
                 Object.entries(errors).forEach(([key, value]) => {
                    // Asegura que key es un campo válido del formulario antes de llamar a setError
                    if (key in form.getValues()) {
                         form.setError(key as keyof (PersonCreateFormData | PersonUpdateFormData), { type: 'server', message: value });
                    }
                 });
            },
            onFinish: () => {
                closeSheet();
            }
        });
    }

    return (
        <Card className={cn("w-full", className)}>
            <CardHeader>
                <CardTitle>{isEditing ? 'Editar Persona' : 'Registrar Nueva Persona'}</CardTitle>
            </CardHeader>
            <CardContent>
                {/* 6. Envuelve todo en el componente <Form> de Shadcn/ui */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        

                        {/* Campo: Tipo de Persona (Select) */}
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Persona *</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        // Deshabilitar cambio de tipo al editar podría ser buena idea
                                        disabled={isEditing || form.formState.isSubmitting}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="natural">Natural</SelectItem>
                                            <SelectItem value="juridica">Jurídica</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage /> {/* Muestra errores para este campo */}
                                </FormItem>
                            )}
                        />

                        {/* === Campos Comunes === */}

                        <FormField
                            control={form.control}
                            name="identification_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo Identificación *</FormLabel>
                                     <Select onValueChange={field.onChange} defaultValue={field.value} disabled={form.formState.isSubmitting}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {/* Deberías obtener esta lista de forma dinámica o definirla como constante */}
                                            <SelectItem value="CC">Cédula Ciudadanía</SelectItem>
                                            <SelectItem value="NIT">NIT</SelectItem>
                                            <SelectItem value="CE">Cédula Extranjería</SelectItem>
                                            <SelectItem value="PAS">Pasaporte</SelectItem>
                                            <SelectItem value="TI">Tarjeta Identidad</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="identification_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Número Identificación *</FormLabel>
                                    <FormControl>
                                        {/* Pasamos {...field} para conectar RHF */}
                                        <Input placeholder="Ingrese el número" {...field} disabled={form.formState.isSubmitting} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                         <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Correo Electrónico</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="ejemplo@correo.com" {...field} value={field.value ?? ''} disabled={form.formState.isSubmitting}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                         )}/>

                         <FormField control={form.control} name="address" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dirección</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ingrese la dirección" {...field} value={field.value ?? ''} disabled={form.formState.isSubmitting}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                         )}/>

                         <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Teléfono</FormLabel>
                                <FormControl>
                                    <Input type="tel" placeholder="Ingrese el teléfono" {...field} value={field.value ?? ''} disabled={form.formState.isSubmitting}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                         )}/>


                        {/* === Campos Condicionales para Persona Natural === */}
                        {personType === 'natural' && (
                            <>
                                <FormField control={form.control} name="first_name" render={({ field }) => (
                                    <FormItem> <FormLabel>Nombres *</FormLabel> <FormControl><Input placeholder="Ingrese los nombres" {...field} value={field.value ?? ''} disabled={form.formState.isSubmitting}/></FormControl> <FormMessage /> </FormItem>
                                )}/>
                                <FormField control={form.control} name="last_name" render={({ field }) => (
                                    <FormItem> <FormLabel>Apellidos *</FormLabel> <FormControl><Input placeholder="Ingrese los apellidos" {...field} value={field.value ?? ''} disabled={form.formState.isSubmitting}/></FormControl> <FormMessage /> </FormItem>
                                )}/>
                                <FormField control={form.control} name="date_of_birth" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha de Nacimiento *</FormLabel>
                                        <FormControl>
                                            {/* Si tienes un DatePicker Shadcn: <DatePicker {...field} /> */}
                                            {/* O un input simple: */}
                                            <Input type="date" {...field} value={field.value ?? ''} disabled={form.formState.isSubmitting}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                 <FormField control={form.control} name="occupation" render={({ field }) => (
                                    <FormItem> <FormLabel>Ocupación</FormLabel> <FormControl><Input placeholder="Ingrese la ocupación" {...field} value={field.value ?? ''} disabled={form.formState.isSubmitting}/></FormControl> <FormMessage /> </FormItem>
                                )}/>
                                <FormField control={form.control} name="salary" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Salario/Ingresos</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" placeholder="Ingrese el valor" {...field}
                                                value={field.value ?? ''}
                                                // onChange necesita convertir a número si el schema espera number
                                                {...form.register("salary", { valueAsNumber: true })}
                                                disabled={form.formState.isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                            </>
                        )}

                        {/* === Campos Condicionales para Persona Jurídica === */}
                        {personType === 'juridica' && (
                            <>
                                <FormField control={form.control} name="company_name" render={({ field }) => (
                                    <FormItem> <FormLabel>Razón Social *</FormLabel> <FormControl><Input placeholder="Ingrese la razón social" {...field} value={field.value ?? ''} disabled={form.formState.isSubmitting}/></FormControl> <FormMessage /> </FormItem>
                                )}/>
                            </>
                        )}

                        </div>

                        {/* Botón de Envío */}
                        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full sm:w-auto cursor-pointer">
                            {form.formState.isSubmitting
                                ? 'Guardando...'
                                : (isEditing ? 'Actualizar Persona' : 'Crear Persona')}
                        </Button>

                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}