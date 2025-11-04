'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Truck, User, Plus, CheckCircle, 
  Eye, XCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

// Master Data
const MASTER_DRIVERS = [
  { id: '1', employeeId: 'DRV001', namaLengkap: 'Budi Santoso', jenisSim: 'SIM B1', status: 'Available' },
  { id: '2', employeeId: 'DRV002', namaLengkap: 'Agus Prasetyo', jenisSim: 'SIM B2', status: 'Available' },
  { id: '3', employeeId: 'DRV003', namaLengkap: 'Joko Widodo', jenisSim: 'SIM B1', status: 'Available' },
  { id: '4', employeeId: 'DRV004', namaLengkap: 'Rudi Hartono', jenisSim: 'SIM B2', status: 'Available' },
  { id: '5', employeeId: 'DRV005', namaLengkap: 'Bambang Susilo', jenisSim: 'SIM B1', status: 'Available' }
];

const MASTER_VEHICLES = [
  { id: '1', nopolEksisting: 'B 1234 ABC', merkTypeMobil: 'Toyota Avanza 1.5', tahun: 2021, status: 'Available' },
  { id: '2', nopolEksisting: 'B 5678 DEF', merkTypeMobil: 'Toyota Innova 2.4', tahun: 2022, status: 'Available' },
  { id: '3', nopolEksisting: 'B 9012 GHI', merkTypeMobil: 'Honda CR-V 2.0', tahun: 2023, status: 'Available' },
  { id: '4', nopolEksisting: 'B 3456 JKL', merkTypeMobil: 'Suzuki Ertiga 1.5', tahun: 2021, status: 'Available' },
  { id: '5', nopolEksisting: 'B 7890 MNO', merkTypeMobil: 'Mitsubishi Xpander 1.5', tahun: 2022, status: 'Available' }
];

interface Schedule {
  id: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  plateNumber: string;
  vehicleType: string;
  tujuan: string;
  jamBerangkat: string;
  kmBerangkat: string;
  tanggalJadwal: string;
  status: 'terdaftar' | 'berjalan' | 'selesai';
  jamPulang?: string;
  kmKembali?: string;
  tanggalPulang?: string;
  createdAt: string;
}

