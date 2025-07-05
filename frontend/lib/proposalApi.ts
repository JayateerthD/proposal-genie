import api from './api';
import { 
  Proposal, 
  ProposalListResponse, 
  ProposalStats, 
  CreateProposalRequest,
  UpdateProposalRequest,
  ProposalFilters,
  ProposalSortOption
} from '@/types/proposal';

export interface ProposalApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ProposalApi {
  // Get all proposals with pagination and filtering
  async getProposals(
    page: number = 1,
    pageSize: number = 10,
    filters?: ProposalFilters,
    sortOption?: ProposalSortOption
  ): Promise<ProposalApiResponse<ProposalListResponse>> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());
      
      if (filters) {
        if (filters.search) params.append('search', filters.search);
        if (filters.status?.length) params.append('status', filters.status.join(','));
        if (filters.tags?.length) params.append('tags', filters.tags.join(','));
        if (filters.collaborators?.length) params.append('collaborators', filters.collaborators.join(','));
        
        if (filters.winProbability) {
          params.append('winProbabilityMin', filters.winProbability.min.toString());
          params.append('winProbabilityMax', filters.winProbability.max.toString());
        }
        
        if (filters.dateRange) {
          params.append('dateStart', filters.dateRange.start.toISOString());
          params.append('dateEnd', filters.dateRange.end.toISOString());
        }
      }
      
      if (sortOption) {
        params.append('sortBy', sortOption.field);
        params.append('sortDirection', sortOption.direction);
      }
      
      const response = await api.get(`/proposals?${params.toString()}`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch proposals'
      };
    }
  }

  // Get a single proposal by ID
  async getProposal(id: string): Promise<ProposalApiResponse<Proposal>> {
    try {
      const response = await api.get(`/proposals/${id}`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch proposal'
      };
    }
  }

  // Create a new proposal
  async createProposal(proposalData: CreateProposalRequest): Promise<ProposalApiResponse<Proposal>> {
    try {
      const response = await api.post('/proposals', proposalData);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to create proposal'
      };
    }
  }

  // Update an existing proposal
  async updateProposal(id: string, updates: UpdateProposalRequest): Promise<ProposalApiResponse<Proposal>> {
    try {
      const response = await api.put(`/proposals/${id}`, updates);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update proposal'
      };
    }
  }

  // Delete a proposal
  async deleteProposal(id: string): Promise<ProposalApiResponse<{ success: boolean }>> {
    try {
      await api.delete(`/proposals/${id}`);
      return { success: true, data: { success: true } };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to delete proposal'
      };
    }
  }

  // Update proposal section content
  async updateProposalSection(
    proposalId: string, 
    sectionId: string, 
    content: string
  ): Promise<ProposalApiResponse<{ success: boolean }>> {
    try {
      const response = await api.put(`/proposals/${proposalId}/sections/${sectionId}`, { content });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update section'
      };
    }
  }

  // Get AI suggestions for a proposal
  async getAISuggestions(proposalId: string): Promise<ProposalApiResponse<any>> {
    try {
      const response = await api.get(`/proposals/${proposalId}/ai-suggestions`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get AI suggestions'
      };
    }
  }

  // Apply AI enhancement to a proposal section
  async enhanceSection(
    proposalId: string, 
    sectionId: string, 
    enhancementType: 'improve' | 'expand' | 'simplify' | 'professional'
  ): Promise<ProposalApiResponse<{ content: string }>> {
    try {
      const response = await api.post(`/proposals/${proposalId}/sections/${sectionId}/enhance`, {
        type: enhancementType
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to enhance section'
      };
    }
  }

  // Calculate win probability for a proposal
  async calculateWinProbability(proposalId: string): Promise<ProposalApiResponse<{ winProbability: number }>> {
    try {
      const response = await api.post(`/proposals/${proposalId}/calculate-win-probability`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to calculate win probability'
      };
    }
  }

  // Get proposal statistics
  async getProposalStats(): Promise<ProposalApiResponse<ProposalStats>> {
    try {
      const response = await api.get('/proposals/stats');
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch proposal stats'
      };
    }
  }

  // Add collaborator to a proposal
  async addCollaborator(
    proposalId: string, 
    userId: string, 
    role: 'owner' | 'editor' | 'viewer'
  ): Promise<ProposalApiResponse<{ success: boolean }>> {
    try {
      const response = await api.post(`/proposals/${proposalId}/collaborators`, { userId, role });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to add collaborator'
      };
    }
  }

  // Remove collaborator from a proposal
  async removeCollaborator(
    proposalId: string, 
    userId: string
  ): Promise<ProposalApiResponse<{ success: boolean }>> {
    try {
      await api.delete(`/proposals/${proposalId}/collaborators/${userId}`);
      return { success: true, data: { success: true } };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to remove collaborator'
      };
    }
  }

  // Update collaborator role
  async updateCollaboratorRole(
    proposalId: string, 
    userId: string, 
    role: 'owner' | 'editor' | 'viewer'
  ): Promise<ProposalApiResponse<{ success: boolean }>> {
    try {
      const response = await api.put(`/proposals/${proposalId}/collaborators/${userId}`, { role });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update collaborator role'
      };
    }
  }

  // Get proposal activity feed
  async getProposalActivity(proposalId: string): Promise<ProposalApiResponse<any[]>> {
    try {
      const response = await api.get(`/proposals/${proposalId}/activity`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch proposal activity'
      };
    }
  }

  // Duplicate a proposal
  async duplicateProposal(
    proposalId: string, 
    newTitle: string
  ): Promise<ProposalApiResponse<Proposal>> {
    try {
      const response = await api.post(`/proposals/${proposalId}/duplicate`, { title: newTitle });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to duplicate proposal'
      };
    }
  }

  // Export proposal to PDF
  async exportProposal(
    proposalId: string, 
    format: 'pdf' | 'docx' = 'pdf'
  ): Promise<ProposalApiResponse<{ downloadUrl: string }>> {
    try {
      const response = await api.post(`/proposals/${proposalId}/export`, { format });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to export proposal'
      };
    }
  }

  // Submit proposal
  async submitProposal(proposalId: string): Promise<ProposalApiResponse<{ success: boolean }>> {
    try {
      const response = await api.post(`/proposals/${proposalId}/submit`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to submit proposal'
      };
    }
  }
}

export const proposalApi = new ProposalApi();
export default proposalApi;