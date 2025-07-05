'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useUIStore } from '@/stores/uiStore';
import { proposalService } from '@/lib/services';
import {
  FileText,
  Upload,
  MessageSquare,
  Sparkles,
  Clock,
  DollarSign,
  Building,
  Mail,
  Calendar,
  Tag,
  Loader2,
  CheckCircle,
  ArrowRight,
  Plus,
  X
} from 'lucide-react';

interface CreateProposalData {
  title: string;
  description: string;
  clientName: string;
  clientEmail: string;
  deadline?: Date;
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  tags: string[];
  template?: string;
}

const quickStartOptions = [
  {
    id: 'blank',
    title: 'Start from Scratch',
    description: 'Create a custom proposal with our guided process',
    icon: FileText,
    color: 'bg-blue-500',
    popular: false
  },
  {
    id: 'upload',
    title: 'Upload RFP',
    description: 'Upload an RFP document and let AI help structure your response',
    icon: Upload,
    color: 'bg-green-500',
    popular: true
  },
  {
    id: 'chat',
    title: 'Chat with AI',
    description: 'Describe your project and let AI build a proposal structure',
    icon: MessageSquare,
    color: 'bg-purple-500',
    popular: false
  },
  {
    id: 'template',
    title: 'Use Template',
    description: 'Start with a proven template from our library',
    icon: Sparkles,
    color: 'bg-orange-500',
    popular: false
  }
];

const predefinedTags = [
  'Software Development', 'Consulting', 'Marketing', 'Design', 'Healthcare',
  'Finance', 'E-commerce', 'Education', 'Government', 'Enterprise',
  'Startup', 'Mobile', 'Web', 'Cloud', 'AI/ML'
];

export default function CreateProposalModal() {
  const { currentModal, closeModal } = useUIStore();
  const [step, setStep] = useState<'method' | 'details'>('method');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [newTag, setNewTag] = useState('');

  const [formData, setFormData] = useState<CreateProposalData>({
    title: '',
    description: '',
    clientName: '',
    clientEmail: '',
    tags: [],
    budget: {
      min: 0,
      max: 0,
      currency: 'USD'
    }
  });

  const isOpen = currentModal?.type === 'create-proposal';

  const handleClose = () => {
    setStep('method');
    setSelectedMethod('');
    setFormData({
      title: '',
      description: '',
      clientName: '',
      clientEmail: '',
      tags: [],
      budget: { min: 0, max: 0, currency: 'USD' }
    });
    closeModal();
  };

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    
    if (methodId === 'upload' || methodId === 'chat') {
      // Close this modal and open the upload modal
      handleClose();
      const { openModal } = useUIStore.getState();
      openModal({
        type: 'upload',
        title: methodId === 'upload' ? 'Upload RFP Document' : 'Chat About Your Project',
        data: { activeMethod: methodId === 'upload' ? 'file' : 'chat' }
      });
      return;
    }
    
    if (methodId === 'template') {
      // Navigate to templates page
      handleClose();
      window.location.href = '/templates';
      return;
    }
    
    setStep('details');
  };

  const handleInputChange = (field: keyof CreateProposalData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddCustomTag = () => {
    if (newTag.trim()) {
      addTag(newTag.trim());
      setNewTag('');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const response = await proposalService.createProposal({
        title: formData.title,
        description: formData.description,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        deadline: formData.deadline,
        budget: formData.budget,
        tags: formData.tags
      });
      
      if (response.success && response.data) {
        handleClose();
        // Navigate to the new proposal editor
        window.location.href = `/editor/${response.data.id}`;
      } else {
        console.error('Failed to create proposal:', response.error);
      }
    } catch (error) {
      console.error('Error creating proposal:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.title.trim() && formData.clientName.trim();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create New Proposal
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {step === 'method' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-medium mb-2">How would you like to start?</h3>
                <p className="text-muted-foreground">
                  Choose the method that works best for your project
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickStartOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <motion.div
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          selectedMethod === option.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => handleMethodSelect(option.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className={`p-3 rounded-lg ${option.color} text-white`}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-semibold">{option.title}</h4>
                                {option.popular && (
                                  <Badge variant="default" className="text-xs">
                                    Popular
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {option.description}
                              </p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 'details' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-medium mb-2">Proposal Details</h3>
                <p className="text-muted-foreground">
                  Fill in the basic information for your proposal
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Proposal Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Enterprise CRM Implementation"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of the project scope and objectives..."
                      rows={3}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="deadline">Project Deadline</Label>
                    <div className="mt-1 relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline ? formData.deadline.toISOString().split('T')[0] : ''}
                        onChange={(e) => handleInputChange('deadline', e.target.value ? new Date(e.target.value) : undefined)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="clientName">Client Name *</Label>
                    <div className="mt-1 relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="clientName"
                        placeholder="e.g., TechCorp Inc."
                        value={formData.clientName}
                        onChange={(e) => handleInputChange('clientName', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="clientEmail">Client Email</Label>
                    <div className="mt-1 relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="clientEmail"
                        type="email"
                        placeholder="contact@techcorp.com"
                        value={formData.clientEmail}
                        onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Budget Range</Label>
                    <div className="mt-1 space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="relative">
                          <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            type="number"
                            placeholder="Min"
                            value={formData.budget?.min || ''}
                            onChange={(e) => handleInputChange('budget', {
                              ...formData.budget,
                              min: parseInt(e.target.value) || 0
                            })}
                            className="pl-8"
                          />
                        </div>
                        <div className="relative">
                          <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            type="number"
                            placeholder="Max"
                            value={formData.budget?.max || ''}
                            onChange={(e) => handleInputChange('budget', {
                              ...formData.budget,
                              max: parseInt(e.target.value) || 0
                            })}
                            className="pl-8"
                          />
                        </div>
                        <Input
                          placeholder="USD"
                          value={formData.budget?.currency || 'USD'}
                          onChange={(e) => handleInputChange('budget', {
                            ...formData.budget,
                            currency: e.target.value
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags Section */}
              <div>
                <Label>Project Tags</Label>
                <div className="mt-2 space-y-3">
                  {/* Selected Tags */}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="px-2 py-1">
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-2 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Add Custom Tag */}
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add custom tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTag()}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddCustomTag}
                      disabled={!newTag.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Predefined Tags */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Quick add:</p>
                    <div className="flex flex-wrap gap-1">
                      {predefinedTags.filter(tag => !formData.tags.includes(tag)).slice(0, 8).map(tag => (
                        <Button
                          key={tag}
                          variant="outline"
                          size="sm"
                          onClick={() => addTag(tag)}
                          className="text-xs h-7"
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            {step === 'details' && (
              <Button
                variant="outline"
                onClick={() => setStep('method')}
                disabled={loading}
              >
                Back
              </Button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            
            {step === 'details' && (
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Create Proposal
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}