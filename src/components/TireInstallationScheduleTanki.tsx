'use client';

import { useState } from 'react';
import { Search, Plus, Edit, Trash2, CheckCircle, Wrench, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { toast } from 'sonner';

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
  pricePerSet: number;
  totalCost: number;
  technician: string;
  workshop: string;
  status: 'Pengajuan' | 'Rencana' | 'Perawatan' | 'Selesai';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  notes?: string;
  submittedBy?: string;
  submittedDate?: string;
  approvedBy?: string;
  approvedDate?: string;
  completedDate?: string;
}

const initialSchedules: InstallationSchedule[] = [
  {
    id: '1',
    scheduleNumber: 'TANKI-2024-001',
    date: '2024-10-15',
    vehicleNumber: 'B 1111 MT',
    vehicleType: 'Mobil Tanki',
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
    submittedBy: 'Budi Santoso',
    submittedDate: '2024-10-13'
  },
  {
    id: '2',
    scheduleNumber: 'TANKI-2024-002',
    date: '2024-10-14',
    vehicleNumber: 'B 2222 MT',
    vehicleType: 'Mobil Tanki',
    tireSize: '315/80R22.5',
    quantity: 4,
    tirePosition: 'Gandar Belakang 1 (Semua)',
    damagedPosition: 'Gandar Belakang 1 Kiri Dalam',
    pricePerSet: 5200000,
    totalCost: 20800000,
    technician: 'Budi Mekanik',
    workshop: 'Workshop B',
    status: 'Rencana',
    priority: 'Critical',
    submittedBy: 'Agus Wibowo',
    submittedDate: '2024-10-12',
    approvedBy: 'Supervisor Fleet',
    approvedDate: '2024-10-13'
  },
  {
    id: '3',
    scheduleNumber: 'TANKI-2024-003',
    date: '2024-10-14',
    vehicleNumber: 'B 3333 MT',
    vehicleType: 'Mobil Tanki',
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
    submittedBy: 'Dedi Rahman',
    submittedDate: '2024-10-11',
    approvedBy: 'Supervisor Fleet',
    approvedDate: '2024-10-12'
  },
  {
    id: '4',
    scheduleNumber: 'TANKI-2024-004',
    date: '2024-10-13',
    vehicleNumber: 'B 4444 MT',
    vehicleType: 'Mobil Tanki',
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
    submittedBy: 'Ahmad Subandi',
    submittedDate: '2024-10-10',
    approvedBy: 'Supervisor Fleet',
    approvedDate: '2024-10-11',
    completedDate: '2024-10-13'
  }
];

