import { create } from "zustand";
import { type z } from "zod";
import { type personCreateSchema } from "@/types/schemas/person";

type Person = z.infer<typeof personCreateSchema>;
type PersonSheetMode = "view" | "edit";

interface PersonSheetState {
  isOpen: boolean;
  mode: PersonSheetMode;
  person: Person | null;
  openSheet: (person: Person, mode: PersonSheetMode) => void;
  closeSheet: () => void;
}

export const usePersonSheetStore = create<PersonSheetState>((set) => ({
  isOpen: false,
  mode: "view",
  person: null,
  openSheet: (person, mode) => set({ isOpen: true, person, mode }),
  closeSheet: () => set({ isOpen: false, person: null }),
}));
