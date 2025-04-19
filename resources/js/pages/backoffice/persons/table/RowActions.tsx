import { useState } from "react";
import { router } from '@inertiajs/react';
import { usePersonSheetStore } from "@/store/personSheetStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import { toast } from "sonner";

export function RowActions({ person }: { person: any }) {
  const openSheet = usePersonSheetStore((state) => state.openSheet);
  const [open, setOpen] = useState(false);
  const handleDelete = () => {
    setOpen(false);
    router.delete(`/dashboard/persons/${person.id}`, {
      onSuccess: () => {
        toast.success("Persona eliminada correctamente");
        router.visit('/dashboard/persons', {
          replace: true,
          only: ['data'],
          preserveScroll: true,
        });
      },
      onError: () => {
        toast.error("Ocurrió un error al eliminar la persona");
      }
    });
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => openSheet(person, "view")}>Ver detalles</DropdownMenuItem>
          <DropdownMenuItem onClick={() => openSheet(person, "edit")}>Editar</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive" onClick={() => setOpen(true)}>
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar persona?</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas eliminar a <b>{person.first_name} {person.last_name || person.company_name}</b>? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
