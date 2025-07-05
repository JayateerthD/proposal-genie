import { create } from 'zustand';
import { 
  UploadFile, 
  UploadProgress, 
  ChatMessage, 
  QuickFormData, 
  UploadMethod, 
  UploadConfig 
} from '@/types/upload';

interface UploadState {
  // Upload files
  files: UploadFile[];
  currentFile: UploadFile | null;
  
  // Upload methods
  activeMethod: 'file' | 'chat' | 'form';
  availableMethods: UploadMethod[];
  
  // Chat state
  chatMessages: ChatMessage[];
  chatLoading: boolean;
  
  // Form state
  formData: QuickFormData | null;
  formValid: boolean;
  
  // Progress tracking
  totalProgress: number;
  overallStatus: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  
  // Configuration
  config: UploadConfig;
  
  // UI state
  dragActive: boolean;
  modalOpen: boolean;
  
  // Error handling
  errors: string[];
  
  // Actions
  setActiveMethod: (method: 'file' | 'chat' | 'form') => void;
  setModalOpen: (open: boolean) => void;
  setDragActive: (active: boolean) => void;
  
  // File upload actions
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  updateFileProgress: (id: string, progress: UploadProgress) => void;
  setFileError: (id: string, error: string) => void;
  setFileCompleted: (id: string, data: { uploadedUrl: string; extractedText?: string; aiAnalysis?: any }) => void;
  
  // Chat actions
  addChatMessage: (message: Omit<ChatMessage, 'id'>) => void;
  setChatLoading: (loading: boolean) => void;
  clearChat: () => void;
  
  // Form actions
  setFormData: (data: Partial<QuickFormData>) => void;
  setFormValid: (valid: boolean) => void;
  clearForm: () => void;
  
  // Progress actions
  updateTotalProgress: () => void;
  setOverallStatus: (status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error') => void;
  
  // Error actions
  addError: (error: string) => void;
  removeError: (error: string) => void;
  clearErrors: () => void;
  
  // Utility actions
  resetUpload: () => void;
  canUpload: () => boolean;
  validateFiles: (files: File[]) => { valid: File[]; invalid: { file: File; reason: string }[] };
  
  // Computed values
  getFilesByStatus: (status: UploadFile['status']) => UploadFile[];
  getCompletedFiles: () => UploadFile[];
  hasErrors: () => boolean;
  isUploading: () => boolean;
}

const defaultConfig: UploadConfig = {
  validation: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/rtf'
    ],
    maxFiles: 5
  },
  endpoints: {
    upload: '/api/upload',
    process: '/api/process',
    analyze: '/api/analyze'
  },
  chunkSize: 1024 * 1024, // 1MB chunks
  retryAttempts: 3
};

const defaultMethods: UploadMethod[] = [
  {
    id: 'file',
    title: 'Upload RFP',
    description: 'Upload PDF, Word, or text files',
    icon: 'Upload',
    active: true
  },
  {
    id: 'chat',
    title: 'Chat Requirements',
    description: 'Describe your project conversationally',
    icon: 'MessageSquare',
    active: true
  },
  {
    id: 'form',
    title: 'Quick Form',
    description: 'Fill out a structured form',
    icon: 'FileText',
    active: true
  }
];

