import { config } from '@/lib/config';

export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  industry: string;
  sections: number;
  estimatedTime: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  usageCount: number;
  createdBy: {
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  preview: string;
  isPremium: boolean;
  isFavorite: boolean;
  content: {
    sections: Array<{
      id: string;
      title: string;
      type: string;
      description: string;
      content: string;
      order: number;
    }>;
  };
}

const mockTemplates: Template[] = [
  {
    id: '1',
    title: 'Software Development Proposal',
    description: 'Comprehensive template for custom software development projects including web and mobile applications.',
    category: 'technical',
    industry: 'Technology',
    sections: 8,
    estimatedTime: 45,
    difficulty: 'Intermediate',
    rating: 4.8,
    usageCount: 234,
    createdBy: {
      name: 'Sarah Chen',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-20'),
    tags: ['Software', 'Web Development', 'Mobile', 'Technical'],
    preview: 'A proven template used by leading software agencies...',
    isPremium: false,
    isFavorite: false,
    content: {
      sections: [
        {
          id: '1',
          title: 'Executive Summary',
          type: 'executive-summary',
          description: 'High-level overview of the software development project',
          content: '<h3>Project Overview</h3><p>We propose to develop a comprehensive software solution that will...</p>',
          order: 1
        },
        {
          id: '2',
          title: 'Technical Requirements',
          type: 'technical-requirements',
          description: 'Detailed technical specifications and requirements',
          content: '<h3>Technical Specifications</h3><ul><li>Frontend: React.js with TypeScript</li><li>Backend: Node.js with Express</li></ul>',
          order: 2
        },
        {
          id: '3',
          title: 'Development Timeline',
          type: 'timeline',
          description: 'Project phases and milestones',
          content: '<h3>Development Phases</h3><p>Phase 1: Requirements Analysis (2 weeks)</p>',
          order: 3
        },
        {
          id: '4',
          title: 'Budget & Investment',
          type: 'budget',
          description: 'Cost breakdown and pricing structure',
          content: '<h3>Investment Overview</h3><p>Total Project Cost: $150,000</p>',
          order: 4
        }
      ]
    }
  },
  {
    id: '2',
    title: 'Digital Marketing Campaign',
    description: 'Complete marketing proposal template for digital advertising campaigns and brand awareness initiatives.',
    category: 'marketing',
    industry: 'Marketing',
    sections: 6,
    estimatedTime: 30,
    difficulty: 'Beginner',
    rating: 4.6,
    usageCount: 189,
    createdBy: {
      name: 'Marcus Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-07-01'),
    tags: ['Marketing', 'Digital', 'Campaign', 'Advertising'],
    preview: 'Transform your marketing strategy with this comprehensive template...',
    isPremium: true,
    isFavorite: true,
    content: {
      sections: [
        {
          id: '1',
          title: 'Campaign Overview',
          type: 'executive-summary',
          description: 'Strategic overview of the marketing campaign',
          content: '<h3>Campaign Strategy</h3><p>Our comprehensive digital marketing approach will...</p>',
          order: 1
        },
        {
          id: '2',
          title: 'Target Audience Analysis',
          type: 'market-analysis',
          description: 'Detailed audience segmentation and targeting',
          content: '<h3>Audience Insights</h3><p>Primary demographic: 25-45 year olds...</p>',
          order: 2
        },
        {
          id: '3',
          title: 'Campaign Strategy',
          type: 'strategy',
          description: 'Multi-channel marketing approach',
          content: '<h3>Strategic Approach</h3><ul><li>Social Media Marketing</li><li>Google Ads</li></ul>',
          order: 3
        }
      ]
    }
  },
  {
    id: '3',
    title: 'Business Consulting Proposal',
    description: 'Professional template for management consulting and business transformation projects.',
    category: 'consulting',
    industry: 'Consulting',
    sections: 10,
    estimatedTime: 60,
    difficulty: 'Advanced',
    rating: 4.9,
    usageCount: 156,
    createdBy: {
      name: 'Dr. Emily Watson',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-06-15'),
    tags: ['Consulting', 'Business', 'Strategy', 'Transformation'],
    preview: 'Enterprise-grade consulting proposal template...',
    isPremium: true,
    isFavorite: false,
    content: {
      sections: [
        {
          id: '1',
          title: 'Situation Analysis',
          type: 'problem-statement',
          description: 'Current state assessment and challenges',
          content: '<h3>Current Business Challenges</h3><p>Our analysis reveals key areas for improvement...</p>',
          order: 1
        },
        {
          id: '2',
          title: 'Proposed Solution',
          type: 'proposed-solution',
          description: 'Strategic recommendations and approach',
          content: '<h3>Strategic Recommendations</h3><p>We recommend a phased transformation approach...</p>',
          order: 2
        }
      ]
    }
  },
  {
    id: '4',
    title: 'Healthcare Technology Solution',
    description: 'Specialized template for healthcare IT and digital health platform proposals.',
    category: 'technical',
    industry: 'Healthcare',
    sections: 9,
    estimatedTime: 50,
    difficulty: 'Advanced',
    rating: 4.7,
    usageCount: 98,
    createdBy: {
      name: 'Dr. James Kim',
      avatar: 'https://i.pravatar.cc/150?img=4'
    },
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-07-10'),
    tags: ['Healthcare', 'Technology', 'HIPAA', 'Digital Health'],
    preview: 'HIPAA-compliant healthcare technology proposal...',
    isPremium: true,
    isFavorite: false,
    content: {
      sections: [
        {
          id: '1',
          title: 'Healthcare Solution Overview',
          type: 'executive-summary',
          description: 'Digital health platform overview',
          content: '<h3>Digital Health Innovation</h3><p>Our HIPAA-compliant platform will revolutionize...</p>',
          order: 1
        }
      ]
    }
  },
  {
    id: '5',
    title: 'E-commerce Platform Development',
    description: 'Complete template for online retail platform and marketplace development projects.',
    category: 'technical',
    industry: 'Retail',
    sections: 7,
    estimatedTime: 40,
    difficulty: 'Intermediate',
    rating: 4.5,
    usageCount: 167,
    createdBy: {
      name: 'Alex Thompson',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-06-30'),
    tags: ['E-commerce', 'Retail', 'Platform', 'Online Store'],
    preview: 'Build successful online retail platforms...',
    isPremium: false,
    isFavorite: true,
    content: {
      sections: [
        {
          id: '1',
          title: 'E-commerce Strategy',
          type: 'executive-summary',
          description: 'Online retail platform strategy',
          content: '<h3>E-commerce Vision</h3><p>We will create a scalable e-commerce platform...</p>',
          order: 1
        }
      ]
    }
  },
  {
    id: '6',
    title: 'Government RFP Response',
    description: 'Structured template for responding to government RFPs and public sector contracts.',
    category: 'government',
    industry: 'Government',
    sections: 12,
    estimatedTime: 75,
    difficulty: 'Advanced',
    rating: 4.8,
    usageCount: 87,
    createdBy: {
      name: 'Lisa Chang',
      avatar: 'https://i.pravatar.cc/150?img=6'
    },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-05-15'),
    tags: ['Government', 'RFP', 'Public Sector', 'Compliance'],
    preview: 'Navigate complex government procurement processes...',
    isPremium: true,
    isFavorite: false,
    content: {
      sections: [
        {
          id: '1',
          title: 'Compliance Statement',
          type: 'compliance',
          description: 'Regulatory compliance and certifications',
          content: '<h3>Regulatory Compliance</h3><p>We certify compliance with all federal requirements...</p>',
          order: 1
        }
      ]
    }
  }
];

interface GetTemplatesOptions {
  category?: string;
  industry?: string;
  sort?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export const mockTemplateService = {
  async getTemplates(options: GetTemplatesOptions = {}) {
    await new Promise(resolve => setTimeout(resolve, config.api.mockDelay));

    let filtered = [...mockTemplates];

    // Filter by category
    if (options.category && options.category !== 'all') {
      filtered = filtered.filter(template => template.category === options.category);
    }

    // Filter by industry
    if (options.industry) {
      filtered = filtered.filter(template => template.industry === options.industry);
    }

    // Search
    if (options.search) {
      const query = options.search.toLowerCase();
      filtered = filtered.filter(template =>
        template.title.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort
    switch (options.sort) {
      case 'popular':
        filtered.sort((a, b) => b.usageCount - a.usageCount);
        break;
      case 'recent':
        filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        filtered.sort((a, b) => b.usageCount - a.usageCount);
    }

    // Pagination
    const limit = options.limit || 50;
    const offset = options.offset || 0;
    const paginated = filtered.slice(offset, offset + limit);

    return {
      success: true,
      data: paginated,
      meta: {
        total: filtered.length,
        limit,
        offset,
        hasMore: offset + limit < filtered.length
      }
    };
  },

  async getTemplate(id: string) {
    await new Promise(resolve => setTimeout(resolve, config.api.mockDelay));

    const template = mockTemplates.find(t => t.id === id);
    
    if (!template) {
      return {
        success: false,
        error: 'Template not found'
      };
    }

    return {
      success: true,
      data: template
    };
  },

  async createProposalFromTemplate(templateId: string, proposalData: any) {
    await new Promise(resolve => setTimeout(resolve, config.api.mockDelay));

    const template = mockTemplates.find(t => t.id === templateId);
    
    if (!template) {
      return {
        success: false,
        error: 'Template not found'
      };
    }

    // Create a new proposal based on the template
    const newProposal = {
      id: Date.now().toString(),
      title: proposalData.title || `${template.title} - ${proposalData.clientName}`,
      description: proposalData.description || template.description,
      clientName: proposalData.clientName,
      clientEmail: proposalData.clientEmail,
      status: {
        id: 'draft',
        name: 'Draft'
      },
      priority: 'medium',
      winProbability: 50,
      value: proposalData.budget || 50000,
      deadline: proposalData.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: proposalData.tags || template.tags,
      sections: template.content.sections.map(section => ({
        ...section,
        id: `${Date.now()}-${section.order}`,
        content: section.content // Start with template content
      })),
      collaborators: [
        {
          userId: 'current-user',
          role: 'owner',
          permissions: ['read', 'write', 'admin'],
          user: {
            id: 'current-user',
            name: 'Current User',
            email: 'user@example.com',
            avatar: 'https://i.pravatar.cc/150?img=10'
          }
        }
      ],
      assignee: {
        id: 'current-user',
        name: 'Current User',
        avatar: 'https://i.pravatar.cc/150?img=10'
      }
    };

    // Increment template usage count
    const templateIndex = mockTemplates.findIndex(t => t.id === templateId);
    if (templateIndex !== -1) {
      mockTemplates[templateIndex].usageCount += 1;
    }

    return {
      success: true,
      data: newProposal
    };
  },

  async toggleFavorite(templateId: string) {
    await new Promise(resolve => setTimeout(resolve, config.api.mockDelay / 2));

    const templateIndex = mockTemplates.findIndex(t => t.id === templateId);
    
    if (templateIndex === -1) {
      return {
        success: false,
        error: 'Template not found'
      };
    }

    mockTemplates[templateIndex].isFavorite = !mockTemplates[templateIndex].isFavorite;

    return {
      success: true,
      data: {
        templateId,
        isFavorite: mockTemplates[templateIndex].isFavorite
      }
    };
  },

  async getCategories() {
    await new Promise(resolve => setTimeout(resolve, config.api.mockDelay / 2));

    const categories = [
      { id: 'all', name: 'All Templates', count: mockTemplates.length },
      { id: 'business', name: 'Business Proposals', count: mockTemplates.filter(t => t.category === 'business').length },
      { id: 'technical', name: 'Technical Proposals', count: mockTemplates.filter(t => t.category === 'technical').length },
      { id: 'consulting', name: 'Consulting', count: mockTemplates.filter(t => t.category === 'consulting').length },
      { id: 'marketing', name: 'Marketing', count: mockTemplates.filter(t => t.category === 'marketing').length },
      { id: 'government', name: 'Government', count: mockTemplates.filter(t => t.category === 'government').length }
    ];

    return {
      success: true,
      data: categories
    };
  },

  async getPopularTemplates(limit = 5) {
    await new Promise(resolve => setTimeout(resolve, config.api.mockDelay / 2));

    const popular = [...mockTemplates]
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);

    return {
      success: true,
      data: popular
    };
  }
};