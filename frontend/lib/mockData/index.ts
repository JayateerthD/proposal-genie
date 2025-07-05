// Export all mock data and utilities
export * from './users';
export * from './proposals';
export * from './aiResponses';
export * from './uploads';

import { mockProposals } from './proposals';
import { ProposalStats } from '@/types/proposal';

// Generate mock proposal statistics
export const generateMockStats = (): ProposalStats => {
  const totalProposals = mockProposals.length;
  const activeProposals = mockProposals.filter(
    p => p.status.id === 'in-progress' || p.status.id === 'review'
  ).length;
  
  const totalWinProbability = mockProposals.reduce(
    (sum, proposal) => sum + proposal.winProbability, 0
  );
  const averageWinRate = totalWinProbability / totalProposals;
  
  // Simulate average response time (in minutes)
  const averageResponseTime = 2.3;
  
  // Get recent activities from all proposals
  const allActivities = mockProposals.flatMap(proposal => proposal.activities || []);
  const recentActivity = allActivities
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return {
    totalProposals,
    activeProposals,
    averageWinRate,
    averageResponseTime,
    recentActivity
  };
};

// Utility functions for mock data manipulation
export const mockDataUtils = {
  // Simulate network delay
  delay: (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Generate random delay within range
  randomDelay: (min: number = 500, max: number = 2000) => {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  },
  
  // Simulate API success/failure
  simulateApiCall: <T>(data: T, successRate: number = 0.95): Promise<{ success: boolean; data?: T; error?: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (Math.random() < successRate) {
          resolve({ success: true, data });
        } else {
          resolve({ 
            success: false, 
            error: 'Simulated network error. Please try again.' 
          });
        }
      }, Math.random() * 1500 + 500); // 500-2000ms delay
    });
  },
  
  // Generate unique IDs
  generateId: (prefix: string = 'id') => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },
  
  // Simulate file upload progress
  simulateUploadProgress: (
    callback: (progress: number) => void,
    duration: number = 3000
  ): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          callback(progress);
          clearInterval(interval);
          resolve();
        } else {
          callback(Math.floor(progress));
        }
      }, duration / 20);
    });
  }
};