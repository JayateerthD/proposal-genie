import { create } from 'zustand';
import { 
  Proposal, 
  ProposalFilters, 
  ProposalSortOption, 
  ProposalStats,
  CreateProposalRequest,
  UpdateProposalRequest,
  ProposalListResponse
} from '@/types/proposal';

interface ProposalState {
  // Data state
  proposals: Proposal[];
  currentProposal: Proposal | null;
  stats: ProposalStats | null;
  
  // UI state
  loading: boolean;
  error: string | null;
  
  // Filters and pagination
  filters: ProposalFilters;
  sortOption: ProposalSortOption;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  
  // Actions
  setProposals: (proposals: Proposal[]) => void;
  setCurrentProposal: (proposal: Proposal | null) => void;
  setStats: (stats: ProposalStats) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Filters and sorting
  setFilters: (filters: Partial<ProposalFilters>) => void;
  setSortOption: (sortOption: ProposalSortOption) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  
  // CRUD operations
  addProposal: (proposal: Proposal) => void;
  updateProposal: (id: string, updates: Partial<Proposal>) => void;
  removeProposal: (id: string) => void;
  
  // Optimistic updates
  optimisticUpdate: (id: string, updates: Partial<Proposal>) => void;
  revertOptimisticUpdate: (id: string, originalProposal: Proposal) => void;
  
  // Utility actions
  clearFilters: () => void;
  resetState: () => void;
  
  // Computed values
  getFilteredProposals: () => Proposal[];
  getProposalById: (id: string) => Proposal | undefined;
  getProposalsByStatus: (status: string) => Proposal[];
}

const initialFilters: ProposalFilters = {
  status: [],
  winProbability: undefined,
  dateRange: undefined,
  collaborators: [],
  tags: [],
  search: ''
};

const defaultSortOption: ProposalSortOption = {
  field: 'updatedAt',
  direction: 'desc'
};

export const useProposalStore = create<ProposalState>((set, get) => ({
  // Initial state
  proposals: [],
  currentProposal: null,
  stats: null,
  loading: false,
  error: null,
  filters: initialFilters,
  sortOption: defaultSortOption,
  currentPage: 1,
  pageSize: 10,
  totalPages: 0,
  totalCount: 0,
  
  // Basic setters
  setProposals: (proposals) => set({ proposals }),
  setCurrentProposal: (proposal) => set({ currentProposal: proposal }),
  setStats: (stats) => set({ stats }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  // Filters and sorting
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters },
    currentPage: 1 // Reset to first page when filters change
  })),
  
  setSortOption: (sortOption) => set({ sortOption, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size, currentPage: 1 }),
  
  // CRUD operations
  addProposal: (proposal) => set((state) => ({
    proposals: [proposal, ...state.proposals],
    totalCount: state.totalCount + 1
  })),
  
  updateProposal: (id, updates) => set((state) => ({
    proposals: state.proposals.map(proposal =>
      proposal.id === id ? { ...proposal, ...updates } : proposal
    ),
    currentProposal: state.currentProposal?.id === id 
      ? { ...state.currentProposal, ...updates }
      : state.currentProposal
  })),
  
  removeProposal: (id) => set((state) => ({
    proposals: state.proposals.filter(proposal => proposal.id !== id),
    currentProposal: state.currentProposal?.id === id ? null : state.currentProposal,
    totalCount: Math.max(0, state.totalCount - 1)
  })),
  
  // Optimistic updates
  optimisticUpdate: (id, updates) => {
    const state = get();
    const proposal = state.proposals.find(p => p.id === id);
    if (proposal) {
      // Store original for potential revert
      (proposal as any)._original = { ...proposal };
      get().updateProposal(id, updates);
    }
  },
  
  revertOptimisticUpdate: (id, originalProposal) => {
    get().updateProposal(id, originalProposal);
  },
  
  // Utility actions
  clearFilters: () => set({ 
    filters: initialFilters, 
    currentPage: 1 
  }),
  
  resetState: () => set({
    proposals: [],
    currentProposal: null,
    stats: null,
    loading: false,
    error: null,
    filters: initialFilters,
    sortOption: defaultSortOption,
    currentPage: 1,
    totalPages: 0,
    totalCount: 0
  }),
  
  // Computed values
  getFilteredProposals: () => {
    const { proposals, filters, sortOption } = get();
    let filtered = [...proposals];
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(proposal =>
        proposal.title.toLowerCase().includes(searchTerm) ||
        proposal.clientName.toLowerCase().includes(searchTerm) ||
        proposal.description?.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(proposal =>
        filters.status!.includes(proposal.status.id)
      );
    }
    
    // Apply win probability filter
    if (filters.winProbability) {
      filtered = filtered.filter(proposal =>
        proposal.winProbability >= filters.winProbability!.min &&
        proposal.winProbability <= filters.winProbability!.max
      );
    }
    
    // Apply date range filter
    if (filters.dateRange) {
      filtered = filtered.filter(proposal => {
        const proposalDate = new Date(proposal.updatedAt);
        return proposalDate >= filters.dateRange!.start &&
               proposalDate <= filters.dateRange!.end;
      });
    }
    
    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(proposal =>
        filters.tags!.some(tag => proposal.tags.includes(tag))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortOption.field];
      const bValue = b[sortOption.field];
      
      if (sortOption.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filtered;
  },
  
  getProposalById: (id) => {
    return get().proposals.find(proposal => proposal.id === id);
  },
  
  getProposalsByStatus: (status) => {
    return get().proposals.filter(proposal => proposal.status.id === status);
  }
}));