import { config } from '@/lib/config';

export interface ContentSuggestion {
  id: string;
  title: string;
  content: string;
  type: 'improvement' | 'expansion' | 'alternative';
  confidence: number;
}

export interface ChatMessage {
  message: string;
  suggestions?: string[];
}

export interface GenerateContentSuggestionsRequest {
  sectionType: string;
  currentContent: string;
  proposalContext: {
    title: string;
    clientName: string;
    industry: string;
  };
}

export interface ChatWithAIRequest {
  message: string;
  context: {
    proposal: {
      title: string;
      clientName: string;
      sections: Array<{
        title: string;
        type: string;
        hasContent: boolean;
      }>;
    };
    activeSection?: {
      title: string;
      type: string;
      content?: string;
    };
  };
}

const sectionSuggestions = {
  'executive-summary': [
    {
      id: '1',
      title: 'Add Compelling Hook',
      content: 'Start with a powerful statement that captures attention: "In today\'s rapidly evolving digital landscape, {clientName} faces the critical challenge of staying competitive while managing operational costs. Our proposed solution addresses this challenge head-on with a comprehensive approach that delivers measurable results."',
      type: 'improvement' as const,
      confidence: 95
    },
    {
      id: '2',
      title: 'Include Key Metrics',
      content: 'Strengthen your summary with specific metrics: "Our solution will reduce operational costs by 30%, improve efficiency by 45%, and deliver ROI within 6 months of implementation."',
      type: 'expansion' as const,
      confidence: 88
    },
    {
      id: '3',
      title: 'Add Value Proposition',
      content: 'Clearly articulate your unique value: "Unlike traditional approaches, our methodology combines industry best practices with cutting-edge technology, ensuring {clientName} receives a solution that is both innovative and proven."',
      type: 'alternative' as const,
      confidence: 92
    }
  ],
  'problem-statement': [
    {
      id: '4',
      title: 'Quantify the Problem',
      content: 'Add specific data to illustrate the pain points: "Current inefficiencies are costing {clientName} approximately $X per month in lost productivity and missed opportunities."',
      type: 'improvement' as const,
      confidence: 90
    },
    {
      id: '5',
      title: 'Include Industry Context',
      content: 'Position within industry trends: "According to recent {industry} industry reports, companies facing similar challenges have seen significant improvements through strategic digital transformation."',
      type: 'expansion' as const,
      confidence: 85
    }
  ],
  'proposed-solution': [
    {
      id: '6',
      title: 'Break Down Solution Components',
      content: 'Structure your solution in clear phases: "Phase 1: Assessment & Planning (Weeks 1-2), Phase 2: Implementation (Weeks 3-8), Phase 3: Testing & Optimization (Weeks 9-10), Phase 4: Training & Go-Live (Weeks 11-12)."',
      type: 'improvement' as const,
      confidence: 93
    },
    {
      id: '7',
      title: 'Add Technical Specifications',
      content: 'Include relevant technical details: "Our solution leverages cloud-native architecture, ensuring 99.9% uptime, automatic scaling, and enterprise-grade security compliance."',
      type: 'expansion' as const,
      confidence: 87
    }
  ],
  'budget': [
    {
      id: '8',
      title: 'Provide Cost Breakdown',
      content: 'Offer transparent pricing: "Total Investment: $X (Development: 60%, Infrastructure: 20%, Training & Support: 15%, Project Management: 5%)"',
      type: 'improvement' as const,
      confidence: 94
    },
    {
      id: '9',
      title: 'Show ROI Calculation',
      content: 'Demonstrate value: "Based on projected efficiency gains and cost savings, the total ROI is estimated at 250% within the first 18 months."',
      type: 'expansion' as const,
      confidence: 89
    }
  ]
};

const contextualResponses = [
  "I'd be happy to help improve your proposal! Based on the section you're working on, I can suggest ways to make it more compelling and professional.",
  "Great question! For this type of content, I recommend focusing on specific benefits and measurable outcomes that will resonate with your client.",
  "That's a common challenge in proposal writing. Here's how you can address it effectively...",
  "I see you're working on the {sectionTitle} section. This is a critical part of your proposal where you want to clearly communicate...",
  "Based on industry best practices, here are some suggestions to strengthen this section...",
  "For {clientName}, I'd recommend emphasizing the specific value propositions that align with their {industry} focus...",
  "Let me help you craft content that will resonate with stakeholders and decision-makers..."
];

