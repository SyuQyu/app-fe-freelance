import { TrendingUp, TrendingDown, Truck, Zap, MapPin, AlertTriangle, CheckCircle, Pause } from 'lucide-react';

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

export function StatsCards() {
  const stats = [
    {
      title: 'Total Fleet',
      value: '20',
      subtitle: 'Active Vehicles',
      trend: 'neutral' as const,
      trendValue: '0%',
      icon: Truck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      progress: 100
    },
    {
      title: 'Stand By',
      value: '15',
      subtitle: 'Ready for Dispatch',
      trend: 'up' as const,
      trendValue: '+12%',
      icon: Pause,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      progress: 75
    },
    {
      title: 'GPS Inactive',
      value: '4',
      subtitle: 'Requires Attention',
      trend: 'down' as const,
      trendValue: '-8%',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      progress: 20
    },
    {
      title: 'GPS Active',
      value: '16',
      subtitle: 'Real-time Tracking',
      trend: 'up' as const,
      trendValue: '+5%',
      icon: MapPin,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      progress: 80
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}