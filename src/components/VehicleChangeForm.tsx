import { useState, useEffect } from 'react';
import { Truck, Calendar, FileText, Plus, Search, Eye, RefreshCcw, AlertCircle, CheckCircle, XCircle, Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

// Interface untuk jadwal dari Dispatcher Scheduling
interface Schedule {
  id: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  plateNumber: string; // Sesuai dengan field di DispatcherScheduling
  vehicleType: string; // Sesuai dengan field di DispatcherScheduling
  tujuan: string;
  jamBerangkat: string;
  kmBerangkat: string;
  tanggalJadwal: string;
  status: 'terdaftar' | 'berjalan' | 'selesai';
  jamPulang?: string;
  kmKembali?: string;
  createdAt: string;
}

interface VehicleChangeRecord {
  id: string;
  scheduleId: string;
  route: string;
  driverName: string;
  oldVehicle: string;
  newVehicle: string;
  changeDate: string;
  changeTime: string;
  reason: string;
  description: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvalDate?: string;
  requestedBy: string;
  notes?: string;
  photos?: string[];
  // New fields for vehicle details
  vehicleType?: string;
  vehicleBrand?: string;
  plateNumber?: string;
  chassisNumber?: string;
  engineNumber?: string;
  vehicleCategory?: string;
  yearManufacture?: string;
  color?: string;
  handoverDate?: string;
  kilometer?: string;
  fuelType?: string;
  tenant?: string;
  user?: string;
  telephone?: string;
}

export function VehicleChangeForm() {
  // State untuk menyimpan data running schedules dari Dispatcher Scheduling
  const [runningSchedules, setRunningSchedules] = useState<Schedule[]>([]);

  // Fetch running schedules dari localStorage
  useEffect(() => {
    const fetchRunningSchedules = () => {
      try {
        const saved = localStorage.getItem('dispatcherSchedules');
        if (saved) {
          const allSchedules: Schedule[] = JSON.parse(saved);
          // Filter hanya yang sedang berjalan
          const running = allSchedules.filter(s => s.status === 'berjalan');
          setRunningSchedules(running);
        }
      } catch (error) {
        console.error('Error loading running schedules:', error);
      }
    };

    // Initial fetch
    fetchRunningSchedules();

    // Set interval untuk update data setiap 2 detik
    const interval = setInterval(fetchRunningSchedules, 2000);

    return () => clearInterval(interval);
  }, []);

  const [changeRecords, setChangeRecords] = useState<VehicleChangeRecord[]>([
    {
      id: '1',
      scheduleId: 'SCH001',
      route: 'Purwokerto - Cilacap',
      driverName: 'Agus Prasetyo',
      oldVehicle: 'B 9254 HT',
      newVehicle: 'B 9254 HA',
      changeDate: '2024-10-13',
      changeTime: '08:30',
      reason: 'maintenance',
      description: 'Kendaraan lama perlu maintenance mendadak',
      approvalStatus: 'approved',
      approvedBy: 'Manager Operasional',
      approvalDate: '2024-10-13',
      requestedBy: 'Dispatcher A',
      photos: []
    },
    {
      id: '2',
      scheduleId: 'SCH002',
      route: 'Semarang - Pemalang',
      driverName: 'Rudi Hartono',
      oldVehicle: 'H 5678 CD',
      newVehicle: 'R 9876 XY',
      changeDate: '2024-10-12',
      changeTime: '14:00',
      reason: 'breakdown',
      description: 'Kerusakan mesin di tengah jalan',
      approvalStatus: 'pending',
      requestedBy: 'Dispatcher B',
      vehicleType: 'Isuzu Elf',
      vehicleBrand: 'Isuzu',
      plateNumber: 'R 9876 XY',
      chassisNumber: 'NKR77LEJGK123456',
      engineNumber: '4JJ1E1234567',
      vehicleCategory: 'Pickup',
      yearManufacture: '2019',
      color: 'Putih',
      fuelType: 'Solar',
      kilometer: '75000',
      handoverDate: '2024-10-12',
      tenant: 'PT. Pertamina Hulu Energi',
      user: 'Manager Logistik',
      telephone: '081234567890'
    }
  ]);

  const [showDialog, setShowDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<VehicleChangeRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  const [formData, setFormData] = useState({
    scheduleId: '',
    route: '',
    driverName: '',
    oldVehicle: '',
    newVehicle: '',
    changeDate: '',
    changeTime: '',
    reason: '',
    description: '',
    requestedBy: 'Dispatcher',
    // New fields
    vehicleType: '',
    vehicleBrand: '',
    plateNumber: '',
    chassisNumber: '',
    engineNumber: '',
    vehicleCategory: '',
    yearManufacture: '',
    color: '',
    handoverDate: '',
    kilometer: '',
    fuelType: '',
    tenant: '',
    user: '',
    telephone: ''
  });

  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  const fuelTypes = ['Diesel', 'Bensin', 'Pertalite', 'Pertamax', 'Solar'];
  const vehicleCategories = ['Tanker', 'Truck', 'Pickup', 'Van', 'Bus'];

  const reasonOptions = [
    { value: 'maintenance', label: 'Maintenance Terjadwal' },
    { value: 'breakdown', label: 'Kerusakan Kendaraan' },
    { value: 'capacity', label: 'Kapasitas Tidak Sesuai' },
    { value: 'efficiency', label: 'Efisiensi Operasional' },
    { value: 'emergency', label: 'Kondisi Darurat' },
    { value: 'driver-request', label: 'Permintaan Driver' },
    { value: 'other', label: 'Lainnya' }
  ];

  const resetForm = () => {
    setFormData({
      scheduleId: '',
      route: '',
      driverName: '',
      oldVehicle: '',
      newVehicle: '',
      changeDate: '',
      changeTime: '',
      reason: '',
      description: '',
      requestedBy: 'Dispatcher',
      vehicleType: '',
      vehicleBrand: '',
      plateNumber: '',
      chassisNumber: '',
      engineNumber: '',
      vehicleCategory: '',
      yearManufacture: '',
      color: '',
      handoverDate: '',
      kilometer: '',
      fuelType: '',
      tenant: '',
      user: '',
      telephone: ''
    });
    setUploadedPhotos([]);
    setSelectedSchedule(null);
  };

  const handleScheduleSelect = (scheduleId: string) => {
    const schedule = runningSchedules.find(s => s.id === scheduleId);
    if (schedule) {
      setSelectedSchedule(schedule);
      setFormData({
        ...formData,
        scheduleId,
        route: schedule.tujuan,
        driverName: schedule.driverName,
        oldVehicle: schedule.plateNumber
      });
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const currentPhotoCount = uploadedPhotos.length;
    const newFilesArray = Array.from(files);

    if (currentPhotoCount + newFilesArray.length > 5) {
      toast.error('Maksimal 5 foto dapat diupload');
      return;
    }

    // Convert files to base64 for preview
    newFilesArray.forEach(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(`File ${file.name} terlalu besar. Maksimal 5MB per file`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPhotos(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!formData.scheduleId || !formData.plateNumber || !formData.driverName) {
      toast.error('Mohon lengkapi field yang diperlukan: Jadwal, Supir, dan No. Polisi');
      return;
    }

    const newRecord: VehicleChangeRecord = {
      id: String(changeRecords.length + 1),
      scheduleId: formData.scheduleId,
      route: formData.route,
      driverName: formData.driverName,
      oldVehicle: formData.oldVehicle,
      newVehicle: formData.plateNumber,
      changeDate: formData.changeDate || new Date().toISOString().split('T')[0],
      changeTime: formData.changeTime || new Date().toTimeString().split(' ')[0].slice(0, 5),
      reason: formData.reason,
      description: formData.description,
      approvalStatus: 'pending',
      requestedBy: formData.requestedBy,
      photos: uploadedPhotos.length > 0 ? uploadedPhotos : undefined,
      // New fields
      vehicleType: formData.vehicleType,
      vehicleBrand: formData.vehicleBrand,
      plateNumber: formData.plateNumber,
      chassisNumber: formData.chassisNumber,
      engineNumber: formData.engineNumber,
      vehicleCategory: formData.vehicleCategory,
      yearManufacture: formData.yearManufacture,
      color: formData.color,
      handoverDate: formData.handoverDate,
      kilometer: formData.kilometer,
      fuelType: formData.fuelType,
      tenant: formData.tenant,
      user: formData.user,
      telephone: formData.telephone
    };

    setChangeRecords([newRecord, ...changeRecords]);
    setShowDialog(false);
    resetForm();
    toast.success('Pengajuan pergantian kendaraan berhasil dibuat');
  };

  const handleApprove = (id: string) => {
    const updatedRecords = changeRecords.map(record => {
      if (record.id === id) {
        return {
          ...record,
          approvalStatus: 'approved' as const,
          approvedBy: 'Manager Operasional',
          approvalDate: new Date().toISOString().split('T')[0]
        };
      }
      return record;
    });
    setChangeRecords(updatedRecords);
    toast.success('Pergantian kendaraan telah disetujui');
  };

  const handleReject = (id: string) => {
    const updatedRecords = changeRecords.map(record => {
      if (record.id === id) {
        return {
          ...record,
          approvalStatus: 'rejected' as const,
          approvedBy: 'Manager Operasional',
          approvalDate: new Date().toISOString().split('T')[0]
        };
      }
      return record;
    });
    setChangeRecords(updatedRecords);
    toast.success('Pergantian kendaraan telah ditolak');
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      approved: { label: 'Disetujui', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { label: 'Ditolak', color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    const statusConfig = config[status as keyof typeof config] || config.pending;
    const Icon = statusConfig.icon;
    return (
      <Badge className={`${statusConfig.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {statusConfig.label}
      </Badge>
    );
  };

  const filteredRecords = changeRecords.filter(record => {
    const matchesSearch = record.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.oldVehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.newVehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.route.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || record.approvalStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Form Unit Ganti Sewa</h1>
          <p className="text-gray-600 mt-1">Kelola pengajuan pergantian kendaraan operasional</p>
        </div>
        
        <Button 
          onClick={() => {
            resetForm();
            setShowDialog(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Ajukan Pergantian
        </Button>
      </div>

      {/* Info Running Schedules */}
      {runningSchedules.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-900">
                  Ada {runningSchedules.length} perjalanan yang sedang berjalan
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Anda dapat mengajukan pergantian kendaraan untuk perjalanan yang sedang berjalan dari Dispatcher Scheduling
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {runningSchedules.length === 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-yellow-900">
                  Tidak ada perjalanan yang sedang berjalan
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Saat ini tidak ada perjalanan yang sedang berjalan di Dispatcher Scheduling. Data akan muncul otomatis ketika ada jadwal yang dimulai.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pengajuan</p>
                <p className="text-2xl font-bold text-gray-900">{changeRecords.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Menunggu Approval</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {changeRecords.filter(r => r.approvalStatus === 'pending').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disetujui</p>
                <p className="text-2xl font-bold text-green-600">
                  {changeRecords.filter(r => r.approvalStatus === 'approved').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ditolak</p>
                <p className="text-2xl font-bold text-red-600">
                  {changeRecords.filter(r => r.approvalStatus === 'rejected').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pergantian Kendaraan</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters - Moved inside the table card */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari driver, kendaraan, atau tujuan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="approved">Disetujui</SelectItem>
                  <SelectItem value="rejected">Ditolak</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}>
                Reset Filter
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900">Tanggal</th>
                  <th className="text-left p-4 font-medium text-gray-900">Tujuan / Driver</th>
                  <th className="text-left p-4 font-medium text-gray-900">Kendaraan Lama</th>
                  <th className="text-left p-4 font-medium text-gray-900">Kendaraan Baru</th>
                  <th className="text-left p-4 font-medium text-gray-900">Alasan</th>
                  <th className="text-left p-4 font-medium text-gray-900">Status</th>
                  <th className="text-left p-4 font-medium text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      <Truck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Belum ada pengajuan pergantian kendaraan</p>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map(record => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="text-sm">
                          <div className="text-gray-900">{record.changeDate}</div>
                          <div className="text-gray-600">{record.changeTime}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900">{record.route}</div>
                          <div className="text-sm text-gray-600">{record.driverName}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-red-500" />
                          <span className="font-medium text-red-600">{record.oldVehicle}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-green-500" />
                          <span className="font-medium text-green-600">{record.newVehicle}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-900">
                          {record.reason}
                        </div>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(record.approvalStatus)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedRecord(record);
                              setShowDetailDialog(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {record.approvalStatus === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleApprove(record.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleReject(record.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajukan Pergantian Kendaraan</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Pilih Kendaraan yang Sedang Berjalan */}
            <div>
              <Label htmlFor="schedule">
                Pilih Kendaraan
              </Label>
              {runningSchedules.length === 0 ? (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                  <p className="text-sm text-gray-600">
                    Tidak ada perjalanan yang sedang berjalan saat ini. Silakan buat jadwal di Dispatcher Scheduling terlebih dahulu.
                  </p>
                </div>
              ) : (
                <Select 
                  value={formData.scheduleId} 
                  onValueChange={handleScheduleSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kendaraan" />
                  </SelectTrigger>
                  <SelectContent>
                    {runningSchedules.map(schedule => (
                      <SelectItem key={schedule.id} value={schedule.id}>
                        {schedule.tujuan} - {schedule.driverName} ({schedule.plateNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Detail Jadwal yang Dipilih */}
            {selectedSchedule && (
              <>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">Detail Kendaraan</h4>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Tujuan:</p>
                      <p className="text-slate-900">{selectedSchedule.tujuan}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Driver:</p>
                      <p className="text-slate-900">{selectedSchedule.driverName}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Kendaraan Saat Ini:</p>
                    <p className="text-red-600">{selectedSchedule.plateNumber}</p>
                  </div>
                </div>

                {/* Detail Kendaraan Pengganti */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-gray-900 mb-3">Detail Kendaraan Pengganti</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="vehicleType">Tipe/Merk Kendaraan</Label>
                      <Input
                        id="vehicleType"
                        placeholder="Contoh: Toyota Dyna"
                        value={formData.vehicleType}
                        onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="vehicleBrand">Merk</Label>
                      <Input
                        id="vehicleBrand"
                        placeholder="Contoh: Toyota"
                        value={formData.vehicleBrand}
                        onChange={(e) => setFormData({...formData, vehicleBrand: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="plateNumber">No. Polisi *</Label>
                      <Input
                        id="plateNumber"
                        placeholder="Contoh: B 9254 HA"
                        value={formData.plateNumber}
                        onChange={(e) => setFormData({...formData, plateNumber: e.target.value, newVehicle: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="chassisNumber">No. Rangka</Label>
                      <Input
                        id="chassisNumber"
                        placeholder="Masukkan nomor rangka"
                        value={formData.chassisNumber}
                        onChange={(e) => setFormData({...formData, chassisNumber: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="engineNumber">No. Mesin</Label>
                      <Input
                        id="engineNumber"
                        placeholder="Masukkan nomor mesin"
                        value={formData.engineNumber}
                        onChange={(e) => setFormData({...formData, engineNumber: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="vehicleCategory">Jenis</Label>
                      <Input
                        id="vehicleCategory"
                        placeholder="Contoh: Tanker, Truck, Pickup"
                        value={formData.vehicleCategory}
                        onChange={(e) => setFormData({...formData, vehicleCategory: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="yearManufacture">Tahun Pembuatan</Label>
                      <Input
                        id="yearManufacture"
                        type="number"
                        placeholder="Contoh: 2020"
                        value={formData.yearManufacture}
                        onChange={(e) => setFormData({...formData, yearManufacture: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="color">Warna</Label>
                      <Input
                        id="color"
                        placeholder="Contoh: Putih"
                        value={formData.color}
                        onChange={(e) => setFormData({...formData, color: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="fuelType">Jenis BBM</Label>
                      <Input
                        id="fuelType"
                        placeholder="Contoh: Diesel, Bensin, Pertalite, Solar"
                        value={formData.fuelType}
                        onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="kilometer">Kilometer</Label>
                      <Input
                        id="kilometer"
                        type="number"
                        placeholder="Contoh: 50000"
                        value={formData.kilometer}
                        onChange={(e) => setFormData({...formData, kilometer: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Informasi Dokumen & Penyewa */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-gray-900 mb-3">Informasi Dokumen & Penyewa</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="handoverDate">Tanggal Serah Terima</Label>
                      <Input
                        id="handoverDate"
                        type="date"
                        placeholder="dd/mm/yyyy"
                        value={formData.handoverDate}
                        onChange={(e) => setFormData({...formData, handoverDate: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="tenant">Penyewa/Pemakai</Label>
                      <Input
                        id="tenant"
                        placeholder="Nama penyewa/pemakai"
                        value={formData.tenant}
                        onChange={(e) => setFormData({...formData, tenant: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="user">Nama User</Label>
                      <Input
                        id="user"
                        placeholder="Nama user"
                        value={formData.user}
                        onChange={(e) => setFormData({...formData, user: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="telephone">Nomor Telepon</Label>
                      <Input
                        id="telephone"
                        placeholder="Nomor telepon"
                        value={formData.telephone}
                        onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Alasan Pergantian */}
                <div>
                  <Label htmlFor="reason">Alasan Pergantian</Label>
                  <Textarea 
                    id="reason" 
                    placeholder="Jelaskan alasan pergantian kendaraan, seperti: Maintenance Terjadwal, Kerusakan Kendaraan, Kapasitas Tidak Sesuai, dll..."
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Keterangan Detail</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Jelaskan detail alasan pergantian..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                  />
                </div>

                {/* Upload Photos */}
                <div>
                  <Label htmlFor="photos">Upload Foto (Maksimal 5 foto)</Label>
                  <div className="mt-2">
                    <Input
                      id="photos"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('photos')?.click()}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Pilih Foto
                    </Button>
                  </div>
                  
                  {uploadedPhotos.length > 0 && (
                    <div className="mt-3 grid grid-cols-5 gap-2">
                      {uploadedPhotos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={photo} 
                            alt={`Upload ${index + 1}`} 
                            className="w-full h-20 object-cover rounded border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removePhoto(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowDialog(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Ajukan Pergantian
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Pergantian Kendaraan</DialogTitle>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Tanggal Pergantian</Label>
                  <p className="font-medium text-gray-900">{selectedRecord.changeDate}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Waktu</Label>
                  <p className="font-medium text-gray-900">{selectedRecord.changeTime}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Driver</Label>
                  <p className="font-medium text-gray-900">{selectedRecord.driverName}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Tujuan</Label>
                  <p className="font-medium text-gray-900">{selectedRecord.route}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Kendaraan Lama</Label>
                  <p className="font-medium text-red-600">{selectedRecord.oldVehicle}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Kendaraan Baru</Label>
                  <p className="font-medium text-green-600">{selectedRecord.newVehicle}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-gray-600">Alasan</Label>
                  <p className="font-medium text-gray-900">
                    {selectedRecord.reason}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedRecord.approvalStatus)}</div>
                </div>

                {selectedRecord.vehicleType && (
                  <div>
                    <Label className="text-gray-600">Tipe Kendaraan</Label>
                    <p className="font-medium text-gray-900">{selectedRecord.vehicleType}</p>
                  </div>
                )}

                {selectedRecord.chassisNumber && (
                  <div>
                    <Label className="text-gray-600">No. Rangka</Label>
                    <p className="font-medium text-gray-900">{selectedRecord.chassisNumber}</p>
                  </div>
                )}

                {selectedRecord.approvalStatus !== 'pending' && (
                  <>
                    <div>
                      <Label className="text-gray-600">Disetujui/Ditolak Oleh</Label>
                      <p className="font-medium text-gray-900">{selectedRecord.approvedBy}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Tanggal Approval</Label>
                      <p className="font-medium text-gray-900">{selectedRecord.approvalDate}</p>
                    </div>
                  </>
                )}

                <div className="col-span-2">
                  <Label className="text-gray-600">Keterangan</Label>
                  <p className="font-medium text-gray-900">{selectedRecord.description}</p>
                </div>

                {selectedRecord.photos && selectedRecord.photos.length > 0 && (
                  <div className="col-span-2">
                    <Label className="text-gray-600">Foto Pendukung</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {selectedRecord.photos.map((photo, index) => (
                        <img 
                          key={index} 
                          src={photo} 
                          alt={`Foto ${index + 1}`} 
                          className="w-full h-24 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
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