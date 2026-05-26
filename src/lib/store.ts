import { create } from "zustand";

interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggle: () => void;
  setMobileOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,
  isMobileOpen: false,
  toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setMobileOpen: (open) => set({ isMobileOpen: open }),
}));

interface KantorSelectionState {
  selectedKantorId: string | null;
  setSelectedKantorId: (id: string | null) => void;
}

export const useKantorSelection = create<KantorSelectionState>((set) => ({
  selectedKantorId: null,
  setSelectedKantorId: (id) => set({ selectedKantorId: id }),
}));
