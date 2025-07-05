import config from '@/lib/config';

// Import services
import { mockProposalService } from './mockProposalService';
import { mockUploadService } from './mockUploadService';
import { mockTemplateService } from './mockTemplateService';
import { mockAIService } from './mockAIService';

// Import real API services (these would be the actual API calls)
import proposalApi from '@/lib/proposalApi';
import uploadApi from '@/lib/uploadApi';
import templateApi from '@/lib/templateApi';
import aiApi from '@/lib/aiApi';

// Service factory that switches between mock and real services based on config
export const proposalService = config.useMockData ? mockProposalService : proposalApi;
export const uploadService = config.useMockData ? mockUploadService : uploadApi;
export const templateService = config.useMockData ? mockTemplateService : templateApi;
export const aiService = config.useMockData ? mockAIService : aiApi;

// Export types for consistency
export type { ProposalApiResponse } from './mockProposalService';
export type { UploadApiResponse, FileUploadResult, ChatAnalysisResult } from './mockUploadService';

// Utility to check if using mock data
export const isMockMode = () => config.useMockData;

// Helper to log service mode in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log(`🔧 Services running in ${config.useMockData ? 'MOCK' : 'REAL'} mode`);
}