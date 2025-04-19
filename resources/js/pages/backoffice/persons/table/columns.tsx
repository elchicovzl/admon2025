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
    const isMobile = useIsMobile()
  
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="link" className="w-fit px-0 text-left text-foreground">
            {item.identification_number}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="flex flex-col">
          <SheetHeader className="gap-1">
            <SheetTitle>{item.identification_number}</SheetTitle>
            <SheetDescription>Showing total visitors for the last 6 months</SheetDescription>
          </SheetHeader>
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4 text-sm">
            {!isMobile && (
              <>
                <div className="grid gap-2">
                  <div className="flex gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUpIcon className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    Showing total visitors for the last 6 months. This is just some random text to test the layout. It
                    spans multiple lines and should wrap around.
                  </div>
                </div>
                <Separator />
              </>
            )}
          </div>
          <SheetFooter className="mt-auto flex gap-2 sm:flex-col sm:space-x-0">
            <SheetClose asChild>
              <Button variant="outline" className="w-full">
                Close
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
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
      accessorKey: "first_name",
      header: "Nombre",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
            {row.original.first_name}
        </div>
      ),
    },
    {
      accessorKey: "last_name",
      header: () => <div className="w-full">Apellido</div>,
      cell: ({ row }) => (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
              loading: `Saving ${row.original.last_name}`,
              success: "Done",
              error: "Error",
            })
          }}
        >
          <Label htmlFor={`${row.original.id}-target`} className="sr-only">
            Target
          </Label>
          <Input
            className="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background"
            defaultValue={row.original.last_name}
            id={`${row.original.id}-target`}
          />
        </form>
      ),
    },
    {
      accessorKey: "type",
      header: () => <div className="w-full">Type</div>,
      cell: ({ row }) => (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
              loading: `Saving ${row.original.identification_number}`,
              success: "Done",
              error: "Error",
            })
          }}
        >
          <Label htmlFor={`${row.original.id}-limit`} className="sr-only">
          type
          </Label>
          <Input
            className="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background"
            defaultValue={row.original.type}
            id={`${row.original.id}-limit`}
          />
        </form>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
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