export function TireInstallationScheduleTanki() {
  const [schedules, setSchedules] = useState<InstallationSchedule[]>(initialSchedules);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('Pengajuan');
  const [isCreatingSubmission, setIsCreatingSubmission] = useState(false);
  const [newSubmission, setNewSubmission] = useState({
    date: '',
    vehicleNumber: '',
    vehicleType: 'Mobil Tanki',
    tireSize: '',
    quantity: 1,
    tirePosition: '',
    damagedPosition: '',
    pricePerSet: 0,
    technician: '',
    workshop: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical',
    notes: ''
  });

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

  const pengajuanCount = schedules.filter(s => s.status === 'Pengajuan').length;
  const rencanaCount = schedules.filter(s => s.status === 'Rencana').length;
  const perawatanCount = schedules.filter(s => s.status === 'Perawatan').length;
  const selesaiCount = schedules.filter(s => s.status === 'Selesai').length;

  const handleApprove = (id: string) => {
    setSchedules(schedules.map(schedule =>
      schedule.id === id ? { 
        ...schedule, 
        status: 'Rencana',
        approvedBy: 'Supervisor Fleet',
        approvedDate: new Date().toISOString().split('T')[0]
      } : schedule
    ));
    toast.success('Pengajuan berhasil disetujui!');
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

  const handleCreateSubmission = () => {
    const newSchedule: InstallationSchedule = {
      id: (schedules.length + 1).toString(),
      scheduleNumber: `TANKI-2024-${String(schedules.length + 1).padStart(3, '0')}`,
      date: newSubmission.date,
      vehicleNumber: newSubmission.vehicleNumber,
      vehicleType: newSubmission.vehicleType,
      tireSize: newSubmission.tireSize,
      quantity: newSubmission.quantity,
      tirePosition: newSubmission.tirePosition,
      damagedPosition: newSubmission.damagedPosition,
      pricePerSet: newSubmission.pricePerSet,
      totalCost: newSubmission.pricePerSet * newSubmission.quantity,
      technician: newSubmission.technician,
      workshop: newSubmission.workshop,
      status: 'Pengajuan',
      priority: newSubmission.priority,
      notes: newSubmission.notes,
      submittedBy: 'User',
      submittedDate: new Date().toISOString().split('T')[0]
    };

    setSchedules([...schedules, newSchedule]);
    setIsCreatingSubmission(false);
    setNewSubmission({
      date: '',
      vehicleNumber: '',
      vehicleType: 'Mobil Tanki',
      tireSize: '',
      quantity: 1,
      tirePosition: '',
      damagedPosition: '',
      pricePerSet: 0,
      technician: '',
      workshop: '',
      priority: 'Medium',
      notes: ''
    });
    toast.success('Pengajuan pemasangan ban berhasil dibuat!');
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
                    <Button size="sm" variant="ghost" title="Lihat Detail">
                      <Eye className="w-4 h-4" />
                    </Button>
                    {status === 'Pengajuan' && (
                      <>
                        <Button size="sm" variant="ghost" title="Edit">
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Jadwal Pemasangan Ban - Mobil Tanki</h1>
          <p className="text-gray-600 mt-1">Kelola jadwal pemasangan dan penggantian ban Mobil Tanki</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsCreatingSubmission(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Buat Pengajuan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{pengajuanCount}</div>
              <div className="text-sm text-gray-600 mt-1">Pengajuan</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{rencanaCount}</div>
              <div className="text-sm text-gray-600 mt-1">Rencana</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{perawatanCount}</div>
              <div className="text-sm text-gray-600 mt-1">Perawatan</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{selesaiCount}</div>
              <div className="text-sm text-gray-600 mt-1">Selesai</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari no. jadwal, polisi, teknisi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger>
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
          <Button variant="outline" onClick={() => { setSearchTerm(''); setFilterPriority('all'); }}>
            Reset Filter
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="Pengajuan">Pengajuan ({pengajuanCount})</TabsTrigger>
          <TabsTrigger value="Rencana">Rencana ({rencanaCount})</TabsTrigger>
          <TabsTrigger value="Perawatan">Perawatan ({perawatanCount})</TabsTrigger>
          <TabsTrigger value="Selesai">Selesai ({selesaiCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="Pengajuan">
          <Card>
            <CardHeader>
              <CardTitle>Tahap Pengajuan</CardTitle>
            </CardHeader>
            <CardContent>
              {renderWorkflowTable('Pengajuan')}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="Rencana">
          <Card>
            <CardHeader>
              <CardTitle>Tahap Rencana</CardTitle>
            </CardHeader>
            <CardContent>
              {renderWorkflowTable('Rencana')}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="Perawatan">
          <Card>
            <CardHeader>
              <CardTitle>Tahap Perawatan</CardTitle>
            </CardHeader>
            <CardContent>
              {renderWorkflowTable('Perawatan')}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="Selesai">
          <Card>
            <CardHeader>
              <CardTitle>Tahap Selesai</CardTitle>
            </CardHeader>
            <CardContent>
              {renderWorkflowTable('Selesai')}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Form Buat Pengajuan */}
      <Dialog open={isCreatingSubmission} onOpenChange={setIsCreatingSubmission}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Buat Pengajuan Pemasangan Ban - Mobil Tanki</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Tanggal Rencana *</Label>
                <Input
                  id="date"
                  type="date"
                  value={newSubmission.date}
                  onChange={(e) => setNewSubmission({...newSubmission, date: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="vehicleNumber">No. Polisi *</Label>
                <Input
                  id="vehicleNumber"
                  value={newSubmission.vehicleNumber}
                  onChange={(e) => setNewSubmission({...newSubmission, vehicleNumber: e.target.value})}
                  placeholder="B 1234 MT"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tireSize">Ukuran Ban *</Label>
                <Select value={newSubmission.tireSize} onValueChange={(value) => setNewSubmission({...newSubmission, tireSize: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih ukuran ban" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="11R22.5">11R22.5</SelectItem>
                    <SelectItem value="295/80R22.5">295/80R22.5</SelectItem>
                    <SelectItem value="315/80R22.5">315/80R22.5</SelectItem>
                    <SelectItem value="12R22.5">12R22.5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantity">Jumlah Ban *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={newSubmission.quantity}
                  onChange={(e) => setNewSubmission({...newSubmission, quantity: parseInt(e.target.value) || 1})}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tirePosition">Posisi Ban</Label>
              <Input
                id="tirePosition"
                value={newSubmission.tirePosition}
                onChange={(e) => setNewSubmission({...newSubmission, tirePosition: e.target.value})}
                placeholder="Contoh: Depan Kiri, Depan Kanan"
              />
            </div>

            <div>
              <Label htmlFor="damagedPosition">Posisi Ban Rusak</Label>
              <Input
                id="damagedPosition"
                value={newSubmission.damagedPosition}
                onChange={(e) => setNewSubmission({...newSubmission, damagedPosition: e.target.value})}
                placeholder="Contoh: Depan Kiri"
              />
            </div>

            <div>
              <Label htmlFor="pricePerSet">Harga per Set (Rp) *</Label>
              <Input
                id="pricePerSet"
                type="number"
                min="0"
                value={newSubmission.pricePerSet}
                onChange={(e) => setNewSubmission({...newSubmission, pricePerSet: parseInt(e.target.value) || 0})}
                placeholder="4500000"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="technician">Teknisi</Label>
                <Input
                  id="technician"
                  value={newSubmission.technician}
                  onChange={(e) => setNewSubmission({...newSubmission, technician: e.target.value})}
                  placeholder="Nama teknisi"
                />
              </div>
              <div>
                <Label htmlFor="workshop">Workshop</Label>
                <Select value={newSubmission.workshop} onValueChange={(value) => setNewSubmission({...newSubmission, workshop: value})}>
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
            </div>

            <div>
              <Label htmlFor="priority">Prioritas</Label>
              <Select value={newSubmission.priority} onValueChange={(value: 'Low' | 'Medium' | 'High' | 'Critical') => setNewSubmission({...newSubmission, priority: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih prioritas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Catatan</Label>
              <Input
                id="notes"
                value={newSubmission.notes}
                onChange={(e) => setNewSubmission({...newSubmission, notes: e.target.value})}
                placeholder="Catatan tambahan"
              />
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Biaya:</span>
                <span className="text-xl font-bold text-blue-600">
                  Rp {(newSubmission.pricePerSet * newSubmission.quantity).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCreatingSubmission(false)}>
                Batal
              </Button>
              <Button onClick={handleCreateSubmission} className="bg-blue-600 hover:bg-blue-700">
                Buat Pengajuan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
