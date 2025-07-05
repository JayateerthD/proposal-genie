'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useUploadStore } from '@/stores/uploadStore';
import { useUIStore } from '@/stores/uiStore';
import { Upload, MessageSquare, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import FileUpload from './FileUpload';
import ChatInput from './ChatInput';
import QuickForm from './QuickForm';

const methodIcons = {
  file: Upload,
  chat: MessageSquare,
  form: FileText
};

export default function UploadModal() {
  const { currentModal, closeModal } = useUIStore();
  const {
    activeMethod,
    setActiveMethod,
    resetUpload,
    overallStatus,
    totalProgress,
    hasErrors,
    isUploading
  } = useUploadStore();

  const isOpen = currentModal?.type === 'upload';

  useEffect(() => {
    if (isOpen && currentModal?.data?.activeMethod) {
      setActiveMethod(currentModal.data.activeMethod);
    }
  }, [isOpen, currentModal, setActiveMethod]);

  const handleClose = () => {
    if (!isUploading()) {
      resetUpload();
      closeModal();
    }
  };

  const methods = [
    {
      id: 'file' as const,
      title: 'Upload Files',
      description: 'Upload PDF, Word, or text documents',
      icon: Upload
    },
    {
      id: 'chat' as const,
      title: 'Chat Description',
      description: 'Describe your project conversationally',
      icon: MessageSquare
    },
    {
      id: 'form' as const,
      title: 'Quick Form',
      description: 'Fill out a structured form',
      icon: FileText
    }
  ];

  const getStatusColor = () => {
    switch (overallStatus) {
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'uploading':
      case 'processing':
        return 'bg-blue-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusIcon = () => {
    switch (overallStatus) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const renderActiveMethod = () => {
    switch (activeMethod) {
      case 'file':
        return <FileUpload />;
      case 'chat':
        return <ChatInput />;
      case 'form':
        return <QuickForm />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              {currentModal?.title || 'Create New Proposal'}
            </DialogTitle>
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              {isUploading() && (
                <Badge variant="secondary" className="animate-pulse">
                  Processing...
                </Badge>
              )}
            </div>
          </div>
          
          {/* Progress bar for uploads */}
          {isUploading() && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>Overall Progress</span>
                <span>{Math.round(totalProgress)}%</span>
              </div>
              <Progress value={totalProgress} className="h-2" />
            </div>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {/* Method Selection */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {methods.map((method) => {
              const Icon = method.icon;
              const isActive = activeMethod === method.id;
              
              return (
                <motion.div
                  key={method.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`cursor-pointer transition-all ${
                      isActive
                        ? 'ring-2 ring-primary bg-primary/5'
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => !isUploading() && setActiveMethod(method.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <Icon className={`h-6 w-6 mx-auto mb-2 ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                      <h3 className={`font-medium text-sm ${
                        isActive ? 'text-primary' : 'text-foreground'
                      }`}>
                        {method.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {method.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Active Method Content */}
          <div className="flex-1 overflow-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMethod}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {renderActiveMethod()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            {hasErrors() && (
              <Badge variant="destructive" className="text-xs">
                {hasErrors() ? 'Errors detected' : ''}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isUploading()}
            >
              {isUploading() ? 'Processing...' : 'Cancel'}
            </Button>
            
            {overallStatus === 'completed' && (
              <Button onClick={() => {
                // Navigate to the editor or create proposal
                closeModal();
              }}>
                Create Proposal
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}