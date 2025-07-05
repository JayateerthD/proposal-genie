'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useProposalStore } from '@/stores/proposalStore';
import { useUIStore } from '@/stores/uiStore';
import { proposalService } from '@/lib/services';
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  Kanban,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Share2,
  Copy,
  Trash2,
  Download,
  Clock,
  Users,
  TrendingUp,
  Calendar,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Zap,
  Target
} from 'lucide-react';
import { Proposal } from '@/types/proposal';

type ViewMode = 'list' | 'grid' | 'kanban';
type SortField = 'title' | 'clientName' | 'updatedAt' | 'deadline' | 'winProbability' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export default function ProposalsPage() {
  const {
    proposals,
    loading,
    error,
    filters,
    setProposals,
    setLoading,
    setError,
    setFilters,
    getFilteredProposals
  } = useProposalStore();

  const { openModal } = useUIStore();

  // Local state for UI
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedProposals, setSelectedProposals] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Load proposals on component mount
  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await proposalService.getProposals(1, 50, filters, {
        field: sortField,
        direction: sortDirection
      });

      if (response.success && response.data) {
        setProposals(response.data.proposals);
      } else {
        setError(response.error || 'Failed to load proposals');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and sorting
  const filteredProposals = getFilteredProposals()
    .filter(proposal => {
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          proposal.title.toLowerCase().includes(query) ||
          proposal.clientName.toLowerCase().includes(query) ||
          proposal.description?.toLowerCase().includes(query) ||
          proposal.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .filter(proposal => {
      // Apply status filter
      if (selectedStatus !== 'all') {
        return proposal.status.id === selectedStatus;
      }
      return true;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleSelectProposal = (proposalId: string) => {
    const newSelected = new Set(selectedProposals);
    if (newSelected.has(proposalId)) {
      newSelected.delete(proposalId);
    } else {
      newSelected.add(proposalId);
    }
    setSelectedProposals(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedProposals.size === filteredProposals.length) {
      setSelectedProposals(new Set());
    } else {
      setSelectedProposals(new Set(filteredProposals.map(p => p.id)));
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
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return '1d ago';
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statuses = [
    { id: 'all', name: 'All Proposals' },
    { id: 'draft', name: 'Draft' },
    { id: 'in-progress', name: 'In Progress' },
    { id: 'review', name: 'Review' },
    { id: 'completed', name: 'Completed' },
    { id: 'submitted', name: 'Submitted' },
    { id: 'won', name: 'Won' },
    { id: 'lost', name: 'Lost' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading proposals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={loadProposals}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proposals</h1>
          <p className="text-muted-foreground">
            Manage and track all your proposal activities
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button
            onClick={() => openModal({
              type: 'create-proposal',
              title: 'Create New Proposal'
            })}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Proposal
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Proposals</p>
                <p className="text-2xl font-bold">{proposals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg Win Rate</p>
                <p className="text-2xl font-bold">
                  {proposals.length > 0 
                    ? Math.round(proposals.reduce((sum, p) => sum + p.winProbability, 0) / proposals.length)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">
                  {proposals.filter(p => p.status.id === 'in-progress' || p.status.id === 'review').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    proposals.reduce((sum, p) => sum + (p.budget?.max || 0), 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search proposals by title, client, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort('updatedAt')}
              >
                {sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center space-x-1 border rounded-lg p-1">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
              >
                <Kanban className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedProposals.size > 0 && (
            <div className="mt-4 p-4 bg-primary/5 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedProposals.size} proposal{selectedProposals.size > 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Proposals Content */}
      <div className="space-y-4">
        {viewMode === 'list' && (
          <ProposalsList 
            proposals={filteredProposals}
            selectedProposals={selectedProposals}
            onSelectProposal={handleSelectProposal}
            onSelectAll={handleSelectAll}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
            getStatusColor={getStatusColor}
            getWinProbabilityColor={getWinProbabilityColor}
            formatTimeAgo={formatTimeAgo}
            formatCurrency={formatCurrency}
          />
        )}

        {viewMode === 'grid' && (
          <ProposalsGrid 
            proposals={filteredProposals}
            getStatusColor={getStatusColor}
            getWinProbabilityColor={getWinProbabilityColor}
            formatTimeAgo={formatTimeAgo}
            formatCurrency={formatCurrency}
          />
        )}

        {viewMode === 'kanban' && (
          <ProposalsKanban 
            proposals={filteredProposals}
            getStatusColor={getStatusColor}
            getWinProbabilityColor={getWinProbabilityColor}
            formatTimeAgo={formatTimeAgo}
            formatCurrency={formatCurrency}
          />
        )}
      </div>

      {filteredProposals.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No proposals found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || selectedStatus !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first proposal'
            }
          </p>
          <Button onClick={() => openModal({
            type: 'create-proposal',
            title: 'Create New Proposal'
          })}>
            <Plus className="h-4 w-4 mr-2" />
            Create Proposal
          </Button>
        </div>
      )}
    </div>
  );
}

// Component for List View
function ProposalsList({ 
  proposals, 
  selectedProposals, 
  onSelectProposal, 
  onSelectAll, 
  onSort, 
  sortField, 
  sortDirection,
  getStatusColor,
  getWinProbabilityColor,
  formatTimeAgo,
  formatCurrency
}: any) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProposals.size === proposals.length && proposals.length > 0}
                    onChange={onSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="p-4 text-left">
                  <Button variant="ghost" size="sm" onClick={() => onSort('title')}>
                    Proposal
                    {sortField === 'title' && (
                      sortDirection === 'asc' ? <SortAsc className="ml-2 h-4 w-4" /> : <SortDesc className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </th>
                <th className="p-4 text-left">
                  <Button variant="ghost" size="sm" onClick={() => onSort('clientName')}>
                    Client
                    {sortField === 'clientName' && (
                      sortDirection === 'asc' ? <SortAsc className="ml-2 h-4 w-4" /> : <SortDesc className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">
                  <Button variant="ghost" size="sm" onClick={() => onSort('winProbability')}>
                    Win Rate
                    {sortField === 'winProbability' && (
                      sortDirection === 'asc' ? <SortAsc className="ml-2 h-4 w-4" /> : <SortDesc className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </th>
                <th className="p-4 text-left">Budget</th>
                <th className="p-4 text-left">Team</th>
                <th className="p-4 text-left">
                  <Button variant="ghost" size="sm" onClick={() => onSort('updatedAt')}>
                    Updated
                    {sortField === 'updatedAt' && (
                      sortDirection === 'asc' ? <SortAsc className="ml-2 h-4 w-4" /> : <SortDesc className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {proposals.map((proposal: Proposal, index: number) => (
                  <motion.tr
                    key={proposal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b hover:bg-muted/50 cursor-pointer"
                    onClick={() => window.location.href = `/editor/${proposal.id}`}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedProposals.has(proposal.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          onSelectProposal(proposal.id);
                        }}
                        className="rounded"
                      />
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{proposal.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {proposal.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {proposal.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {proposal.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{proposal.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{proposal.clientName}</p>
                      {proposal.clientEmail && (
                        <p className="text-sm text-muted-foreground">{proposal.clientEmail}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(proposal.status.id)}>
                        {proposal.status.name}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Progress value={proposal.winProbability} className="w-16 h-2" />
                        <span className={`text-sm font-medium ${getWinProbabilityColor(proposal.winProbability)}`}>
                          {proposal.winProbability}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      {proposal.budget ? (
                        <div>
                          <p className="text-sm font-medium">
                            {formatCurrency(proposal.budget.min)} - {formatCurrency(proposal.budget.max)}
                          </p>
                          <p className="text-xs text-muted-foreground">{proposal.budget.currency}</p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex -space-x-2">
                        {proposal.collaborators.slice(0, 3).map(collab => (
                          <Avatar key={collab.userId} className="w-6 h-6 border-2 border-background">
                            <AvatarImage src={collab.user.avatar} />
                            <AvatarFallback className="text-xs">
                              {collab.user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {proposal.collaborators.length > 3 && (
                          <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                            <span className="text-xs">+{proposal.collaborators.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {formatTimeAgo(new Date(proposal.updatedAt))}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`/preview/${proposal.id}`, '_blank');
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `/editor/${proposal.id}`;
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Open actions menu
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// Component for Grid View (will be implemented next)
function ProposalsGrid({ proposals, getStatusColor, getWinProbabilityColor, formatTimeAgo, formatCurrency }: any) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence>
        {proposals.map((proposal: Proposal, index: number) => (
          <motion.div
            key={proposal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Badge className={getStatusColor(proposal.status.id)}>
                    {proposal.status.name}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/preview/${proposal.id}`, '_blank');
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/editor/${proposal.id}`;
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2">{proposal.title}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {proposal.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Client:</span>
                  <span className="text-sm">{proposal.clientName}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Win Probability</span>
                    <span className={`text-sm font-medium ${getWinProbabilityColor(proposal.winProbability)}`}>
                      {proposal.winProbability}%
                    </span>
                  </div>
                  <Progress value={proposal.winProbability} className="h-2" />
                </div>

                {proposal.budget && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Budget:</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(proposal.budget.min)} - {formatCurrency(proposal.budget.max)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {proposal.collaborators.slice(0, 3).map(collab => (
                      <Avatar key={collab.userId} className="w-6 h-6 border-2 border-background">
                        <AvatarImage src={collab.user.avatar} />
                        <AvatarFallback className="text-xs">
                          {collab.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {proposal.collaborators.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                        <span className="text-xs">+{proposal.collaborators.length - 3}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(new Date(proposal.updatedAt))}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {proposal.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {proposal.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{proposal.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Component for Kanban View (simplified for now)
function ProposalsKanban({ proposals, getStatusColor, getWinProbabilityColor, formatTimeAgo, formatCurrency }: any) {
  const statuses = ['draft', 'in-progress', 'review', 'completed', 'submitted', 'won', 'lost'];
  const statusNames = {
    'draft': 'Draft',
    'in-progress': 'In Progress',
    'review': 'Review',
    'completed': 'Completed',
    'submitted': 'Submitted',
    'won': 'Won',
    'lost': 'Lost'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {statuses.map(statusId => {
        const statusProposals = proposals.filter((p: Proposal) => p.status.id === statusId);
        
        return (
          <Card key={statusId} className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                {statusNames[statusId as keyof typeof statusNames]}
                <Badge variant="secondary">{statusProposals.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {statusProposals.map((proposal: Proposal) => (
                <Card 
                  key={proposal.id} 
                  className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => window.location.href = `/editor/${proposal.id}`}
                >
                  <h4 className="font-medium text-sm line-clamp-2 mb-2">{proposal.title}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{proposal.clientName}</p>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium ${getWinProbabilityColor(proposal.winProbability)}`}>
                      {proposal.winProbability}%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(new Date(proposal.updatedAt))}
                    </span>
                  </div>
                  
                  <div className="flex -space-x-1">
                    {proposal.collaborators.slice(0, 3).map(collab => (
                      <Avatar key={collab.userId} className="w-5 h-5 border border-background">
                        <AvatarImage src={collab.user.avatar} />
                        <AvatarFallback className="text-xs">
                          {collab.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}