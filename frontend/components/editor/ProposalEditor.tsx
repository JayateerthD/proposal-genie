'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Proposal, ProposalSection } from '@/types/proposal';
import {
  Bold,
  Italic,
  Underline as UnderTheLine,
  List,
  ListOrdered,
  Quote,
  Code,
  Table as TableIcon,
  Link as LinkIcon,
  Undo,
  Redo,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  CheckSquare,
  FileText,
  Target,
  Clock,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Plus,
  Edit
} from 'lucide-react';

interface ProposalEditorProps {
  proposal: Proposal;
  activeSection?: ProposalSection;
  onContentChange: (sectionId: string, content: string) => void;
  onSectionSelect: (sectionId: string) => void;
}

export default function ProposalEditor({
  proposal,
  activeSection,
  onContentChange,
  onSectionSelect
}: ProposalEditorProps) {
  const [wordCount, setWordCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your proposal content...',
      }),
      Typography,
      Underline,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: activeSection?.content || '',
    onUpdate: ({ editor }) => {
      if (activeSection) {
        const content = editor.getHTML();
        const textContent = editor.getText();
        setWordCount(textContent.split(/\s+/).filter(word => word.length > 0).length);

        // Debounced content update
        if (onContentChange) {
          onContentChange(activeSection.id, content);
        }
      }
    },
    onFocus: () => setIsEditing(true),
    onBlur: () => setIsEditing(false),
  });

  // Update editor content when active section changes
  useEffect(() => {
    if (editor && activeSection) {
      const currentContent = editor.getHTML();
      if (currentContent !== activeSection.content) {
        editor.commands.setContent(activeSection.content || '');
      }

      // Update word count
      const textContent = editor.getText();
      setWordCount(textContent.split(/\s+/).filter(word => word.length > 0).length);
    }
  }, [activeSection, editor]);

  const getSectionProgress = () => {
    const completedSections = proposal.sections.filter(s => s.content && s.content.trim().length > 0).length;
    return (completedSections / proposal.sections.length) * 100;
  };

  const getTargetWordCount = (sectionType: string) => {
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

  const getWordCountColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage < 50) return 'text-red-500';
    if (percentage < 80) return 'text-orange-500';
    if (percentage >= 100) return 'text-green-500';
    return 'text-blue-500';
  };

  if (!editor) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!activeSection) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No Section Selected</h3>
          <p className="text-sm text-muted-foreground">
            Select a section from the left sidebar to start editing your proposal.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{activeSection.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeSection.description}
                </p>
              </div>
              <Badge variant={activeSection.content && activeSection.content.trim() ? 'default' : 'secondary'}>
                {activeSection.content && activeSection.content.trim() ? 'In Progress' : 'Not Started'}
              </Badge>
            </div>

            {/* Section Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <Type className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className={getWordCountColor(wordCount, getTargetWordCount(activeSection.type))}>
                    {wordCount}
                  </span>
                  <span className="text-muted-foreground">
                    /{getTargetWordCount(activeSection.type)} words
                  </span>
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Progress: {Math.round(getSectionProgress())}%
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Last updated: {new Date(proposal.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Editor Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-3">
            <div className="flex flex-wrap items-center gap-1">
              {/* Text Formatting */}
              <div className="flex items-center border-r pr-2 mr-2">
                <Button
                  variant={editor.isActive('bold') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant={editor.isActive('italic') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant={editor.isActive('underline') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                  <UnderTheLine className="h-4 w-4" />
                </Button>
              </div>

              {/* Lists */}
              <div className="flex items-center border-r pr-2 mr-2">
                <Button
                  variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                  variant={editor.isActive('taskList') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleTaskList().run()}
                >
                  <CheckSquare className="h-4 w-4" />
                </Button>
              </div>

              {/* Block Formatting */}
              <div className="flex items-center border-r pr-2 mr-2">
                <Button
                  variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                >
                  <Quote className="h-4 w-4" />
                </Button>
                <Button
                  variant={editor.isActive('codeBlock') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                >
                  <Code className="h-4 w-4" />
                </Button>
              </div>

              {/* Insert Elements */}
              <div className="flex items-center border-r pr-2 mr-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                  }}
                >
                  <TableIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const url = prompt('Enter URL:');
                    if (url) {
                      editor.chain().focus().setLink({ href: url }).run();
                    }
                  }}
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </div>

              {/* Undo/Redo */}
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                >
                  <Undo className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Editor Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className={`transition-all ${isEditing ? 'ring-2 ring-primary/20' : ''}`}>
          <CardContent className="p-6">
            <EditorContent
              editor={editor}
              className="prose prose-sm max-w-none focus:outline-none"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Section Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Navigation</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {proposal.sections.map((section) => (
                <Button
                  key={section.id}
                  variant={section.id === activeSection.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onSectionSelect(section.id)}
                  className="justify-start text-xs"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  {section.title}
                </Button>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-medium">{Math.round(getSectionProgress())}%</span>
              </div>
              <Progress value={getSectionProgress()} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}