import {
    type ColumnDef,
} from "@tanstack/react-table"
import {  useSortable } from "@dnd-kit/sortable"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {  GripVerticalIcon, MoreVerticalIcon, TrendingUpIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useIsMobile } from "@/hooks/use-mobile"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@radix-ui/react-separator"
import { toast } from "sonner"
import { personCreateSchema } from "@/types/schemas/person"
import { usePersonSheetStore } from "@/store/personSheetStore";
import { router } from '@inertiajs/react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { useState } from "react"
import { RowActions } from "./RowActions";

function DragHandle({ id }: { id: number }) {
    const { attributes, listeners } = useSortable({
      id,
    })
  
    return (
      <Button
        {...attributes}
        {...listeners}
        variant="ghost"
        size="icon"
        className="size-7 text-muted-foreground hover:bg-transparent"
      >
        <GripVerticalIcon className="size-3 text-muted-foreground" />
        <span className="sr-only">Drag to reorder</span>
      </Button>
    )
}

function TableCellViewer({ item }: { item: z.infer<typeof personCreateSchema> }) {
    const openSheet = usePersonSheetStore((state) => state.openSheet);
    return (
      <Button
        variant="link"
        className="w-fit px-0 text-left text-foreground"
        onClick={() => openSheet(item, "view")}
      >
        {item.identification_number}
      </Button>
    );
}
  
export const columns: ColumnDef<z.infer<typeof personCreateSchema>>[] = [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.id} />,
    },
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "identification_number",
      header: "Identificación",
      cell: ({ row }) => {
        return <TableCellViewer item={row.original} />
      },
      enableHiding: false,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="">
          {row.original.email}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: () => <div className="w-full">Tipo</div>,
      cell: ({ row }) => (
        <div className="capitalize">
          {row.original.type === 'natural' ? 'Natural' : 'Jurídica'}
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "phone",
      header: "Telefono",
      cell: ({ row }) => {
        const isAssigned = row.original.phone !== "Assign reviewer"
  
        if (isAssigned) {
          return row.original.phone
        }
  
        return (
          <>
            <Label htmlFor={`${row.original.id}-reviewer`} className="sr-only">
                Phone
            </Label>
            {row.original.phone}
          </>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Fecha de Creación",
      cell: ({ row }) => {
        // Puedes formatear la fecha si lo deseas
        const date = new Date(row.original.created_at);
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      },
      enableSorting: true,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return <RowActions person={row.original} />;
      },
    },
]
