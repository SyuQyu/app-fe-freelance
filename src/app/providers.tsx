'use client';

import type { ReactNode } from 'react';
import { AuthProvider } from '@/components/AuthContext';
import { DropdownSettingsProvider } from '@/components/DropdownSettingsContext';
import { Toaster } from '@/components/ui/sonner';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <DropdownSettingsProvider>
        {children}
        <Toaster position="top-right" />
      </DropdownSettingsProvider>
    </AuthProvider>
  );
}
