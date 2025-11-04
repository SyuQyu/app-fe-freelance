export type ActivePage =
  | 'Dashboard'
  | 'DashboardAMT'
  | 'DashboardKRP'
  | 'DashboardMobilTanki'
  | 'VehicleMaster'
  | 'VehicleMasterBiruPutih'
  | 'VehicleMasterKRP'
  | 'DriverMaster'
  | 'DriverMasterDriver'
  | 'DriverMasterSupir'
  | 'MaintenanceWorkflow'
  | 'MaintenanceWorkflowTanki'
  | 'MaintenanceWorkflowKRP'
  | 'VehicleChecklist'
  | 'TireWorkshop'
  | 'TireInstallationSchedule'
  | 'TireInstallationScheduleKRP'
  | 'TireInstallationScheduleTanki'
  | 'DailyReport'
  | 'DocumentUpload'
  | 'DocumentSPP'
  | 'DispatcherScheduling'
  | 'VehicleChangeForm'
  | 'DispatcherInspection'
  | 'SystemSettings'
  | 'UserProfile';

export const ACTIVE_PAGE_TO_PATH: Record<ActivePage, string> = {
  Dashboard: '/dashboard',
  DashboardAMT: '/dashboard/amt',
  DashboardKRP: '/dashboard/krp',
  DashboardMobilTanki: '/dashboard/mobil-tanki',
  VehicleMaster: '/vehicle-master',
  VehicleMasterBiruPutih: '/vehicle-master/mt',
  VehicleMasterKRP: '/vehicle-master/krp',
  DriverMaster: '/driver-master',
  DriverMasterDriver: '/driver-master/amt',
  DriverMasterSupir: '/driver-master/supir',
  MaintenanceWorkflow: '/maintenance-workflow',
  MaintenanceWorkflowTanki: '/maintenance-workflow/tanki',
  MaintenanceWorkflowKRP: '/maintenance-workflow/krp',
  VehicleChecklist: '/vehicle-checklist',
  TireWorkshop: '/tire-workshop',
  TireInstallationSchedule: '/tire-installation-schedule',
  TireInstallationScheduleKRP: '/tire-installation-schedule/krp',
  TireInstallationScheduleTanki: '/tire-installation-schedule/tanki',
  DailyReport: '/daily-report',
  DocumentUpload: '/document-upload',
  DocumentSPP: '/document-upload/spp',
  DispatcherScheduling: '/dispatcher/scheduling',
  VehicleChangeForm: '/dispatcher/vehicle-change-form',
  DispatcherInspection: '/dispatcher/inspection',
  SystemSettings: '/system-settings',
  UserProfile: '/user-profile',
};

export const PATH_TO_ACTIVE_PAGE = Object.fromEntries(
  Object.entries(ACTIVE_PAGE_TO_PATH).map(([key, value]) => [value, key as ActivePage]),
) as Record<string, ActivePage>;

export const ACTIVE_PAGE_LABELS: Record<ActivePage, string> = {
  Dashboard: 'Dashboard Fleet',
  DashboardAMT: 'Dashboard AMT',
  DashboardKRP: 'Dashboard KRP',
  DashboardMobilTanki: 'Dashboard MT',
  VehicleMaster: 'Master Data Kendaraan',
  VehicleMasterBiruPutih: 'Master Data Kendaraan MT',
  VehicleMasterKRP: 'Master Data Kendaraan KRP',
  DriverMaster: 'Master Data Personel',
  DriverMasterDriver: 'Master Data AMT',
  DriverMasterSupir: 'Master Data Driver',
  MaintenanceWorkflow: 'Workflow Maintenance',
  MaintenanceWorkflowTanki: 'Workflow Maintenance MT',
  MaintenanceWorkflowKRP: 'Workflow Maintenance KRP',
  VehicleChecklist: 'Checklist Harian MT',
  TireWorkshop: 'Workshop Ban',
  TireInstallationSchedule: 'Jadwal Pemasangan Ban',
  TireInstallationScheduleKRP: 'Jadwal Pemasangan Ban KRP',
  TireInstallationScheduleTanki: 'Jadwal Pemasangan Ban MT',
  DailyReport: 'Laporan Harian',
  DocumentUpload: 'Upload Dokumen',
  DocumentSPP: 'Dokumen SPP',
  DispatcherScheduling: 'Dispatcher Scheduling',
  VehicleChangeForm: 'Form Unit Ganti Sewa',
  DispatcherInspection: 'Dispatcher Inspection Kendaraan',
  SystemSettings: 'System Settings',
  UserProfile: 'User Profile',
};
