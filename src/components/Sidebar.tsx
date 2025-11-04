'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  Home,
  Settings,
  Users,
  FileText,
  BarChart3,
  ChevronRight,
  Circle,
  User,
  LogOut,
  ClipboardList,
  Upload,
  Package,
  CalendarDays,
} from 'lucide-react';
import { ACTIVE_PAGE_TO_PATH, type ActivePage } from '@/lib/navigation';

interface SidebarProps {
  activeItem?: ActivePage;
}

interface SidebarMenuItem {
  icon: LucideIcon;
  label: string;
  page?: ActivePage;
  count?: number | null;
  children?: Array<{ label: string; page: ActivePage }>;
  activePages?: ActivePage[];
}

const menuItems: SidebarMenuItem[] = [
  {
    icon: Home,
    label: 'Dashboard',
    page: 'Dashboard',
    activePages: ['Dashboard', 'DashboardKRP', 'DashboardMobilTanki', 'DashboardAMT'],
    children: [
      { label: 'Dashboard MT', page: 'DashboardMobilTanki' },
      { label: 'Dashboard KRP', page: 'DashboardKRP' },
    ],
  },
  {
    icon: ClipboardList,
    label: 'Laporan Harian',
    activePages: ['DailyReport', 'VehicleChecklist'],
    children: [
      { label: 'Data Operasional', page: 'DailyReport' },
      { label: 'Checklist Harian MT', page: 'VehicleChecklist' },
    ],
  },
  {
    icon: Upload,
    label: 'Upload Dokumen',
    page: 'DocumentUpload',
    count: 12,
    activePages: ['DocumentUpload', 'DocumentSPP'],
    children: [{ label: 'Dokumen SPP', page: 'DocumentSPP' }],
  },
  {
    icon: Users,
    label: 'Master Data Kendaraan',
    activePages: ['VehicleMaster', 'VehicleMasterBiruPutih', 'VehicleMasterKRP'],
    children: [
      { label: 'Kendaraan MT', page: 'VehicleMasterBiruPutih' },
      { label: 'Kendaraan KRP', page: 'VehicleMasterKRP' },
    ],
  },
  {
    icon: User,
    label: 'Master Data Personel',
    activePages: ['DriverMaster', 'DriverMasterDriver', 'DriverMasterSupir'],
    children: [
      { label: 'Master Data AMT', page: 'DriverMasterDriver' },
      { label: 'Master Data Driver', page: 'DriverMasterSupir' },
    ],
  },
  {
    icon: FileText,
    label: 'Workflow Maintenance',
    activePages: ['MaintenanceWorkflow', 'MaintenanceWorkflowTanki', 'MaintenanceWorkflowKRP'],
    children: [
      { label: 'Workflow Maintenance MT', page: 'MaintenanceWorkflowTanki' },
      { label: 'Workflow Maintenance Mobil KRP', page: 'MaintenanceWorkflowKRP' },
    ],
  },
  {
    icon: Package,
    label: 'Workshop Ban',
    activePages: [
      'TireWorkshop',
      'TireInstallationSchedule',
      'TireInstallationScheduleKRP',
      'TireInstallationScheduleTanki',
    ],
    children: [
      { label: 'Jadwal Pemasangan MT', page: 'TireInstallationScheduleTanki' },
      { label: 'Jadwal Pemasangan KRP', page: 'TireInstallationScheduleKRP' },
    ],
  },
  {
    icon: CalendarDays,
    label: 'Dispatcher',
    activePages: ['DispatcherScheduling', 'VehicleChangeForm', 'DispatcherInspection'],
    children: [
      { label: 'Dispatcher Scheduling', page: 'DispatcherScheduling' },
      { label: 'Form Unit Ganti Sewa', page: 'VehicleChangeForm' },
      { label: 'Inspection Kendaraan', page: 'DispatcherInspection' },
    ],
  },
];

const bottomMenuItems: SidebarMenuItem[] = [
  { icon: BarChart3, label: 'Reports & Analytics', page: 'Dashboard' },
  { icon: Settings, label: 'System Settings', page: 'SystemSettings' },
];

