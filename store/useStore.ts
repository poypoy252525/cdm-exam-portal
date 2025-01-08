import { create } from "zustand";

interface Store {
  success: boolean;
  setSuccess: (success: boolean) => void;
}

export const useStore = create<Store>((set) => ({
  success: false,
  setSuccess: (success) => set({ success }),
}));
