import { useState } from "react";
import {
  Home,
  Truck,
  MapPin,
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
} from "lucide-react";

interface SidebarProps {
  activeItem?: string;
}

export function Sidebar({
  activeItem = "Fleet",
}: SidebarProps) {
  const [expandedMenu, setExpandedMenu] = useState<
    string | null
  >(null);
  const getMenuItemValue = (label: string) => {
    switch (label) {
      case "Dashboard":
        return "Dashboard";
      case "Dashboard AMT":
        return "DashboardAMT";
      case "Dashboard KRP":
        return "DashboardKRP";
      case "Dashboard Mobil Tanki":
        return "DashboardMobilTanki";
      case "Laporan Harian":
        return "DailyReport";

      case "Upload Dokumen":
        return "DocumentUpload";
      case "Dokumen SPP":
        return "DocumentSPP";
      case "Master Data Kendaraan":
        return "VehicleMaster";
      case "Kendaraan MT":
        return "VehicleMasterBiruPutih";
      case "Kendaraan KRP":
        return "VehicleMasterKRP";
      case "Master Data Personel":
        return "DriverMaster";
      case "Master Data AMT":
        return "DriverMasterDriver";
      case "Master Data Driver":
        return "DriverMasterSupir";
      case "Workflow Maintenance":
        return "MaintenanceWorkflow";
      case "Workflow Maintenance Mobil Tanki":
        return "MaintenanceWorkflowTanki";
      case "Workflow Maintenance Mobil KRP":
        return "MaintenanceWorkflowKRP";
      case "Inspection Kendaraan":
        return "VehicleChecklist";
      case "Workshop Ban":
        return "TireWorkshop";
      case "Jadwal Pemasangan KRP":
        return "TireInstallationScheduleKRP";
      case "Jadwal Pemasangan Tanki":
        return "TireInstallationScheduleTanki";
      case "Dispatcher Scheduling":
        return "DispatcherScheduling";
      case "Form Unit Ganti Sewa":
        return "VehicleChangeForm";
      case "Dispatcher Inspection Kendaraan":
        return "DispatcherInspection";
      case "System Settings":
        return "SystemSettings";
      default:
        return "Dashboard";
    }
  };
  const menuItems = [
    {
      icon: Home,
      label: "Dashboard",
      active:
        activeItem === "Dashboard" ||
        activeItem === "DashboardKRP" ||
        activeItem === "DashboardMobilTanki",
      hasSubmenu: true,
      count: null,
    },
    {
      icon: ClipboardList,
      label: "Laporan Harian",
      active:
        activeItem === "DailyReport" ||
        activeItem === "VehicleChecklist",
      hasSubmenu: true,
      count: null,
    },
    {
      icon: Upload,
      label: "Upload Dokumen",
      active:
        activeItem === "DocumentUpload" ||
        activeItem === "DocumentSPP",
      hasSubmenu: true,
      count: 12,
    },
    {
      icon: Users,
      label: "Master Data Kendaraan",
      active:
        activeItem === "VehicleMasterBiruPutih" ||
        activeItem === "VehicleMasterKRP",
      hasSubmenu: true,
      count: 20,
    },
    {
      icon: User,
      label: "Master Data Personel",
      active:
        activeItem === "DriverMasterDriver" ||
        activeItem === "DriverMasterSupir",
      hasSubmenu: true,
      count: 15,
    },
    {
      icon: FileText,
      label: "Workflow Maintenance",
      active:
        activeItem === "MaintenanceWorkflowTanki" ||
        activeItem === "MaintenanceWorkflowKRP",
      hasSubmenu: true,
      count: 8,
    },
    {
      icon: Package,
      label: "Workshop Ban",
      active:
        activeItem === "TireInstallationScheduleKRP" ||
        activeItem === "TireInstallationScheduleTanki",
      hasSubmenu: true,
      count: null,
    },
    {
      icon: CalendarDays,
      label: "Dispatcher",
      active:
        activeItem === "DispatcherScheduling" ||
        activeItem === "VehicleChangeForm" ||
        activeItem === "DispatcherInspection",
      hasSubmenu: true,
      count: null,
    },
  ];

  const bottomMenuItems = [
    { icon: BarChart3, label: "Reports & Analytics" },
    { icon: Settings, label: "System Settings" },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white flex flex-col h-screen shadow-xl">
      {/* Logo Section */}
      <div className="p-6 border-b border-blue-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
            <span className="text-blue-600 font-bold">
              OILS
            </span>
          </div>
          <div>
            <div className="font-bold text-lg">OILS</div>
            <div className="font-bold text-lg">
              PATRA LOGISTIK
            </div>
            <div className="text-xs text-blue-200">
              Management System
            </div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="px-4 py-3 border-b border-blue-500/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">
              Joni Talang
            </div>
            <div className="text-xs text-blue-200">
              Fleet Manager
            </div>
          </div>
          <Circle className="w-2 h-2 fill-green-400 text-green-400" />
        </div>
      </div>

      {/* Main Menu */}
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {menuItems.map((item, index) => {
            const isExpanded =
              expandedMenu === item.label || item.active;

            return (
              <div key={index}>
                <div
                  data-menu-item={
                    item.hasSubmenu
                      ? undefined
                      : getMenuItemValue(item.label)
                  }
                  onClick={(e) => {
                    if (item.hasSubmenu) {
                      e.stopPropagation();
                      setExpandedMenu(
                        isExpanded ? null : item.label,
                      );
                    }
                  }}
                  className={`flex items-center gap-3 px-3 py-3 mx-1 rounded-lg cursor-pointer transition-all duration-200 group ${
                    item.active
                      ? "bg-white/20 shadow-lg border-r-4 border-white"
                      : "hover:bg-white/10 hover:translate-x-1"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 ${item.active ? "text-white" : "text-blue-200"}`}
                  />
                  <span
                    className={`flex-1 text-sm ${item.active ? "font-semibold" : "font-medium"}`}
                  >
                    {item.label}
                  </span>
                  {item.count && (
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.count}
                    </span>
                  )}
                  {item.hasSubmenu && (
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                    />
                  )}
                </div>

                {/* Submenu for expanded items */}
                {isExpanded && item.hasSubmenu && (
                  <div className="ml-8 mt-2 space-y-1">
                    {/* Dashboard Submenu */}
                    {item.label === "Dashboard" && (
                      <>
                        <div
                          data-menu-item="DashboardMobilTanki"
                          className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-all duration-200 rounded ${
                            activeItem === "DashboardMobilTanki"
                              ? "text-white bg-white/10"
                              : "text-blue-200 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <Circle className="w-1.5 h-1.5 fill-current" />
                          <span>Dashboard MT</span>
                        </div>

                        <div
                          data-menu-item="DashboardKRP"
                          className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-all duration-200 rounded ${
                            activeItem === "DashboardKRP"
                              ? "text-white bg-white/10"
                              : "text-blue-200 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <Circle className="w-1.5 h-1.5 fill-current" />
                          <span>Dashboard KRP</span>
                        </div>
                      </>
                    )}

                    {/* Laporan Harian Submenu */}
                    {item.label === "Laporan Harian" && (
                      <>
                        <div
                          data-menu-item="DailyReport"
                          className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-all duration-200 rounded ${
                            activeItem === "DailyReport"
                              ? "text-white bg-white/10"
                              : "text-blue-200 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <Circle className="w-1.5 h-1.5 fill-current" />
                          <span>Data Operasional</span>
                        </div>

                        <div
                          data-menu-item="VehicleChecklist"
                          className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-all duration-200 rounded ${
                            activeItem === "VehicleChecklist"
                              ? "text-white bg-white/10"
                              : "text-blue-200 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <Circle className="w-1.5 h-1.5 fill-current" />
                          <span>Checklist Harian MT</span>
                        </div>
                      </>
                    )}

                    {/* Upload Dokumen Submenu */}
                    {item.label === "Upload Dokumen" && (
                      <>
                        <div
                          data-menu-item="DocumentSPP"
                          className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-all duration-200 rounded ${
                            activeItem === "DocumentSPP"
                              ? "text-white bg-white/10"
                              : "text-blue-200 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <Circle className="w-1.5 h-1.5 fill-current" />
                          <span>Dokumen SPP</span>
                        </div>
                      </>
                    )}

                    {/* Master Data Kendaraan Submenu */}
                    {item.label === "Master Data Kendaraan" && (
                      <>
                        <div
                          data-menu-item="VehicleMasterBiruPutih"
                          className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-all duration-200 rounded ${
                            activeItem ===
                            "VehicleMasterBiruPutih"
                              ? "text-white bg-white/10"
                              : "text-blue-200 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <Circle className="w-1.5 h-1.5 fill-current" />
                          <span>Kendaraan MT</span>
                        </div>

                        <div
                          data-menu-item="VehicleMasterKRP"
                          className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-all duration-200 rounded ${
                            activeItem === "VehicleMasterKRP"
                              ? "text-white bg-white/10"
                              : "text-blue-200 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <Circle className="w-1.5 h-1.5 fill-current" />
                          <span>Kendaraan KRP</span>
                        </div>
                      </>
                    )}

                    {/* Master Data Personel Submenu */}
                    {item.label === "Master Data Personel" && (
                      <>
                        <div
                          data-menu-item="DriverMasterDriver"
                          className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-all duration-200 rounded ${
                            activeItem === "DriverMasterDriver"
                              ? "text-white bg-white/10"
                              : "text-blue-200 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <Circle className="w-1.5 h-1.5 fill-current" />
                          <span>Master Data AMT</span>
                        </div>

                        <div
                          data-menu-item="DriverMasterSupir"
                          className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-all duration-200 rounded ${
                            activeItem === "DriverMasterSupir"
                              ? "text-white bg-white/10"
                              : "text-blue-200 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <Circle className="w-1.5 h-1.5 fill-current" />
                          <span>Master Data Driver</span>
                        </div>
                      </>
                    )}

                    {/* Workflow Maintenance Submenu */}
                    {item.label === "Workflow Maintenance" && (
                      <>
                        <div
                          data-menu-item="MaintenanceWorkflowTanki"
                          className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-all duration-200 rounded ${
                            activeItem ===
                            "MaintenanceWorkflowTanki"
                              ? "text-white bg-white/10"
                              : "text-blue-200 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <Circle className="w-1.5 h-1.5 fill-current" />
                          <span>Workflow Maintenance MT</span>
                        </div>

                        <div
                          data-menu-item="MaintenanceWorkflowKRP"
                          className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-all duration-200 rounded ${
                            activeItem ===
                            "MaintenanceWorkflowKRP"
                              ? "text-white bg-white/10"
                              : "text-blue-200 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <Circle className="w-1.5 h-1.5 fill-current" />
                          <span>
                            Workflow Maintenance Mobil KRP
                          </span>
                        </div>
                      </>
                    )}

                    {/* Workshop Ban Submenu */}
                    {item.label === "Workshop Ban" && (
                      <>
                        <div
                          data-menu-item="TireInstallationScheduleTanki"
                          className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-all duration-200 rounded ${
                            activeItem ===
                            "TireInstallationScheduleTanki"
                              ? "text-white bg-white/10"
                              : "text-blue-200 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <Circle className="w-1.5 h-1.5 fill-current" />
                          <span>Jadwal Pemasangan MT</span>
                        </div>
                        <div
                          data-menu-item="TireInstallationScheduleKRP"
                          className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-all duration-200 rounded ${
                            activeItem ===
                            "TireInstallationScheduleKRP"
                              ? "text-white bg-white/10"
                              : "text-blue-200 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <Circle className="w-1.5 h-1.5 fill-current" />
                          <span>Jadwal Pemasangan KRP</span>
                        </div>
                      </>
                    )}

                    {/* Dispatcher Submenu */}
                    {item.label === "Dispatcher" && (
                      <>
                        <div
                          data-menu-item="DispatcherScheduling"
                          className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-all duration-200 rounded ${
                            activeItem ===
                            "DispatcherScheduling"
                              ? "text-white bg-white/10"
                              : "text-blue-200 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <Circle className="w-1.5 h-1.5 fill-current" />
                          <span>Dispatcher Scheduling</span>
                        </div>
                        <div
                          data-menu-item="VehicleChangeForm"
                          className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-all duration-200 rounded ${
                            activeItem === "VehicleChangeForm"
                              ? "text-white bg-white/10"
                              : "text-blue-200 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <Circle className="w-1.5 h-1.5 fill-current" />
                          <span>Form Unit Ganti Sewa</span>
                        </div>
                        <div
                          data-menu-item="DispatcherInspection"
                          className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-all duration-200 rounded ${
                            activeItem ===
                            "DispatcherInspection"
                              ? "text-white bg-white/10"
                              : "text-blue-200 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <Circle className="w-1.5 h-1.5 fill-current" />
                          <span>Inspection Kendaraan</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Menu */}
      <div className="border-t border-blue-500/30">
        <nav className="space-y-1 py-4 px-2">
          {bottomMenuItems.map((item, index) => (
            <div
              key={index}
              data-menu-item={getMenuItemValue(item.label)}
              className={`flex items-center gap-3 px-3 py-3 mx-1 rounded-lg cursor-pointer transition-all duration-200 ${
                activeItem === getMenuItemValue(item.label)
                  ? "bg-white/20 shadow-lg border-r-4 border-white"
                  : "hover:bg-white/10 hover:translate-x-1"
              }`}
            >
              <item.icon className={`w-5 h-5 ${
                activeItem === getMenuItemValue(item.label) ? "text-white" : "text-blue-200"
              }`} />
              <span className={`text-sm ${
                activeItem === getMenuItemValue(item.label) ? "font-semibold" : "font-medium"
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </nav>
      </div>

      {/* User Guide & Footer */}
      <div className="p-4 border-t border-blue-500/30">
        <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl font-medium">
          USER GUIDE
        </button>

        <div className="flex items-center justify-between mt-4">
          <div className="text-xs text-blue-200">
            © 2024 OLS Fleet System
          </div>
          <button className="p-1 hover:bg-white/10 rounded transition-colors">
            <LogOut className="w-4 h-4 text-blue-200" />
          </button>
        </div>
      </div>
    </div>
  );
}