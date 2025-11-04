'use client';

import { AlertTriangle, Clock, CheckCircle, Info, X } from 'lucide-react';
import { useState } from 'react';

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  vehicle?: string;
  timestamp: string;
  resolved: boolean;
}

export function RecentAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Low Fuel Alert',
      message: 'Vehicle fuel level below 20%',
      vehicle: 'B 9254 HE',
      timestamp: '5 minutes ago',
      resolved: false
    },
    {
      id: '2',
      type: 'error',
      title: 'GPS Signal Lost',
      message: 'Vehicle GPS tracking disconnected',
      vehicle: 'B 9254 HU',
      timestamp: '15 minutes ago',
      resolved: false
    },
    {
      id: '3',
      type: 'info',
      title: 'Route Update',
      message: 'New optimal route available for Semarang destination',
      timestamp: '1 hour ago',
      resolved: false
    },
    {
      id: '4',
      type: 'success',
      title: 'Maintenance Completed',
      message: 'Scheduled maintenance completed successfully',
      vehicle: 'B 9254 HO',
      timestamp: '2 hours ago',
      resolved: true
    },
    {
      id: '5',
      type: 'warning',
      title: 'Speed Limit Exceeded',
      message: 'Vehicle exceeded speed limit on highway',
      vehicle: 'B 9254 HT',
      timestamp: '3 hours ago',
      resolved: true
    }
  ]);

  const dismissAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'error': return AlertTriangle;
      case 'info': return Info;
      case 'success': return CheckCircle;
      default: return AlertTriangle;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'success': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const unresolvedAlerts = alerts.filter(alert => !alert.resolved);
  const resolvedAlerts = alerts.filter(alert => alert.resolved);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">System Alerts</h3>
            <p className="text-sm text-gray-600 mt-1">
              {unresolvedAlerts.length} active alerts requiring attention
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
              {unresolvedAlerts.length} Active
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-4 max-h-80 overflow-y-auto">
        {/* Unresolved Alerts */}
        {unresolvedAlerts.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Active Alerts</h4>
            <div className="space-y-3">
              {unresolvedAlerts.map((alert) => {
                const AlertIcon = getAlertIcon(alert.type);
                const colorClass = getAlertColor(alert.type);
                
                return (
                  <div key={alert.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}>
                      <AlertIcon className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-medium text-gray-900">{alert.title}</h5>
                          <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{alert.timestamp}</span>
                            </div>
                            {alert.vehicle && (
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                {alert.vehicle}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => dismissAlert(alert.id)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Resolved Alerts */}
        {resolvedAlerts.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Recently Resolved</h4>
            <div className="space-y-2">
              {resolvedAlerts.map((alert) => {
                const AlertIcon = getAlertIcon(alert.type);
                
                return (
                  <div key={alert.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg opacity-75">
                    <div className="w-6 h-6 bg-gray-200 rounded-lg flex items-center justify-center">
                      <AlertIcon className="w-3 h-3 text-gray-500" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium text-gray-700">{alert.title}</h5>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>{alert.timestamp}</span>
                        {alert.vehicle && (
                          <span className="bg-gray-200 px-2 py-1 rounded">
                            {alert.vehicle}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {alerts.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h4 className="font-medium text-gray-900">All Clear!</h4>
            <p className="text-sm text-gray-600 mt-1">No active alerts at this time</p>
          </div>
        )}
      </div>
      
      {alerts.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
            View Alert History →
          </button>
        </div>
      )}
    </div>
  );
}