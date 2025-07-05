import api from './api';
import { UploadFile, UploadProgress } from '@/types/upload';

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

export interface ChatAnalysisResult {
  extractedInfo: {
    projectTitle?: string;
    clientName?: string;
    requirements: string[];
    timeline?: string;
    budget?: string;
    industryType?: string;
  };
  suggestions: string[];
  nextQuestions: string[];
}

class UploadApi {
  // Upload file with progress tracking
  async uploadFile(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadApiResponse<FileUploadResult>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', file.name);
      formData.append('type', file.type);

      const response = await api.post('/upload/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress({
              fileId: file.name,
              progress,
              stage: 'uploading',
              message: `Uploading ${file.name}...`
            });
          }
        },
      });

      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to upload file'
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
          message: 'Processing file...'
        });
      }

      const response = await api.post(`/upload/process/${fileId}`);

      if (onProgress) {
        onProgress({
          fileId,
          progress: 100,
          stage: 'completed',
          message: 'Processing complete'
        });
      }

      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to process file'
      };
    }
  }

  // Analyze chat conversation
  async analyzeChatConversation(
    messages: string[]
  ): Promise<UploadApiResponse<ChatAnalysisResult>> {
    try {
      const response = await api.post('/upload/analyze-chat', { messages });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to analyze chat'
      };
    }
  }

  // Generate AI response for chat
  async getChatResponse(
    message: string,
    context?: any
  ): Promise<UploadApiResponse<{ response: string; extractedInfo?: any }>> {
    try {
      const response = await api.post('/upload/chat-response', { message, context });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get chat response'
      };
    }
  }

  // Validate form data and get suggestions
  async validateFormData(
    formData: any
  ): Promise<UploadApiResponse<{ valid: boolean; suggestions: string[]; errors: string[] }>> {
    try {
      const response = await api.post('/upload/validate-form', formData);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to validate form data'
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
    try {
      const response = await api.post('/upload/create-proposal', uploadData);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to create proposal from upload'
      };
    }
  }

  // Get upload history
  async getUploadHistory(
    page: number = 1,
    pageSize: number = 10
  ): Promise<UploadApiResponse<{ uploads: any[]; totalCount: number }>> {
    try {
      const response = await api.get(`/upload/history?page=${page}&pageSize=${pageSize}`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch upload history'
      };
    }
  }

  // Delete uploaded file
  async deleteUploadedFile(fileId: string): Promise<UploadApiResponse<{ success: boolean }>> {
    try {
      await api.delete(`/upload/file/${fileId}`);
      return { success: true, data: { success: true } };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to delete file'
      };
    }
  }

  // Get supported file types
  async getSupportedFileTypes(): Promise<UploadApiResponse<{ types: string[]; maxSize: number }>> {
    try {
      const response = await api.get('/upload/supported-types');
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get supported file types'
      };
    }
  }

  // Upload multiple files with chunking support
  async uploadMultipleFiles(
    files: File[],
    onProgress?: (fileId: string, progress: UploadProgress) => void
  ): Promise<UploadApiResponse<FileUploadResult[]>> {
    try {
      const uploadPromises = files.map(file => 
        this.uploadFile(file, onProgress ? (progress) => onProgress(file.name, progress) : undefined)
      );

      const results = await Promise.allSettled(uploadPromises);
      const successfulUploads: FileUploadResult[] = [];
      const errors: string[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.success) {
          successfulUploads.push(result.value.data!);
        } else {
          const error = result.status === 'rejected' 
            ? result.reason 
            : (result.value as UploadApiResponse).error;
          errors.push(`${files[index].name}: ${error}`);
        }
      });

      if (errors.length > 0 && successfulUploads.length === 0) {
        return {
          success: false,
          error: `All uploads failed: ${errors.join(', ')}`
        };
      }

      return { 
        success: true, 
        data: successfulUploads,
        message: errors.length > 0 ? `Some uploads failed: ${errors.join(', ')}` : undefined
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to upload multiple files'
      };
    }
  }

  // Retry failed upload
  async retryUpload(
    file: File,
    originalFileId: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadApiResponse<FileUploadResult>> {
    try {
      return await this.uploadFile(file, onProgress);
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to retry upload'
      };
    }
  }
}

export const uploadApi = new UploadApi();
export default uploadApi;