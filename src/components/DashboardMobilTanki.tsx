'use client';

import { RefreshCw, Calendar, Download, Settings } from 'lucide-react';
import { StatsCards } from './StatsCards';
import { MapView } from './MapView';
import { DataTables } from './DataTables';
import { RecentAlerts } from './RecentAlerts';

export function DashboardMobilTanki() {
  return (
    <div className="p-6 max-w-full">z
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Mobil Tanki</h1>
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
