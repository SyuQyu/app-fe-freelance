import { Plus, Download, Upload, RefreshCw, AlertTriangle, Settings, MapPin, Calendar } from 'lucide-react';

export function QuickActions() {
  const actions = [
    {
      icon: Plus,
      label: 'Add Vehicle',
      description: 'Register new vehicle',
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => console.log('Add vehicle')
    },
    {
      icon: MapPin,
      label: 'Plan Route',
      description: 'Create new route',
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => console.log('Plan route')
    },
    {
      icon: Calendar,
      label: 'Schedule Maintenance',
      description: 'Book service appointment',
      color: 'bg-orange-500 hover:bg-orange-600',
      onClick: () => console.log('Schedule maintenance')
    },
    {
      icon: Download,
      label: 'Export Data',
      description: 'Download fleet report',
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => console.log('Export data')
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
      <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`${action.color} text-white p-4 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg group`}
          >
            <action.icon className="w-6 h-6 mb-2 mx-auto" />
            <div className="text-sm font-medium">{action.label}</div>
            <div className="text-xs opacity-90 mt-1">{action.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}