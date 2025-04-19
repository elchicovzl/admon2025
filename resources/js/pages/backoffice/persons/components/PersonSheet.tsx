import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { usePersonSheetStore } from "@/store/personSheetStore";
import { PersonForm } from "./PersonForm";

export default function PersonSheet() {
  const { isOpen, person, mode, closeSheet } = usePersonSheetStore();

  if (!person) return null;

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
          <div className="space-y-2 mt-4">
            <div><b>Nombre:</b> {person.first_name} {person.last_name}</div>
            <div><b>Email:</b> {person.email}</div>
            <div><b>Teléfono:</b> {person.phone}</div>
            <div><b>Tipo:</b> {person.type}</div>
            <div><b>Identificación:</b> {person.identification_number}</div>
            {person.created_at && (
              <div><b>Fecha de creación:</b> {new Date(person.created_at).toLocaleString()}</div>
            )}
          </div>
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
