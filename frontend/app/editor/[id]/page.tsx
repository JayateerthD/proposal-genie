'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useProposalStore } from '@/stores/proposalStore';
import { proposalService } from '@/lib/services';
import { Proposal } from '@/types/proposal';
import ProposalEditor from '@/components/editor/ProposalEditor';
import AISidebar from '@/components/editor/AISidebar';
import SectionManager from '@/components/editor/SectionManager';
import {
  FileText,
  Share2,
  Download,
  Eye,
  Settings,
  Users,
  Clock,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Save,
  Loader2,
  ArrowLeft,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react';

export default function EditorPage() {
  const params = useParams();
  const proposalId = params.id as string;

  const { currentProposal, setCurrentProposal, loading, setLoading, error, setError } = useProposalStore();
  const [activeSection, setActiveSection] = useState<string>('');
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);
  const [sectionManagerOpen, setSectionManagerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (proposalId) {
      loadProposal(proposalId);
    }
  }, [proposalId]);

  useEffect(() => {
    if (currentProposal?.sections && currentProposal.sections.length > 0 && !activeSection) {
      setActiveSection(currentProposal.sections[0].id);
    }
  }, [currentProposal, activeSection]);

  const loadProposal = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await proposalService.getProposal(id);

      if (response.success && response.data) {
        setCurrentProposal(response.data);
      } else {
        setError(response.error || 'Failed to load proposal');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load proposal');
    } finally {
      setLoading(false);
    }
  };

  const handleSectionContentChange = async (sectionId: string, content: string) => {
    if (!currentProposal) return;

    // Update local state immediately
    const updatedProposal = {
      ...currentProposal,
      sections: currentProposal.sections.map(section =>
        section.id === sectionId
          ? { ...section, content, wordCount: content.split(/\s+/).length }
          : section
      ),
      updatedAt: new Date()
    };

    setCurrentProposal(updatedProposal);

    // Debounced save to backend
    setSaving(true);
    try {
      await proposalService.updateProposalSection(currentProposal.id, sectionId, content);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save section:', error);
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (statusId: string) => {
    switch (statusId) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-purple-100 text-purple-800';
      case 'won': return 'bg-emerald-100 text-emerald-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWinProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-green-600';
    if (probability >= 60) return 'text-blue-600';
    if (probability >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading proposal...</p>
        </div>
      </div>
    );
  }

  if (error || !currentProposal) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Error: {error || 'Proposal not found'}</p>
          <div className="flex items-center space-x-2 justify-center">
            <Button onClick={() => loadProposal(proposalId)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/proposals'}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Proposals
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const activeSection_data = currentProposal?.sections?.find(s => s.id === activeSection);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/proposals'}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <div>
              <h1 className="text-lg font-semibold truncate max-w-[300px]">
                {currentProposal.title}
              </h1>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{currentProposal.clientName}</span>
                <span>•</span>
                <Badge className={getStatusColor(currentProposal.status.id)}>
                  {currentProposal.status.name}
                </Badge>
              </div>
            </div>
          </div>

          {/* Center Section - Save Status */}
          <div className="flex items-center space-x-2">
            {saving ? (
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </div>
            ) : lastSaved ? (
              <div className="flex items-center text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Saved {formatTimeAgo(lastSaved)}
              </div>
            ) : null}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSectionManagerOpen(!sectionManagerOpen)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Sections
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setAiSidebarOpen(!aiSidebarOpen)}
            >
              <Target className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/preview/${proposalId}`, '_blank')}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>

            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>

            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Section Manager */}
          {sectionManagerOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="col-span-3"
            >
              <SectionManager
                proposal={currentProposal}
                activeSection={activeSection}
                onSectionSelect={setActiveSection}
                onSectionUpdate={handleSectionContentChange}
              />
            </motion.div>
          )}

          {/* Main Editor */}
          <div className={`${sectionManagerOpen && aiSidebarOpen ? 'col-span-6' : sectionManagerOpen || aiSidebarOpen ? 'col-span-9' : 'col-span-12'}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Proposal Info Card */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Win Probability</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Progress value={currentProposal.winProbability} className="flex-1 h-2" />
                        <span className={`text-lg font-bold ${getWinProbabilityColor(currentProposal.winProbability)}`}>
                          {currentProposal.winProbability}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Last Updated</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatTimeAgo(new Date(currentProposal.updatedAt))}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Collaborators</span>
                      </div>
                      <div className="flex -space-x-2">
                        {currentProposal.collaborators.slice(0, 4).map(collab => (
                          <Avatar key={collab.userId} className="w-6 h-6 border-2 border-background">
                            <AvatarImage src={collab.user.avatar} />
                            <AvatarFallback className="text-xs">
                              {collab.user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {currentProposal.collaborators.length > 4 && (
                          <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                            <span className="text-xs">+{currentProposal.collaborators.length - 4}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Editor */}
              <ProposalEditor
                proposal={currentProposal}
                activeSection={activeSection_data}
                onContentChange={handleSectionContentChange}
                onSectionSelect={setActiveSection}
              />
            </motion.div>
          </div>

          {/* Right Sidebar - AI Assistant */}
          {aiSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="col-span-3"
            >
              <AISidebar
                proposal={currentProposal}
                activeSection={activeSection_data}
                onContentSuggestion={(content) => {
                  if (activeSection_data) {
                    handleSectionContentChange(activeSection_data.id, content);
                  }
                }}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}