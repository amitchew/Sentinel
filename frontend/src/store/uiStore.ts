import { create } from 'zustand';

interface UIStore {
  selectedValidatorId: string | null;
  sidebarOpen: boolean;
  currentView: 'overview' | 'analytics' | 'validators' | 'events' | 'settings';
  setSelectedValidatorId: (id: string | null) => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentView: (view: 'overview' | 'analytics' | 'validators' | 'events' | 'settings') => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  selectedValidatorId: null,
  sidebarOpen: true,
  currentView: 'overview',
  setSelectedValidatorId: (id) => set({ selectedValidatorId: id }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrentView: (view) => set({ currentView: view }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
