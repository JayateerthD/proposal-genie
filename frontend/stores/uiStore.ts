import { create } from 'zustand';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface Modal {
  id: string;
  type: 'upload' | 'create-proposal' | 'edit-proposal' | 'confirm-delete' | 'share-proposal' | 'settings' | 'create-template';
  title: string;
  data?: any;
  onClose?: () => void;
  onConfirm?: (data?: any) => void;
}

interface Sidebar {
  id: string;
  type: 'ai-assistant' | 'proposal-details' | 'collaboration' | 'activity-feed';
  title: string;
  data?: any;
  position: 'left' | 'right';
  width?: number;
}

interface UIState {
  // Loading states
  globalLoading: boolean;
  pageLoading: boolean;
  actionLoading: Record<string, boolean>;
  
  // Modal management
  modals: Modal[];
  currentModal: Modal | null;
  
  // Sidebar management
  sidebars: Sidebar[];
  activeSidebar: Sidebar | null;
  
  // Toast notifications
  toasts: Toast[];
  
  // View preferences
  viewMode: 'grid' | 'list' | 'kanban';
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'system';
  
  // Search and filters
  searchOpen: boolean;
  filtersOpen: boolean;
  
  // Layout preferences
  layout: {
    dashboardColumns: number;
    editorSidebarOpen: boolean;
    editorSidebarWidth: number;
    proposalListDensity: 'compact' | 'comfortable' | 'spacious';
  };
  
  // Actions
  setGlobalLoading: (loading: boolean) => void;
  setPageLoading: (loading: boolean) => void;
  setActionLoading: (action: string, loading: boolean) => void;
  
  // Modal actions
  openModal: (modal: Omit<Modal, 'id'>) => void;
  closeModal: (id?: string) => void;
  closeAllModals: () => void;
  
  // Sidebar actions
  openSidebar: (sidebar: Omit<Sidebar, 'id'>) => void;
  closeSidebar: (id?: string) => void;
  toggleSidebar: (id: string) => void;
  
  // Toast actions
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  
  // View preferences
  setViewMode: (mode: 'grid' | 'list' | 'kanban') => void;
  toggleSidebarCollapsed: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Search and filters
  setSearchOpen: (open: boolean) => void;
  setFiltersOpen: (open: boolean) => void;
  
  // Layout preferences
  setLayout: (layout: Partial<UIState['layout']>) => void;
  
  // Utility actions
  resetUI: () => void;
}

const initialLayout = {
  dashboardColumns: 3,
  editorSidebarOpen: true,
  editorSidebarWidth: 300,
  proposalListDensity: 'comfortable' as const
};

export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  globalLoading: false,
  pageLoading: false,
  actionLoading: {},
  modals: [],
  currentModal: null,
  sidebars: [],
  activeSidebar: null,
  toasts: [],
  viewMode: 'list',
  sidebarCollapsed: false,
  theme: 'system',
  searchOpen: false,
  filtersOpen: false,
  layout: initialLayout,
  
  // Loading actions
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
  setPageLoading: (loading) => set({ pageLoading: loading }),
  setActionLoading: (action, loading) => set((state) => ({
    actionLoading: {
      ...state.actionLoading,
      [action]: loading
    }
  })),
  
  // Modal actions
  openModal: (modalData) => {
    const id = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const modal: Modal = { ...modalData, id };
    
    set((state) => ({
      modals: [...state.modals, modal],
      currentModal: modal
    }));
  },
  
  closeModal: (id) => {
    const state = get();
    const modalToClose = id ? state.modals.find(m => m.id === id) : state.currentModal;
    
    if (modalToClose) {
      modalToClose.onClose?.();
      
      const updatedModals = state.modals.filter(m => m.id !== modalToClose.id);
      const newCurrentModal = updatedModals.length > 0 ? updatedModals[updatedModals.length - 1] : null;
      
      set({
        modals: updatedModals,
        currentModal: newCurrentModal
      });
    }
  },
  
  closeAllModals: () => {
    const state = get();
    state.modals.forEach(modal => modal.onClose?.());
    set({ modals: [], currentModal: null });
  },
  
  // Sidebar actions
  openSidebar: (sidebarData) => {
    const id = `sidebar-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const sidebar: Sidebar = { ...sidebarData, id };
    
    set((state) => ({
      sidebars: [...state.sidebars, sidebar],
      activeSidebar: sidebar
    }));
  },
  
  closeSidebar: (id) => {
    const state = get();
    const sidebarToClose = id ? state.sidebars.find(s => s.id === id) : state.activeSidebar;
    
    if (sidebarToClose) {
      const updatedSidebars = state.sidebars.filter(s => s.id !== sidebarToClose.id);
      const newActiveSidebar = updatedSidebars.length > 0 ? updatedSidebars[updatedSidebars.length - 1] : null;
      
      set({
        sidebars: updatedSidebars,
        activeSidebar: newActiveSidebar
      });
    }
  },
  
  toggleSidebar: (id) => {
    const state = get();
    const sidebar = state.sidebars.find(s => s.id === id);
    
    if (sidebar) {
      if (state.activeSidebar?.id === id) {
        get().closeSidebar(id);
      } else {
        set({ activeSidebar: sidebar });
      }
    }
  },
  
  // Toast actions
  addToast: (toastData) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const toast: Toast = { ...toastData, id };
    
    set((state) => ({
      toasts: [...state.toasts, toast]
    }));
    
    // Auto-remove toast after duration
    const duration = toastData.duration || 5000;
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },
  
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(toast => toast.id !== id)
  })),
  
  clearToasts: () => set({ toasts: [] }),
  
  // View preferences
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleSidebarCollapsed: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setTheme: (theme) => set({ theme }),
  
  // Search and filters
  setSearchOpen: (open) => set({ searchOpen: open }),
  setFiltersOpen: (open) => set({ filtersOpen: open }),
  
  // Layout preferences
  setLayout: (layoutUpdates) => set((state) => ({
    layout: { ...state.layout, ...layoutUpdates }
  })),
  
  // Utility actions
  resetUI: () => set({
    globalLoading: false,
    pageLoading: false,
    actionLoading: {},
    modals: [],
    currentModal: null,
    sidebars: [],
    activeSidebar: null,
    toasts: [],
    viewMode: 'list',
    sidebarCollapsed: false,
    searchOpen: false,
    filtersOpen: false,
    layout: initialLayout
  })
}));