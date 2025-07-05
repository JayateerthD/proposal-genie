'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useUploadStore } from '@/stores/uploadStore';
import { uploadService } from '@/lib/services';
import {
  Upload,
  File,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  RotateCcw,
  Eye
} from 'lucide-react';

export default function FileUpload() {
  const {
    files,
    addFiles,
    removeFile,
    updateFileProgress,
    setFileError,
    setFileCompleted,
    canUpload,
    dragActive,
    setDragActive
  } = useUploadStore();

  const [processing, setProcessing] = useState<Set<string>>(new Set());

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    addFiles(acceptedFiles);

    // Process each file
    for (const file of acceptedFiles) {
      await processFile(file);
    }
  }, [addFiles]);

  const processFile = async (file: File) => {
    const fileId = files.find(f => f.file.name === file.name)?.id;
    if (!fileId) return;

    setProcessing(prev => new Set(prev).add(fileId));

    try {
      // Upload the file
      const uploadResult = await uploadService.uploadFile(file, (progress) => {
        updateFileProgress(fileId, progress);
      });

      if (!uploadResult.success || !uploadResult.data) {
        throw new Error(uploadResult.error || 'Upload failed');
      }

      // Process the uploaded file
      const processResult = await uploadService.processFile(uploadResult.data.id, (progress) => {
        updateFileProgress(fileId, progress);
      });

      if (!processResult.success || !processResult.data) {
        throw new Error(processResult.error || 'Processing failed');
      }

      // Mark as completed
      setFileCompleted(fileId, {
        uploadedUrl: processResult.data.url,
        extractedText: processResult.data.extractedText,
        aiAnalysis: processResult.data.aiAnalysis
      });

    } catch (error: any) {
      setFileError(fileId, error.message || 'Upload failed');
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const retryFile = async (fileId: string) => {
    const uploadFile = files.find(f => f.id === fileId);
    if (!uploadFile) return;

    await processFile(uploadFile.file);
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject
  } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/rtf': ['.rtf']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: !canUpload(),
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
    onDropRejected: () => setDragActive(false)
  });

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <File className="h-5 w-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'txt':
      case 'rtf':
        return <FileText className="h-5 w-5 text-gray-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'uploading':
      case 'processing':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <Card>
        <CardContent className="p-2">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
              ${isDragReject ? 'border-red-500 bg-red-50' : ''}
              ${!canUpload() ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5'}
            `}
          >
            <input {...getInputProps()} />

            <motion.div
              animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
              className="space-y-4"
            >
              <Upload className={`h-12 w-12 mx-auto ${isDragActive ? 'text-primary' : 'text-muted-foreground'
                }`} />

              <div>
                <h3 className="text-lg font-medium">
                  {isDragActive ? 'Drop files here' : 'Upload your RFP documents'}
                </h3>
                <p className="text-muted-foreground mt-2">
                  Drag & drop files here, or click to browse
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Supports PDF, Word, and text files up to 10MB
                </p>
              </div>

              {!canUpload() && (
                <Badge variant="secondary">
                  Maximum file limit reached
                </Badge>
              )}
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-4">Uploaded Files</h4>
            <div className="space-y-3">
              <AnimatePresence>
                {files.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg"
                  >
                    {getFileIcon(file.file.name)}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">
                          {file.file.name}
                        </p>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(file.status)}
                          <span className={`text-xs ${getStatusColor(file.status)}`}>
                            {file.status === 'pending' && 'Pending'}
                            {file.status === 'uploading' && 'Uploading...'}
                            {file.status === 'processing' && 'Processing...'}
                            {file.status === 'completed' && 'Completed'}
                            {file.status === 'error' && 'Error'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-muted-foreground">
                          {(file.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>

                        {(file.status === 'uploading' || file.status === 'processing') && (
                          <div className="flex-1 mx-4">
                            <Progress value={file.progress} className="h-1" />
                          </div>
                        )}
                      </div>

                      {file.error && (
                        <p className="text-xs text-red-600 mt-1">
                          Error: {file.error}
                        </p>
                      )}

                      {file.status === 'completed' && file.extractedText && (
                        <div className="mt-2 p-2 bg-background rounded text-xs">
                          <p className="font-medium text-green-600 mb-1">Extracted Content:</p>
                          <p className="text-muted-foreground line-clamp-2">
                            {file.extractedText.substring(0, 150)}...
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-1">
                      {file.status === 'completed' && file.extractedText && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // Open preview modal
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}

                      {file.status === 'error' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => retryFile(file.id)}
                          disabled={processing.has(file.id)}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        disabled={file.status === 'uploading' || file.status === 'processing'}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}