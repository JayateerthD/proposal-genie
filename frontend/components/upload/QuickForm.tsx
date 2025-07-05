'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useUploadStore } from '@/stores/uploadStore';
import { uploadService } from '@/lib/services';
import {
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function QuickForm() {
  const {
    formData,
    setFormData,
    setFormValid,
    formValid
  } = useUploadStore();

  const [requirements, setRequirements] = useState<string[]>(formData?.requirements || []);
  const [newRequirement, setNewRequirement] = useState('');
  const [validating, setValidating] = useState(false);
  const [validationResults, setValidationResults] = useState<{
    errors: string[];
    suggestions: string[];
  } | null>(null);

  const handleInputChange = (field: string, value: any) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    
    // Clear validation results when data changes
    if (validationResults) {
      setValidationResults(null);
    }
  };

  const addRequirement = () => {
    if (newRequirement.trim() && !requirements.includes(newRequirement.trim())) {
      const updatedRequirements = [...requirements, newRequirement.trim()];
      setRequirements(updatedRequirements);
      setFormData({ requirements: updatedRequirements });
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    const updatedRequirements = requirements.filter((_, i) => i !== index);
    setRequirements(updatedRequirements);
    setFormData({ requirements: updatedRequirements });
  };

  const validateForm = async () => {
    setValidating(true);
    
    try {
      const response = await uploadService.validateFormData({
        ...formData,
        requirements
      });
      
      if (response.success && response.data) {
        setValidationResults({
          errors: response.data.errors,
          suggestions: response.data.suggestions
        });
        setFormValid(response.data.valid);
      }
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setValidating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addRequirement();
    }
  };

  return (
    <div className="space-y-6 max-h-[500px] overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Project Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Project Title */}
          <div className="space-y-2">
            <Label htmlFor="projectTitle">Project Title *</Label>
            <Input
              id="projectTitle"
              placeholder="e.g., Enterprise CRM Platform Development"
              value={formData?.projectTitle || ''}
              onChange={(e) => handleInputChange('projectTitle', e.target.value)}
            />
          </div>

          {/* Client Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                placeholder="e.g., TechCorp Inc."
                value={formData?.clientName || ''}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                id="clientEmail"
                type="email"
                placeholder="contact@techcorp.com"
                value={formData?.clientEmail || ''}
                onChange={(e) => handleInputChange('clientEmail', e.target.value)}
              />
            </div>
          </div>

          {/* Project Description */}
          <div className="space-y-2">
            <Label htmlFor="projectDescription">Project Description *</Label>
            <Textarea
              id="projectDescription"
              placeholder="Describe the project scope, objectives, and key deliverables..."
              rows={4}
              value={formData?.projectDescription || ''}
              onChange={(e) => handleInputChange('projectDescription', e.target.value)}
            />
          </div>

          {/* Industry and Project Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industryType">Industry</Label>
              <Input
                id="industryType"
                placeholder="e.g., Healthcare, Finance, Retail"
                value={formData?.industryType || ''}
                onChange={(e) => handleInputChange('industryType', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectType">Project Type</Label>
              <Input
                id="projectType"
                placeholder="e.g., Web Development, Consulting"
                value={formData?.projectType || ''}
                onChange={(e) => handleInputChange('projectType', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Key Requirements</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Add a requirement..."
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button
                type="button"
                size="sm"
                onClick={addRequirement}
                disabled={!newRequirement.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {requirements.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Requirements:</p>
              <div className="flex flex-wrap gap-2">
                {requirements.map((req, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge variant="secondary" className="pr-1">
                      {req}
                      <button
                        onClick={() => removeRequirement(index)}
                        className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline and Budget */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Timeline & Budget</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deadline">Project Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={formData?.deadline ? formData.deadline.toISOString().split('T')[0] : ''}
              onChange={(e) => handleInputChange('deadline', e.target.value ? new Date(e.target.value) : undefined)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgetMin">Min Budget</Label>
              <Input
                id="budgetMin"
                type="number"
                placeholder="50000"
                value={formData?.budget?.min || ''}
                onChange={(e) => handleInputChange('budget', {
                  ...formData?.budget,
                  min: parseInt(e.target.value) || 0
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetMax">Max Budget</Label>
              <Input
                id="budgetMax"
                type="number"
                placeholder="100000"
                value={formData?.budget?.max || ''}
                onChange={(e) => handleInputChange('budget', {
                  ...formData?.budget,
                  max: parseInt(e.target.value) || 0
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                placeholder="USD"
                value={formData?.budget?.currency || 'USD'}
                onChange={(e) => handleInputChange('budget', {
                  ...formData?.budget,
                  currency: e.target.value
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Results */}
      {validationResults && (
        <Card>
          <CardContent className="pt-6">
            {validationResults.errors.length > 0 && (
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Errors to fix:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                  {validationResults.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {validationResults.suggestions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-blue-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Suggestions:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-600">
                  {validationResults.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Button */}
      <div className="flex justify-end">
        <Button
          onClick={validateForm}
          disabled={validating}
          className="min-w-[120px]"
        >
          {validating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Validating...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Validate Form
            </>
          )}
        </Button>
      </div>
    </div>
  );
}