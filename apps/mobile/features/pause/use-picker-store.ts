import { create } from "zustand";

type PickerStore = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const usePickerStore = create<PickerStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