export function DispatcherScheduling() {
  // Load schedules from localStorage
  const loadSchedules = () => {
    try {
      const saved = localStorage.getItem('dispatcherSchedules');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading schedules:', error);
      return [];
    }
  };

  const [schedules, setSchedules] = useState<Schedule[]>(loadSchedules());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSelesaiDialog, setShowSelesaiDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [activeTab, setActiveTab] = useState('standby');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Form state
  const [formData, setFormData] = useState({
    driverId: '',
    vehicleId: '',
    tujuan: '',
    jamBerangkat: '',
    kmBerangkat: '',
    tanggalJadwal: new Date().toISOString().split('T')[0]
  });

  // Selesai form state
  const [selesaiData, setSelesaiData] = useState({
    tanggalPulang: new Date().toISOString().split('T')[0],
    jamPulang: '',
    kmKembali: ''
  });

  // Save schedules to localStorage
  useEffect(() => {
    localStorage.setItem('dispatcherSchedules', JSON.stringify(schedules));
  }, [schedules]);

  // Update running schedules to window for VehicleChangeForm
  useEffect(() => {
    const runningSchedules = schedules.filter(s => s.status === 'berjalan').map(schedule => ({
      id: schedule.id,
      driverId: schedule.driverId,
      driverName: schedule.driverName,
      vehicleId: schedule.vehicleId,
      vehicleNopol: schedule.plateNumber,
      vehicleMerk: schedule.vehicleType,
      tujuan: schedule.tujuan,
      jamBerangkat: schedule.jamBerangkat,
      kmBerangkat: schedule.kmBerangkat,
      tanggalJadwal: schedule.tanggalJadwal,
      status: schedule.status,
      createdAt: schedule.createdAt
    }));
    (window as any).dispatcherRunningSchedules = runningSchedules;
  }, [schedules]);

  // Update current time every minute and check for auto status changes
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Check and auto-move schedules from "terdaftar" to "berjalan" based on time
      setSchedules(prev => {
        const updated = prev.map(schedule => {
          if (schedule.status === 'terdaftar') {
            const scheduleDate = new Date(schedule.tanggalJadwal);
            const [hours, minutes] = schedule.jamBerangkat.split(':');
            scheduleDate.setHours(parseInt(hours), parseInt(minutes), 0);
            
            // If current time is past or equal to scheduled time, move to "berjalan"
            if (now >= scheduleDate) {
              toast.info(`Jadwal ${schedule.driverName} otomatis dipindahkan ke Status Berjalan`, {
                description: `${schedule.plateNumber} - ${schedule.tujuan}`
              });
              return { ...schedule, status: 'berjalan' as const };
            }
          }
          return schedule;
        });
        
        return updated;
      });
    }, 60000); // Check every minute

    return () => clearInterval(timer);
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      driverId: '',
      vehicleId: '',
      tujuan: '',
      jamBerangkat: '',
      kmBerangkat: '',
      tanggalJadwal: new Date().toISOString().split('T')[0]
    });
  };

  const resetSelesaiForm = () => {
    setSelesaiData({
      tanggalPulang: new Date().toISOString().split('T')[0],
      jamPulang: '',
      kmKembali: ''
    });
  };

  // Get available drivers (not in active schedules)
  const getAvailableDrivers = () => {
    const activeDriverIds = schedules
      .filter(s => s.status === 'terdaftar' || s.status === 'berjalan')
      .map(s => s.driverId);
    return MASTER_DRIVERS.filter(d => !activeDriverIds.includes(d.id));
  };

  // Get available vehicles (not in active schedules)
  const getAvailableVehicles = () => {
    const activeVehicleIds = schedules
      .filter(s => s.status === 'terdaftar' || s.status === 'berjalan')
      .map(s => s.vehicleId);
    return MASTER_VEHICLES.filter(v => !activeVehicleIds.includes(v.id));
  };

  // Handle create schedule
  const handleCreateSchedule = () => {
    if (!formData.driverId || !formData.vehicleId || !formData.tujuan || 
        !formData.jamBerangkat || !formData.kmBerangkat) {
      toast.error('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    const driver = MASTER_DRIVERS.find(d => d.id === formData.driverId);
    const vehicle = MASTER_VEHICLES.find(v => v.id === formData.vehicleId);

    if (!driver || !vehicle) {
      toast.error('Data driver atau kendaraan tidak valid');
      return;
    }

    const newSchedule: Schedule = {
      id: `SCH-${Date.now()}`,
      driverId: driver.id,
      driverName: driver.namaLengkap,
      vehicleId: vehicle.id,
      plateNumber: vehicle.nopolEksisting,
      vehicleType: vehicle.merkTypeMobil,
      tujuan: formData.tujuan,
      jamBerangkat: formData.jamBerangkat,
      kmBerangkat: formData.kmBerangkat,
      tanggalJadwal: formData.tanggalJadwal,
      status: 'terdaftar',
      createdAt: new Date().toISOString()
    };

    setSchedules(prev => [...prev, newSchedule]);
    toast.success(`Jadwal berhasil dibuat untuk ${driver.namaLengkap} - ${vehicle.nopolEksisting}`);
    resetForm();
    setShowAddDialog(false);
    setActiveTab('terdaftar');
  };

  // Handle open selesai dialog
  const handleOpenSelesai = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setShowSelesaiDialog(true);
  };

  // Handle selesai
  const handleSelesai = () => {
    if (!selectedSchedule) return;

    if (!selesaiData.tanggalPulang || !selesaiData.jamPulang || !selesaiData.kmKembali) {
      toast.error('Mohon lengkapi Tanggal Pulang, Jam Pulang dan KM Kembali');
      return;
    }

    setSchedules(prev => prev.map(s => 
      s.id === selectedSchedule.id 
        ? { 
            ...s, 
            status: 'selesai' as const,
            tanggalPulang: selesaiData.tanggalPulang,
            jamPulang: selesaiData.jamPulang,
            kmKembali: selesaiData.kmKembali
          } 
        : s
    ));

    toast.success('Perjalanan selesai! Driver dan kendaraan dikembalikan ke standby.');
    resetSelesaiForm();
    setShowSelesaiDialog(false);
    setSelectedSchedule(null);
  };

  // Handle delete
  const handleDelete = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
    toast.success('Jadwal berhasil dihapus');
  };

  // Handle view detail
  const handleViewDetail = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setShowDetailDialog(true);
  };

  // Stats
  const availableDrivers = getAvailableDrivers();
  const availableVehicles = getAvailableVehicles();
  const terdaftarCount = schedules.filter(s => s.status === 'terdaftar').length;
  const berjalanCount = schedules.filter(s => s.status === 'berjalan').length;

  // Check if Selesai form is valid
  const isSelesaiFormValid = selesaiData.tanggalPulang && selesaiData.jamPulang && selesaiData.kmKembali;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-slate-900 mb-2">Dispatcher Scheduling</h1>
          <p className="text-slate-600">
            Kelola jadwal penggunaan driver dan kendaraan
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {currentTime.toLocaleDateString('id-ID', { 
              weekday: 'long', 
              day: 'numeric',
              month: 'long', 
              year: 'numeric' 
            })} - {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <Button 
          onClick={() => setShowAddDialog(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Buat Jadwal Baru
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-3">Standby</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">Driver Standby</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      {availableDrivers.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">Mobil Standby</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      {availableVehicles.length}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Status Berjalan</p>
                <p className="text-2xl text-slate-900 mt-1">{berjalanCount}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {berjalanCount === 0 ? 'sedang tidak ada perjalanan' : 'perjalanan sedang berjalan'}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Jadwal Terdaftar</p>
                <p className="text-2xl text-slate-900 mt-1">{terdaftarCount}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {terdaftarCount === 0 ? 'belum ada jadwal' : 'menunggu waktu berangkat'}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="standby">
            Standby
          </TabsTrigger>
          <TabsTrigger value="berjalan">
            Status Berjalan
          </TabsTrigger>
          <TabsTrigger value="terdaftar">
            Jadwal Terdaftar
          </TabsTrigger>
        </TabsList>

        {/* Tab: Standby */}
        <TabsContent value="standby">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Driver Standby */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Driver Standby</span>
                  <Badge className="bg-green-100 text-green-700">
                    {availableDrivers.length} Driver
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableDrivers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Semua driver sedang bertugas</p>
                    </div>
                  ) : (
                    availableDrivers.map((driver) => (
                      <div key={driver.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-slate-900">{driver.namaLengkap}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                {driver.employeeId}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {driver.jenisSim}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Mobil Standby */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Mobil Standby</span>
                  <Badge className="bg-green-100 text-green-700">
                    {availableVehicles.length} Mobil
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableVehicles.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Truck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Semua kendaraan sedang digunakan</p>
                    </div>
                  ) : (
                    availableVehicles.map((vehicle) => (
                      <div key={vehicle.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-slate-900">{vehicle.nopolEksisting}</p>
                            <p className="text-sm text-gray-600">{vehicle.merkTypeMobil}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {vehicle.tahun}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Status Berjalan */}
        <TabsContent value="berjalan">
          <Card>
            <CardHeader>
              <CardTitle>Status Berjalan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {schedules.filter(s => s.status === 'berjalan').length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Belum ada jadwal yang berjalan</p>
                    <p className="text-sm mt-1">Jadwal akan otomatis berpindah saat waktu berangkat tiba</p>
                  </div>
                ) : (
                  schedules.filter(s => s.status === 'berjalan').map((schedule) => (
                    <div key={schedule.id} className="p-4 bg-orange-50 rounded-lg border border-orange-200 transition-all animate-in slide-in-from-top duration-500">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                              Berjalan
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {new Date(schedule.tanggalJadwal).toLocaleDateString('id-ID')} • {schedule.jamBerangkat}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Driver</p>
                              <p className="text-sm text-slate-900">{schedule.driverName}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Kendaraan</p>
                              <p className="text-sm text-slate-900">{schedule.plateNumber}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Tujuan</p>
                              <p className="text-sm text-slate-900">{schedule.tujuan}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">KM Berangkat</p>
                              <p className="text-sm text-slate-900">{schedule.kmBerangkat} km</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" variant="ghost" onClick={() => handleViewDetail(schedule)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleOpenSelesai(schedule)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Selesai
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Jadwal Terdaftar */}
        <TabsContent value="terdaftar">
          <Card>
            <CardHeader>
              <CardTitle>Jadwal Terdaftar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {schedules.filter(s => s.status === 'terdaftar').length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Belum ada jadwal terdaftar</p>
                    <p className="text-sm mt-1">Klik "Buat Jadwal Baru" untuk membuat jadwal</p>
                  </div>
                ) : (
                  schedules.filter(s => s.status === 'terdaftar').map((schedule) => (
                    <div key={schedule.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200 transition-all animate-in fade-in duration-300">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                              Terdaftar
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {new Date(schedule.tanggalJadwal).toLocaleDateString('id-ID')} • {schedule.jamBerangkat}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Driver</p>
                              <p className="text-sm text-slate-900">{schedule.driverName}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Kendaraan</p>
                              <p className="text-sm text-slate-900">{schedule.plateNumber} - {schedule.vehicleType}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Tujuan</p>
                              <p className="text-sm text-slate-900">{schedule.tujuan}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">KM Berangkat</p>
                              <p className="text-sm text-slate-900">{schedule.kmBerangkat} km</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" variant="ghost" onClick={() => handleViewDetail(schedule)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleDelete(schedule.id)}
                          >
                            <XCircle className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog: Buat Jadwal Baru */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Buat Jadwal Baru</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pilih Driver <span className="text-red-500">*</span></Label>
                <Select value={formData.driverId} onValueChange={(value) => setFormData(prev => ({ ...prev, driverId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih driver..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDrivers.map(driver => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.namaLengkap} ({driver.employeeId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Pilih Kendaraan <span className="text-red-500">*</span></Label>
                <Select value={formData.vehicleId} onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kendaraan..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVehicles.map(vehicle => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.nopolEksisting} - {vehicle.merkTypeMobil}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Tujuan <span className="text-red-500">*</span></Label>
                <Select value={formData.tujuan} onValueChange={(value) => setFormData(prev => ({ ...prev, tujuan: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tujuan..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dalam Kota">Dalam Kota</SelectItem>
                    <SelectItem value="Luar Kota">Luar Kota</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tanggal Jadwal <span className="text-red-500">*</span></Label>
                <Input
                  type="date"
                  value={formData.tanggalJadwal}
                  onChange={(e) => setFormData(prev => ({ ...prev, tanggalJadwal: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Jam Berangkat <span className="text-red-500">*</span></Label>
                <Input
                  type="time"
                  value={formData.jamBerangkat}
                  onChange={(e) => setFormData(prev => ({ ...prev, jamBerangkat: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>KM Berangkat <span className="text-red-500">*</span></Label>
                <Input
                  type="number"
                  value={formData.kmBerangkat}
                  onChange={(e) => setFormData(prev => ({ ...prev, kmBerangkat: e.target.value }))}
                  placeholder="Contoh: 50000"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => {
                setShowAddDialog(false);
                resetForm();
              }}>
                Batal
              </Button>
              <Button onClick={handleCreateSchedule} className="bg-blue-600 hover:bg-blue-700">
                Simpan Jadwal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Selesai */}
      <Dialog open={showSelesaiDialog} onOpenChange={setShowSelesaiDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selesaikan Perjalanan</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-slate-900 mb-1">
                <span className="font-semibold">Driver:</span> {selectedSchedule?.driverName}
              </p>
              <p className="text-sm text-slate-900">
                <span className="font-semibold">Kendaraan:</span> {selectedSchedule?.plateNumber}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Tanggal Pulang <span className="text-red-500">*</span></Label>
              <Input
                type="date"
                value={selesaiData.tanggalPulang}
                onChange={(e) => setSelesaiData(prev => ({ ...prev, tanggalPulang: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Jam Pulang <span className="text-red-500">*</span></Label>
              <Input
                type="time"
                value={selesaiData.jamPulang}
                onChange={(e) => setSelesaiData(prev => ({ ...prev, jamPulang: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>KM Kembali <span className="text-red-500">*</span></Label>
              <Input
                type="number"
                value={selesaiData.kmKembali}
                onChange={(e) => setSelesaiData(prev => ({ ...prev, kmKembali: e.target.value }))}
                placeholder="Contoh: 50150"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => {
                setShowSelesaiDialog(false);
                resetSelesaiForm();
                setSelectedSchedule(null);
              }}>
                Batal
              </Button>
              <Button 
                onClick={handleSelesai} 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!isSelesaiFormValid}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Detail */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Jadwal</DialogTitle>
          </DialogHeader>
          
          {selectedSchedule && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge 
                    className={
                      selectedSchedule.status === 'terdaftar' 
                        ? 'bg-blue-100 text-blue-700'
                        : selectedSchedule.status === 'berjalan'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-green-100 text-green-700'
                    }
                  >
                    {selectedSchedule.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tanggal</p>
                  <p className="text-slate-900">{new Date(selectedSchedule.tanggalJadwal).toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Driver</p>
                  <p className="text-slate-900">{selectedSchedule.driverName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kendaraan</p>
                  <p className="text-slate-900">{selectedSchedule.plateNumber}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Tipe Kendaraan</p>
                  <p className="text-slate-900">{selectedSchedule.vehicleType}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Tujuan</p>
                  <p className="text-slate-900">{selectedSchedule.tujuan}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Jam Berangkat</p>
                  <p className="text-slate-900">{selectedSchedule.jamBerangkat}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">KM Berangkat</p>
                  <p className="text-slate-900">{selectedSchedule.kmBerangkat} km</p>
                </div>
                {selectedSchedule.jamPulang && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">Tanggal Pulang</p>
                      <p className="text-slate-900">
                        {selectedSchedule.tanggalPulang 
                          ? new Date(selectedSchedule.tanggalPulang).toLocaleDateString('id-ID')
                          : '-'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Jam Pulang</p>
                      <p className="text-slate-900">{selectedSchedule.jamPulang}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">KM Kembali</p>
                      <p className="text-slate-900">{selectedSchedule.kmKembali} km</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Total Jarak Tempuh</p>
                      <p className="text-slate-900 text-lg">
                        {parseInt(selectedSchedule.kmKembali || '0') - parseInt(selectedSchedule.kmBerangkat)} km
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
