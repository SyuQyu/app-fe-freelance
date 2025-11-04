import { Home, ChevronRight } from 'lucide-react';

export function Breadcrumb() {
  return (
    <div className="bg-gray-100 px-6 py-3 border-b border-gray-200">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Home className="w-4 h-4" />
        <span>Home</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800">Dashboard Fleet</span>
      </div>
    </div>
  );
}