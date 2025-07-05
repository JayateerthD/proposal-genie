export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ProposalStatus {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface ProposalSection {
  id: string;
  title: string;
  description: string;
  type: string;
  content: string;
  order: number;
  isRequired: boolean;
  wordCount?: number;
}

export interface ProposalCollaborator {
  userId: string;
  user: User;
  role: 'owner' | 'editor' | 'viewer';
  addedAt: Date;
}

export interface ProposalActivity {
  id: string;
  type: 'created' | 'updated' | 'ai_enhanced' | 'shared' | 'submitted' | 'status_changed';
  description: string;
  userId: string;
  user: User;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface Proposal {
  id: string;
  title: string;
  description?: string;
  clientName: string;
  clientEmail?: string;
  status: ProposalStatus;
  winProbability: number;
  sections: ProposalSection[];
  collaborators: ProposalCollaborator[];
  activities: ProposalActivity[];
  rfpDocument?: {
    id: string;
    filename: string;
    url: string;
    uploadedAt: Date;
  };
  aiInsights?: {
    keyRequirements: string[];
    suggestedImprovements: string[];
    competitiveAdvantages: string[];
    riskFactors: string[];
  };
  deadline?: Date;
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
}

export interface CreateProposalRequest {
  title: string;
  description?: string;
  clientName: string;
  clientEmail?: string;
  deadline?: Date;
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  tags?: string[];
}

export interface UpdateProposalRequest {
  title?: string;
  description?: string;
  clientName?: string;
  clientEmail?: string;
  deadline?: Date;
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  tags?: string[];
}

export interface ProposalFilters {
  status?: string[];
  winProbability?: {
    min: number;
    max: number;
  };
  dateRange?: {
    start: Date;
    end: Date;
  };
  collaborators?: string[];
  tags?: string[];
  search?: string;
}

export interface ProposalSortOption {
  field: 'title' | 'clientName' | 'createdAt' | 'updatedAt' | 'deadline' | 'winProbability';
  direction: 'asc' | 'desc';
}

export interface ProposalListResponse {
  proposals: Proposal[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProposalStats {
  totalProposals: number;
  activeProposals: number;
  averageWinRate: number;
  averageResponseTime: number;
  recentActivity: ProposalActivity[];
}