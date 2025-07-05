export interface MockUploadResponse {
  id: string;
  filename: string;
  url: string;
  extractedText: string;
  aiAnalysis: {
    keyRequirements: string[];
    proposalType: string;
    clientInfo: {
      name: string;
      industry?: string;
      requirements?: string[];
    };
    timeline?: {
      deadline: Date;
      milestones: string[];
    };
    budget?: {
      estimatedRange: string;
      currency: string;
    };
  };
}

export const mockUploadResponses: Record<string, MockUploadResponse> = {
  'banking-rfp': {
    id: 'upload-banking-1',
    filename: 'GlobalBank-CRM-RFP.pdf',
    url: '/mock-docs/banking-rfp.pdf',
    extractedText: `REQUEST FOR PROPOSAL
    
GlobalBank Inc. Customer Relationship Management System

EXECUTIVE SUMMARY
GlobalBank Inc. is seeking a comprehensive Customer Relationship Management (CRM) solution to enhance customer engagement, streamline operations, and improve data analytics capabilities across all business units.

PROJECT SCOPE
The selected vendor will be responsible for:
- Design and implementation of a modern CRM platform
- Integration with existing banking systems
- Data migration from legacy systems
- Staff training and change management
- Ongoing support and maintenance

KEY REQUIREMENTS
1. Multi-channel customer interaction management
2. Advanced analytics and reporting capabilities
3. Compliance with banking regulations (SOX, GDPR, PCI-DSS)
4. Real-time data synchronization
5. Mobile-responsive interface
6. API integration capabilities
7. Scalability to support 500,000+ customers
8. High availability (99.9% uptime)

TECHNICAL SPECIFICATIONS
- Cloud-based architecture preferred
- Support for 1000+ concurrent users
- Integration with core banking systems
- Advanced security and audit trails
- Automated workflow capabilities

TIMELINE
Project must be completed within 6 months from contract signing.
Key milestones:
- Month 1: System design and architecture
- Month 2-3: Development and initial testing
- Month 4: Data migration and integration
- Month 5: User training and pilot testing
- Month 6: Go-live and support transition

BUDGET
Total project budget: $750,000 - $950,000
Payment terms negotiable based on milestone completion.

EVALUATION CRITERIA
Proposals will be evaluated based on:
- Technical approach and methodology (30%)
- Team experience and qualifications (25%)
- Cost and value proposition (20%)
- Implementation timeline (15%)
- References and past performance (10%)`,
    aiAnalysis: {
      keyRequirements: [
        'Multi-channel customer interaction management',
        'Advanced analytics and reporting',
        'Banking compliance (SOX, GDPR, PCI-DSS)',
        'Real-time data synchronization',
        'Mobile-responsive interface',
        'API integration capabilities',
        'Scalability for 500,000+ customers',
        'High availability (99.9% uptime)'
      ],
      proposalType: 'Software Development - CRM System',
      clientInfo: {
        name: 'GlobalBank Inc.',
        industry: 'Banking & Financial Services',
        requirements: [
          'CRM platform design and implementation',
          'Legacy system integration',
          'Data migration',
          'Staff training',
          'Ongoing support'
        ]
      },
      timeline: {
        deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
        milestones: [
          'System design and architecture',
          'Development and testing',
          'Data migration and integration',
          'User training and pilot',
          'Go-live and support transition'
        ]
      },
      budget: {
        estimatedRange: '$750,000 - $950,000',
        currency: 'USD'
      }
    }
  },
  
  'ecommerce-rfp': {
    id: 'upload-ecommerce-1',
    filename: 'RetailCorp-Ecommerce-RFP.pdf',
    url: '/mock-docs/ecommerce-rfp.pdf',
    extractedText: `REQUEST FOR PROPOSAL
    
RetailCorp E-commerce Platform Redesign

PROJECT OVERVIEW
RetailCorp is seeking a complete redesign of our e-commerce platform to improve customer experience, increase conversion rates, and support our growing business needs.

CURRENT SITUATION
Our existing platform is outdated and lacks modern features. We're experiencing:
- High cart abandonment rates (68%)
- Poor mobile experience
- Limited personalization capabilities
- Slow page load times
- Difficulties with inventory management

PROJECT OBJECTIVES
1. Create a modern, mobile-first e-commerce experience
2. Implement advanced personalization features
3. Improve site performance and loading speeds
4. Integrate with existing ERP and inventory systems
5. Enhance analytics and reporting capabilities
6. Implement modern payment processing
7. Support for multiple product catalogs

TECHNICAL REQUIREMENTS
- Responsive design for all devices
- Progressive Web App (PWA) capabilities
- Advanced search and filtering
- Personalized product recommendations
- Inventory management integration
- Multi-payment gateway support
- SEO optimization
- Analytics integration (Google Analytics, Adobe Analytics)
- A/B testing capabilities

TIMELINE
Project completion required within 4 months.
Phases:
- Phase 1: Design and UX/UI (Month 1)
- Phase 2: Development (Month 2-3)
- Phase 3: Testing and launch (Month 4)

BUDGET RANGE
$150,000 - $200,000

SUCCESS METRICS
- Reduce cart abandonment by 25%
- Improve mobile conversion rates by 40%
- Increase average order value by 15%
- Achieve page load times under 3 seconds`,
    aiAnalysis: {
      keyRequirements: [
        'Mobile-first responsive design',
        'Advanced personalization features',
        'Performance optimization',
        'ERP and inventory integration',
        'Analytics and reporting',
        'Modern payment processing',
        'Multi-product catalog support',
        'SEO optimization'
      ],
      proposalType: 'E-commerce Platform Development',
      clientInfo: {
        name: 'RetailCorp',
        industry: 'Retail & E-commerce',
        requirements: [
          'Platform redesign',
          'Mobile optimization',
          'Performance improvement',
          'System integration',
          'Analytics implementation'
        ]
      },
      timeline: {
        deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 4 months
        milestones: [
          'Design and UX/UI',
          'Development',
          'Testing and launch'
        ]
      },
      budget: {
        estimatedRange: '$150,000 - $200,000',
        currency: 'USD'
      }
    }
  },

  'healthcare-rfp': {
    id: 'upload-healthcare-1',
    filename: 'MedTech-Analytics-RFP.pdf',
    url: '/mock-docs/healthcare-rfp.pdf',
    extractedText: `REQUEST FOR PROPOSAL

MedTech Solutions Healthcare Analytics Dashboard

PROJECT SUMMARY
MedTech Solutions requires a comprehensive healthcare analytics dashboard to visualize patient data, track clinical outcomes, and support data-driven decision making across our healthcare network.

COMPLIANCE REQUIREMENTS
All solutions must comply with:
- HIPAA Privacy and Security Rules
- HITECH Act requirements
- FDA regulations for medical devices
- SOC 2 Type II certification preferred

FUNCTIONAL REQUIREMENTS
1. Real-time patient data visualization
2. Clinical outcome tracking and reporting
3. Population health analytics
4. Predictive analytics for patient risk assessment
5. Integration with existing EMR systems
6. Automated report generation
7. Role-based access controls
8. Audit trail capabilities

TECHNICAL SPECIFICATIONS
- Cloud-based solution preferred (HIPAA-compliant)
- Support for HL7 FHIR standards
- Integration with Epic, Cerner, and Allscripts EMRs
- Real-time data processing capabilities
- Advanced data visualization tools
- Machine learning capabilities for predictive analytics
- Mobile-responsive design
- 24/7 system availability

DATA REQUIREMENTS
- Patient demographics and clinical data
- Lab results and diagnostic imaging
- Medication administration records
- Treatment outcomes and follow-up data
- Quality metrics and performance indicators

TIMELINE
6-month implementation timeline:
- Month 1-2: Requirements gathering and system design
- Month 3-4: Development and EMR integration
- Month 5: Testing and validation
- Month 6: Training and go-live

BUDGET
Total budget allocation: $300,000 - $450,000

VENDOR QUALIFICATIONS
- Healthcare industry experience required
- HIPAA compliance expertise
- EMR integration experience
- References from similar healthcare organizations`,
    aiAnalysis: {
      keyRequirements: [
        'HIPAA compliance',
        'Real-time data visualization',
        'EMR system integration',
        'Predictive analytics',
        'Role-based access controls',
        'Audit trail capabilities',
        'HL7 FHIR standards support',
        '24/7 system availability'
      ],
      proposalType: 'Healthcare Analytics Platform',
      clientInfo: {
        name: 'MedTech Solutions',
        industry: 'Healthcare & Medical Technology',
        requirements: [
          'Analytics dashboard development',
          'EMR integration',
          'Compliance implementation',
          'Data visualization',
          'Predictive analytics'
        ]
      },
      timeline: {
        deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
        milestones: [
          'Requirements gathering and design',
          'Development and EMR integration',
          'Testing and validation',
          'Training and go-live'
        ]
      },
      budget: {
        estimatedRange: '$300,000 - $450,000',
        currency: 'USD'
      }
    }
  }
};

export const getRandomUploadResponse = (): MockUploadResponse => {
  const responses = Object.values(mockUploadResponses);
  return responses[Math.floor(Math.random() * responses.length)];
};

export const getUploadResponseByType = (filename: string): MockUploadResponse => {
  const lowerFilename = filename.toLowerCase();
  
  if (lowerFilename.includes('bank') || lowerFilename.includes('crm')) {
    return mockUploadResponses['banking-rfp'];
  }
  
  if (lowerFilename.includes('ecommerce') || lowerFilename.includes('retail')) {
    return mockUploadResponses['ecommerce-rfp'];
  }
  
  if (lowerFilename.includes('health') || lowerFilename.includes('medical')) {
    return mockUploadResponses['healthcare-rfp'];
  }
  
  return getRandomUploadResponse();
};