const getHref = (page?: ActivePage) => (page ? ACTIVE_PAGE_TO_PATH[page] : '#');

const isItemActive = (item: SidebarMenuItem, activeItem: ActivePage | undefined) => {
  if (!activeItem) {
    return false;
  }

  if (item.activePages?.includes(activeItem)) {
    return true;
  }

  if (item.page && item.page === activeItem) {
    return true;
  }

  return item.children?.some((child) => child.page === activeItem) ?? false;
};

export function Sidebar({ activeItem }: SidebarProps) {
  const initialExpandedMenu = useMemo(() => {
    const match = menuItems.find((item) => item.children?.some((child) => child.page === activeItem));
    return match?.label ?? null;
  }, [activeItem]);

  const [expandedMenu, setExpandedMenu] = useState<string | null>(initialExpandedMenu);

  useEffect(() => {
    setExpandedMenu(initialExpandedMenu);
  }, [initialExpandedMenu]);

  return (
    <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white flex flex-col h-screen shadow-xl">
      <div className="p-6 border-b border-blue-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
            <span className="text-blue-600 font-bold">OILS</span>
          </div>
          <div>
            <div className="font-bold text-lg">OILS</div>
            <div className="font-bold text-lg">PATRA LOGISTIK</div>
            <div className="text-xs text-blue-200">Management System</div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-blue-500/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">Joni Talang</div>
            <div className="text-xs text-blue-200">Fleet Manager</div>
          </div>
          <Circle className="w-2 h-2 fill-green-400 text-green-400" />
        </div>
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => {
            const expanded = expandedMenu === item.label || isItemActive(item, activeItem);
            const isActive = isItemActive(item, activeItem);
            const Wrapper: React.ElementType = item.children ? 'div' : Link;

            return (
              <div key={item.label}>
                <Wrapper
                  {...(!item.children
                    ? { href: getHref(item.page), prefetch: true }
                    : { onClick: () => setExpandedMenu(expanded ? null : item.label) })}
                  className={`flex items-center gap-3 px-3 py-3 mx-1 rounded-lg cursor-pointer transition-all duration-200 group ${
                    isActive ? 'bg-white/20 shadow-lg border-r-4 border-white' : 'hover:bg-white/10 hover:translate-x-1'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-blue-200'}`} />
                  <span className={`flex-1 text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                  {item.count ? (
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">{item.count}</span>
                  ) : null}
                  {item.children ? (
                    <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
                  ) : null}
                </Wrapper>

                {item.children && expanded ? (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.children.map((child) => {
                      const childActive = activeItem === child.page;
                      return (
                        <Link
                          key={child.label}
                          href={getHref(child.page)}
                          prefetch
                          className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-all duration-200 rounded ${
                            childActive ? 'text-white bg-white/10' : 'text-blue-200 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <Circle className="w-1.5 h-1.5 fill-current" />
                          <span>{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-blue-500/30">
        <nav className="space-y-1 py-4 px-2">
          {bottomMenuItems.map((item) => {
            const active = item.page ? item.page === activeItem : false;
            return (
              <Link
                key={item.label}
                href={getHref(item.page)}
                prefetch
                className={`flex items-center gap-3 px-3 py-3 mx-1 rounded-lg cursor-pointer transition-all duration-200 ${
                  active ? 'bg-white/20 shadow-lg border-r-4 border-white' : 'hover:bg-white/10 hover:translate-x-1'
                }`}
              >
                <item.icon className={`w-5 h-5 ${active ? 'text-white' : 'text-blue-200'}`} />
                <span className={`text-sm ${active ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-blue-500/30">
        <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl font-medium">
          USER GUIDE
        </button>

        <div className="flex items-center justify-between mt-4">
          <div className="text-xs text-blue-200">© 2024 OLS Fleet System</div>
          <button className="p-1 hover:bg-white/10 rounded transition-colors">
            <LogOut className="w-4 h-4 text-blue-200" />
          </button>
        </div>
      </div>
    </div>
  );
}
