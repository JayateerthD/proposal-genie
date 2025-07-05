'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Proposal, ProposalSection } from '@/types/proposal';
import { aiService } from '@/lib/services';
import {
  Brain,
  Send,
  Sparkles,
  Copy,
  Check,
  Loader2,
  MessageSquare,
  Target,
  Lightbulb,
  Zap,
  FileText,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  ChevronDown,
  ChevronRight,
  Plus,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  X
} from 'lucide-react';

interface AISidebarProps {
  proposal: Proposal;
  activeSection?: ProposalSection;
  onContentSuggestion: (content: string) => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  feedback?: 'positive' | 'negative';
}

interface ContentSuggestion {
  id: string;
  title: string;
  content: string;
  type: 'improvement' | 'expansion' | 'alternative';
  confidence: number;
}

const quickPrompts = [
  {
    id: 'improve',
    title: 'Improve Section',
    prompt: 'How can I improve this section to be more compelling and professional?',
    icon: TrendingUp,
    color: 'bg-blue-500'
  },
  {
    id: 'expand',
    title: 'Add Details',
    prompt: 'Expand this section with more specific details and examples.',
    icon: Plus,
    color: 'bg-green-500'
  },
  {
    id: 'shorten',
    title: 'Make Concise',
    prompt: 'Make this section more concise while keeping the key points.',
    icon: Target,
    color: 'bg-orange-500'
  },
  {
    id: 'rewrite',
    title: 'Rewrite Tone',
    prompt: 'Rewrite this section with a more professional and persuasive tone.',
    icon: RefreshCw,
    color: 'bg-purple-500'
  }
];

const aiCapabilities = [
  {
    title: 'Content Enhancement',
    description: 'Improve writing quality and persuasiveness',
    icon: Sparkles
  },
  {
    title: 'Section Analysis',
    description: 'Get feedback on completeness and structure',
    icon: Target
  },
  {
    title: 'Competitive Edge',
    description: 'Suggestions to stand out from competitors',
    icon: TrendingUp
  },
  {
    title: 'Stakeholder Focus',
    description: 'Tailor content for specific audiences',
    icon: Users
  }
];

