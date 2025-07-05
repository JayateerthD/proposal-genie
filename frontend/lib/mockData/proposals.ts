import { Proposal, ProposalStatus, ProposalSection, ProposalCollaborator, ProposalActivity } from '@/types/proposal';
import { mockUsers, currentUser, getRandomUsers } from './users';

export const proposalStatuses: ProposalStatus[] = [
  {
    id: 'draft',
    name: 'Draft',
    color: '#6B7280',
    order: 1
  },
  {
    id: 'in-progress',
    name: 'In Progress',
    color: '#3B82F6',
    order: 2
  },
  {
    id: 'review',
    name: 'Review',
    color: '#F59E0B',
    order: 3
  },
  {
    id: 'completed',
    name: 'Completed',
    color: '#10B981',
    order: 4
  },
  {
    id: 'submitted',
    name: 'Submitted',
    color: '#8B5CF6',
    order: 5
  },
  {
    id: 'won',
    name: 'Won',
    color: '#059669',
    order: 6
  },
  {
    id: 'lost',
    name: 'Lost',
    color: '#DC2626',
    order: 7
  }
];

const sampleSections: ProposalSection[] = [
  {
    id: 'exec-summary',
    title: 'Executive Summary',
    content: 'This comprehensive proposal outlines our strategic approach to delivering exceptional results for your organization. Our team brings together deep industry expertise, proven methodologies, and innovative solutions to address your specific challenges and objectives.',
    order: 1,
    isRequired: true,
    wordCount: 150
  },
  {
    id: 'technical-approach',
    title: 'Technical Approach',
    content: 'Our technical methodology leverages cutting-edge technologies and industry best practices. We employ an agile development framework that ensures rapid iteration, continuous feedback, and seamless integration with your existing systems.',
    order: 2,
    isRequired: true,
    wordCount: 200
  },
  {
    id: 'project-timeline',
    title: 'Project Timeline',
    content: 'The project will be executed in four distinct phases over a 12-week period. Each phase includes specific deliverables, milestones, and quality checkpoints to ensure we stay on track and meet your expectations.',
    order: 3,
    isRequired: true,
    wordCount: 100
  },
  {
    id: 'team-qualifications',
    title: 'Team Qualifications',
    content: 'Our team consists of senior professionals with extensive experience in similar projects. Each team member brings specialized skills and has a proven track record of successful project delivery in your industry.',
    order: 4,
    isRequired: true,
    wordCount: 120
  },
  {
    id: 'budget-pricing',
    title: 'Budget & Pricing',
    content: 'Our competitive pricing structure provides excellent value while ensuring quality delivery. The total project cost is structured to align with project milestones, providing transparency and cost predictability.',
    order: 5,
    isRequired: true,
    wordCount: 80
  }
];

const generateActivity = (proposalId: string, type: ProposalActivity['type'], description: string, user = currentUser, hoursAgo = 1): ProposalActivity => ({
  id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  type,
  description,
  userId: user.id,
  user,
  createdAt: new Date(Date.now() - hoursAgo * 60 * 60 * 1000),
  metadata: {}
});

const generateCollaborators = (proposalId: string, count = 2): ProposalCollaborator[] => {
  const collaborators: ProposalCollaborator[] = [
    {
      userId: currentUser.id,
      user: currentUser,
      role: 'owner',
      addedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    }
  ];

  const randomUsers = getRandomUsers(count - 1, [currentUser.id]);
  randomUsers.forEach((user, index) => {
    collaborators.push({
      userId: user.id,
      user,
      role: index === 0 ? 'editor' : 'viewer',
      addedAt: new Date(Date.now() - (5 - index) * 24 * 60 * 60 * 1000)
    });
  });

  return collaborators;
};

