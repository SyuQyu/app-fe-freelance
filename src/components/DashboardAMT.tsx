import { useState } from 'react';
import { RefreshCw, Calendar, Download, Settings, TrendingUp, TrendingDown, Truck, MapPin, AlertTriangle, Pause, CheckCircle } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: any;
  color: string;
  bgColor: string;
  progress?: number;
}

function StatCard({ title, value, subtitle, trend, trendValue, icon: Icon, color, bgColor, progress }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            trend === 'up' ? 'bg-green-100 text-green-700' :
            trend === 'down' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {trend === 'up' && <TrendingUp className="w-3 h-3" />}
            {trend === 'down' && <TrendingDown className="w-3 h-3" />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-600">{title}</div>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
        
        {progress !== undefined && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Active Status</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  progress > 80 ? 'bg-green-500' :
                  progress > 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function DashboardAMT() {
  const stats = [
    {
      title: 'Total Kendaraan AMT',
      value: '12',
      subtitle: 'Kendaraan Biru Putih Aktif',
      trend: 'neutral' as const,
      trendValue: '0%',
      icon: Truck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      progress: 100
    },
    {
      title: 'Stand By',
      value: '8',
      subtitle: 'Siap Dispatch',
      trend: 'up' as const,
      trendValue: '+15%',
      icon: Pause,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      progress: 67
    },
    {
      title: 'GPS Inactive',
      value: '2',
      subtitle: 'Perlu Perhatian',
      trend: 'down' as const,
      trendValue: '-5%',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      progress: 17
    },
    {
      title: 'GPS Active',
      value: '10',
      subtitle: 'Real-time Tracking',
      trend: 'up' as const,
      trendValue: '+8%',
      icon: MapPin,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      progress: 83
    }
  ];

  const amtVehicles = [
    { nopol: 'B 1234 ABC', status: 'Standby', driver: 'Ahmad Yani', location: 'Pool Marunda', gps: 'Active' },
    { nopol: 'B 5678 DEF', status: 'Operasional', driver: 'Budi Santoso', location: 'Gresik Terminal', gps: 'Active' },
    { nopol: 'B 9012 GHI', status: 'Standby', driver: 'Candra Wijaya', location: 'Pool Marunda', gps: 'Active' },
    { nopol: 'B 3456 JKL', status: 'Maintenance', driver: '-', location: 'Workshop', gps: 'Inactive' },
    { nopol: 'B 7890 MNO', status: 'Operasional', driver: 'Dedi Kurniawan', location: 'Cilacap Terminal', gps: 'Active' },
    { nopol: 'B 2345 PQR', status: 'Standby', driver: 'Eko Prasetyo', location: 'Pool Marunda', gps: 'Active' },
    { nopol: 'B 6789 STU', status: 'Operasional', driver: 'Fajar Hidayat', location: 'Semarang Terminal', gps: 'Active' },
    { nopol: 'B 0123 VWX', status: 'Standby', driver: 'Gunawan', location: 'Pool Marunda', gps: 'Active' },
  ];

  return (
    <div className="p-6 max-w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard AMT (Kendaraan Biru Putih)</h1>
          <p className="text-gray-600 mt-2">
            Monitoring real-time kendaraan AMT dan performa operasional
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Status Overview */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Kendaraan AMT</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Standby</div>
                  <div className="text-sm text-gray-500">Siap operasional</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">8</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Operasional</div>
                  <div className="text-sm text-gray-500">Sedang berjalan</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">3</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Maintenance</div>
                  <div className="text-sm text-gray-500">Dalam perbaikan</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-orange-600">1</div>
            </div>
          </div>
        </div>

        {/* GPS Status */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status GPS</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-green-100 rounded-full mb-4">
                <div className="text-4xl font-bold text-green-600">83%</div>
              </div>
              <div className="text-lg font-medium text-gray-900">GPS Active Rate</div>
              <div className="text-sm text-gray-500 mt-2">10 dari 12 kendaraan terhubung</div>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Daftar Kendaraan AMT</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Polisi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPS</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {amtVehicles.map((vehicle, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vehicle.nopol}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      vehicle.status === 'Standby' ? 'bg-green-100 text-green-700' :
                      vehicle.status === 'Operasional' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.driver}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      vehicle.gps === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {vehicle.gps}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Status: Online</span>
            </div>
            <span>•</span>
            <span>Kendaraan AMT: 12/12</span>
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
