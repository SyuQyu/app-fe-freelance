'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Breadcrumb } from '@/components/Breadcrumb';
import { PATH_TO_ACTIVE_PAGE, type ActivePage } from '@/lib/navigation';
import { useAuth } from '@/components/AuthContext';

const DEFAULT_ACTIVE_PAGE: ActivePage = 'Dashboard';

const DIRECT_PATH_LOOKUP = new Map<string, ActivePage>(Object.entries(PATH_TO_ACTIVE_PAGE));
const NORMALIZED_PATH_CACHE = new Map<string, ActivePage>();

const normalizePath = (pathname: string | null | undefined): string => {
  if (!pathname) {
    return '/dashboard';
  }
  if (pathname !== '/' && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
};

const resolveActivePage = (pathname: string | null | undefined): ActivePage => {
  const normalized = normalizePath(pathname);

  const directMatch = DIRECT_PATH_LOOKUP.get(normalized);
  if (directMatch) {
    return directMatch;
  }

  const cached = NORMALIZED_PATH_CACHE.get(normalized);
  if (cached) {
    return cached;
  }

  const segments = normalized.split('/').filter(Boolean);
  while (segments.length > 0) {
    const candidate = `/${segments.join('/')}`;
    const match = DIRECT_PATH_LOOKUP.get(candidate);
    if (match) {
      NORMALIZED_PATH_CACHE.set(normalized, match);
      return match;
    }
    segments.pop();
  }

  NORMALIZED_PATH_CACHE.set(normalized, DEFAULT_ACTIVE_PAGE);
  return DEFAULT_ACTIVE_PAGE;
};

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  const activePage = useMemo(() => resolveActivePage(pathname), [pathname]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeItem={activePage} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <Breadcrumb activePage={activePage} />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
