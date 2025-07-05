'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useProposalStore } from '@/stores/proposalStore';
import { useUIStore } from '@/stores/uiStore';
import { proposalService } from '@/lib/services';
import { useRouter } from 'next/navigation';

import {
  FileText,
  TrendingUp,
  Clock,
  Users,
  Upload,
  MessageSquare,
  BarChart3,
  Plus,
  Filter,
  Search,
  Bell,
  Settings
} from 'lucide-react';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 10
    }
  }
};

const cardHoverVariants = {
  hover: {
    scale: 1.02,
    transition: {
      type: "spring" as "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

function DashboardContent() {
  const {
    proposals,
    stats,
    loading,
    error,
    setProposals,
    setStats,
    setLoading,
    setError,
    getFilteredProposals
  } = useProposalStore();
  const router = useRouter()
  const { openModal } = useUIStore();

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load proposals and stats in parallel
      const [proposalsResponse, statsResponse] = await Promise.all([
        proposalService.getProposals(1, 5), // Get first 5 for recent proposals
        proposalService.getProposalStats()
      ]);

      if (proposalsResponse.success && proposalsResponse.data) {
        setProposals(proposalsResponse.data.proposals);
      } else {
        setError(proposalsResponse.error || 'Failed to load proposals');
      }

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      } else {
        console.warn('Failed to load stats:', statsResponse.error);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Generate stats cards from store data
  const generateStatsCards = () => {
    if (!stats) {
      return [
        {
          title: "Active Proposals",
          value: proposals.length.toString(),
          change: "Loading...",
          icon: FileText,
          color: "text-blue-600"
        },
        {
          title: "Win Rate",
          value: "-%",
          change: "Loading...",
          icon: TrendingUp,
          color: "text-green-600"
        },
        {
          title: "Avg. Response Time",
          value: "- min",
          change: "Loading...",
          icon: Clock,
          color: "text-orange-600"
        },
        {
          title: "Team Members",
          value: "-",
          change: "Loading...",
          icon: Users,
          color: "text-purple-600"
        }
      ];
    }

    return [
      {
        title: "Active Proposals",
        value: stats.activeProposals.toString(),
        change: `${stats.totalProposals} total`,
        icon: FileText,
        color: "text-blue-600"
      },
      {
        title: "Win Rate",
        value: `${Math.round(stats.averageWinRate)}%`,
        change: "All time average",
        icon: TrendingUp,
        color: "text-green-600"
      },
      {
        title: "Avg. Response Time",
        value: `${stats.averageResponseTime} min`,
        change: "AI-assisted speed",
        icon: Clock,
        color: "text-orange-600"
      },
      {
        title: "Recent Activity",
        value: stats.recentActivity.length.toString(),
        change: "This week",
        icon: BarChart3,
        color: "text-purple-600"
      }
    ];
  };

  const statsCards = generateStatsCards();
  const recentProposals = getFilteredProposals().slice(0, 3);

  // Quick actions with modal integration
  const quickActions = [
    {
      title: "Upload RFP",
      description: "Start with a PDF or document",
      icon: Upload,
      color: "bg-blue-500",
      onClick: () => openModal({
        type: 'upload',
        title: 'Upload RFP Document',
        data: { activeMethod: 'file' }
      })
    },
    {
      title: "Quick Chat",
      description: "Describe requirements conversationally",
      icon: MessageSquare,
      color: "bg-green-500",
      onClick: () => openModal({
        type: 'upload',
        title: 'Chat About Your Project',
        data: { activeMethod: 'chat' }
      })
    },
    {
      title: "Quick Form",
      description: "Fill out a structured form",
      icon: FileText,
      color: "bg-purple-500",
      onClick: () => openModal({
        type: 'upload',
        title: 'Quick Project Form',
        data: { activeMethod: 'form' }
      })
    }
  ];

  // Helper function to format time
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return '1 day ago';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={loadDashboardData}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your proposals.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={cardHoverVariants}
            whileHover="hover"
            className="cursor-pointer"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="mr-2 h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Start creating your next winning proposal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  whileHover={{ x: 4 }}
                  className="flex items-center p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                  onClick={action.onClick}
                >
                  <div className={`p-2 rounded-md ${action.color} mr-3`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{action.title}</p>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Proposals */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Recent Proposals
                  </CardTitle>
                  <CardDescription>
                    Your latest proposal activities
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push('/proposals')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProposals.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No proposals yet. Create your first one!</p>
                  </div>
                ) : (
                  recentProposals.map((proposal, index) => (
                    <motion.div
                      key={proposal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                      className="flex items-center justify-between p-4 rounded-lg border hover:shadow-sm transition-all cursor-pointer"
                      onClick={() => window.location.href = `/editor/${proposal.id}`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{proposal.title}</h4>
                          <Badge variant="secondary" className={`
                            ${proposal.status.name === 'In Progress' ? 'bg-blue-100 text-blue-800' : ''}
                            ${proposal.status.name === 'Review' ? 'bg-orange-100 text-orange-800' : ''}
                            ${proposal.status.name === 'Draft' ? 'bg-gray-100 text-gray-800' : ''}
                            ${proposal.status.name === 'Completed' ? 'bg-green-100 text-green-800' : ''}
                          `}>
                            {proposal.status.name}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{proposal.clientName}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Win Probability: {proposal.winProbability}%</span>
                          <span>•</span>
                          <span>{proposal.collaborators.length} collaborators</span>
                          <span>•</span>
                          <span>{formatTimeAgo(new Date(proposal.updatedAt))}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="w-16 text-right">
                          <div className="text-sm font-medium mb-1">{proposal.winProbability}%</div>
                          <Progress value={proposal.winProbability} className="h-2" />
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Activity Feed */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates across all your proposals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentActivity?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No recent activity</p>
                </div>
              ) : (
                stats?.recentActivity?.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full ${activity.type === 'ai_enhanced' ? 'bg-green-500' :
                      activity.type === 'shared' ? 'bg-blue-500' :
                        activity.type === 'updated' ? 'bg-orange-500' :
                          activity.type === 'submitted' ? 'bg-purple-500' :
                            'bg-gray-500'
                      }`} />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.description}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(new Date(activity.createdAt))} by {activity.user.name}
                      </p>
                    </div>
                  </motion.div>
                )) || []
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}