'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUIStore } from '@/stores/uiStore';
import { templateService } from '@/lib/services';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  Star,
  Eye,
  Download,
  Copy,
  Calendar,
  Users,
  FileText,
  Clock,
  TrendingUp,
  Building,
  Zap,
  Target,
  Sparkles,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react';

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  industry: string;
  sections: number;
  estimatedTime: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  usageCount: number;
  createdBy: {
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  preview: string;
  isPremium: boolean;
  isFavorite: boolean;
}

const categories = [
  { id: 'all', name: 'All Templates', count: 24 },
  { id: 'business', name: 'Business Proposals', count: 8 },
  { id: 'technical', name: 'Technical Proposals', count: 6 },
  { id: 'consulting', name: 'Consulting', count: 4 },
  { id: 'marketing', name: 'Marketing', count: 3 },
  { id: 'government', name: 'Government', count: 3 }
];

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
  'Retail', 'Consulting', 'Government', 'Non-profit', 'Startup'
];

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'recent', label: 'Recently Added' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'alphabetical', label: 'A-Z' }
];

export default function TemplatesPage() {
  const { openModal } = useUIStore();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, [selectedCategory, selectedIndustry, sortBy]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const response = await templateService.getTemplates({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        industry: selectedIndustry || undefined,
        sort: sortBy,
        search: searchQuery
      });

      if (response.success && response.data) {
        setTemplates(response.data);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Debounce search
    setTimeout(() => {
      loadTemplates();
    }, 300);
  };

  const useTemplate = (template: Template) => {
    openModal({
      type: 'create-proposal',
      title: 'Create Proposal from Template',
      data: { templateId: template.id }
    });
  };

  const previewTemplate = (template: Template) => {
    // Open template preview modal
    console.log('Preview template:', template.id);
  };

  const toggleFavorite = (templateId: string) => {
    setTemplates(prev =>
      prev.map(template =>
        template.id === templateId
          ? { ...template, isFavorite: !template.isFavorite }
          : template
      )
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTemplates = templates.filter(template => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        template.title.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Proposal Templates</h1>
            <p className="text-muted-foreground">
              Start with proven templates to accelerate your proposal writing
            </p>
          </div>
          <Button onClick={() => openModal({ type: 'create-template', title: 'Create Template' })}>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center space-x-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-2 border rounded-md text-sm"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name} ({category.count})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Industry</label>
                    <select
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      className="w-full p-2 border rounded-md text-sm"
                    >
                      <option value="">All Industries</option>
                      {industries.map(industry => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full p-2 border rounded-md text-sm"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>

      {/* Templates Grid/List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-full mb-4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <CardTitle className="text-lg line-clamp-1">
                            {template.title}
                          </CardTitle>
                          {template.isPremium && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(template.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Star className={`h-4 w-4 ${template.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <FileText className="h-3 w-3" />
                        <span>{template.sections} sections</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{template.estimatedTime}min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3" />
                        <span>{template.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                        <Badge className={`text-xs ${getDifficultyColor(template.difficulty)}`}>
                          {template.difficulty}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {template.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {template.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={template.createdBy.avatar} />
                          <AvatarFallback className="text-xs">
                            {template.createdBy.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground truncate">
                            {template.createdBy.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {template.usageCount} uses
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => useTemplate(template)}
                          className="flex-1"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Use Template
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => previewTemplate(template)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-4">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{template.title}</h3>
                          {template.isPremium && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {template.category}
                          </Badge>
                          <Badge className={`text-xs ${getDifficultyColor(template.difficulty)}`}>
                            {template.difficulty}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                          {template.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <FileText className="h-3 w-3" />
                            <span>{template.sections} sections</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{template.estimatedTime}min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3" />
                            <span>{template.rating.toFixed(1)} ({template.usageCount} uses)</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={template.createdBy.avatar} />
                              <AvatarFallback className="text-xs">
                                {template.createdBy.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span>{template.createdBy.name}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(template.id)}
                        >
                          <Star className={`h-4 w-4 ${template.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => previewTemplate(template)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => useTemplate(template)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Use Template
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {filteredTemplates.length === 0 && !loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No templates found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your filters or search terms
              </p>
              <Button onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}