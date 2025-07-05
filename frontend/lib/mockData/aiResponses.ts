interface ChatScenario {
  triggers: string[];
  response: string;
  extractedInfo?: any;
  suggestions?: string[];
}

export const chatScenarios: ChatScenario[] = [
  // Software Development
  {
    triggers: ['software', 'app', 'application', 'development', 'programming', 'code'],
    response: "Great! I can help you create a compelling software development proposal. Could you tell me more about the specific type of application you're building? For example, is it a web application, mobile app, or enterprise software?",
    suggestions: ['Web application', 'Mobile app', 'Enterprise software', 'API development']
  },
  {
    triggers: ['web', 'website', 'portal', 'platform'],
    response: "Perfect! Web development projects are exciting. What's the main purpose of this web platform? Is it for e-commerce, content management, user portal, or something else? Also, who is your target client?",
    extractedInfo: {
      projectType: 'Web Development'
    },
    suggestions: ['E-commerce platform', 'Content management', 'User portal', 'Business website']
  },
  {
    triggers: ['mobile', 'ios', 'android', 'app store'],
    response: "Mobile app development - excellent choice! Are you planning for iOS, Android, or both platforms? What's the core functionality of the app, and do you have any specific features in mind?",
    extractedInfo: {
      projectType: 'Mobile App Development'
    },
    suggestions: ['iOS only', 'Android only', 'Cross-platform', 'Native development']
  },

  // Marketing
  {
    triggers: ['marketing', 'campaign', 'advertising', 'promotion', 'brand'],
    response: "Marketing campaigns can be incredibly impactful! What type of marketing are you focusing on? Digital marketing, traditional advertising, social media campaigns, or a comprehensive marketing strategy?",
    extractedInfo: {
      projectType: 'Marketing Campaign'
    },
    suggestions: ['Digital marketing', 'Social media campaign', 'Content marketing', 'Brand strategy']
  },
  {
    triggers: ['social media', 'facebook', 'instagram', 'linkedin', 'twitter'],
    response: "Social media marketing is crucial for modern businesses! Which platforms are you targeting, and what are your main goals? Brand awareness, lead generation, customer engagement, or sales conversion?",
    extractedInfo: {
      projectType: 'Social Media Marketing',
      requirements: ['Social media presence', 'Content creation', 'Audience engagement']
    },
    suggestions: ['Brand awareness', 'Lead generation', 'Customer engagement', 'Sales conversion']
  },

  // Consulting
  {
    triggers: ['consulting', 'consultation', 'advisory', 'strategy', 'business'],
    response: "Business consulting projects require deep expertise. What area of consulting are you proposing? Management consulting, IT strategy, digital transformation, or operational improvement?",
    extractedInfo: {
      projectType: 'Business Consulting'
    },
    suggestions: ['Management consulting', 'IT strategy', 'Digital transformation', 'Process optimization']
  },

  // Construction
  {
    triggers: ['construction', 'building', 'renovation', 'infrastructure', 'facility'],
    response: "Construction projects involve detailed planning and execution. What type of construction work is this? New building construction, renovation, infrastructure development, or facility management?",
    extractedInfo: {
      projectType: 'Construction',
      industryType: 'Construction'
    },
    suggestions: ['New construction', 'Renovation', 'Infrastructure', 'Commercial building']
  },

  // Timeline questions
  {
    triggers: ['deadline', 'timeline', 'when', 'schedule', 'delivery', 'complete'],
    response: "Timeline is crucial for project planning. When does the client need this completed? Do they have any specific milestones or phases they want to see along the way?",
    suggestions: ['1-3 months', '3-6 months', '6-12 months', 'Ongoing project']
  },

  // Budget questions
  {
    triggers: ['budget', 'cost', 'price', 'money', 'investment', 'funding'],
    response: "Understanding the budget helps create a realistic proposal. Has the client indicated a budget range? Even a rough estimate would be helpful for tailoring the proposal appropriately.",
    suggestions: ['Under $50K', '$50K-$100K', '$100K-$500K', 'Over $500K']
  },

  // Client information
  {
    triggers: ['client', 'company', 'organization', 'business'],
    response: "Tell me about your client. What's their company name and industry? Understanding their business context helps create a more targeted proposal.",
    suggestions: ['Technology company', 'Healthcare organization', 'Financial services', 'Retail business']
  },

  // Requirements
  {
    triggers: ['requirements', 'features', 'functionality', 'needs', 'must have'],
    response: "Understanding requirements is key to a winning proposal. What are the core features or functionalities the client needs? Are there any specific technical requirements or constraints I should know about?",
    suggestions: ['Core functionality', 'Integration needs', 'Performance requirements', 'Security requirements']
  }
];