const improvementTips = [
  "Consider adding specific metrics and KPIs to quantify the impact",
  "Include relevant case studies or success stories from similar projects",
  "Use active voice and compelling language to engage readers",
  "Break down complex concepts into digestible sections with clear headers",
  "Add visual elements like charts or infographics to support key points",
  "Ensure each section connects back to the client's specific needs and goals",
  "Include risk mitigation strategies to address potential concerns",
  "Highlight your unique differentiators and competitive advantages"
];

export const mockAIService = {
  async generateContentSuggestions(request: GenerateContentSuggestionsRequest) {
    await new Promise(resolve => setTimeout(resolve, config.api.mockDelay + 500));

    const suggestions = sectionSuggestions[request.sectionType as keyof typeof sectionSuggestions] || [
      {
        id: 'default-1',
        title: 'Enhance Content Structure',
        content: 'Consider organizing this section with clear headers and bullet points to improve readability and impact.',
        type: 'improvement' as const,
        confidence: 80
      },
      {
        id: 'default-2',
        title: 'Add Client-Specific Details',
        content: `Customize this section for ${request.proposalContext.clientName} by including specific references to their ${request.proposalContext.industry} industry needs.`,
        type: 'expansion' as const,
        confidence: 75
      }
    ];

    // Personalize suggestions with context
    const personalizedSuggestions = suggestions.map(suggestion => ({
      ...suggestion,
      content: suggestion.content
        .replace('{clientName}', request.proposalContext.clientName)
        .replace('{industry}', request.proposalContext.industry)
    }));

    return {
      success: true,
      data: {
        suggestions: personalizedSuggestions,
        sectionType: request.sectionType,
        context: request.proposalContext
      }
    };
  },

  async chatWithAI(request: ChatWithAIRequest) {
    await new Promise(resolve => setTimeout(resolve, config.api.mockDelay + 300));

    const { message, context } = request;
    const { proposal, activeSection } = context;

    // Analyze the message for intent
    const isQuestionAboutSection = message.toLowerCase().includes('section') || 
                                  message.toLowerCase().includes('improve') ||
                                  message.toLowerCase().includes('help');
    
    const isQuestionAboutContent = message.toLowerCase().includes('content') ||
                                  message.toLowerCase().includes('write') ||
                                  message.toLowerCase().includes('suggest');

    let responseMessage = '';
    let suggestions: string[] = [];

    if (isQuestionAboutSection && activeSection) {
      responseMessage = `I see you're working on the "${activeSection.title}" section. This is crucial for demonstrating ${getSectionPurpose(activeSection.type)}. Here are some ways to make it more effective:`;
      
      suggestions = [
        `Enhance the ${activeSection.title} with specific metrics relevant to ${proposal.clientName}`,
        `Add industry-specific examples that resonate with ${proposal.clientName}'s ${getSectionContext(activeSection.type)}`,
        `Structure the content with clear headings and bullet points for better readability`
      ];
    } else if (isQuestionAboutContent) {
      responseMessage = `I can help you create compelling content! For ${proposal.clientName}, I recommend focusing on their specific needs and challenges. Here's what I suggest:`;
      
      suggestions = [
        'Start with a strong value proposition that addresses their main pain points',
        'Include concrete examples and case studies from similar projects',
        'Use data and metrics to support your recommendations',
        'End with clear next steps and timeline'
      ];
    } else if (message.toLowerCase().includes('template') || message.toLowerCase().includes('structure')) {
      responseMessage = `Here's a proven structure for this type of proposal that works well for ${proposal.clientName}'s industry:`;
      
      suggestions = [
        'Executive Summary: Hook, problem, solution, value (2-3 paragraphs)',
        'Problem Statement: Current challenges with quantified impact',
        'Proposed Solution: Detailed approach with phases and deliverables',
        'Timeline & Budget: Clear milestones with transparent pricing'
      ];
    } else {
      // Generic helpful response
      const randomResponse = contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
      responseMessage = randomResponse
        .replace('{sectionTitle}', activeSection?.title || 'current')
        .replace('{clientName}', proposal.clientName)
        .replace('{industry}', 'industry');

      // Add some general improvement tips
      const randomTips = improvementTips
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      suggestions = randomTips;
    }

    return {
      success: true,
      data: {
        message: responseMessage,
        suggestions: suggestions.length > 0 ? suggestions : undefined,
        context: {
          proposalTitle: proposal.title,
          clientName: proposal.clientName,
          activeSection: activeSection?.title
        }
      }
    };
  },

  async enhanceContent(content: string, enhancementType: 'professional' | 'persuasive' | 'concise' | 'detailed') {
    await new Promise(resolve => setTimeout(resolve, config.api.mockDelay + 800));

    const enhancements = {
      professional: 'Enhanced with formal business language and industry terminology',
      persuasive: 'Improved with compelling arguments and value-focused messaging',
      concise: 'Streamlined to eliminate redundancy while maintaining key points',
      detailed: 'Expanded with additional context, examples, and supporting information'
    };

    const enhancedContent = `<p><strong>[AI Enhanced - ${enhancements[enhancementType]}]</strong></p>\n\n${content}\n\n<p><em>This content has been enhanced to improve its ${enhancementType} tone and effectiveness.</em></p>`;

    return {
      success: true,
      data: {
        originalContent: content,
        enhancedContent,
        enhancementType,
        improvements: [
          'Improved clarity and readability',
          'Enhanced professional tone',
          'Added compelling value propositions',
          'Structured for better flow'
        ]
      }
    };
  },

  async generateSectionContent(sectionType: string, context: any) {
    await new Promise(resolve => setTimeout(resolve, config.api.mockDelay + 1000));

    const templates = {
      'executive-summary': `
        <h3>Executive Summary</h3>
        <p>We are pleased to present this comprehensive proposal for ${context.clientName}'s ${context.projectType || 'initiative'}. Our proposed solution addresses the key challenges you've outlined while delivering measurable value and competitive advantage.</p>
        
        <p><strong>The Challenge:</strong> Based on our analysis, ${context.clientName} faces [specific challenge] that impacts [business area].</p>
        
        <p><strong>Our Solution:</strong> We recommend a strategic approach that combines [solution elements] to achieve [specific outcomes].</p>
        
        <p><strong>Expected Outcomes:</strong> Implementation will result in [quantified benefits] within [timeframe].</p>
      `,
      'problem-statement': `
        <h3>Current Challenges</h3>
        <p>${context.clientName} is experiencing challenges that are common in the ${context.industry || 'industry'} sector:</p>
        
        <ul>
          <li><strong>Operational Inefficiencies:</strong> Current processes are not optimized for scale</li>
          <li><strong>Technology Gaps:</strong> Legacy systems limit growth potential</li>
          <li><strong>Competitive Pressure:</strong> Market demands require rapid adaptation</li>
        </ul>
        
        <p>These challenges translate to quantifiable business impact, including reduced productivity, increased costs, and missed opportunities.</p>
      `,
      'proposed-solution': `
        <h3>Recommended Solution</h3>
        <p>Our comprehensive approach addresses ${context.clientName}'s specific needs through a phased implementation:</p>
        
        <h4>Phase 1: Assessment & Strategy</h4>
        <p>Complete analysis of current state and development of detailed implementation roadmap.</p>
        
        <h4>Phase 2: Implementation</h4>
        <p>Systematic deployment of solution components with continuous monitoring and optimization.</p>
        
        <h4>Phase 3: Optimization & Training</h4>
        <p>Performance tuning and comprehensive training to ensure maximum value realization.</p>
      `
    };

    const content = templates[sectionType as keyof typeof templates] || `
      <h3>Section Content</h3>
      <p>This section will address specific aspects of the proposal relevant to ${context.clientName}'s needs.</p>
      <p>Key points will be developed to ensure comprehensive coverage of requirements and deliverables.</p>
    `;

    return {
      success: true,
      data: {
        content,
        sectionType,
        context,
        suggestions: [
          'Customize with specific client details',
          'Add relevant metrics and data points',
          'Include supporting evidence and examples'
        ]
      }
    };
  }
};

// Helper functions
function getSectionPurpose(sectionType: string): string {
  const purposes = {
    'executive-summary': 'your value proposition and key recommendations',
    'problem-statement': 'the challenges your client faces',
    'proposed-solution': 'your recommended approach and methodology',
    'timeline': 'project phases and realistic expectations',
    'budget': 'transparent pricing and value justification',
    'team': 'your expertise and qualifications',
    'conclusion': 'next steps and compelling call to action'
  };
  
  return purposes[sectionType as keyof typeof purposes] || 'your key messages';
}

function getSectionContext(sectionType: string): string {
  const contexts = {
    'executive-summary': 'strategic objectives',
    'problem-statement': 'operational challenges',
    'proposed-solution': 'implementation requirements',
    'timeline': 'project constraints',
    'budget': 'investment priorities',
    'team': 'resource needs',
    'conclusion': 'decision criteria'
  };
  
  return contexts[sectionType as keyof typeof contexts] || 'business requirements';
}