export const useUploadStore = create<UploadState>((set, get) => ({
  // Initial state
  files: [],
  currentFile: null,
  activeMethod: 'file',
  availableMethods: defaultMethods,
  chatMessages: [],
  chatLoading: false,
  formData: null,
  formValid: false,
  totalProgress: 0,
  overallStatus: 'idle',
  config: defaultConfig,
  dragActive: false,
  modalOpen: false,
  errors: [],
  
  // Basic actions
  setActiveMethod: (method) => set({ activeMethod: method }),
  setModalOpen: (open) => set({ modalOpen: open }),
  setDragActive: (active) => set({ dragActive: active }),
  
  // File upload actions
  addFiles: (newFiles) => {
    const { valid, invalid } = get().validateFiles(newFiles);
    
    // Add errors for invalid files
    invalid.forEach(({ file, reason }) => {
      get().addError(`${file.name}: ${reason}`);
    });
    
    // Add valid files
    if (valid.length > 0) {
      const uploadFiles: UploadFile[] = valid.map(file => ({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        progress: 0,
        status: 'pending'
      }));
      
      set((state) => ({
        files: [...state.files, ...uploadFiles],
        overallStatus: 'uploading'
      }));
    }
  },
  
  removeFile: (id) => set((state) => ({
    files: state.files.filter(file => file.id !== id),
    currentFile: state.currentFile?.id === id ? null : state.currentFile
  })),
  
  clearFiles: () => set({ files: [], currentFile: null }),
  
  updateFileProgress: (id, progress) => set((state) => ({
    files: state.files.map(file =>
      file.id === id
        ? { ...file, progress: progress.progress, status: progress.stage as any }
        : file
    )
  })),
  
  setFileError: (id, error) => set((state) => ({
    files: state.files.map(file =>
      file.id === id
        ? { ...file, status: 'error', error }
        : file
    )
  })),
  
  setFileCompleted: (id, data) => set((state) => ({
    files: state.files.map(file =>
      file.id === id
        ? { 
            ...file, 
            status: 'completed', 
            progress: 100,
            uploadedUrl: data.uploadedUrl,
            extractedText: data.extractedText,
            aiAnalysis: data.aiAnalysis
          }
        : file
    )
  })),
  
  // Chat actions
  addChatMessage: (messageData) => {
    const id = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const message: ChatMessage = { ...messageData, id };
    
    set((state) => ({
      chatMessages: [...state.chatMessages, message]
    }));
  },
  
  setChatLoading: (loading) => set({ chatLoading: loading }),
  clearChat: () => set({ chatMessages: [] }),
  
  // Form actions
  setFormData: (data) => set((state) => ({
    formData: state.formData ? { ...state.formData, ...data } : data as QuickFormData
  })),
  
  setFormValid: (valid) => set({ formValid: valid }),
  clearForm: () => set({ formData: null, formValid: false }),
  
  // Progress actions
  updateTotalProgress: () => {
    const { files } = get();
    if (files.length === 0) {
      set({ totalProgress: 0 });
      return;
    }
    
    const totalProgress = files.reduce((sum, file) => sum + file.progress, 0);
    const averageProgress = totalProgress / files.length;
    
    set({ totalProgress: averageProgress });
  },
  
  setOverallStatus: (status) => set({ overallStatus: status }),
  
  // Error actions
  addError: (error) => set((state) => ({
    errors: [...state.errors, error]
  })),
  
  removeError: (error) => set((state) => ({
    errors: state.errors.filter(e => e !== error)
  })),
  
  clearErrors: () => set({ errors: [] }),
  
  // Utility actions
  resetUpload: () => set({
    files: [],
    currentFile: null,
    chatMessages: [],
    chatLoading: false,
    formData: null,
    formValid: false,
    totalProgress: 0,
    overallStatus: 'idle',
    dragActive: false,
    errors: []
  }),
  
  canUpload: () => {
    const { files, config } = get();
    return files.length < config.validation.maxFiles;
  },
  
  validateFiles: (files) => {
    const { config } = get();
    const { validation } = config;
    const valid: File[] = [];
    const invalid: { file: File; reason: string }[] = [];
    
    files.forEach(file => {
      // Check file size
      if (file.size > validation.maxSize) {
        invalid.push({
          file,
          reason: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (${(validation.maxSize / 1024 / 1024).toFixed(2)}MB)`
        });
        return;
      }
      
      // Check file type
      if (!validation.allowedTypes.includes(file.type)) {
        invalid.push({
          file,
          reason: `File type "${file.type}" is not supported`
        });
        return;
      }
      
      valid.push(file);
    });
    
    // Check total file count
    const currentFileCount = get().files.length;
    const wouldExceedLimit = currentFileCount + valid.length > validation.maxFiles;
    
    if (wouldExceedLimit) {
      const allowedCount = validation.maxFiles - currentFileCount;
      const exceededFiles = valid.splice(allowedCount);
      
      exceededFiles.forEach(file => {
        invalid.push({
          file,
          reason: `Would exceed maximum file limit of ${validation.maxFiles}`
        });
      });
    }
    
    return { valid, invalid };
  },
  
  // Computed values
  getFilesByStatus: (status) => {
    return get().files.filter(file => file.status === status);
  },
  
  getCompletedFiles: () => {
    return get().files.filter(file => file.status === 'completed');
  },
  
  hasErrors: () => {
    const { errors, files } = get();
    return errors.length > 0 || files.some(file => file.status === 'error');
  },
  
  isUploading: () => {
    const { overallStatus } = get();
    return overallStatus === 'uploading' || overallStatus === 'processing';
  }
}));