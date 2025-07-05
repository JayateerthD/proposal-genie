export interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  uploadedUrl?: string;
  extractedText?: string;
  aiAnalysis?: {
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

export interface UploadProgress {
  fileId: string;
  progress: number;
  stage: 'uploading' | 'processing' | 'analyzing' | 'completed';
  message?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  metadata?: {
    extractedInfo?: Record<string, any>;
    suggestions?: string[];
  };
}

export interface QuickFormData {
  projectTitle: string;
  clientName: string;
  clientEmail?: string;
  projectDescription: string;
  deadline?: Date;
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  requirements: string[];
  industryType?: string;
  projectType?: string;
}

export interface UploadMethod {
  id: 'file' | 'chat' | 'form';
  title: string;
  description: string;
  icon: string;
  active: boolean;
}

export interface FileValidation {
  maxSize: number; // in bytes
  allowedTypes: string[];
  maxFiles: number;
}

export interface UploadConfig {
  validation: FileValidation;
  endpoints: {
    upload: string;
    process: string;
    analyze: string;
  };
  chunkSize: number;
  retryAttempts: number;
}