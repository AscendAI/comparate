import { create } from "zustand";

interface ToggleLanguage {
  toggleLanguage: boolean;
  setToggle: () => void;
}

export const useStore = create<ToggleLanguage>((set) => ({
  toggleLanguage: false,
  setToggle: () => set((state) => ({ toggleLanguage: !state.toggleLanguage })),
}));
