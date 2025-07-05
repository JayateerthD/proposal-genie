'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProposalStore } from '@/stores/proposalStore';
import { proposalService } from '@/lib/services';
import { Proposal } from '@/types/proposal';
import {
  ArrowLeft,
  Download,
  Share2,
  Edit,
  Pin,
  ExternalLink,
  Calendar,
  DollarSign,
  Clock,
  Target,
  TrendingUp,
  Users,
  Building,
  Mail,
  Phone,
  Globe,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function ProposalPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const proposalId = params.id as string;

  const { currentProposal, setCurrentProposal, loading, setLoading, error, setError } = useProposalStore();
  const [isPrintMode, setIsPrintMode] = useState(false);

  useEffect(() => {
    if (proposalId) {
      loadProposal(proposalId);
    }
  }, [proposalId]);

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

  const handlePrint = () => {
    setIsPrintMode(true);
    setTimeout(() => {
      window.print();
      setIsPrintMode(false);
    }, 100);
  };

  const handleDownload = () => {
    // Here you would implement PDF generation
    console.log('Download proposal as PDF');
  };

  const handleShare = () => {
    // Here you would implement sharing functionality
    console.log('Share proposal');
  };

  const handleEdit = () => {
    router.push(`/editor/${proposalId}`);
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  const getCompletedSections = () => {
    if (!currentProposal) return 0;
    return currentProposal.sections.filter(section =>
      section.content && section.content.trim().length > 0
    ).length;
  };

  const getTotalWordCount = () => {
    if (!currentProposal) return 0;
    return currentProposal.sections.reduce((total, section) => {
      const words = section.content ? section.content.split(/\s+/).filter(word => word.length > 0).length : 0;
      return total + words;
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
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
              Try Again
            </Button>
            <Button variant="outline" onClick={() => router.push('/proposals')}>
              Back to Proposals
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isPrintMode ? 'print:p-0' : 'bg-background'}`}>
      {/* Header - Hidden in print mode */}
      {!isPrintMode && (
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 print:hidden"
        >
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/proposals')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Proposals
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <div>
                <h1 className="text-lg font-semibold truncate max-w-[300px]">
                  {currentProposal.title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Preview Mode
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>

              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>

              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Pin className="h-4 w-4 mr-2" />
                Print
              </Button>

              <Button size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </motion.header>
      )}

      {/* Main Content */}
      <div className={`${isPrintMode ? 'p-8' : 'container mx-auto px-4 py-8'} max-w-4xl`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Proposal Header */}
          <div className="text-center space-y-4 border-b pb-8">
            <h1 className="text-4xl font-bold text-foreground">
              {currentProposal.title}
            </h1>

            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Building className="h-4 w-4" />
                <span>Prepared for {currentProposal.clientName}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(currentProposal.createdAt)}</span>
              </div>
            </div>

            {/* Proposal Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {currentProposal.winProbability}%
                </div>
                <div className="text-sm text-muted-foreground">Win Probability</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {getCompletedSections()}/{currentProposal.sections.length}
                </div>
                <div className="text-sm text-muted-foreground">Sections Complete</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {getTotalWordCount().toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Words</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {currentProposal.deadline ? Math.ceil((new Date(currentProposal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">Days to Deadline</div>
              </div>
            </div>
          </div>

          {/* Proposal Sections */}
          <div className="space-y-8">
            {currentProposal.sections
              .sort((a, b) => a.order - b.order)
              .map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-foreground">
                        {section.title}
                      </h2>
                      {section.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {section.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {section.content && section.content.trim() ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                      )}
                      <Badge variant={section.content && section.content.trim() ? 'default' : 'secondary'}>
                        {section.content && section.content.trim() ? 'Complete' : 'Draft'}
                      </Badge>
                    </div>
                  </div>

                  <Card>
                    <CardContent className="p-6">
                      {section.content && section.content.trim() ? (
                        <div
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: section.content }}
                        />
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <FileText className="h-8 w-8 mx-auto mb-2" />
                          <p>This section is still being drafted.</p>
                          <p className="text-sm">Content will be added soon.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>

          {/* Proposal Footer */}
          <div className="border-t pt-8 space-y-6">
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Client Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{currentProposal.clientName}</span>
                    </div>
                    {currentProposal.clientEmail && (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{currentProposal.clientEmail}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Project Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className={`
                        ${currentProposal.status.id === 'draft' ? 'bg-gray-100 text-gray-800' : ''}
                        ${currentProposal.status.id === 'in-progress' ? 'bg-blue-100 text-blue-800' : ''}
                        ${currentProposal.status.id === 'review' ? 'bg-orange-100 text-orange-800' : ''}
                        ${currentProposal.status.id === 'completed' ? 'bg-green-100 text-green-800' : ''}
                      `}>
                        {currentProposal.status.name}
                      </Badge>
                    </div>
                    {currentProposal.deadline && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Deadline:</span>
                        <span>{formatDate(currentProposal.deadline)}</span>
                      </div>
                    )}
                    {currentProposal.budget && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Budget:</span>
                        <span>
                          {formatCurrency(currentProposal.budget.min)} - {formatCurrency(currentProposal.budget.max)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Members */}
            {currentProposal.collaborators && currentProposal.collaborators.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Project Team</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentProposal.collaborators.map(collaborator => (
                      <div key={collaborator.userId} className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={collaborator.user.avatar} />
                          <AvatarFallback>
                            {collaborator.user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{collaborator.user.name}</p>
                          <p className="text-sm text-muted-foreground capitalize">{collaborator.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {currentProposal.tags && currentProposal.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {currentProposal.tags.map(tag => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Generated Notice */}
          <div className="text-center text-sm text-muted-foreground border-t pt-4">
            <p>
              This proposal was generated on {formatDate(new Date())} using ProposalGenie
            </p>
            <p className="mt-1">
              Last updated: {formatDate(currentProposal.updatedAt)}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:p-0 {
            padding: 0 !important;
          }
          
          h1, h2, h3 {
            break-after: avoid;
          }
          
          .break-inside-avoid {
            break-inside: avoid;
          }
          
          @page {
            margin: 1in;
            size: letter;
          }
        }
      `}</style>
    </div>
  );
}