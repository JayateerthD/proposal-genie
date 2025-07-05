'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useUploadStore } from '@/stores/uploadStore';
import { uploadService } from '@/lib/services';
import {
  Send,
  Bot,
  User,
  Loader2,
  Lightbulb,
  CheckCircle
} from 'lucide-react';

export default function ChatInput() {
  const {
    chatMessages,
    chatLoading,
    addChatMessage,
    setChatLoading,
    setFormData
  } = useUploadStore();

  const [currentMessage, setCurrentMessage] = useState('');
  const [extractedInfo, setExtractedInfo] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    // Start with a welcome message if no messages exist
    if (chatMessages.length === 0) {
      addChatMessage({
        type: 'ai',
        content: "Hi! I'm here to help you create a winning proposal. Let's start by talking about your project. What kind of proposal are you working on?",
        timestamp: new Date()
      });
    }
  }, [chatMessages.length, addChatMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || chatLoading) return;

    const userMessage = currentMessage.trim();
    setCurrentMessage('');

    // Add user message
    addChatMessage({
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    });

    setChatLoading(true);

    try {
      // Get AI response
      const response = await uploadService.getChatResponse(userMessage, {
        previousMessages: chatMessages,
        extractedInfo
      });

      if (response.success && response.data) {
        // Add AI response
        addChatMessage({
          type: 'ai',
          content: response.data.response,
          timestamp: new Date(),
          metadata: {
            extractedInfo: response.data.extractedInfo,
            suggestions: response.data.suggestions
          }
        });

        // Update extracted info
        if (response.data.extractedInfo) {
          const newInfo = { ...extractedInfo, ...response.data.extractedInfo };
          setExtractedInfo(newInfo);
          
          // Update form data in store
          setFormData({
            projectTitle: newInfo.projectTitle || '',
            clientName: newInfo.clientName || '',
            projectDescription: newInfo.projectDescription || '',
            requirements: newInfo.requirements || [],
            industryType: newInfo.industryType,
            projectType: newInfo.projectType,
            deadline: newInfo.deadline ? new Date(newInfo.deadline) : undefined,
            budget: newInfo.budget ? {
              min: newInfo.budget.min || 0,
              max: newInfo.budget.max || 0,
              currency: newInfo.budget.currency || 'USD'
            } : undefined
          });
        }
      } else {
        throw new Error(response.error || 'Failed to get AI response');
      }
    } catch (error: any) {
      addChatMessage({
        type: 'ai',
        content: "I'm sorry, I encountered an error. Could you please try rephrasing your message?",
        timestamp: new Date()
      });
    } finally {
      setChatLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "I need to respond to an RFP for a software development project",
    "Help me create a proposal for a marketing campaign",
    "I'm bidding on a construction project",
    "I need to propose a consulting engagement"
  ];

  const isInfoComplete = extractedInfo && 
    extractedInfo.projectTitle && 
    extractedInfo.clientName && 
    extractedInfo.requirements?.length > 0;

  return (
    <div className="flex flex-col h-[500px]">
      {/* Chat Messages */}
      <Card className="flex-1 mb-4">
        <CardContent className="p-4 h-full overflow-y-auto">
          <div className="space-y-4">
            <AnimatePresence>
              {chatMessages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : 'order-2'}`}>
                    <div className={`flex items-start space-x-2 ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      
                      <div className={`rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        
                        {message.metadata?.suggestions && (
                          <div className="mt-2 space-y-1">
                            {message.metadata.suggestions.map((suggestion: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs mr-1">
                                <Lightbulb className="h-3 w-3 mr-1" />
                                {suggestion}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className={`text-xs text-muted-foreground mt-1 ${
                      message.type === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Loading indicator */}
            {chatLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Extracted Information Summary */}
      {extractedInfo && Object.keys(extractedInfo).length > 0 && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-sm">Extracted Information</h4>
              {isInfoComplete && (
                <Badge variant="default" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Ready to create proposal
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              {extractedInfo.projectTitle && (
                <div>
                  <p className="text-muted-foreground">Project Title</p>
                  <p className="font-medium">{extractedInfo.projectTitle}</p>
                </div>
              )}
              
              {extractedInfo.clientName && (
                <div>
                  <p className="text-muted-foreground">Client</p>
                  <p className="font-medium">{extractedInfo.clientName}</p>
                </div>
              )}
              
              {extractedInfo.timeline && (
                <div>
                  <p className="text-muted-foreground">Timeline</p>
                  <p className="font-medium">{extractedInfo.timeline}</p>
                </div>
              )}
              
              {extractedInfo.budget && (
                <div>
                  <p className="text-muted-foreground">Budget</p>
                  <p className="font-medium">{extractedInfo.budget}</p>
                </div>
              )}
            </div>
            
            {extractedInfo.requirements && extractedInfo.requirements.length > 0 && (
              <div className="mt-3">
                <p className="text-muted-foreground text-sm">Key Requirements</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {extractedInfo.requirements.slice(0, 3).map((req: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                  {extractedInfo.requirements.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{extractedInfo.requirements.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Suggested Questions (only show if no messages yet) */}
      {chatMessages.length <= 1 && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <h4 className="font-medium text-sm mb-3">Quick Start</h4>
            <div className="grid grid-cols-2 gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto p-2 text-left justify-start"
                  onClick={() => setCurrentMessage(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message Input */}
      <div className="flex space-x-2">
        <Input
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Describe your project, requirements, timeline..."
          disabled={chatLoading}
          className="flex-1"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!currentMessage.trim() || chatLoading}
          size="sm"
        >
          {chatLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}