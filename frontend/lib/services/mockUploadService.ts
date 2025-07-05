import { UploadFile, UploadProgress } from '@/types/upload';
import { mockDataUtils, getUploadResponseByType, generateAIResponse } from '@/lib/mockData';

export interface UploadApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FileUploadResult {
  id: string;
  filename: string;
  url: string;
  extractedText?: string;
  aiAnalysis?: any;
}

export interface ChatAnalysisResult {
  extractedInfo: any;
  suggestions: string[];
  nextQuestions: string[];
}

class MockUploadService {
  // Upload file with progress tracking
  async uploadFile(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadApiResponse<FileUploadResult>> {
    try {
      // Simulate upload progress
      if (onProgress) {
        onProgress({
          fileId: file.name,
          progress: 0,
          stage: 'uploading',
          message: `Uploading ${file.name}...`
        });
      }

      // Simulate upload progress
      await mockDataUtils.simulateUploadProgress((progress) => {
        if (onProgress) {
          onProgress({
            fileId: file.name,
            progress,
            stage: 'uploading',
            message: `Uploading ${file.name}... ${progress}%`
          });
        }
      }, 2000);

      // Get mock response based on filename
      const mockResponse = getUploadResponseByType(file.name);

      const result: FileUploadResult = {
        id: mockDataUtils.generateId('upload'),
        filename: file.name,
        url: URL.createObjectURL(file), // Create a local URL for the uploaded file
        extractedText: mockResponse.extractedText,
        aiAnalysis: mockResponse.aiAnalysis
      };

      return { success: true, data: result };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Upload failed'
      };
    }
  }

  // Process uploaded file (extract text and analyze)
  async processFile(
    fileId: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadApiResponse<FileUploadResult>> {
    try {
      if (onProgress) {
        onProgress({
          fileId,
          progress: 0,
          stage: 'processing',
          message: 'Extracting text from document...'
        });
      }

      // Simulate processing delay
      await mockDataUtils.delay(1000);

      if (onProgress) {
        onProgress({
          fileId,
          progress: 50,
          stage: 'analyzing',
          message: 'Analyzing requirements with AI...'
        });
      }

      await mockDataUtils.delay(1500);

      if (onProgress) {
        onProgress({
          fileId,
          progress: 100,
          stage: 'completed',
          message: 'Processing complete'
        });
      }

      // This would normally return the processed file data
      // For mock, we'll return a success response
      return { 
        success: true, 
        data: { 
          id: fileId, 
          filename: 'processed-file.pdf', 
          url: '/mock-processed-file.pdf' 
        } 
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Processing failed'
      };
    }
  }

  // Analyze chat conversation
  async analyzeChatConversation(
    messages: string[]
  ): Promise<UploadApiResponse<ChatAnalysisResult>> {
    await mockDataUtils.randomDelay(500, 1000);

    try {
      const conversationText = messages.join(' ');
      const aiResponse = generateAIResponse(conversationText);

      const result: ChatAnalysisResult = {
        extractedInfo: aiResponse.extractedInfo || {},
        suggestions: aiResponse.suggestions || [],
        nextQuestions: [
          'What are the key technical requirements?',
          'When does the client need this completed?',
          'What is the approximate budget range?',
          'Are there any specific compliance requirements?'
        ]
      };

      return { success: true, data: result };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to analyze conversation'
      };
    }
  }

  // Generate AI response for chat
  async getChatResponse(
    message: string,
    context?: any
  ): Promise<UploadApiResponse<{ response: string; extractedInfo?: any }>> {
    // Simulate typing delay
    await mockDataUtils.randomDelay(800, 2000);

    try {
      const aiResponse = generateAIResponse(message, context);
      
      return { 
        success: true, 
        data: {
          response: aiResponse.response,
          extractedInfo: aiResponse.extractedInfo,
          suggestions: aiResponse.suggestions
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get AI response'
      };
    }
  }

  // Validate form data and get suggestions
  async validateFormData(
    formData: any
  ): Promise<UploadApiResponse<{ valid: boolean; suggestions: string[]; errors: string[] }>> {
    await mockDataUtils.randomDelay(300, 600);

    try {
      const errors: string[] = [];
      const suggestions: string[] = [];

      // Basic validation
      if (!formData.projectTitle) {
        errors.push('Project title is required');
      }
      if (!formData.clientName) {
        errors.push('Client name is required');
      }
      if (!formData.projectDescription) {
        errors.push('Project description is required');
      }

      // Generate suggestions
      if (formData.projectTitle && formData.projectTitle.length < 10) {
        suggestions.push('Consider making the project title more descriptive');
      }
      if (formData.requirements && formData.requirements.length < 3) {
        suggestions.push('Adding more detailed requirements will improve the proposal');
      }
      if (!formData.deadline) {
        suggestions.push('Including a deadline helps with project planning');
      }

      return { 
        success: true, 
        data: { 
          valid: errors.length === 0, 
          suggestions, 
          errors 
        } 
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to validate form data'
      };
    }
  }

  // Create proposal from upload data
  async createProposalFromUpload(
    uploadData: {
      method: 'file' | 'chat' | 'form';
      data: any;
    }
  ): Promise<UploadApiResponse<{ proposalId: string }>> {
    await mockDataUtils.randomDelay(1000, 2000);

    try {
      const proposalId = mockDataUtils.generateId('proposal');
      
      // In a real implementation, this would create the proposal
      // using the extracted data from the upload
      
      return { 
        success: true, 
        data: { proposalId }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create proposal from upload'
      };
    }
  }

  // Get upload history
  async getUploadHistory(
    page: number = 1,
    pageSize: number = 10
  ): Promise<UploadApiResponse<{ uploads: any[]; totalCount: number }>> {
    await mockDataUtils.randomDelay(200, 500);

    try {
      // Mock upload history
      const mockUploads = [
        {
          id: 'upload-1',
          filename: 'GlobalBank-CRM-RFP.pdf',
          uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          status: 'completed',
          extractedData: true
        },
        {
          id: 'upload-2',
          filename: 'RetailCorp-Requirements.docx',
          uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          status: 'completed',
          extractedData: true
        },
        {
          id: 'upload-3',
          filename: 'MedTech-Project-Brief.pdf',
          uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          status: 'completed',
          extractedData: true
        }
      ];

      return { 
        success: true, 
        data: { 
          uploads: mockUploads.slice((page - 1) * pageSize, page * pageSize),
          totalCount: mockUploads.length
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch upload history'
      };
    }
  }

  // Delete uploaded file
  async deleteUploadedFile(fileId: string): Promise<UploadApiResponse<{ success: boolean }>> {
    await mockDataUtils.randomDelay(200, 400);

    try {
      return { success: true, data: { success: true } };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete file'
      };
    }
  }

  // Get supported file types
  async getSupportedFileTypes(): Promise<UploadApiResponse<{ types: string[]; maxSize: number }>> {
    await mockDataUtils.randomDelay(100, 300);

    try {
      return { 
        success: true, 
        data: { 
          types: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'text/rtf'
          ],
          maxSize: 10 * 1024 * 1024 // 10MB
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get supported file types'
      };
    }
  }
}

export const mockUploadService = new MockUploadService();
export default mockUploadService;