import { 
  Proposal, 
  ProposalListResponse, 
  ProposalStats, 
  CreateProposalRequest,
  UpdateProposalRequest,
  ProposalFilters,
  ProposalSortOption
} from '@/types/proposal';

import { 
  mockProposals, 
  generateMockStats, 
  proposalStatuses,
  mockDataUtils,
  currentUser,
  getRandomUsers 
} from '@/lib/mockData';

export interface ProposalApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class MockProposalService {
  private proposals: Proposal[] = [...mockProposals];

  // Get all proposals with pagination and filtering
  async getProposals(
    page: number = 1,
    pageSize: number = 10,
    filters?: ProposalFilters,
    sortOption?: ProposalSortOption
  ): Promise<ProposalApiResponse<ProposalListResponse>> {
    await mockDataUtils.randomDelay();
    
    try {
      let filteredProposals = [...this.proposals];

      // Apply filters
      if (filters) {
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredProposals = filteredProposals.filter(proposal =>
            proposal.title.toLowerCase().includes(searchTerm) ||
            proposal.clientName.toLowerCase().includes(searchTerm) ||
            proposal.description?.toLowerCase().includes(searchTerm)
          );
        }

        if (filters.status && filters.status.length > 0) {
          filteredProposals = filteredProposals.filter(proposal =>
            filters.status!.includes(proposal.status.id)
          );
        }

        if (filters.winProbability) {
          filteredProposals = filteredProposals.filter(proposal =>
            proposal.winProbability >= filters.winProbability!.min &&
            proposal.winProbability <= filters.winProbability!.max
          );
        }

        if (filters.dateRange) {
          filteredProposals = filteredProposals.filter(proposal => {
            const proposalDate = new Date(proposal.updatedAt);
            return proposalDate >= filters.dateRange!.start &&
                   proposalDate <= filters.dateRange!.end;
          });
        }

        if (filters.tags && filters.tags.length > 0) {
          filteredProposals = filteredProposals.filter(proposal =>
            filters.tags!.some(tag => proposal.tags.includes(tag))
          );
        }
      }

      // Apply sorting
      if (sortOption) {
        filteredProposals.sort((a, b) => {
          const aValue = a[sortOption.field];
          const bValue = b[sortOption.field];
          
          if (sortOption.direction === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
      } else {
        // Default sort by updated date
        filteredProposals.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      }

      // Apply pagination
      const totalCount = filteredProposals.length;
      const totalPages = Math.ceil(totalCount / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const proposals = filteredProposals.slice(startIndex, endIndex);

      return {
        success: true,
        data: {
          proposals,
          totalCount,
          page,
          pageSize,
          totalPages
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch proposals'
      };
    }
  }

  // Get a single proposal by ID
  async getProposal(id: string): Promise<ProposalApiResponse<Proposal>> {
    await mockDataUtils.randomDelay(300, 800);
    
    const proposal = this.proposals.find(p => p.id === id);
    
    if (proposal) {
      return { success: true, data: proposal };
    } else {
      return { success: false, error: 'Proposal not found' };
    }
  }

  // Create a new proposal
  async createProposal(proposalData: CreateProposalRequest): Promise<ProposalApiResponse<Proposal>> {
    await mockDataUtils.randomDelay(800, 1500);
    
    try {
      const newProposal: Proposal = {
        id: mockDataUtils.generateId('proposal'),
        title: proposalData.title,
        description: proposalData.description,
        clientName: proposalData.clientName,
        clientEmail: proposalData.clientEmail,
        status: proposalStatuses[0], // Draft
        winProbability: 50, // Default starting probability
        sections: [
          {
            id: mockDataUtils.generateId('section'),
            title: 'Executive Summary',
            content: '',
            order: 1,
            isRequired: true
          },
          {
            id: mockDataUtils.generateId('section'),
            title: 'Technical Approach',
            content: '',
            order: 2,
            isRequired: true
          },
          {
            id: mockDataUtils.generateId('section'),
            title: 'Project Timeline',
            content: '',
            order: 3,
            isRequired: true
          },
          {
            id: mockDataUtils.generateId('section'),
            title: 'Team Qualifications',
            content: '',
            order: 4,
            isRequired: true
          },
          {
            id: mockDataUtils.generateId('section'),
            title: 'Budget & Pricing',
            content: '',
            order: 5,
            isRequired: true
          }
        ],
        collaborators: [
          {
            userId: currentUser.id,
            user: currentUser,
            role: 'owner',
            addedAt: new Date()
          }
        ],
        activities: [
          {
            id: mockDataUtils.generateId('activity'),
            type: 'created',
            description: 'Proposal created',
            userId: currentUser.id,
            user: currentUser,
            createdAt: new Date(),
            metadata: {}
          }
        ],
        deadline: proposalData.deadline,
        budget: proposalData.budget,
        tags: proposalData.tags || [],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: currentUser.id,
        lastModifiedBy: currentUser.id
      };

      this.proposals.unshift(newProposal);
      
      return { success: true, data: newProposal };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create proposal'
      };
    }
  }

  // Update an existing proposal
  async updateProposal(id: string, updates: UpdateProposalRequest): Promise<ProposalApiResponse<Proposal>> {
    await mockDataUtils.randomDelay(500, 1000);
    
    const proposalIndex = this.proposals.findIndex(p => p.id === id);
    
    if (proposalIndex === -1) {
      return { success: false, error: 'Proposal not found' };
    }

    try {
      const updatedProposal = {
        ...this.proposals[proposalIndex],
        ...updates,
        updatedAt: new Date(),
        lastModifiedBy: currentUser.id
      };

      this.proposals[proposalIndex] = updatedProposal;

      // Add activity
      updatedProposal.activities.push({
        id: mockDataUtils.generateId('activity'),
        type: 'updated',
        description: 'Proposal updated',
        userId: currentUser.id,
        user: currentUser,
        createdAt: new Date(),
        metadata: { updates: Object.keys(updates) }
      });

      return { success: true, data: updatedProposal };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update proposal'
      };
    }
  }

  // Delete a proposal
  async deleteProposal(id: string): Promise<ProposalApiResponse<{ success: boolean }>> {
    await mockDataUtils.randomDelay(400, 800);
    
    const proposalIndex = this.proposals.findIndex(p => p.id === id);
    
    if (proposalIndex === -1) {
      return { success: false, error: 'Proposal not found' };
    }

    this.proposals.splice(proposalIndex, 1);
    
    return { success: true, data: { success: true } };
  }

  // Get proposal statistics
  async getProposalStats(): Promise<ProposalApiResponse<ProposalStats>> {
    await mockDataUtils.randomDelay(200, 600);
    
    try {
      const stats = generateMockStats();
      return { success: true, data: stats };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch proposal stats'
      };
    }
  }

  // Update proposal section content
  async updateProposalSection(
    proposalId: string, 
    sectionId: string, 
    content: string
  ): Promise<ProposalApiResponse<{ success: boolean }>> {
    await mockDataUtils.randomDelay(300, 700);
    
    const proposal = this.proposals.find(p => p.id === proposalId);
    
    if (!proposal) {
      return { success: false, error: 'Proposal not found' };
    }

    const section = proposal.sections.find(s => s.id === sectionId);
    
    if (!section) {
      return { success: false, error: 'Section not found' };
    }

    section.content = content;
    section.wordCount = content.split(/\s+/).length;
    proposal.updatedAt = new Date();
    proposal.lastModifiedBy = currentUser.id;

    // Add activity
    proposal.activities.push({
      id: mockDataUtils.generateId('activity'),
      type: 'updated',
      description: `Updated section: ${section.title}`,
      userId: currentUser.id,
      user: currentUser,
      createdAt: new Date(),
      metadata: { sectionId, sectionTitle: section.title }
    });

    return { success: true, data: { success: true } };
  }

  // Get AI suggestions for a proposal
  async getAISuggestions(proposalId: string): Promise<ProposalApiResponse<any>> {
    await mockDataUtils.randomDelay(1000, 2500);
    
    const proposal = this.proposals.find(p => p.id === proposalId);
    
    if (!proposal) {
      return { success: false, error: 'Proposal not found' };
    }

    const suggestions = {
      improvements: [
        'Consider adding more specific metrics to demonstrate ROI',
        'Include case studies from similar projects',
        'Expand on risk mitigation strategies',
        'Add more detail to the implementation timeline'
      ],
      strengths: [
        'Strong technical approach',
        'Comprehensive team qualifications',
        'Competitive pricing structure',
        'Clear project methodology'
      ],
      recommendations: [
        'Highlight your unique value proposition',
        'Address potential client concerns proactively',
        'Include testimonials from previous clients',
        'Emphasize your industry expertise'
      ]
    };

    return { success: true, data: suggestions };
  }

  // Apply AI enhancement to a proposal section
  async enhanceSection(
    proposalId: string, 
    sectionId: string, 
    enhancementType: 'improve' | 'expand' | 'simplify' | 'professional'
  ): Promise<ProposalApiResponse<{ content: string }>> {
    await mockDataUtils.randomDelay(1500, 3000);
    
    const proposal = this.proposals.find(p => p.id === proposalId);
    
    if (!proposal) {
      return { success: false, error: 'Proposal not found' };
    }

    const section = proposal.sections.find(s => s.id === sectionId);
    
    if (!section) {
      return { success: false, error: 'Section not found' };
    }

    // Simulate AI enhancement by adding content based on type
    let enhancedContent = section.content;
    
    switch (enhancementType) {
      case 'improve':
        enhancedContent += '\n\nOur approach leverages industry best practices and proven methodologies to ensure successful project delivery. We employ rigorous quality assurance processes and maintain transparent communication throughout the engagement.';
        break;
      case 'expand':
        enhancedContent += '\n\nThis comprehensive solution includes detailed documentation, training materials, and ongoing support to ensure seamless adoption. Our team will work closely with your stakeholders to customize the implementation to your specific business requirements.';
        break;
      case 'simplify':
        enhancedContent = enhancedContent.split('.').slice(0, 2).join('.') + '. Our streamlined approach focuses on delivering maximum value with minimal complexity.';
        break;
      case 'professional':
        enhancedContent = 'Executive Summary: ' + enhancedContent + '\n\nThis strategic initiative represents a significant opportunity to enhance operational efficiency and drive measurable business outcomes through our proven implementation methodology.';
        break;
    }

    // Add activity
    proposal.activities.push({
      id: mockDataUtils.generateId('activity'),
      type: 'ai_enhanced',
      description: `AI enhanced section: ${section.title}`,
      userId: currentUser.id,
      user: currentUser,
      createdAt: new Date(),
      metadata: { sectionId, enhancementType }
    });

    return { success: true, data: { content: enhancedContent } };
  }

  // Calculate win probability for a proposal
  async calculateWinProbability(proposalId: string): Promise<ProposalApiResponse<{ winProbability: number }>> {
    await mockDataUtils.randomDelay(800, 1500);
    
    const proposal = this.proposals.find(p => p.id === proposalId);
    
    if (!proposal) {
      return { success: false, error: 'Proposal not found' };
    }

    // Simulate AI calculation based on various factors
    let probability = 50; // Base probability
    
    // Factor in completion status
    const completedSections = proposal.sections.filter(s => s.content.length > 100).length;
    const totalSections = proposal.sections.length;
    probability += (completedSections / totalSections) * 30;
    
    // Factor in client engagement (simulated)
    probability += Math.random() * 20;
    
    // Factor in timeline urgency
    if (proposal.deadline) {
      const daysUntilDeadline = Math.ceil(
        (proposal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      if (daysUntilDeadline < 7) {
        probability += 10; // Urgency bonus
      }
    }
    
    probability = Math.min(95, Math.max(15, Math.round(probability)));
    
    // Update the proposal
    proposal.winProbability = probability;
    proposal.updatedAt = new Date();

    return { success: true, data: { winProbability: probability } };
  }

  // Add collaborator to a proposal
  async addCollaborator(
    proposalId: string, 
    userId: string, 
    role: 'owner' | 'editor' | 'viewer'
  ): Promise<ProposalApiResponse<{ success: boolean }>> {
    await mockDataUtils.randomDelay(400, 800);
    
    const proposal = this.proposals.find(p => p.id === proposalId);
    
    if (!proposal) {
      return { success: false, error: 'Proposal not found' };
    }

    // Check if collaborator already exists
    const existingCollaborator = proposal.collaborators.find(c => c.userId === userId);
    if (existingCollaborator) {
      return { success: false, error: 'User is already a collaborator' };
    }

    const user = getRandomUsers(1)[0]; // In real implementation, fetch user by ID
    
    proposal.collaborators.push({
      userId,
      user,
      role,
      addedAt: new Date()
    });

    // Add activity
    proposal.activities.push({
      id: mockDataUtils.generateId('activity'),
      type: 'shared',
      description: `Added ${user.name} as ${role}`,
      userId: currentUser.id,
      user: currentUser,
      createdAt: new Date(),
      metadata: { addedUserId: userId, role }
    });

    return { success: true, data: { success: true } };
  }

  // Duplicate a proposal
  async duplicateProposal(
    proposalId: string, 
    newTitle: string
  ): Promise<ProposalApiResponse<Proposal>> {
    await mockDataUtils.randomDelay(600, 1200);
    
    const originalProposal = this.proposals.find(p => p.id === proposalId);
    
    if (!originalProposal) {
      return { success: false, error: 'Proposal not found' };
    }

    const duplicatedProposal: Proposal = {
      ...originalProposal,
      id: mockDataUtils.generateId('proposal'),
      title: newTitle,
      status: proposalStatuses[0], // Reset to Draft
      winProbability: 50,
      sections: originalProposal.sections.map(section => ({
        ...section,
        id: mockDataUtils.generateId('section')
      })),
      collaborators: [
        {
          userId: currentUser.id,
          user: currentUser,
          role: 'owner',
          addedAt: new Date()
        }
      ],
      activities: [
        {
          id: mockDataUtils.generateId('activity'),
          type: 'created',
          description: `Duplicated from "${originalProposal.title}"`,
          userId: currentUser.id,
          user: currentUser,
          createdAt: new Date(),
          metadata: { originalProposalId: proposalId }
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: currentUser.id,
      lastModifiedBy: currentUser.id
    };

    this.proposals.unshift(duplicatedProposal);

    return { success: true, data: duplicatedProposal };
  }
}

export const mockProposalService = new MockProposalService();
export default mockProposalService;