'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Proposal, ProposalSection } from '@/types/proposal';
import {
  FileText,
  Plus,
  Edit3,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  Type,
  BarChart3,
  Settings,
  Save,
  X,
  ArrowUp,
  ArrowDown,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';

interface SectionManagerProps {
  proposal: Proposal;
  activeSection: string;
  onSectionSelect: (sectionId: string) => void;
  onSectionUpdate: (sectionId: string, content: string) => void;
}

interface SectionStats {
  wordCount: number;
  progress: number;
  estimatedTime: number;
}

export default function SectionManager({
  proposal,
  activeSection,
  onSectionSelect,
  onSectionUpdate
}: SectionManagerProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });
  const [showStats, setShowStats] = useState(true);

  const getSectionStats = (section: ProposalSection): SectionStats => {
    const wordCount = section.content ? section.content.split(/\s+/).filter(word => word.length > 0).length : 0;
    const targetWords = getTargetWordCount(section.type);
    const progress = Math.min((wordCount / targetWords) * 100, 100);
    const estimatedTime = Math.max(0, Math.ceil((targetWords - wordCount) / 50)); // 50 words per minute
    
    return { wordCount, progress, estimatedTime };
  };

  const getTargetWordCount = (sectionType: string): number => {
    const targets = {
      'executive-summary': 200,
      'company-overview': 300,
      'problem-statement': 250,
      'proposed-solution': 500,
      'timeline': 150,
      'budget': 200,
      'team': 300,
      'conclusion': 150
    };
    return targets[sectionType as keyof typeof targets] || 250;
  };

  const getStatusColor = (progress: number) => {
    if (progress === 0) return 'text-gray-400';
    if (progress < 30) return 'text-red-500';
    if (progress < 70) return 'text-orange-500';
    if (progress < 100) return 'text-blue-500';
    return 'text-green-500';
  };

  const getStatusIcon = (progress: number) => {
    if (progress === 0) return <AlertCircle className="h-3 w-3 text-gray-400" />;
    if (progress < 100) return <Clock className="h-3 w-3 text-orange-500" />;
    return <CheckCircle className="h-3 w-3 text-green-500" />;
  };

  const toggleSectionExpanded = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const startEditingSection = (section: ProposalSection) => {
    setEditingSection(section.id);
    setEditForm({
      title: section.title,
      description: section.description
    });
  };

  const saveEditingSection = () => {
    // Here you would typically call an API to update the section metadata
    console.log('Save section edit:', editForm);
    setEditingSection(null);
  };

  const cancelEditingSection = () => {
    setEditingSection(null);
    setEditForm({ title: '', description: '' });
  };

  const duplicateSection = (section: ProposalSection) => {
    // Here you would typically call an API to duplicate the section
    console.log('Duplicate section:', section.id);
  };

  const deleteSection = (sectionId: string) => {
    // Here you would typically call an API to delete the section
    console.log('Delete section:', sectionId);
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    // Here you would typically call an API to reorder sections
    console.log('Move section:', sectionId, direction);
  };

  const addNewSection = () => {
    // Here you would typically open a modal to create a new section
    console.log('Add new section');
  };

  const totalProgress = Math.round(
    proposal.sections.reduce((acc, section) => {
      const stats = getSectionStats(section);
      return acc + stats.progress;
    }, 0) / proposal.sections.length
  );

  const completedSections = proposal.sections.filter(section => 
    getSectionStats(section).progress >= 100
  ).length;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Sections
          </CardTitle>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStats(!showStats)}
            >
              {showStats ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={addNewSection}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Overall Progress */}
        {showStats && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{totalProgress}%</span>
            </div>
            <Progress value={totalProgress} className="h-2" />
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {completedSections}/{proposal.sections.length} Complete
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {proposal.sections.reduce((acc, section) => acc + getSectionStats(section).estimatedTime, 0)}min left
                </span>
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 p-4 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-2">
            <AnimatePresence>
              {proposal.sections.map((section, index) => {
                const stats = getSectionStats(section);
                const isActive = section.id === activeSection;
                const isExpanded = expandedSections.has(section.id);
                const isEditing = editingSection === section.id;

                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`transition-all ${isActive ? 'ring-2 ring-primary/20 bg-primary/5' : 'hover:shadow-md'}`}>
                      <CardContent className="p-3">
                        {/* Section Header */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSectionExpanded(section.id)}
                            className="p-1 h-6 w-6"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
                          </Button>

                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() => onSectionSelect(section.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(stats.progress)}
                                <h4 className={`text-sm font-medium ${isActive ? 'text-primary' : ''}`}>
                                  {section.title}
                                </h4>
                              </div>
                              <div className="flex items-center space-x-1">
                                {showStats && (
                                  <Badge variant="secondary" className="text-xs">
                                    {stats.wordCount}w
                                  </Badge>
                                )}
                                <GripVertical className="h-3 w-3 text-muted-foreground" />
                              </div>
                            </div>

                            {showStats && (
                              <div className="mt-2">
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                  <span>Progress</span>
                                  <span className={getStatusColor(stats.progress)}>
                                    {Math.round(stats.progress)}%
                                  </span>
                                </div>
                                <Progress value={stats.progress} className="h-1" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Expanded Content */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 space-y-3"
                            >
                              <Separator />

                              {/* Edit Form */}
                              {isEditing ? (
                                <div className="space-y-2">
                                  <Input
                                    value={editForm.title}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Section title"
                                    className="text-sm"
                                  />
                                  <Textarea
                                    value={editForm.description}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Section description"
                                    rows={2}
                                    className="text-sm"
                                  />
                                  <div className="flex items-center space-x-1">
                                    <Button
                                      size="sm"
                                      onClick={saveEditingSection}
                                      className="text-xs"
                                    >
                                      <Save className="h-3 w-3 mr-1" />
                                      Save
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={cancelEditingSection}
                                      className="text-xs"
                                    >
                                      <X className="h-3 w-3 mr-1" />
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  {/* Section Info */}
                                  <div className="space-y-2">
                                    <p className="text-xs text-muted-foreground">
                                      {section.description}
                                    </p>
                                    
                                    {showStats && (
                                      <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="flex items-center space-x-1">
                                          <Type className="h-3 w-3 text-muted-foreground" />
                                          <span>
                                            {stats.wordCount}/{getTargetWordCount(section.type)} words
                                          </span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <Clock className="h-3 w-3 text-muted-foreground" />
                                          <span>
                                            {stats.estimatedTime}min left
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Section Actions */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => startEditingSection(section)}
                                        className="text-xs h-6"
                                      >
                                        <Edit3 className="h-3 w-3 mr-1" />
                                        Edit
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => duplicateSection(section)}
                                        className="text-xs h-6"
                                      >
                                        <Copy className="h-3 w-3 mr-1" />
                                        Copy
                                      </Button>
                                    </div>

                                    <div className="flex items-center space-x-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => moveSection(section.id, 'up')}
                                        disabled={index === 0}
                                        className="h-6 w-6 p-0"
                                      >
                                        <ArrowUp className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => moveSection(section.id, 'down')}
                                        disabled={index === proposal.sections.length - 1}
                                        className="h-6 w-6 p-0"
                                      >
                                        <ArrowDown className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteSection(section.id)}
                                        className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Add Section Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: proposal.sections.length * 0.05 + 0.2 }}
            className="mt-4"
          >
            <Button
              variant="dashed"
              onClick={addNewSection}
              className="w-full py-6 border-2 border-dashed border-muted-foreground/25 hover:border-primary/50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Section
            </Button>
          </motion.div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}