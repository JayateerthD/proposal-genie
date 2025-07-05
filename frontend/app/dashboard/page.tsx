'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
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

// Mock data
const stats = [
  {
    title: "Active Proposals",
    value: "12",
    change: "+2 from last week",
    icon: FileText,
    color: "text-blue-600"
  },
  {
    title: "Win Rate",
    value: "87%",
    change: "+15% from last month",
    icon: TrendingUp,
    color: "text-green-600"
  },
  {
    title: "Avg. Response Time",
    value: "2.3 min",
    change: "↓ 94% faster",
    icon: Clock,
    color: "text-orange-600"
  },
  {
    title: "Team Members",
    value: "8",
    change: "2 active now",
    icon: Users,
    color: "text-purple-600"
  }
];

const recentProposals = [
  {
    id: 1,
    title: "GlobalBank CRM Platform",
    client: "GlobalBank Inc.",
    status: "In Progress",
    winProbability: 91,
    lastUpdated: "2 hours ago",
    collaborators: 3
  },
  {
    id: 2,
    title: "E-commerce Platform Redesign",
    client: "RetailCorp",
    status: "Review",
    winProbability: 78,
    lastUpdated: "1 day ago",
    collaborators: 2
  },
  {
    id: 3,
    title: "Healthcare Analytics Dashboard",
    client: "MedTech Solutions",
    status: "Draft",
    winProbability: 85,
    lastUpdated: "3 hours ago",
    collaborators: 4
  }
];

const quickActions = [
  {
    title: "Upload RFP",
    description: "Start with a PDF or document",
    icon: Upload,
    color: "bg-blue-500"
  },
  {
    title: "Quick Chat",
    description: "Describe requirements conversationally",
    icon: MessageSquare,
    color: "bg-green-500"
  },
  {
    title: "Browse Templates",
    description: "Start from existing templates",
    icon: FileText,
    color: "bg-purple-500"
  }
];

function StatusBadge({ status }: { status: string }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Review':
        return 'bg-orange-100 text-orange-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Badge variant="secondary" className={getStatusColor(status)}>
      {status}
    </Badge>
  );
}

export default function DashboardPage() {
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
        {stats.map((stat, index) => (
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
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProposals.map((proposal, index) => (
                  <motion.div
                    key={proposal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                    className="flex items-center justify-between p-4 rounded-lg border hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{proposal.title}</h4>
                        <StatusBadge status={proposal.status} />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{proposal.client}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Win Probability: {proposal.winProbability}%</span>
                        <span>•</span>
                        <span>{proposal.collaborators} collaborators</span>
                        <span>•</span>
                        <span>{proposal.lastUpdated}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="w-16 text-right">
                        <div className="text-sm font-medium mb-1">{proposal.winProbability}%</div>
                        <Progress value={proposal.winProbability} className="h-2" />
                      </div>
                    </div>
                  </motion.div>
                ))}
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
              {[
                { action: "AI enhanced", proposal: "GlobalBank CRM Platform", time: "2 hours ago", type: "enhancement" },
                { action: "New collaboration", proposal: "Healthcare Analytics", time: "4 hours ago", type: "collaboration" },
                { action: "Win probability updated", proposal: "E-commerce Platform", time: "1 day ago", type: "update" },
                { action: "Proposal submitted", proposal: "RetailCorp Integration", time: "2 days ago", type: "submission" }
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full ${activity.type === 'enhancement' ? 'bg-green-500' :
                      activity.type === 'collaboration' ? 'bg-blue-500' :
                        activity.type === 'update' ? 'bg-orange-500' :
                          'bg-purple-500'
                    }`} />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.action}</span> in{' '}
                      <span className="text-blue-600">{activity.proposal}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}