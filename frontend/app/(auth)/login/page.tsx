'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loginUser } from '@/lib/auth';
import { useUserStore } from '@/stores/userStore';
import Link from 'next/link';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { setTokens, setUser } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await loginUser({ email, password });
    
    // Debug: Log the actual response structure
    console.log('Login response:', response);
    
    if (response.message === "Login Successful" && response.data) {
      localStorage.setItem("accessToken", response.data.token.access);
      localStorage.setItem("refreshToken", response.data.token.refresh);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      // Update userStore with the new auth data
      setTokens(response.data.token.access, response.data.token.refresh);
      setUser(response.data.user);
      
      router.push('/dashboard');
    } else if (response.message === "Login Successful" && response.token) {
      // Handle case where token is at root level
      localStorage.setItem("accessToken", response.token.access);
      localStorage.setItem("refreshToken", response.token.refresh);
      localStorage.setItem("user", JSON.stringify(response.user));
      
      // Update userStore with the new auth data
      setTokens(response.token.access, response.token.refresh);
      setUser(response.user);
      
      router.push('/dashboard');
    } else {
      console.log('Login failed with response:', response);
      toast.error(response.error || response.message || 'Login failed. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Enter your email below to login to your account.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/register" className="underline">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}