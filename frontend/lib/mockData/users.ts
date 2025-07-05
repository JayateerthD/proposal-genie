import { User } from '@/types/proposal';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user-2',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user-3',
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user-4',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user-5',
    name: 'David Kim',
    email: 'david.kim@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user-6',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@example.com',
    avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user-7',
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user-8',
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face'
  }
];

export const currentUser = mockUsers[0]; // Alex Johnson as the current user

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getRandomUsers = (count: number, excludeIds: string[] = []): User[] => {
  const availableUsers = mockUsers.filter(user => !excludeIds.includes(user.id));
  const shuffled = [...availableUsers].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};