export default function AISidebar({
  proposal,
  activeSection,
  onContentSuggestion
}: AISidebarProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
  const [copiedSuggestion, setCopiedSuggestion] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'suggestions' | 'analysis'>('chat');

  // Auto-generate suggestions when section changes
  useEffect(() => {
    if (activeSection && activeSection.content) {
      generateSuggestions();
    }
  }, [activeSection?.content]);

  const generateSuggestions = async () => {
    if (!activeSection?.content) return;

    setLoading(true);
    try {
      const response = await aiService.generateContentSuggestions({
        sectionType: activeSection.type,
        currentContent: activeSection.content,
        proposalContext: {
          title: proposal.title,
          clientName: proposal.clientName,
          industry: proposal.tags[0] || 'general'
        }
      });

      if (response.success && response.data) {
        setSuggestions(response.data.suggestions || []);
      }
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: userInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setLoading(true);

    try {
      const response = await aiService.chatWithAI({
        message: userInput,
        context: {
          proposal: {
            title: proposal.title,
            clientName: proposal.clientName,
            sections: proposal.sections.map(s => ({
              title: s.title,
              type: s.type,
              hasContent: !!s.content
            }))
          },
          activeSection: activeSection ? {
            title: activeSection.title,
            type: activeSection.type,
            content: activeSection.content
          } : undefined
        }
      });

      if (response.success && response.data) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: response.data.message,
          timestamp: new Date(),
          suggestions: response.data.suggestions
        };

        setChatMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const useQuickPrompt = (prompt: string) => {
    setUserInput(prompt);
  };

  const copySuggestion = async (content: string, suggestionId: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedSuggestion(suggestionId);
    setTimeout(() => setCopiedSuggestion(null), 2000);
  };

  const applySuggestion = (content: string) => {
    onContentSuggestion(content);
  };

  const provideFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setChatMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, feedback }
          : msg
      )
    );
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Assistant</CardTitle>
              <p className="text-xs text-muted-foreground">
                {activeSection ? `Working on: ${activeSection.title}` : 'Select a section to get started'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg mt-4">
          {[
            { id: 'chat', label: 'Chat', icon: MessageSquare },
            { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
            { id: 'analysis', label: 'Analysis', icon: Target }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab.id as any)}
                className="flex-1 text-xs"
              >
                <Icon className="h-3 w-3 mr-1" />
                {tab.label}
              </Button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 space-y-4">
        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <>
            {/* Quick Prompts */}
            {activeSection && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-1">
                  {quickPrompts.map(prompt => {
                    const Icon = prompt.icon;
                    return (
                      <Button
                        key={prompt.id}
                        variant="outline"
                        size="sm"
                        onClick={() => useQuickPrompt(prompt.prompt)}
                        className="text-xs h-8 p-1"
                      >
                        <Icon className="h-3 w-3 mr-1" />
                        {prompt.title}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Chat Messages */}
            <div className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-3">
                  {chatMessages.length === 0 && !activeSection && (
                    <div className="text-center py-8">
                      <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Select a section to start getting AI assistance
                      </p>
                    </div>
                  )}

                  {chatMessages.length === 0 && activeSection && (
                    <div className="space-y-3">
                      <div className="text-center py-4">
                        <Sparkles className="h-6 w-6 text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium">Ready to help!</p>
                        <p className="text-xs text-muted-foreground">
                          Ask me anything about improving your proposal
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">What I can do:</p>
                        {aiCapabilities.map(capability => {
                          const Icon = capability.icon;
                          return (
                            <div key={capability.title} className="flex items-start space-x-2 text-xs">
                              <Icon className="h-3 w-3 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="font-medium">{capability.title}</p>
                                <p className="text-muted-foreground">{capability.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <AnimatePresence>
                    {chatMessages.map(message => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] ${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-2`}>
                          <p className="text-xs whitespace-pre-wrap">{message.content}</p>
                          
                          {message.suggestions && (
                            <div className="mt-2 space-y-1">
                              {message.suggestions.map((suggestion, idx) => (
                                <Button
                                  key={idx}
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => applySuggestion(suggestion)}
                                  className="w-full text-xs justify-start"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Apply suggestion
                                </Button>
                              ))}
                            </div>
                          )}

                          {message.type === 'ai' && (
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => provideFeedback(message.id, 'positive')}
                                  className={`h-6 w-6 p-0 ${message.feedback === 'positive' ? 'bg-green-100 text-green-600' : ''}`}
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => provideFeedback(message.id, 'negative')}
                                  className={`h-6 w-6 p-0 ${message.feedback === 'negative' ? 'bg-red-100 text-red-600' : ''}`}
                                >
                                  <ThumbsDown className="h-3 w-3" />
                                </Button>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {message.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {loading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-muted rounded-lg p-2">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span className="text-xs">AI is thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <div className="flex space-x-2 mt-3">
                <Input
                  placeholder="Ask AI about your proposal..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  className="text-xs"
                  disabled={loading || !activeSection}
                />
                <Button
                  size="sm"
                  onClick={sendMessage}
                  disabled={!userInput.trim() || loading || !activeSection}
                >
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Suggestions Tab */}
        {activeTab === 'suggestions' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Content Suggestions</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={generateSuggestions}
                disabled={loading || !activeSection?.content}
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {!activeSection && (
              <div className="text-center py-8">
                <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Select a section to see suggestions
                </p>
              </div>
            )}

            {activeSection && !activeSection.content && (
              <div className="text-center py-8">
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Add some content to get AI suggestions
                </p>
              </div>
            )}

            {suggestions.length > 0 && (
              <ScrollArea className="flex-1">
                <div className="space-y-3">
                  {suggestions.map(suggestion => (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="border-l-4 border-l-primary/20">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-medium">{suggestion.title}</h5>
                            <Badge variant="secondary" className="text-xs">
                              {suggestion.confidence}% match
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
                            {suggestion.content}
                          </p>
                          
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copySuggestion(suggestion.content, suggestion.id)}
                              className="text-xs"
                            >
                              {copiedSuggestion === suggestion.id ? (
                                <>
                                  <Check className="h-3 w-3 mr-1" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3 mr-1" />
                                  Copy
                                </>
                              )}
                            </Button>
                            
                            <Button
                              size="sm"
                              onClick={() => applySuggestion(suggestion.content)}
                              className="text-xs"
                            >
                              <Zap className="h-3 w-3 mr-1" />
                              Apply
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Section Analysis</h4>
            
            {!activeSection ? (
              <div className="text-center py-8">
                <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Select a section to analyze
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Content Metrics */}
                <Card>
                  <CardContent className="p-3">
                    <h5 className="text-sm font-medium mb-2">Content Metrics</h5>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Word Count:</span>
                        <span className="ml-1 font-medium">
                          {activeSection.content ? activeSection.content.split(/\s+/).length : 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={activeSection.content ? 'default' : 'secondary'} className="ml-1 text-xs">
                          {activeSection.content ? 'Draft' : 'Empty'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardContent className="p-3">
                    <h5 className="text-sm font-medium mb-2">Recommendations</h5>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start space-x-2">
                        <Lightbulb className="h-3 w-3 text-yellow-500 mt-0.5" />
                        <span>Consider adding specific metrics and data points</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Target className="h-3 w-3 text-blue-500 mt-0.5" />
                        <span>Focus on client benefits and value proposition</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Users className="h-3 w-3 text-green-500 mt-0.5" />
                        <span>Include stakeholder-specific language</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Completion Status */}
                <Card>
                  <CardContent className="p-3">
                    <h5 className="text-sm font-medium mb-2">Section Progress</h5>
                    <div className="space-y-2">
                      {proposal.sections.map(section => (
                        <div key={section.id} className="flex items-center justify-between text-xs">
                          <span className={section.id === activeSection.id ? 'font-medium' : ''}>
                            {section.title}
                          </span>
                          <Badge
                            variant={section.content ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {section.content ? 'Done' : 'Todo'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}