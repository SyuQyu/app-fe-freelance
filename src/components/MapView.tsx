'use client';

import { MapPin, Layers, Maximize, RotateCcw, Navigation, Truck, AlertTriangle, Clock, Fuel } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';

interface VehicleMarker {
  id: string;
  x: string;
  y: string;
  status: 'active' | 'idle' | 'maintenance' | 'offline';
  vehicleCode: string;
  speed: number;
  fuel: number;
  driver: string;
  lastUpdate: string;
}

export function MapView() {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleMarker | null>(null);
  const [mapView, setMapView] = useState<'satellite' | 'street' | 'terrain'>('satellite');

  const vehicles: VehicleMarker[] = [
    { 
      id: '1', 
      x: '25%', 
      y: '35%', 
      status: 'active',
      vehicleCode: 'B 9254 HT',
      speed: 65,
      fuel: 85,
      driver: 'Ahmad Subandi',
      lastUpdate: '2 min ago'
    },
    { 
      id: '2', 
      x: '45%', 
      y: '25%', 
      status: 'idle',
      vehicleCode: 'B 9254 HO',
      speed: 0,
      fuel: 92,
      driver: 'Budi Santoso',
      lastUpdate: '5 min ago'
    },
    { 
      id: '3', 
      x: '65%', 
      y: '45%', 
      status: 'active',
      vehicleCode: 'B 9254 HA',
      speed: 45,
      fuel: 72,
      driver: 'Dedi Kurniawan',
      lastUpdate: '1 min ago'
    },
    { 
      id: '4', 
      x: '35%', 
      y: '55%', 
      status: 'maintenance',
      vehicleCode: 'B 9254 HE',
      speed: 0,
      fuel: 45,
      driver: 'Eko Prasetyo',
      lastUpdate: '15 min ago'
    },
    { 
      id: '5', 
      x: '75%', 
      y: '30%', 
      status: 'offline',
      vehicleCode: 'B 9254 HU',
      speed: 0,
      fuel: 0,
      driver: 'Fajar Hidayat',
      lastUpdate: '2 hours ago'
    }
  ];

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'maintenance': return 'bg-orange-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getMarkerIcon = (status: string) => {
    switch (status) {
      case 'active': return Truck;
      case 'idle': return Clock;
      case 'maintenance': return AlertTriangle;
      case 'offline': return AlertTriangle;
      default: return MapPin;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Real-time Fleet Tracking</h2>
            <p className="text-sm text-gray-600 mt-1">Live GPS positions and vehicle status monitoring</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Map View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(['satellite', 'street', 'terrain'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setMapView(view)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors capitalize ${
                    mapView === view 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
            
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Maximize className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="relative h-96 bg-gray-100 overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1722082839885-49f018c75614?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWElMjBtYXAlMjBzYXRlbGxpdGUlMjB2aWV3fGVufDF8fHx8MTc1NzkxMDkzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Fleet Map View"
          className="w-full h-full object-cover"
        />
        
        {/* Vehicle Markers */}
        {vehicles.map((vehicle) => {
          const MarkerIcon = getMarkerIcon(vehicle.status);
          return (
            <div
              key={vehicle.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ left: vehicle.x, top: vehicle.y }}
              onClick={() => setSelectedVehicle(selectedVehicle?.id === vehicle.id ? null : vehicle)}
            >
              <div className="relative">
                <div className={`w-10 h-10 ${getMarkerColor(vehicle.status)} rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 transition-transform`}>
                  <MarkerIcon className="w-5 h-5 text-white" />
                </div>
                <div className={`absolute top-0 left-0 w-10 h-10 ${getMarkerColor(vehicle.status)} rounded-full animate-ping opacity-30`}></div>
                
                {/* Vehicle Code Label */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {vehicle.vehicleCode}
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Vehicle Info Popup */}
        {selectedVehicle && (
          <div className="absolute top-4 right-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{selectedVehicle.vehicleCode}</h3>
              <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                selectedVehicle.status === 'active' ? 'bg-green-100 text-green-700' :
                selectedVehicle.status === 'idle' ? 'bg-yellow-100 text-yellow-700' :
                selectedVehicle.status === 'maintenance' ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'
              }`}>
                {selectedVehicle.status}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Navigation className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">Speed</div>
                  <div className="text-lg font-bold">{selectedVehicle.speed} km/h</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Fuel className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Fuel Level</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          selectedVehicle.fuel > 50 ? 'bg-green-500' :
                          selectedVehicle.fuel > 25 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${selectedVehicle.fuel}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{selectedVehicle.fuel}%</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-3">
                <div className="text-sm text-gray-600">Driver: <span className="font-medium text-gray-900">{selectedVehicle.driver}</span></div>
                <div className="text-xs text-gray-500 mt-1">Last update: {selectedVehicle.lastUpdate}</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Map Controls */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md overflow-hidden">
          <button className="block p-3 hover:bg-gray-50 border-b border-gray-200 transition-colors">
            <span className="text-lg font-semibold">+</span>
          </button>
          <button className="block p-3 hover:bg-gray-50 border-b border-gray-200 transition-colors">
            <span className="text-lg font-semibold">−</span>
          </button>
          <button className="block p-3 hover:bg-gray-50 border-b border-gray-200 transition-colors">
            <Layers className="w-4 h-4" />
          </button>
          <button className="block p-3 hover:bg-gray-50 transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
          <div className="text-sm font-medium text-gray-900 mb-2">Status Legend</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Active ({vehicles.filter(v => v.status === 'active').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Idle ({vehicles.filter(v => v.status === 'idle').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Maintenance ({vehicles.filter(v => v.status === 'maintenance').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Offline ({vehicles.filter(v => v.status === 'offline').length})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}