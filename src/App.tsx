import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Breadcrumb } from './components/Breadcrumb';
import { StatsCards } from './components/StatsCards';
import { MapView } from './components/MapView';
import { DataTables } from './components/DataTables';
import { Toaster } from './components/ui/sonner';

import { RecentAlerts } from './components/RecentAlerts';
import { DashboardAMT } from './components/DashboardAMT';
import { DashboardKRP } from './components/DashboardKRP';
import { DashboardMobilTanki } from './components/DashboardMobilTanki';
import { VehicleMasterData } from './components/VehicleMasterData';
import { VehicleMasterDataBiruPutih } from './components/VehicleMasterDataBiruPutih';
import { VehicleMasterDataKRP } from './components/VehicleMasterDataKRP';
import { DriverMasterData } from './components/DriverMasterData';
import { DriverMasterDataDriver } from './components/DriverMasterDataDriver';
import { DriverMasterDataSupir } from './components/DriverMasterDataSupir';
import { MaintenanceWorkflow } from './components/MaintenanceWorkflow';
import { MaintenanceWorkflowTanki } from './components/MaintenanceWorkflowTanki';
import { MaintenanceWorkflowKRP } from './components/MaintenanceWorkflowKRP';
import { VehicleChecklist } from './components/VehicleChecklist';
import { DailyReport } from './components/DailyReport';

import { DocumentUpload } from './components/DocumentUpload';
import { DocumentSPP } from './components/DocumentSPP';

import { TireWorkshop } from './components/TireWorkshop';
import { TireInstallationSchedule } from './components/TireInstallationSchedule';
import { TireInstallationScheduleKRP } from './components/TireInstallationScheduleKRP';
import { TireInstallationScheduleTanki } from './components/TireInstallationScheduleTanki';
import { DispatcherScheduling } from './components/DispatcherScheduling';
import { VehicleChangeForm } from './components/VehicleChangeForm';
import { DispatcherInspectionKendaraan } from './components/DispatcherInspectionKendaraan';
import { SystemSettings } from './components/SystemSettings';
import { UserProfile } from './components/UserProfile';
import { Login } from './components/Login';
import { AuthProvider, useAuth } from './components/AuthContext';
import { DropdownSettingsProvider } from './components/DropdownSettingsContext';
import { RefreshCw, Calendar, Download, Settings } from 'lucide-react';

type ActivePage = 'Dashboard' | 'DashboardAMT' | 'DashboardKRP' | 'DashboardMobilTanki' | 'VehicleMaster' | 'VehicleMasterBiruPutih' | 'VehicleMasterKRP' | 'DriverMaster' | 'DriverMasterDriver' | 'DriverMasterSupir' | 'RepairHistory' | 'MaintenanceWorkflow' | 'MaintenanceWorkflowTanki' | 'MaintenanceWorkflowKRP' | 'VehicleChecklist' | 'TireWorkshop' | 'TireInstallationSchedule' | 'TireInstallationScheduleKRP' | 'TireInstallationScheduleTanki' | 'DailyReport' | 'DocumentUpload' | 'DocumentSPP' | 'DispatcherScheduling' | 'VehicleChangeForm' | 'DispatcherInspection' | 'SystemSettings' | 'UserProfile';

function AppContent() {
  const { isAuthenticated, login } = useAuth();
  const [activePage, setActivePage] = useState<ActivePage>('Dashboard');

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  // Handler untuk menyinkronkan data dari Dispatcher Scheduling
  const handleDispatcherDataUpdate = (standbyDrivers: any[], standbyVehicles: any[], runningSchedules: any[]) => {
    // Simpan running schedules ke window object agar bisa diakses oleh VehicleChangeForm
    (window as any).dispatcherRunningSchedules = runningSchedules;
  };

  const renderContent = () => {
    switch (activePage) {
      case 'DashboardAMT':
        return <DashboardAMT />;
      case 'DashboardKRP':
        return <DashboardKRP />;
      case 'DashboardMobilTanki':
        return <DashboardMobilTanki />;
      case 'VehicleMaster':
        return <VehicleMasterData />;
      case 'VehicleMasterBiruPutih':
        return <VehicleMasterDataBiruPutih />;
      case 'VehicleMasterKRP':
        return <VehicleMasterDataKRP />;
      case 'DriverMaster':
        return <DriverMasterData />;
      case 'DriverMasterDriver':
        return <DriverMasterDataDriver />;
      case 'DriverMasterSupir':
        return <DriverMasterDataSupir />;
      case 'MaintenanceWorkflow':
        return <MaintenanceWorkflow />;
      case 'MaintenanceWorkflowTanki':
        return <MaintenanceWorkflowTanki />;
      case 'MaintenanceWorkflowKRP':
        return <MaintenanceWorkflowKRP />;
      case 'VehicleChecklist':
        return <VehicleChecklist />;
      case 'TireWorkshop':
        return <TireWorkshop />;
      case 'TireInstallationSchedule':
        return <TireInstallationSchedule />;
      case 'TireInstallationScheduleKRP':
        return <TireInstallationScheduleKRP />;
      case 'TireInstallationScheduleTanki':
        return <TireInstallationScheduleTanki />;
      case 'DailyReport':
        return <DailyReport />;
      case 'DocumentUpload':
        return <DocumentUpload />;
      case 'DocumentSPP':
        return <DocumentSPP />;
      case 'DispatcherScheduling':
        return <DispatcherScheduling onDataUpdate={handleDispatcherDataUpdate} />;
      case 'VehicleChangeForm':
        return <VehicleChangeForm />;
      case 'DispatcherInspection':
        return <DispatcherInspectionKendaraan />;
      case 'SystemSettings':
        return <SystemSettings />;
      case 'UserProfile':
        return <UserProfile />;
      case 'Dashboard':
      default:
        return (
          <div className="p-6 max-w-full">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Fleet Management Dashboard</h1>
                <p className="text-gray-600 mt-2">
                  Real-time overview of your fleet operations and performance metrics
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleTimeString('id-ID', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </div>
                
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm font-medium">Refresh</span>
                </button>
                
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">Export Report</span>
                </button>
              </div>
            </div>
            
            {/* Statistics Cards */}
            <StatsCards />
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Map View - Takes 2 columns */}
              <div className="lg:col-span-2">
                <MapView />
              </div>
              
              {/* Alerts Panel - Takes 1 column */}
              <div className="lg:col-span-1">
                <RecentAlerts />
              </div>
            </div>
            
            {/* Data Tables */}
            <DataTables />
            
            {/* Footer Info */}
            <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>System Status: Online</span>
                  </div>
                  <span>•</span>
                  <span>Total Active Connections: 16/20</span>
                  <span>•</span>
                  <span>Data Sync: Real-time</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    <Calendar className="w-4 h-4" />
                    <span>Schedule Report</span>
                  </button>
                  
                  <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Dashboard Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const handleMenuClick = (page: ActivePage) => {
    setActivePage(page);
  };

  return (
    <DropdownSettingsProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div onClick={(e) => {
          const target = e.target as HTMLElement;
          const menuItem = target.closest('[data-menu-item]');
          if (menuItem) {
            const page = menuItem.getAttribute('data-menu-item') as ActivePage;
            handleMenuClick(page);
          }
        }}>
          <Sidebar activeItem={activePage} />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <Header onNavigate={handleMenuClick} />
          
          {/* Breadcrumb */}
          <Breadcrumb />
        
        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
      
      {/* Toast Notifications */}
      <Toaster position="top-right" />
      </div>
    </DropdownSettingsProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}