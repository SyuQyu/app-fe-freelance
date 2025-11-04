'use client';

import { Home, ChevronRight } from 'lucide-react';
import { ACTIVE_PAGE_LABELS, type ActivePage } from '@/lib/navigation';

interface BreadcrumbProps {
  activePage: ActivePage;
}

export function Breadcrumb({ activePage }: BreadcrumbProps) {
  const label = ACTIVE_PAGE_LABELS[activePage] ?? ACTIVE_PAGE_LABELS.Dashboard;

  return (
    <div className="bg-gray-100 px-6 py-3 border-b border-gray-200">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Home className="w-4 h-4" />
        <span>Home</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800">{label}</span>
      </div>
    </div>
  );
}
