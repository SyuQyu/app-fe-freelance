'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Login } from '@/components/Login';
import { useAuth } from '@/components/AuthContext';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  return <Login />;
}
