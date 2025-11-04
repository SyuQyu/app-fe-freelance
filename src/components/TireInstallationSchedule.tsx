import { useState } from 'react';
import { Calendar, Search, Filter, Plus, Edit, Trash2, CheckCircle, Clock, Wrench, MapPin, Eye, FileText, ArrowRight, Printer, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';
import exampleImage from 'figma:asset/14cb7a6cd99c07eea63cb4725994d9891eb71a59.png';

interface InstallationSchedule {
  id: string;
  scheduleNumber: string;
  date: string;
  vehicleNumber: string;
  vehicleType: string;
  tireSize: string;
  quantity: number;
  tirePosition: string;
  damagedPosition: string;
  tireConditionPhoto?: string;
  pricePerSet: number;
  totalCost: number;
  technician: string;
  workshop: string;
  status: 'Pengajuan' | 'Rencana' | 'Perawatan' | 'Selesai';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  notes?: string;
  estimatedDuration: number; // in minutes
  submittedBy?: string;
  submittedDate?: string;
  approvedBy?: string;
  approvedDate?: string;
  completedDate?: string;
  // Legacy fields for backward compatibility
  tireBrand?: string;
}

const initialSchedules: InstallationSchedule[] = [
  {
    id: '1',
    scheduleNumber: 'SCH-2024-001',
    date: '2024-10-15',
    vehicleNumber: 'B 1234 XYZ',
    vehicleType: 'Truck',
    tireSize: '11R22.5',
    quantity: 2,
    tirePosition: 'Depan Kiri, Depan Kanan',
    damagedPosition: 'Depan Kiri',
    pricePerSet: 4500000,
    totalCost: 9000000,
    technician: 'Ahmad Teknisi',
    workshop: 'Workshop A',
    status: 'Pengajuan',
    priority: 'High',
    estimatedDuration: 120,
    notes: 'Penggantian ban depan karena aus',
    submittedBy: 'Budi Santoso',
    submittedDate: '2024-10-13'
  },
  {
    id: '2',
    scheduleNumber: 'SCH-2024-002',
    date: '2024-10-14',
    vehicleNumber: 'B 5678 ABC',
    vehicleType: 'Trailer',
    tireSize: '315/80R22.5',
    quantity: 4,
    tirePosition: 'Gandar Belakang 1 (Semua)',
    damagedPosition: 'Gandar Belakang 1 Kiri Dalam, Kanan Dalam',
    pricePerSet: 5200000,
    totalCost: 20800000,
    technician: 'Budi Mekanik',
    workshop: 'Workshop B',
    status: 'Rencana',
    priority: 'Critical',
    estimatedDuration: 180,
    submittedBy: 'Agus Wibowo',
    submittedDate: '2024-10-12',
    approvedBy: 'Supervisor Fleet',
    approvedDate: '2024-10-13'
  },
  {
    id: '3',
    scheduleNumber: 'SCH-2024-003',
    date: '2024-10-14',
    vehicleNumber: 'B 9012 DEF',
    vehicleType: 'Truck',
    tireSize: '295/80R22.5',
    quantity: 10,
    tirePosition: 'Semua Roda',
    damagedPosition: 'Gandar Belakang 2 (Semua)',
    pricePerSet: 4800000,
    totalCost: 48000000,
    technician: 'Candra Workshop',
    workshop: 'Workshop A',
    status: 'Perawatan',
    priority: 'Medium',
    estimatedDuration: 240,
    notes: 'Penggantian semua ban preventif',
    submittedBy: 'Dedi Rahman',
    submittedDate: '2024-10-11',
    approvedBy: 'Supervisor Fleet',
    approvedDate: '2024-10-12'
  },
  {
    id: '4',
    scheduleNumber: 'SCH-2024-004',
    date: '2024-10-13',
    vehicleNumber: 'B 3456 GHI',
    vehicleType: 'Truck',
    tireSize: '11R22.5',
    quantity: 2,
    tirePosition: 'Belakang Kanan Luar, Dalam',
    damagedPosition: 'Belakang Kanan Dalam',
    pricePerSet: 4500000,
    totalCost: 9000000,
    technician: 'Dedi Repair',
    workshop: 'Workshop C',
    status: 'Selesai',
    priority: 'Low',
    estimatedDuration: 90,
    submittedBy: 'Ahmad Subandi',
    submittedDate: '2024-10-10',
    approvedBy: 'Supervisor Fleet',
    approvedDate: '2024-10-11',
    completedDate: '2024-10-13'
  }
];

export function TireInstallationSchedule() {
  const [schedules, setSchedules] = useState<InstallationSchedule[]>(initialSchedules);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<InstallationSchedule | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isBADialogOpen, setIsBADialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<InstallationSchedule | null>(null);
  const [activeTab, setActiveTab] = useState('Pengajuan');
  
  const [newSchedule, setNewSchedule] = useState({
    vehicleNumber: '',
    vehicleType: '',
    tireSize: '',
    quantity: 0,
    tirePosition: '',
    damagedPosition: '',
    tireConditionPhoto: '',
    pricePerSet: 0,
    totalCost: 0,
    technician: '',
    workshop: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical',
    date: '',
    estimatedDuration: 120,
    notes: '',
    submittedBy: ''
  });

  // Filter by tab and search
  const getFilteredSchedules = (status: InstallationSchedule['status']) => {
    return schedules.filter(schedule => {
      const matchesStatus = schedule.status === status;
      const matchesSearch = schedule.scheduleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           schedule.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           schedule.technician.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = filterPriority === 'all' || schedule.priority === filterPriority;
      
      return matchesStatus && matchesSearch && matchesPriority;
    });
  };

  // Statistics
  const pengajuanCount = schedules.filter(s => s.status === 'Pengajuan').length;
  const rencanaCount = schedules.filter(s => s.status === 'Rencana').length;
  const perawatanCount = schedules.filter(s => s.status === 'Perawatan').length;
  const selesaiCount = schedules.filter(s => s.status === 'Selesai').length;

  const handleAddSchedule = () => {
    if (!newSchedule.vehicleNumber || !newSchedule.tireSize || !newSchedule.quantity || !newSchedule.date) {
      toast.error('Mohon lengkapi semua field yang wajib diisi!');
      return;
    }

    const newItem: InstallationSchedule = {
      id: `SCH${Date.now()}`,
      scheduleNumber: `SCH-2024-${String(schedules.length + 1).padStart(3, '0')}`,
      ...newSchedule,
      status: 'Pengajuan',
      submittedDate: new Date().toISOString().split('T')[0]
    };

    setSchedules([...schedules, newItem]);
    setIsAddDialogOpen(false);
    setNewSchedule({
      vehicleNumber: '',
      vehicleType: '',
      tireSize: '',
      quantity: 0,
      tirePosition: '',
      damagedPosition: '',
      tireConditionPhoto: '',
      pricePerSet: 0,
      totalCost: 0,
      technician: '',
      workshop: '',
      priority: 'Medium',
      date: '',
      estimatedDuration: 120,
      notes: '',
      submittedBy: ''
    });
    toast.success('Pengajuan pemasangan ban berhasil dibuat!');
  };

  const handleApprove = (id: string) => {
    setSchedules(schedules.map(schedule =>
      schedule.id === id ? { 
        ...schedule, 
        status: 'Rencana',
        approvedBy: 'Supervisor Fleet',
        approvedDate: new Date().toISOString().split('T')[0]
      } : schedule
    ));
    toast.success('Pengajuan berhasil disetujui dan masuk ke tahap Rencana!');
  };

  const handleStartMaintenance = (id: string) => {
    setSchedules(schedules.map(schedule =>
      schedule.id === id ? { ...schedule, status: 'Perawatan' } : schedule
    ));
    toast.success('Perawatan ban dimulai!');
  };

  const handleComplete = (id: string) => {
    setSchedules(schedules.map(schedule =>
      schedule.id === id ? { 
        ...schedule, 
        status: 'Selesai',
        completedDate: new Date().toISOString().split('T')[0]
      } : schedule
    ));
    toast.success('Perawatan ban berhasil diselesaikan!');
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
    toast.success('Jadwal berhasil dihapus!');
  };

  const handleEditSchedule = (schedule: InstallationSchedule) => {
    setEditingSchedule(schedule);
    setNewSchedule({
      vehicleNumber: schedule.vehicleNumber,
      vehicleType: schedule.vehicleType,
      tireSize: schedule.tireSize,
      quantity: schedule.quantity,
      tirePosition: schedule.tirePosition,
      damagedPosition: schedule.damagedPosition,
      tireConditionPhoto: schedule.tireConditionPhoto || '',
      pricePerSet: schedule.pricePerSet,
      totalCost: schedule.totalCost,
      technician: schedule.technician,
      workshop: schedule.workshop,
      priority: schedule.priority,
      date: schedule.date,
      estimatedDuration: schedule.estimatedDuration,
      notes: schedule.notes || '',
      submittedBy: schedule.submittedBy || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateSchedule = () => {
    if (!editingSchedule) return;
    
    if (!newSchedule.vehicleNumber || !newSchedule.tireSize || !newSchedule.quantity || !newSchedule.date) {
      toast.error('Mohon lengkapi semua field yang wajib diisi!');
      return;
    }

    setSchedules(schedules.map(schedule =>
      schedule.id === editingSchedule.id
        ? { ...schedule, ...newSchedule }
        : schedule
    ));
    
    setIsEditDialogOpen(false);
    setEditingSchedule(null);
    setNewSchedule({
      vehicleNumber: '',
      vehicleType: '',
      tireSize: '',
      quantity: 0,
      tirePosition: '',
      damagedPosition: '',
      tireConditionPhoto: '',
      pricePerSet: 0,
      totalCost: 0,
      technician: '',
      workshop: '',
      priority: 'Medium',
      date: '',
      estimatedDuration: 120,
      notes: '',
      submittedBy: ''
    });
    toast.success('Pengajuan berhasil diupdate!');
  };

  const handlePrintBA = () => {
    window.print();
    toast.success('Dokumen BA siap dicetak!');
  };

  const getPriorityBadge = (priority: InstallationSchedule['priority']) => {
    const variants = {
      'Low': 'bg-gray-100 text-gray-700',
      'Medium': 'bg-blue-100 text-blue-700',
      'High': 'bg-orange-100 text-orange-700',
      'Critical': 'bg-red-100 text-red-700'
    };
    return variants[priority];
  };

  const renderWorkflowTable = (status: InstallationSchedule['status']) => {
    const filteredSchedules = getFilteredSchedules(status);
    
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Jadwal</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>No Polisi</TableHead>
              <TableHead>Ukuran Ban</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Posisi Ban</TableHead>
              <TableHead>Posisi Rusak</TableHead>
              <TableHead>Harga/Set</TableHead>
              <TableHead>Total Biaya</TableHead>
              {status === 'Pengajuan' && <TableHead>Pengaju</TableHead>}
              {status === 'Rencana' && <TableHead>Disetujui Oleh</TableHead>}
              {status === 'Perawatan' && <TableHead>Teknisi</TableHead>}
              {status === 'Selesai' && <TableHead>Tgl Selesai</TableHead>}
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSchedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell className="font-medium">{schedule.scheduleNumber}</TableCell>
                <TableCell>{new Date(schedule.date).toLocaleDateString('id-ID')}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{schedule.vehicleNumber}</div>
                    <div className="text-sm text-gray-500">{schedule.vehicleType}</div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{schedule.tireSize}</TableCell>
                <TableCell>
                  <Badge className="bg-blue-100 text-blue-800">
                    {schedule.quantity} pcs
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm max-w-[150px]">{schedule.tirePosition || '-'}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm max-w-[150px] text-red-600">{schedule.damagedPosition || '-'}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium">
                    Rp {schedule.pricePerSet.toLocaleString('id-ID')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-green-700">
                    Rp {schedule.totalCost.toLocaleString('id-ID')}
                  </div>
                </TableCell>
                {status === 'Pengajuan' && (
                  <TableCell>
                    <div className="text-sm">
                      <div>{schedule.submittedBy}</div>
                      <div className="text-gray-500">{schedule.submittedDate}</div>
                    </div>
                  </TableCell>
                )}
                {status === 'Rencana' && (
                  <TableCell>
                    <div className="text-sm">
                      <div>{schedule.approvedBy}</div>
                      <div className="text-gray-500">{schedule.approvedDate}</div>
                    </div>
                  </TableCell>
                )}
                {status === 'Perawatan' && (
                  <TableCell>
                    <div className="text-sm">{schedule.technician || '-'}</div>
                  </TableCell>
                )}
                {status === 'Selesai' && (
                  <TableCell>
                    <div className="text-sm">{schedule.completedDate}</div>
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedSchedule(schedule);
                        setIsDetailDialogOpen(true);
                      }}
                      title="Lihat Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {status === 'Pengajuan' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-600 text-blue-600 hover:bg-blue-50"
                          onClick={() => {
                            setSelectedSchedule(schedule);
                            setIsBADialogOpen(true);
                          }}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          BA Pengajuan
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditSchedule(schedule)}
                          title="Edit Pengajuan"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleApprove(schedule.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Setujui
                        </Button>
                      </>
                    )}
                    {status === 'Rencana' && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => handleStartMaintenance(schedule.id)}
                      >
                        <Wrench className="w-4 h-4 mr-1" />
                        Mulai
                      </Button>
                    )}
                    {status === 'Perawatan' && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleComplete(schedule.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Selesai
                      </Button>
                    )}
                    {status !== 'Selesai' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteSchedule(schedule.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredSchedules.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Tidak ada data untuk tahap ini
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workflow Pemasangan Ban</h1>
          <p className="text-gray-600 mt-1">Kelola workflow pemasangan dan penggantian ban kendaraan</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Buat Pengajuan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Buat Pengajuan Pemasangan Ban</DialogTitle>
              <DialogDescription>
                Lengkapi form berikut untuk mengajukan pemasangan atau penggantian ban kendaraan
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Tanggal dan No Polisi */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Tanggal Pengajuan *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newSchedule.date}
                    onChange={(e) => setNewSchedule({...newSchedule, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleNumber">No Polisi Armada *</Label>
                  <Input
                    id="vehicleNumber"
                    placeholder="B 1234 XYZ"
                    value={newSchedule.vehicleNumber}
                    onChange={(e) => setNewSchedule({...newSchedule, vehicleNumber: e.target.value})}
                  />
                </div>
              </div>

              {/* Ukuran dan Jumlah Ban */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tireSize">Ukuran Ban Yang Diajukan *</Label>
                  <Input
                    id="tireSize"
                    placeholder="11R22.5, 295/80R22.5, dll"
                  value={newSchedule.tirePosition}
                  onChange={(e) => setNewSchedule({...newSchedule, tirePosition: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tireBrand">Merek Ban *</Label>
                <Input
                  id="tireBrand"
                  placeholder="Bridgestone, Michelin, dll"
                  value={newSchedule.tireBrand}
                  onChange={(e) => setNewSchedule({...newSchedule, tireBrand: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tireSize">Ukuran Ban</Label>
                <Input
                  id="tireSize"
                  placeholder="11R22.5"
                  value={newSchedule.tireSize}
                  onChange={(e) => setNewSchedule({...newSchedule, tireSize: e.target.value})}
                />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Jumlah Total Ban Yang Diajukan *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Contoh: 2, 4, 6, dll"
                    value={newSchedule.quantity || ''}
                    onChange={(e) => {
                      const qty = parseInt(e.target.value) || 0;
                      setNewSchedule({
                        ...newSchedule, 
                        quantity: qty,
                        totalCost: qty > 0 ? (newSchedule.pricePerSet * qty) : 0
                      });
                    }}
                  />
                </div>
              </div>

              {/* Posisi Ban */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tirePosition">Posisi Ban</Label>
                  <Textarea
                    id="tirePosition"
                    placeholder="Contoh: Depan Kiri, Depan Kanan atau Gandar 1 Kiri Luar, Dalam"
                    value={newSchedule.tirePosition}
                    onChange={(e) => setNewSchedule({...newSchedule, tirePosition: e.target.value})}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="damagedPosition">Posisi Ban Yang Rusak</Label>
                  <Textarea
                    id="damagedPosition"
                    placeholder="Contoh: Depan Kiri atau Gandar 2 Kanan Dalam"
                    value={newSchedule.damagedPosition}
                    onChange={(e) => setNewSchedule({...newSchedule, damagedPosition: e.target.value})}
                    rows={2}
                  />
                </div>
              </div>

              {/* Upload Foto */}
              <div className="space-y-2">
                <Label htmlFor="tirePhoto">Upload Foto Kondisi Ban (PNG, JPG)</Label>
                <Input
                  id="tirePhoto"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewSchedule({...newSchedule, tireConditionPhoto: file.name});
                    }
                  }}
                />
                <p className="text-xs text-gray-500">Format: PNG atau JPG, Maksimal 5MB</p>
              </div>

              {/* Harga */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pricePerSet">Harga Ban / Set *</Label>
                  <Input
                    id="pricePerSet"
                    type="number"
                    placeholder="4500000"
                    value={newSchedule.pricePerSet || ''}
                    onChange={(e) => {
                      const price = parseInt(e.target.value) || 0;
                      setNewSchedule({
                        ...newSchedule, 
                        pricePerSet: price,
                        totalCost: price * newSchedule.quantity
                      });
                    }}
                  />
                  <p className="text-xs text-gray-500">Masukkan harga per set ban</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalCost">Total Biaya</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="totalCost"
                      value={`Rp ${newSchedule.totalCost.toLocaleString('id-ID')}`}
                      disabled
                      className="bg-gray-50 font-medium text-green-700"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Otomatis dihitung dari harga × jumlah</p>
                </div>
              </div>

              {/* Info Tambahan */}
              <div className="space-y-2 border-t pt-4">
                <Label htmlFor="technician">Teknisi (Opsional)</Label>
                <Input
                  id="technician"
                  placeholder="Nama teknisi yang akan mengerjakan"
                  value={newSchedule.technician}
                  onChange={(e) => setNewSchedule({...newSchedule, technician: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workshop">Workshop (Opsional)</Label>
                  <Select value={newSchedule.workshop} onValueChange={(value) => setNewSchedule({...newSchedule, workshop: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih workshop" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Workshop A">Workshop A</SelectItem>
                      <SelectItem value="Workshop B">Workshop B</SelectItem>
                      <SelectItem value="Workshop C">Workshop C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="submittedBy">Nama Pengaju (Opsional)</Label>
                  <Input
                    id="submittedBy"
                    placeholder="Nama yang mengajukan"
                    value={newSchedule.submittedBy}
                    onChange={(e) => setNewSchedule({...newSchedule, submittedBy: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Catatan Tambahan</Label>
                <Textarea
                  id="notes"
                  placeholder="Catatan atau keterangan tambahan..."
                  value={newSchedule.notes}
                  onChange={(e) => setNewSchedule({...newSchedule, notes: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleAddSchedule} className="bg-blue-600 hover:bg-blue-700">
                Buat Pengajuan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={activeTab === 'Pengajuan' ? 'border-blue-500 border-2' : ''}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pengajuan</CardTitle>
            <FileText className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pengajuanCount}</div>
            <p className="text-xs text-gray-500 mt-1">Menunggu persetujuan</p>
          </CardContent>
        </Card>
        <Card className={activeTab === 'Rencana' ? 'border-purple-500 border-2' : ''}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Rencana</CardTitle>
            <Calendar className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rencanaCount}</div>
            <p className="text-xs text-gray-500 mt-1">Disetujui & terjadwal</p>
          </CardContent>
        </Card>
        <Card className={activeTab === 'Perawatan' ? 'border-yellow-500 border-2' : ''}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Perawatan</CardTitle>
            <Wrench className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{perawatanCount}</div>
            <p className="text-xs text-gray-500 mt-1">Sedang dikerjakan</p>
          </CardContent>
        </Card>
        <Card className={activeTab === 'Selesai' ? 'border-green-500 border-2' : ''}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Selesai</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selesaiCount}</div>
            <p className="text-xs text-gray-500 mt-1">Telah diselesaikan</p>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Progress */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium">Pengajuan</div>
                <div className="text-sm text-gray-500">Submit & Review</div>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400" />
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium">Rencana</div>
                <div className="text-sm text-gray-500">Planning & Schedule</div>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400" />
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-yellow-600 text-white flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium">Perawatan</div>
                <div className="text-sm text-gray-500">Execution</div>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400" />
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium">Selesai</div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari berdasarkan nomor jadwal, kendaraan, atau teknisi..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter Prioritas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Prioritas</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Tabs */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="Pengajuan" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Pengajuan ({pengajuanCount})
              </TabsTrigger>
              <TabsTrigger value="Rencana" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Rencana ({rencanaCount})
              </TabsTrigger>
              <TabsTrigger value="Perawatan" className="flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Perawatan ({perawatanCount})
              </TabsTrigger>
              <TabsTrigger value="Selesai" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Selesai ({selesaiCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="Pengajuan" className="mt-6">
              {renderWorkflowTable('Pengajuan')}
            </TabsContent>

            <TabsContent value="Rencana" className="mt-6">
              {renderWorkflowTable('Rencana')}
            </TabsContent>

            <TabsContent value="Perawatan" className="mt-6">
              {renderWorkflowTable('Perawatan')}
            </TabsContent>

            <TabsContent value="Selesai" className="mt-6">
              {renderWorkflowTable('Selesai')}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Pengajuan Pemasangan Ban</DialogTitle>
          </DialogHeader>
          {selectedSchedule && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">No. Jadwal</Label>
                    <p className="font-medium text-lg">{selectedSchedule.scheduleNumber}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Status</Label>
                    <div className="mt-1">
                      <Badge className={
                        selectedSchedule.status === 'Pengajuan' ? 'bg-blue-100 text-blue-700' :
                        selectedSchedule.status === 'Rencana' ? 'bg-purple-100 text-purple-700' :
                        selectedSchedule.status === 'Perawatan' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }>
                        {selectedSchedule.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informasi Pengajuan */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900 border-b pb-2">Informasi Pengajuan</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Tanggal Pengajuan</Label>
                    <p className="font-medium">{new Date(selectedSchedule.date).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">No Polisi Armada</Label>
                    <p className="font-medium">{selectedSchedule.vehicleNumber}</p>
                  </div>
                </div>
              </div>

              {/* Spesifikasi Ban */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900 border-b pb-2">Spesifikasi Ban</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Ukuran Ban Yang Diajukan</Label>
                    <p className="font-medium text-blue-700">{selectedSchedule.tireSize}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Jumlah Total Ban</Label>
                    <p className="font-medium">
                      <Badge className="bg-blue-100 text-blue-800">{selectedSchedule.quantity} pcs</Badge>
                    </p>
                  </div>
                </div>
              </div>

              {/* Posisi Ban */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900 border-b pb-2">Detail Posisi Ban</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Posisi Ban</Label>
                    <p className="font-medium">{selectedSchedule.tirePosition || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Posisi Ban Yang Rusak</Label>
                    <p className="font-medium text-red-600">{selectedSchedule.damagedPosition || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Foto Kondisi */}
              {selectedSchedule.tireConditionPhoto && (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 border-b pb-2">Foto Kondisi Ban</h3>
                  <div className="bg-gray-50 p-4 rounded border">
                    <p className="text-sm text-gray-600">📎 {selectedSchedule.tireConditionPhoto}</p>
                  </div>
                </div>
              )}

              {/* Biaya */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900 border-b pb-2">Rincian Biaya</h3>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600">Harga Ban / Set</Label>
                      <p className="font-medium text-lg">Rp {selectedSchedule.pricePerSet.toLocaleString('id-ID')}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Total Biaya</Label>
                      <p className="font-medium text-xl text-green-700">Rp {selectedSchedule.totalCost.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Tambahan */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900 border-b pb-2">Informasi Tambahan</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Teknisi</Label>
                    <p className="font-medium">{selectedSchedule.technician || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Workshop</Label>
                    <p className="font-medium">{selectedSchedule.workshop || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Diajukan Oleh</Label>
                    <p className="font-medium">{selectedSchedule.submittedBy || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Tanggal Pengajuan</Label>
                    <p className="font-medium">{selectedSchedule.submittedDate || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              {(selectedSchedule.approvedBy || selectedSchedule.completedDate) && (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 border-b pb-2">Timeline Proses</h3>
                  <div className="space-y-2">
                    {selectedSchedule.approvedBy && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-600">Disetujui oleh:</span>
                        <span className="font-medium">{selectedSchedule.approvedBy}</span>
                        <span className="text-gray-500">({selectedSchedule.approvedDate})</span>
                      </div>
                    )}
                    {selectedSchedule.completedDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-600">Diselesaikan pada:</span>
                        <span className="font-medium">{selectedSchedule.completedDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Catatan */}
              {selectedSchedule.notes && (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 border-b pb-2">Catatan</h3>
                  <p className="p-3 bg-gray-50 rounded border text-gray-700">{selectedSchedule.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* BA Pengajuan Dialog */}
      <Dialog open={isBADialogOpen} onOpenChange={setIsBADialogOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Berita Acara Pengajuan Pembelian Ban</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handlePrintBA}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          {selectedSchedule && (
            <div className="space-y-6 p-6 bg-white" id="ba-pengajuan-print">
              {/* Header with Logo */}
              <div className="flex justify-between items-start border-b-2 border-gray-300 pb-4">
                <div>
                  <h2 className="text-xl font-bold">FORM PERMOHONAN PEMBELIAN BAN</h2>
                </div>
                <div className="w-48">
                  <img src={exampleImage} alt="Pertamina Patra Logistik" className="w-full" />
                </div>
              </div>

              {/* Form Data */}
              <div className="space-y-3">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border border-gray-400 bg-blue-100 px-3 py-2 w-1/4 font-medium">Tanggal Pengajuan</td>
                      <td className="border border-gray-400 px-3 py-2 w-1/4">{new Date(selectedSchedule.date).toLocaleDateString('id-ID')}</td>
                      <td className="border border-gray-400 bg-blue-100 px-3 py-2 w-1/4 font-medium">Posisi Ban Yang Rusak</td>
                      <td className="border border-gray-400 px-3 py-2 w-1/4">{selectedSchedule.damagedPosition || '-'}</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 bg-blue-100 px-3 py-2 font-medium">No Polisi Armada</td>
                      <td className="border border-gray-400 px-3 py-2">{selectedSchedule.vehicleNumber}</td>
                      <td className="border border-gray-400 bg-blue-100 px-3 py-2 font-medium">Posisi Ban</td>
                      <td className="border border-gray-400 px-3 py-2 text-sm">{selectedSchedule.tirePosition || '-'}</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 bg-blue-100 px-3 py-2 font-medium">Ukuran Ban Yang Di Ajukan</td>
                      <td className="border border-gray-400 px-3 py-2">{selectedSchedule.tireSize}</td>
                      <td rowSpan={2} className="border border-gray-400 px-3 py-2 text-center align-top pt-6">
                        <div className="text-sm text-gray-600">{selectedSchedule.tirePosition || '-'}</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 bg-blue-100 px-3 py-2 font-medium">Jumlah Total Ban Yang di Ajukan</td>
                      <td className="border border-gray-400 px-3 py-2">{selectedSchedule.quantity} Ban</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Pricing Table */}
              <div className="space-y-2">
                <h3 className="font-bold bg-yellow-200 px-3 py-2 border border-gray-400">Harga Ban /set</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-400 px-3 py-2">Ukuran</th>
                      <th className="border border-gray-400 px-3 py-2">Harga/Set</th>
                      <th className="border border-gray-400 px-3 py-2">Kebutuhan Ban</th>
                      <th className="border border-gray-400 px-3 py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-400 px-3 py-2 text-center">{selectedSchedule.tireSize}</td>
                      <td className="border border-gray-400 px-3 py-2 text-right">Rp {selectedSchedule.pricePerSet.toLocaleString('id-ID')}</td>
                      <td className="border border-gray-400 px-3 py-2 text-center">{selectedSchedule.quantity} Ban</td>
                      <td className="border border-gray-400 px-3 py-2 text-right">Rp {selectedSchedule.totalCost.toLocaleString('id-ID')}</td>
                    </tr>
                    <tr className="bg-yellow-200 font-bold">
                      <td colSpan={3} className="border border-gray-400 px-3 py-2 text-center">Grand Total</td>
                      <td className="border border-gray-400 px-3 py-2 text-right">Rp {selectedSchedule.totalCost.toLocaleString('id-ID')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signature Section */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center space-y-16">
                  <div>
                    <p className="font-medium mb-1">Yang Membuat,</p>
                  </div>
                  <div>
                    <p className="font-medium border-t border-gray-400 pt-2 inline-block px-8">
                      ( {selectedSchedule.submittedBy || '_______________'} )
                    </p>
                  </div>
                </div>
                <div className="text-center space-y-16">
                  <div>
                    <p className="font-medium mb-1">Mengetahui,</p>
                  </div>
                  <div>
                    <p className="font-medium border-t border-gray-400 pt-2 inline-block px-8">
                      ( {selectedSchedule.approvedBy || '_______________'} )
                    </p>
                  </div>
                </div>
                <div className="text-center space-y-16">
                  <div>
                    <p className="font-medium mb-1">Menyetujui,</p>
                  </div>
                  <div>
                    <p className="font-medium border-t border-gray-400 pt-2 inline-block px-8">
                      ( _______________ )
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              {selectedSchedule.notes && (
                <div className="mt-6 border-t pt-4">
                  <p className="font-medium mb-2">Catatan:</p>
                  <p className="text-gray-700">{selectedSchedule.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Pengajuan Pemasangan Ban</DialogTitle>
            <DialogDescription>
              Edit data pengajuan pemasangan atau penggantian ban kendaraan
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Tanggal dan No Polisi */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">Tanggal Pengajuan *</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={newSchedule.date}
                  onChange={(e) => setNewSchedule({...newSchedule, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-vehicleNumber">No Polisi Armada *</Label>
                <Input
                  id="edit-vehicleNumber"
                  placeholder="B 1234 XYZ"
                  value={newSchedule.vehicleNumber}
                  onChange={(e) => setNewSchedule({...newSchedule, vehicleNumber: e.target.value})}
                />
              </div>
            </div>

            {/* Ukuran dan Jumlah Ban */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-tireSize">Ukuran Ban Yang Diajukan *</Label>
                <Input
                  id="edit-tireSize"
                  placeholder="11R22.5, 295/80R22.5, dll"
                  value={newSchedule.tireSize}
                  onChange={(e) => setNewSchedule({...newSchedule, tireSize: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-quantity">Jumlah Total Ban Yang Diajukan *</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  placeholder="Contoh: 2, 4, 6, dll"
                  value={newSchedule.quantity || ''}
                  onChange={(e) => {
                    const qty = parseInt(e.target.value) || 0;
                    setNewSchedule({
                      ...newSchedule, 
                      quantity: qty,
                      totalCost: qty > 0 ? (newSchedule.pricePerSet * qty) : 0
                    });
                  }}
                />
              </div>
            </div>

            {/* Posisi Ban */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-tirePosition">Posisi Ban</Label>
                <Textarea
                  id="edit-tirePosition"
                  placeholder="Contoh: Depan Kiri, Depan Kanan"
                  value={newSchedule.tirePosition}
                  onChange={(e) => setNewSchedule({...newSchedule, tirePosition: e.target.value})}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-damagedPosition">Posisi Ban Yang Rusak</Label>
                <Textarea
                  id="edit-damagedPosition"
                  placeholder="Contoh: Depan Kiri"
                  value={newSchedule.damagedPosition}
                  onChange={(e) => setNewSchedule({...newSchedule, damagedPosition: e.target.value})}
                  rows={2}
                />
              </div>
            </div>

            {/* Upload Foto */}
            <div className="space-y-2">
              <Label htmlFor="edit-tirePhoto">Upload Foto Kondisi Ban (PNG, JPG)</Label>
              <Input
                id="edit-tirePhoto"
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setNewSchedule({...newSchedule, tireConditionPhoto: file.name});
                  }
                }}
              />
              {newSchedule.tireConditionPhoto && (
                <p className="text-xs text-gray-600">File saat ini: {newSchedule.tireConditionPhoto}</p>
              )}
            </div>

            {/* Harga */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-pricePerSet">Harga Ban / Set *</Label>
                <Input
                  id="edit-pricePerSet"
                  type="number"
                  placeholder="4500000"
                  value={newSchedule.pricePerSet || ''}
                  onChange={(e) => {
                    const price = parseInt(e.target.value) || 0;
                    setNewSchedule({
                      ...newSchedule, 
                      pricePerSet: price,
                      totalCost: price * newSchedule.quantity
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-totalCost">Total Biaya</Label>
                <Input
                  id="edit-totalCost"
                  value={`Rp ${newSchedule.totalCost.toLocaleString('id-ID')}`}
                  disabled
                  className="bg-gray-50 font-medium text-green-700"
                />
              </div>
            </div>

            {/* Info Tambahan */}
            <div className="space-y-2 border-t pt-4">
              <Label htmlFor="edit-technician">Teknisi (Opsional)</Label>
              <Input
                id="edit-technician"
                placeholder="Nama teknisi"
                value={newSchedule.technician}
                onChange={(e) => setNewSchedule({...newSchedule, technician: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-workshop">Workshop (Opsional)</Label>
                <Select value={newSchedule.workshop} onValueChange={(value) => setNewSchedule({...newSchedule, workshop: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih workshop" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Workshop A">Workshop A</SelectItem>
                    <SelectItem value="Workshop B">Workshop B</SelectItem>
                    <SelectItem value="Workshop C">Workshop C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-submittedBy">Nama Pengaju (Opsional)</Label>
                <Input
                  id="edit-submittedBy"
                  placeholder="Nama yang mengajukan"
                  value={newSchedule.submittedBy}
                  onChange={(e) => setNewSchedule({...newSchedule, submittedBy: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">Catatan Tambahan</Label>
              <Textarea
                id="edit-notes"
                placeholder="Catatan atau keterangan tambahan..."
                value={newSchedule.notes}
                onChange={(e) => setNewSchedule({...newSchedule, notes: e.target.value})}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setEditingSchedule(null);
            }}>
              Batal
            </Button>
            <Button onClick={handleUpdateSchedule} className="bg-blue-600 hover:bg-blue-700">
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
