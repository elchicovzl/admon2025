import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { usePersonSheetStore } from "@/store/personSheetStore";
import { PersonForm } from "./PersonForm";

export default function PersonSheet() {
  const { isOpen, person, mode, closeSheet } = usePersonSheetStore();

  if (!person) return null;

  // Renderizado condicional según tipo
  const renderNaturalFields = () => (
    <>
      <div><b>Nombre:</b> {person.first_name} {person.last_name}</div>
      <div><b>Fecha de nacimiento:</b> {person.date_of_birth}</div>
      <div><b>Email:</b> {person.email}</div>
      <div><b>Teléfono:</b> {person.phone}</div>
      <div><b>Ocupación:</b> {person.occupation}</div>
      <div><b>Salario:</b> {person.salary != null ? person.salary : '-'}</div>
    </>
  );

  const renderJuridicaFields = () => (
    <>
      <div><b>Razón social:</b> {person.company_name}</div>
      <div><b>Email:</b> {person.email}</div>
      <div><b>Teléfono:</b> {person.phone}</div>
      <div><b>Dirección:</b> {person.address}</div>
    </>
  );

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent className="max-w-xl w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>
            {mode === "view" ? "Detalles de la persona" : "Editar persona"}
          </SheetTitle>
          <SheetDescription>
            {mode === "view"
              ? "Aquí puedes ver los detalles de la persona."
              : "Edita los datos y guarda los cambios."}
          </SheetDescription>
        </SheetHeader>
        {mode === "view" ? (
          <Card className="m-4">
            <CardContent className="space-y-2 py-6">
              <div><b>Tipo:</b> {person.type === 'natural' ? 'Natural' : 'Jurídica'}</div>
              <div><b>Identificación:</b> {person.identification_number}</div>
              {person.type === 'natural' ? renderNaturalFields() : renderJuridicaFields()}
              {person.created_at && (
                <div><b>Fecha de creación:</b> {new Date(person.created_at).toLocaleString()}</div>
              )}
            </CardContent>
          </Card>
        ) : (
          <PersonForm person={person} />
        )}
        <SheetFooter>
          <button onClick={closeSheet} className="btn btn-secondary mt-4 w-full">Cerrar</button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
