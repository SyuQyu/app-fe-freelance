'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import type { ActivePage } from '@/lib/navigation';

function LoadingPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
      Memuat konten...
    </div>
  );
}

const lazy = <T extends ComponentType<any>>(loader: () => Promise<T>) =>
  dynamic(async () => ({ default: await loader() }), {
    ssr: false,
    loading: LoadingPlaceholder,
  });

const lazyFrom = <Module extends Record<PropertyKey, unknown>, Key extends keyof Module>(
  importer: () => Promise<Module>,
  key: Key,
) =>
  lazy(() => importer().then((module) => module[key] as ComponentType<any>));

const PAGE_COMPONENTS: Partial<Record<ActivePage, ReturnType<typeof lazy>>> = {
  Dashboard: lazyFrom(() => import('@/components/DashboardHome'), 'DashboardHome'),
  DashboardAMT: lazyFrom(() => import('@/components/DashboardAMT'), 'DashboardAMT'),
  DashboardKRP: lazyFrom(() => import('@/components/DashboardKRP'), 'DashboardKRP'),
  DashboardMobilTanki: lazyFrom(() => import('@/components/DashboardMobilTanki'), 'DashboardMobilTanki'),
  VehicleMaster: lazyFrom(() => import('@/components/VehicleMasterData'), 'VehicleMasterData'),
  VehicleMasterBiruPutih: lazyFrom(() => import('@/components/VehicleMasterDataBiruPutih'), 'VehicleMasterDataBiruPutih'),
  VehicleMasterKRP: lazyFrom(() => import('@/components/VehicleMasterDataKRP'), 'VehicleMasterDataKRP'),
  DriverMaster: lazyFrom(() => import('@/components/DriverMasterData'), 'DriverMasterData'),
  DriverMasterDriver: lazyFrom(() => import('@/components/DriverMasterDataDriver'), 'DriverMasterDataDriver'),
  DriverMasterSupir: lazyFrom(() => import('@/components/DriverMasterDataSupir'), 'DriverMasterDataSupir'),
  MaintenanceWorkflow: lazyFrom(() => import('@/components/MaintenanceWorkflow'), 'MaintenanceWorkflow'),
  MaintenanceWorkflowTanki: lazyFrom(() => import('@/components/MaintenanceWorkflowTanki'), 'MaintenanceWorkflowTanki'),
  MaintenanceWorkflowKRP: lazyFrom(() => import('@/components/MaintenanceWorkflowKRP'), 'MaintenanceWorkflowKRP'),
  VehicleChecklist: lazyFrom(() => import('@/components/VehicleChecklist'), 'VehicleChecklist'),
  TireWorkshop: lazyFrom(() => import('@/components/TireWorkshop'), 'TireWorkshop'),
  TireInstallationSchedule: lazyFrom(() => import('@/components/TireInstallationSchedule'), 'TireInstallationSchedule'),
  TireInstallationScheduleKRP: lazyFrom(() => import('@/components/TireInstallationScheduleKRP'), 'TireInstallationScheduleKRP'),
  TireInstallationScheduleTanki: lazyFrom(() => import('@/components/TireInstallationScheduleTanki'), 'TireInstallationScheduleTanki'),
  DailyReport: lazyFrom(() => import('@/components/DailyReport'), 'DailyReport'),
  DocumentUpload: lazyFrom(() => import('@/components/DocumentUpload'), 'DocumentUpload'),
  DocumentSPP: lazyFrom(() => import('@/components/DocumentSPP'), 'DocumentSPP'),
  DispatcherScheduling: lazyFrom(() => import('@/components/DispatcherScheduling'), 'DispatcherScheduling'),
  VehicleChangeForm: lazyFrom(() => import('@/components/VehicleChangeForm'), 'VehicleChangeForm'),
  DispatcherInspection: lazyFrom(() => import('@/components/DispatcherInspectionKendaraan'), 'DispatcherInspectionKendaraan'),
  SystemSettings: lazyFrom(() => import('@/components/SystemSettings'), 'SystemSettings'),
  UserProfile: lazyFrom(() => import('@/components/UserProfile'), 'UserProfile'),
};

interface LazyPageRendererProps {
  activePage: ActivePage;
}

export function LazyPageRenderer({ activePage }: LazyPageRendererProps) {
  const Component = PAGE_COMPONENTS[activePage];

  if (!Component) {
    return null;
  }

  return <Component />;
}