export const defaultResponses = {
  welcome: "Hi! I'm here to help you create a winning proposal. Let's start by talking about your project. What kind of proposal are you working on?",
  clarification: "Could you provide a bit more detail about that? The more specific information you give me, the better I can help tailor your proposal.",
  unknown: "That's interesting! Could you tell me more about the specific requirements or goals for this project? Understanding the client's needs will help me assist you better.",
  summary: "Based on what you've told me, I'm getting a good picture of your project. Is there anything else important about the requirements, timeline, or client that I should know?",
  complete: "Excellent! I have enough information to help create a strong proposal. You can now proceed to generate your proposal or continue refining the details."
};

export const industryTemplates = {
  technology: {
    commonRequirements: ['Scalability', 'Security', 'Performance', 'Integration', 'User Experience'],
    keyPoints: ['Technical expertise', 'Innovation', 'Quality assurance', 'Support and maintenance'],
    riskFactors: ['Technology changes', 'Security vulnerabilities', 'Performance issues']
  },
  healthcare: {
    commonRequirements: ['HIPAA Compliance', 'Data Security', 'Interoperability', 'User Training'],
    keyPoints: ['Healthcare expertise', 'Compliance knowledge', 'Patient data protection', 'Clinical workflow'],
    riskFactors: ['Regulatory compliance', 'Data privacy', 'System integration']
  },
  finance: {
    commonRequirements: ['Security', 'Compliance', 'Audit trails', 'Performance', 'Reliability'],
    keyPoints: ['Financial sector experience', 'Regulatory compliance', 'Risk management', 'Security expertise'],
    riskFactors: ['Regulatory changes', 'Security threats', 'Data integrity']
  },
  retail: {
    commonRequirements: ['User Experience', 'Mobile Support', 'Payment Integration', 'Inventory Management'],
    keyPoints: ['E-commerce experience', 'Customer journey optimization', 'Conversion optimization', 'Analytics'],
    riskFactors: ['Seasonal fluctuations', 'Customer behavior changes', 'Competition']
  }
};

export const generateAIResponse = (userMessage: string, context?: any): { 
  response: string; 
  extractedInfo?: any; 
  suggestions?: string[] 
} => {
  const message = userMessage.toLowerCase();
  
  // Find matching scenario
  for (const scenario of chatScenarios) {
    if (scenario.triggers.some(trigger => message.includes(trigger))) {
      return {
        response: scenario.response,
        extractedInfo: scenario.extractedInfo,
        suggestions: scenario.suggestions
      };
    }
  }
  
  // Extract specific information patterns
  const extractedInfo: any = {};
  
  // Extract company names (simple pattern)
  const companyMatch = message.match(/(?:for|with|client)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
  if (companyMatch) {
    extractedInfo.clientName = companyMatch[1];
  }
  
  // Extract budget information
  const budgetMatch = message.match(/\$?([\d,]+)(?:k|thousand|million)?/);
  if (budgetMatch) {
    extractedInfo.budget = budgetMatch[0];
  }
  
  // Extract timeline information
  const timelineMatch = message.match(/(\d+)\s*(weeks?|months?|days?)/);
  if (timelineMatch) {
    extractedInfo.timeline = `${timelineMatch[1]} ${timelineMatch[2]}`;
  }
  
  // Default response based on context
  if (Object.keys(extractedInfo).length > 0) {
    return {
      response: "Thanks for that information! I'm building a picture of your project. Can you tell me more about the specific deliverables or outcomes the client is expecting?",
      extractedInfo,
      suggestions: ['Project deliverables', 'Success metrics', 'Client expectations', 'Technical requirements']
    };
  }
  
  return {
    response: defaultResponses.clarification,
    suggestions: ['Tell me about the client', 'Describe the project scope', 'Timeline requirements', 'Budget considerations']
  };
};