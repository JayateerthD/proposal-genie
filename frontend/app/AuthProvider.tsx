'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { usePathname, useRouter } from 'next/navigation';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializeAuth = useUserStore((state) => state.initializeAuth);
  const accessToken = useUserStore((state) => state.accessToken);
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
    setLoading(false);
  }, [initializeAuth]);

  useEffect(() => {
    if (!loading) {
      const publicPaths = ['/login', '/register'];
      const isPublicPath = publicPaths.includes(pathname);

      if (!accessToken && !isPublicPath) {
        router.push('/login');
      } else if (accessToken && isPublicPath) {
        router.push('/dashboard');
      }
    }
  }, [accessToken, pathname, router, loading]);

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  return <>{children}</>;
}