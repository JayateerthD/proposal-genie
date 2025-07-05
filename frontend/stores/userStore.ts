import { create } from 'zustand';
import { getAccessToken, getRefreshToken, getUser } from '@/lib/auth';

interface UserState {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: any) => void;
  clearAuth: () => void;
  initializeAuth: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
  setUser: (user) => set({ user }),
  clearAuth: () => set({ accessToken: null, refreshToken: null, user: null }),
  initializeAuth: () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    const user = getUser();
    set({ accessToken, refreshToken, user });
  },
}));

// Initialize auth state on store creation
useUserStore.getState().initializeAuth();