export const mockProposals: Proposal[] = [
  {
    id: 'proposal-1',
    title: 'Enterprise CRM Platform for GlobalBank',
    description: 'Complete digital transformation solution with advanced analytics and customer management capabilities.',
    clientName: 'GlobalBank Inc.',
    clientEmail: 'procurement@globalbank.com',
    status: proposalStatuses[1], // In Progress
    winProbability: 91,
    sections: sampleSections.map(section => ({ ...section, id: `${section.id}-1` })),
    collaborators: generateCollaborators('proposal-1', 3),
    activities: [
      generateActivity('proposal-1', 'ai_enhanced', 'AI enhanced the executive summary section', currentUser, 2),
      generateActivity('proposal-1', 'updated', 'Updated technical approach section', mockUsers[1], 4),
      generateActivity('proposal-1', 'shared', 'Shared proposal with stakeholders', currentUser, 6)
    ],
    rfpDocument: {
      id: 'rfp-1',
      filename: 'GlobalBank-CRM-RFP.pdf',
      url: '/mock-docs/globalbank-rfp.pdf',
      uploadedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
    },
    aiInsights: {
      keyRequirements: ['Customer data analytics', 'Multi-channel integration', 'Compliance reporting', 'Real-time dashboards'],
      suggestedImprovements: ['Add security compliance section', 'Include scalability metrics', 'Emphasize cost savings'],
      competitiveAdvantages: ['15+ years banking experience', 'Proven ROI methodology', 'Award-winning support'],
      riskFactors: ['Tight timeline', 'Complex legacy system integration', 'Regulatory requirements']
    },
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    budget: {
      min: 750000,
      max: 950000,
      currency: 'USD'
    },
    tags: ['Enterprise', 'Banking', 'CRM', 'Digital Transformation'],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    createdBy: currentUser.id,
    lastModifiedBy: currentUser.id
  },
  {
    id: 'proposal-2',
    title: 'E-commerce Platform Redesign for RetailCorp',
    description: 'Modern, mobile-first e-commerce platform with advanced personalization and analytics.',
    clientName: 'RetailCorp',
    clientEmail: 'digital@retailcorp.com',
    status: proposalStatuses[2], // Review
    winProbability: 78,
    sections: sampleSections.map(section => ({ ...section, id: `${section.id}-2` })),
    collaborators: generateCollaborators('proposal-2', 2),
    activities: [
      generateActivity('proposal-2', 'status_changed', 'Moved to review stage', currentUser, 1),
      generateActivity('proposal-2', 'updated', 'Finalized pricing structure', mockUsers[2], 8),
      generateActivity('proposal-2', 'created', 'Proposal created', currentUser, 24)
    ],
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
    budget: {
      min: 150000,
      max: 200000,
      currency: 'USD'
    },
    tags: ['E-commerce', 'Retail', 'Mobile', 'UX/UI'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    createdBy: currentUser.id,
    lastModifiedBy: mockUsers[2].id
  },
  {
    id: 'proposal-3',
    title: 'Healthcare Analytics Dashboard for MedTech Solutions',
    description: 'Advanced healthcare data visualization and predictive analytics platform.',
    clientName: 'MedTech Solutions',
    clientEmail: 'projects@medtechsolutions.com',
    status: proposalStatuses[0], // Draft
    winProbability: 85,
    sections: sampleSections.map(section => ({ ...section, id: `${section.id}-3` })),
    collaborators: generateCollaborators('proposal-3', 4),
    activities: [
      generateActivity('proposal-3', 'ai_enhanced', 'AI improved compliance section', currentUser, 3),
      generateActivity('proposal-3', 'updated', 'Added HIPAA compliance details', mockUsers[3], 12),
      generateActivity('proposal-3', 'created', 'Proposal created', currentUser, 72)
    ],
    deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 4 weeks from now
    budget: {
      min: 300000,
      max: 450000,
      currency: 'USD'
    },
    tags: ['Healthcare', 'Analytics', 'Compliance', 'Data Visualization'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    createdBy: currentUser.id,
    lastModifiedBy: currentUser.id
  },
  {
    id: 'proposal-4',
    title: 'Marketing Automation Platform for StartupXYZ',
    description: 'Comprehensive marketing automation solution with lead scoring and customer journey mapping.',
    clientName: 'StartupXYZ',
    clientEmail: 'founders@startupxyz.com',
    status: proposalStatuses[3], // Completed
    winProbability: 95,
    sections: sampleSections.map(section => ({ ...section, id: `${section.id}-4` })),
    collaborators: generateCollaborators('proposal-4', 2),
    activities: [
      generateActivity('proposal-4', 'submitted', 'Proposal submitted to client', currentUser, 24),
      generateActivity('proposal-4', 'status_changed', 'Marked as completed', currentUser, 26),
      generateActivity('proposal-4', 'ai_enhanced', 'AI optimized ROI projections', currentUser, 48)
    ],
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    budget: {
      min: 75000,
      max: 100000,
      currency: 'USD'
    },
    tags: ['Marketing', 'Automation', 'Startup', 'Lead Generation'],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    createdBy: currentUser.id,
    lastModifiedBy: currentUser.id
  },
  {
    id: 'proposal-5',
    title: 'Cloud Migration Strategy for TechCorp',
    description: 'Complete cloud infrastructure migration with security, scalability, and cost optimization.',
    clientName: 'TechCorp Industries',
    clientEmail: 'it@techcorp.com',
    status: proposalStatuses[1], // In Progress
    winProbability: 72,
    sections: sampleSections.map(section => ({ ...section, id: `${section.id}-5` })),
    collaborators: generateCollaborators('proposal-5', 3),
    activities: [
      generateActivity('proposal-5', 'updated', 'Updated security compliance section', mockUsers[4], 6),
      generateActivity('proposal-5', 'shared', 'Shared with technical team', currentUser, 18),
      generateActivity('proposal-5', 'created', 'Proposal created', currentUser, 96)
    ],
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 5 weeks from now
    budget: {
      min: 500000,
      max: 750000,
      currency: 'USD'
    },
    tags: ['Cloud', 'Migration', 'Infrastructure', 'Security'],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    createdBy: currentUser.id,
    lastModifiedBy: mockUsers[4].id
  }
];

export const getProposalById = (id: string): Proposal | undefined => {
  return mockProposals.find(proposal => proposal.id === id);
};

export const getProposalsByStatus = (statusId: string): Proposal[] => {
  return mockProposals.filter(proposal => proposal.status.id === statusId);
};

export const getRecentProposals = (count: number = 5): Proposal[] => {
  return [...mockProposals]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, count);
};