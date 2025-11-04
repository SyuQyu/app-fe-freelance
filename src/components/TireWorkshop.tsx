import { useState } from 'react';
import { Calendar, Package, Wrench, History, FileText, Plus, Edit, Trash2, Search, Filter, Download, Clock, CheckCircle, AlertCircle, XCircle, Truck, User, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';

interface TireInventory {
  id: string;
  brand: string;
  size: string;
  type: string;
  quantity: number;
  condition: 'Baru' | 'Bekas' | 'Retreading';
  location: string;
  supplier: string;
  lastUpdate: string;
  minStock: number;
}

interface InstallationSchedule {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  driverName: string;
  region: string;
  pool: string;
  scheduledDate: string;
  scheduledTime: string;
  tireSize: string;
  tireType: string;
  vehicleWheelType: '8' | '10' | '12' | '14';
  quantity: number;
  workType: 'Lepas Ban' | 'Pasang Ban' | 'Rotasi';
  tirePosition: string[];
  priority: 'High' | 'Medium' | 'Low';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  estimatedDuration: number;
  assignedTechnician: string;
  cost: number;
  notes: string;
}

interface WorkStatus {
  id: string;
  vehiclePlate: string;
  workType: string;
  startTime: string;
  estimatedEnd: string;
  actualEnd?: string;
  technician: string;
  progress: number;
  status: 'Waiting' | 'In Progress' | 'Quality Check' | 'Completed' | 'On Hold';
  notes: string;
}

interface InstallationHistory {
  id: string;
  vehiclePlate: string;
  installDate: string;
  tireDetails: {
    brand: string;
    size: string;
    quantity: number;
    position: string[];
  };
  technician: string;
  workDuration: number;
  cost: number;
  nextMaintenanceKm: number;
  notes: string;
  warrantyPeriod: number;
}

const initialInventory: TireInventory[] = [
  {
    id: '1',
    brand: 'Bridgestone',
    size: '11R22.5',
    type: 'Radial',
    quantity: 45,
    condition: 'Baru',
    location: 'Gudang A-1',
    supplier: 'PT Bridgestone Indonesia',
    lastUpdate: '2024-10-06',
    minStock: 20
  },
  {
    id: '2',
    brand: 'Michelin',
    size: '315/80R22.5',
    type: 'Radial',
    quantity: 32,
    condition: 'Baru',
    location: 'Gudang A-2',
    supplier: 'PT Michelin Indonesia',
    lastUpdate: '2024-10-05',
    minStock: 15
  },
  {
    id: '3',
    brand: 'Goodyear',
    size: '295/80R22.5',
    type: 'Bias',
    quantity: 28,
    condition: 'Bekas',
    location: 'Gudang B-1',
    supplier: 'PT Goodyear Indonesia',
    lastUpdate: '2024-10-04',
    minStock: 10
  },
  {
    id: '4',
    brand: 'Dunlop',
    size: '11R22.5',
    type: 'Retreading',
    quantity: 12,
    condition: 'Retreading',
    location: 'Gudang C-1',
    supplier: 'Workshop Retreading',
    lastUpdate: '2024-10-03',
    minStock: 8
  }
];

const initialSchedules: InstallationSchedule[] = [
  {
    id: '1',
    vehicleId: 'V001',
    vehiclePlate: 'B 1234 ABC',
    driverName: 'Ahmad Rizki',
    region: 'Jakarta',
    pool: 'Pool A',
    scheduledDate: '2024-10-07',
    scheduledTime: '08:00',
    tireSize: '11R22.5',
    tireType: 'All Season',
    vehicleWheelType: '10',
    quantity: 4,
    workType: 'Pasang Ban',
    tirePosition: ['Front Left', 'Front Right', 'Rear Left 1', 'Rear Right 1'],
    priority: 'High',
    status: 'Scheduled',
    estimatedDuration: 120,
    assignedTechnician: 'Budi Santoso',
    cost: 600000,
    notes: 'Ganti ban depan dan belakang kiri-kanan'
  },
  {
    id: '2',
    vehicleId: 'V002',
    vehiclePlate: 'B 5678 DEF',
    driverName: 'Charlie Wijaya',
    region: 'Bekasi',
    pool: 'Pool B',
    scheduledDate: '2024-10-07',
    scheduledTime: '10:30',
    tireSize: '315/80R22.5',
    tireType: 'Commercial',
    vehicleWheelType: '12',
    quantity: 4,
    workType: 'Rotasi',
    tirePosition: ['Front Left', 'Front Right', 'Rear Left 1', 'Rear Right 1'],
    priority: 'Medium',
    status: 'In Progress',
    estimatedDuration: 90,
    assignedTechnician: 'Dedi Kurniawan',
    cost: 200000,
    notes: 'Rotasi ban untuk pemerataan aus'
  },
  {
    id: '3',
    vehicleId: 'V003',
    vehiclePlate: 'B 9999 XYZ',
    driverName: 'Doni Saputra',
    region: 'Tangerang',
    pool: 'Pool C',
    scheduledDate: '2024-10-08',
    scheduledTime: '09:00',
    tireSize: '11R22.5',
    tireType: 'Heavy Duty',
    vehicleWheelType: '14',
    quantity: 2,
    workType: 'Lepas Ban',
    tirePosition: ['Rear Left 2', 'Rear Right 2'],
    priority: 'Low',
    status: 'Scheduled',
    estimatedDuration: 60,
    assignedTechnician: 'Eko Prasetyo',
    cost: 200000,
    notes: 'Lepas ban belakang yang sudah aus'
  }
];

const initialWorkStatus: WorkStatus[] = [
  {
    id: '1',
    vehiclePlate: 'B 5678 DEF',
    workType: 'Rotasi Ban',
    startTime: '10:30',
    estimatedEnd: '12:00',
    technician: 'Dedi Kurniawan',
    progress: 65,
    status: 'In Progress',
    notes: 'Sedang proses rotasi ban depan ke belakang'
  },
  {
    id: '2',
    vehiclePlate: 'B 9101 GHI',
    workType: 'Quality Check',
    startTime: '13:15',
    estimatedEnd: '13:45',
    technician: 'Eko Prasetyo',
    progress: 90,
    status: 'Quality Check',
    notes: 'Pemeriksaan akhir tekanan angin dan balancing'
  }
];

const initialHistory: InstallationHistory[] = [
  {
    id: '1',
    vehiclePlate: 'B 1122 JKL',
    installDate: '2024-10-05',
    tireDetails: {
      brand: 'Bridgestone',
      size: '11R22.5',
      quantity: 6,
      position: ['Front Left', 'Front Right', 'Rear Left 1', 'Rear Right 1', 'Rear Left 2', 'Rear Right 2']
    },
    technician: 'Budi Santoso',
    workDuration: 180,
    cost: 15000000,
    nextMaintenanceKm: 80000,
    notes: 'Penggantian ban lengkap dengan balancing',
    warrantyPeriod: 12
  },
  {
    id: '2',
    vehiclePlate: 'B 3344 MNO',
    installDate: '2024-10-04',
    tireDetails: {
      brand: 'Michelin',
      size: '315/80R22.5',
      quantity: 4,
      position: ['Rear Left 1', 'Rear Right 1', 'Rear Left 2', 'Rear Right 2']
    },
    technician: 'Dedi Kurniawan',
    workDuration: 150,
    cost: 12000000,
    nextMaintenanceKm: 75000,
    notes: 'Ganti ban belakang, kondisi ban depan masih baik',
    warrantyPeriod: 18
  }
];

export function TireWorkshop() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [inventory] = useState<TireInventory[]>(initialInventory);
  const [schedules, setSchedules] = useState<InstallationSchedule[]>(initialSchedules);
  const [workStatus] = useState<WorkStatus[]>(initialWorkStatus);
  const [isCreateScheduleOpen, setIsCreateScheduleOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    vehiclePlate: '',
    driverName: '',
    region: '',
    pool: '',
    scheduledDate: '',
    scheduledTime: '',
    workType: 'Lepas Ban' as 'Lepas Ban' | 'Pasang Ban' | 'Rotasi',
    tirePosition: [] as string[],
    tireSize: '',
    tireType: '',
    vehicleWheelType: '8' as '8' | '10' | '12' | '14',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    assignedTechnician: '',
    estimatedDuration: 120,
    cost: 0,
    notes: ''
  });

  const calculateEstimatedCost = (workType: string, positions: string[]) => {
    const basePrice = {
      'Lepas Ban': 100000,
      'Pasang Ban': 150000,
      'Rotasi': 50000
    };
    
    const cost = (basePrice[workType as keyof typeof basePrice] || 0) * positions.length;
    return cost;
  };

  const handlePositionChange = (position: string, checked: boolean) => {
    let newPositions: string[];
    if (checked) {
      newPositions = [...newSchedule.tirePosition, position];
    } else {
      newPositions = newSchedule.tirePosition.filter(p => p !== position);
    }
    
    const estimatedCost = calculateEstimatedCost(newSchedule.workType, newPositions);
    
    setNewSchedule(prev => ({
      ...prev,
      tirePosition: newPositions,
      cost: estimatedCost
    }));
  };

  const handleWorkTypeChange = (workType: 'Lepas Ban' | 'Pasang Ban' | 'Rotasi') => {
    const estimatedCost = calculateEstimatedCost(workType, newSchedule.tirePosition);
    
    setNewSchedule(prev => ({
      ...prev,
      workType,
      cost: estimatedCost
    }));
  };

  const handleCreateSchedule = () => {
    // Validation
    if (!newSchedule.region || !newSchedule.pool || !newSchedule.vehiclePlate || !newSchedule.driverName || !newSchedule.scheduledDate || !newSchedule.scheduledTime || !newSchedule.tireType || !newSchedule.vehicleWheelType) {
      toast.error('Mohon lengkapi semua field yang wajib diisi!');
      return;
    }

    if (newSchedule.tirePosition.length === 0) {
      toast.error('Pilih minimal satu posisi ban!');
      return;
    }

    if (!newSchedule.assignedTechnician) {
      toast.error('Pilih teknisi yang akan ditugaskan!');
      return;
    }

    if (newSchedule.cost <= 0) {
      toast.error('Masukkan estimasi biaya yang valid!');
      return;
    }

    // Create new schedule object
    const scheduleId = `S${Date.now()}`;
    const newScheduleData: InstallationSchedule = {
      id: scheduleId,
      vehicleId: `V${Math.floor(Math.random() * 1000)}`,
      vehiclePlate: newSchedule.vehiclePlate,
      driverName: newSchedule.driverName,
      region: newSchedule.region,
      pool: newSchedule.pool,
      scheduledDate: newSchedule.scheduledDate,
      scheduledTime: newSchedule.scheduledTime,
      tireSize: newSchedule.tireSize,
      tireType: newSchedule.tireType,
      vehicleWheelType: newSchedule.vehicleWheelType,
      quantity: newSchedule.tirePosition.length,
      workType: newSchedule.workType,
      tirePosition: newSchedule.tirePosition,
      status: 'Scheduled',
      priority: newSchedule.priority,
      assignedTechnician: newSchedule.assignedTechnician,
      estimatedDuration: newSchedule.estimatedDuration,
      cost: newSchedule.cost,
      notes: newSchedule.notes
    };

    // Add to schedules
    setSchedules(prev => [newScheduleData, ...prev]);

    // Show success message
    toast.success('Jadwal berhasil dibuat!');

    // Reset form
    setNewSchedule({
      vehiclePlate: '',
      driverName: '',
      region: '',
      pool: '',
      scheduledDate: '',
      scheduledTime: '',
      workType: 'Lepas Ban',
      tirePosition: [],
      tireSize: '',
      tireType: '',
      vehicleWheelType: '8',
      priority: 'Medium',
      assignedTechnician: '',
      estimatedDuration: 120,
      cost: 0,
      notes: ''
    });

    // Close dialog
    setIsCreateScheduleOpen(false);
  };
  const [history] = useState<InstallationHistory[]>(initialHistory);
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicleSuggestions] = useState([
    'B 1234 ABC', 'B 5678 DEF', 'B 9101 JKL', 'B 2468 MNO', 'B 1357 PQR'
  ]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Scheduled': { color: 'bg-blue-100 text-blue-800', icon: Clock },
      'In Progress': { color: 'bg-orange-100 text-orange-800', icon: Wrench },
      'Completed': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'Cancelled': { color: 'bg-red-100 text-red-800', icon: XCircle },
      'Quality Check': { color: 'bg-purple-100 text-purple-800', icon: AlertCircle },
      'Waiting': { color: 'bg-gray-100 text-gray-800', icon: Clock },
      'On Hold': { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Waiting'];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityColors = {
      'High': 'bg-red-100 text-red-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-green-100 text-green-800'
    };

    return (
      <Badge className={priorityColors[priority as keyof typeof priorityColors]}>
        {priority}
      </Badge>
    );
  };

  const getConditionBadge = (condition: string) => {
    const conditionColors = {
      'Baru': 'bg-green-100 text-green-800',
      'Bekas': 'bg-orange-100 text-orange-800',
      'Retreading': 'bg-blue-100 text-blue-800'
    };

    return (
      <Badge className={conditionColors[condition as keyof typeof conditionColors]}>
        {condition}
      </Badge>
    );
  };

  return (
    <div className="p-6 max-w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lapas Pasang Ban</h1>
          <p className="text-gray-600 mt-2">
            Workshop management untuk pemasangan dan maintenance ban kendaraan fleet
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Jadwal Harian</span>
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Export Laporan</span>
          </Button>
          
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Jadwal Baru</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Inventory</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inventory.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
                <p className="text-xs text-green-600">+12 unit minggu ini</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Jadwal Hari Ini</p>
                <p className="text-2xl font-bold text-gray-900">{schedules.length}</p>
                <p className="text-xs text-blue-600">2 high priority</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sedang Dikerjakan</p>
                <p className="text-2xl font-bold text-gray-900">{workStatus.length}</p>
                <p className="text-xs text-orange-600">Avg. progress 77%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Wrench className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Selesai Bulan Ini</p>
                <p className="text-2xl font-bold text-gray-900">28</p>
                <p className="text-xs text-green-600">95% on time</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Inventory Ban
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Jadwal Pemasangan
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            Status Pekerjaan
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="report" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Laporan Workshop
          </TabsTrigger>
        </TabsList>

        {/* Inventory Tab */}
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Inventory Ban</CardTitle>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Cari brand, ukuran..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Stock
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Brand</TableHead>
                    <TableHead>Ukuran</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Kondisi</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Min Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.brand}</TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>
                        <span className={`font-bold ${item.quantity <= item.minStock ? 'text-red-600' : 'text-gray-900'}`}>
                          {item.quantity}
                        </span>
                      </TableCell>
                      <TableCell>{getConditionBadge(item.condition)}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{item.minStock}</TableCell>
                      <TableCell>
                        {item.quantity <= item.minStock ? (
                          <Badge className="bg-red-100 text-red-800">Low Stock</Badge>
                        ) : item.quantity <= item.minStock * 1.5 ? (
                          <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-800">Good</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Package className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Jadwal Pemasangan Ban</CardTitle>
                <div className="flex gap-3">
                  <Select defaultValue="today">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Hari Ini</SelectItem>
                      <SelectItem value="tomorrow">Besok</SelectItem>
                      <SelectItem value="week">Minggu Ini</SelectItem>
                      <SelectItem value="month">Bulan Ini</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog open={isCreateScheduleOpen} onOpenChange={setIsCreateScheduleOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Buat Jadwal
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Buat Jadwal Lepas Pasang Ban</DialogTitle>
                      </DialogHeader>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        {/* Left Column */}
                        <div className="space-y-4">
                          {/* Region & Pool */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="region">Region *</Label>
                              <Select value={newSchedule.region} onValueChange={(value) => 
                                setNewSchedule(prev => ({ ...prev, region: value }))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih region" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Jakarta">Jakarta</SelectItem>
                                  <SelectItem value="Bekasi">Bekasi</SelectItem>
                                  <SelectItem value="Tangerang">Tangerang</SelectItem>
                                  <SelectItem value="Depok">Depok</SelectItem>
                                  <SelectItem value="Bogor">Bogor</SelectItem>
                                  <SelectItem value="Bandung">Bandung</SelectItem>
                                  <SelectItem value="Surabaya">Surabaya</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="pool">Pool *</Label>
                              <Select value={newSchedule.pool} onValueChange={(value) => 
                                setNewSchedule(prev => ({ ...prev, pool: value }))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih pool" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pool A">Pool A - Main Workshop</SelectItem>
                                  <SelectItem value="Pool B">Pool B - Secondary</SelectItem>
                                  <SelectItem value="Pool C">Pool C - Mobile Unit</SelectItem>
                                  <SelectItem value="Pool D">Pool D - Emergency</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="workType">Type Pekerjaan *</Label>
                            <Select value={newSchedule.workType} onValueChange={handleWorkTypeChange}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Lepas Ban">Lepas Ban</SelectItem>
                                <SelectItem value="Pasang Ban">Pasang Ban</SelectItem>
                                <SelectItem value="Rotasi">Rotasi Ban</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="scheduledDate">Tanggal *</Label>
                              <Input
                                id="scheduledDate"
                                type="date"
                                value={newSchedule.scheduledDate}
                                onChange={(e) => setNewSchedule(prev => ({ ...prev, scheduledDate: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="scheduledTime">Waktu *</Label>
                              <Input
                                id="scheduledTime"
                                type="time"
                                value={newSchedule.scheduledTime}
                                onChange={(e) => setNewSchedule(prev => ({ ...prev, scheduledTime: e.target.value }))}
                              />
                            </div>
                          </div>
                          
                          <div className="relative">
                            <Label htmlFor="vehiclePlate">Nopol (Nomor Kendaraan) *</Label>
                            <Input
                              id="vehiclePlate"
                              value={newSchedule.vehiclePlate}
                              onChange={(e) => {
                                setNewSchedule(prev => ({ ...prev, vehiclePlate: e.target.value }));
                                setShowSuggestions(e.target.value.length > 0);
                              }}
                              onFocus={() => setShowSuggestions(newSchedule.vehiclePlate.length > 0)}
                              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                              placeholder="B 1234 ABC"
                            />
                            {showSuggestions && (
                              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                                {vehicleSuggestions
                                  .filter(vehicle => 
                                    vehicle.toLowerCase().includes(newSchedule.vehiclePlate.toLowerCase())
                                  )
                                  .map((vehicle) => (
                                    <div
                                      key={vehicle}
                                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                      onClick={() => {
                                        setNewSchedule(prev => ({ ...prev, vehiclePlate: vehicle }));
                                        setShowSuggestions(false);
                                      }}
                                    >
                                      {vehicle}
                                    </div>
                                  ))
                                }
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <Label htmlFor="driverName">Nama Driver *</Label>
                            <Input
                              id="driverName"
                              value={newSchedule.driverName}
                              onChange={(e) => setNewSchedule(prev => ({ ...prev, driverName: e.target.value }))}
                              placeholder="Nama supir"
                            />
                          </div>
                          
                          <div>
                            <Label>Posisi Ban *</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {['Front Left', 'Front Right', 'Rear Left 1', 'Rear Right 1', 'Rear Left 2', 'Rear Right 2', 'Spare Tire'].map((position) => (
                                <label key={position} className="flex items-center space-x-2 text-sm">
                                  <input
                                    type="checkbox"
                                    checked={newSchedule.tirePosition.includes(position)}
                                    onChange={(e) => handlePositionChange(position, e.target.checked)}
                                    className="rounded border-gray-300"
                                  />
                                  <span>{position}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Right Column */}
                        <div className="space-y-4">
                          {/* Cost Information */}
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-3">Informasi Biaya</h4>
                            <div className="space-y-3">
                              <div>
                                <Label htmlFor="cost">Biaya Estimasi (Rp) *</Label>
                                <Input
                                  id="cost"
                                  type="number"
                                  value={newSchedule.cost}
                                  onChange={(e) => setNewSchedule(prev => ({ ...prev, cost: parseInt(e.target.value) || 0 }))}
                                  placeholder="0"
                                  min="0"
                                />
                                <p className="text-xs text-blue-600 mt-1">
                                  {newSchedule.cost > 0 && `Rp ${newSchedule.cost.toLocaleString('id-ID')}`}
                                </p>
                              </div>
                              
                              <div className="text-xs text-blue-700 bg-blue-100 p-2 rounded">
                                <div className="font-medium mb-1">Tarif per ban:</div>
                                <div>• Lepas Ban: Rp 100.000</div>
                                <div>• Pasang Ban: Rp 150.000</div>
                                <div>• Rotasi: Rp 50.000</div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="tireSize">Ukuran Ban</Label>
                            <Select value={newSchedule.tireSize} onValueChange={(value) => 
                              setNewSchedule(prev => ({ ...prev, tireSize: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih ukuran ban" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="11R22.5">11R22.5</SelectItem>
                                <SelectItem value="315/80R22.5">315/80R22.5</SelectItem>
                                <SelectItem value="295/80R22.5">295/80R22.5</SelectItem>
                                <SelectItem value="12R22.5">12R22.5</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="tireType">Jenis Ban *</Label>
                              <Select value={newSchedule.tireType} onValueChange={(value) => 
                                setNewSchedule(prev => ({ ...prev, tireType: value }))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih jenis ban" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="All Season">All Season</SelectItem>
                                  <SelectItem value="Commercial">Commercial</SelectItem>
                                  <SelectItem value="Heavy Duty">Heavy Duty</SelectItem>
                                  <SelectItem value="Retreading">Retreading</SelectItem>
                                  <SelectItem value="Off Road">Off Road</SelectItem>
                                  <SelectItem value="Highway">Highway</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="vehicleWheelType">Jenis Kendaraan *</Label>
                              <Select value={newSchedule.vehicleWheelType} onValueChange={(value: '8' | '10' | '12' | '14') => 
                                setNewSchedule(prev => ({ ...prev, vehicleWheelType: value }))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih jenis" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="8">8 Ban</SelectItem>
                                  <SelectItem value="10">10 Ban</SelectItem>
                                  <SelectItem value="12">12 Ban</SelectItem>
                                  <SelectItem value="14">14 Ban</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="priority">Priority</Label>
                              <Select value={newSchedule.priority} onValueChange={(value: 'High' | 'Medium' | 'Low') => 
                                setNewSchedule(prev => ({ ...prev, priority: value }))}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="High">High</SelectItem>
                                  <SelectItem value="Medium">Medium</SelectItem>
                                  <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="estimatedDuration">Estimasi Durasi (menit)</Label>
                              <Input
                                id="estimatedDuration"
                                type="number"
                                value={newSchedule.estimatedDuration}
                                onChange={(e) => setNewSchedule(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) || 120 }))}
                                min="15"
                                max="480"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="assignedTechnician">Teknisi yang Ditugaskan *</Label>
                            <Select value={newSchedule.assignedTechnician} onValueChange={(value) => 
                              setNewSchedule(prev => ({ ...prev, assignedTechnician: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih teknisi" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Budi Santoso">Budi Santoso</SelectItem>
                                <SelectItem value="Dedi Kurniawan">Dedi Kurniawan</SelectItem>
                                <SelectItem value="Eko Prasetyo">Eko Prasetyo</SelectItem>
                                <SelectItem value="Fajar Maulana">Fajar Maulana</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="notes">Keterangan</Label>
                            <Textarea
                              id="notes"
                              value={newSchedule.notes}
                              onChange={(e) => setNewSchedule(prev => ({ ...prev, notes: e.target.value }))}
                              placeholder="Catatan atau keterangan tambahan untuk pekerjaan ini..."
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateScheduleOpen(false)}>
                          Batal
                        </Button>
                        <Button onClick={handleCreateSchedule}>
                          <Plus className="w-4 h-4 mr-2" />
                          Buat Jadwal
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Region/Pool</TableHead>
                    <TableHead>Nopol</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Jenis Ban</TableHead>
                    <TableHead>Jenis Kendaraan</TableHead>
                    <TableHead>Posisi Ban</TableHead>
                    <TableHead>Biaya</TableHead>
                    <TableHead>Teknisi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{schedule.scheduledTime}</div>
                          <div className="text-sm text-gray-500">{schedule.scheduledDate}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{schedule.region}</div>
                          <div className="text-gray-500">{schedule.pool}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{schedule.vehiclePlate}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          {schedule.driverName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          schedule.workType === 'Rotasi' ? 'bg-purple-100 text-purple-800' :
                          schedule.workType === 'Lepas Ban' ? 'bg-red-100 text-red-800' :
                          'bg-green-100 text-green-800'
                        }>
                          {schedule.workType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <Badge variant="secondary" className="text-xs">
                            {schedule.tireType}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">
                            {schedule.vehicleWheelType} Ban
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {schedule.tirePosition.join(', ')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-green-600">
                            Rp {schedule.cost.toLocaleString('id-ID')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{schedule.assignedTechnician}</TableCell>
                      <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <CheckCircle className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Work Status Tab */}
        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Status Pekerjaan Real-time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workStatus.map((work) => (
                  <div key={work.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-lg">{work.vehiclePlate}</h3>
                        <p className="text-gray-600">{work.workType}</p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(work.status)}
                        <p className="text-sm text-gray-500 mt-1">
                          {work.technician}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Mulai</p>
                        <p className="font-medium">{work.startTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Estimasi Selesai</p>
                        <p className="font-medium">{work.estimatedEnd}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Progress</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${work.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{work.progress}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-sm text-gray-600">{work.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>History Pemasangan Ban</CardTitle>
                <div className="flex gap-3">
                  <Input 
                    placeholder="Cari nomor kendaraan..."
                    className="w-64"
                  />
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Periode</SelectItem>
                      <SelectItem value="week">Minggu Ini</SelectItem>
                      <SelectItem value="month">Bulan Ini</SelectItem>
                      <SelectItem value="quarter">3 Bulan</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {history.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-lg flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          {record.vehiclePlate}
                        </h3>
                        <p className="text-gray-600">{record.installDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          Rp {record.cost.toLocaleString('id-ID')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {record.workDuration} menit
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Brand & Ukuran</p>
                        <p className="font-medium">{record.tireDetails.brand}</p>
                        <p className="text-sm">{record.tireDetails.size}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Quantity</p>
                        <p className="font-medium">{record.tireDetails.quantity} ban</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Teknisi</p>
                        <p className="font-medium">{record.technician}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Next Maintenance</p>
                        <p className="font-medium">{record.nextMaintenanceKm.toLocaleString()} km</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded p-3 mb-3">
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Posisi:</strong> {record.tireDetails.position.join(', ')}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Catatan:</strong> {record.notes}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">
                        Garansi: {record.warrantyPeriod} bulan
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <FileText className="w-3 h-3 mr-1" />
                          Detail
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3 mr-1" />
                          Invoice
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workshop Report Tab */}
        <TabsContent value="report">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span>Avg. Installation Time</span>
                    <span className="font-bold">142 menit</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <span>On-Time Completion</span>
                    <span className="font-bold">95.2%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                    <span>Total Jobs This Month</span>
                    <span className="font-bold">134 jobs</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                    <span>Customer Satisfaction</span>
                    <span className="font-bold">4.8/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inventory Status */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Ban dalam Stock</span>
                    <span className="font-bold">117 unit</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Low Stock Items</span>
                    <span className="font-bold text-red-600">2 items</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Fast Moving Items</span>
                    <span className="font-bold text-green-600">11R22.5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Supplier Active</span>
                    <span className="font-bold">4 supplier</span>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Top Suppliers</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>PT Bridgestone Indonesia</span>
                        <span>35%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>PT Michelin Indonesia</span>
                        <span>28%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>PT Goodyear Indonesia</span>
                        <span>22%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <span>Revenue This Month</span>
                    <span className="font-bold text-green-600">Rp 284,500,000</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span>Avg. Job Value</span>
                    <span className="font-bold">Rp 2,125,000</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                    <span>Parts Cost</span>
                    <span className="font-bold">Rp 180,300,000</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                    <span>Labor Cost</span>
                    <span className="font-bold">Rp 45,200,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Workshop Efficiency */}
            <Card>
              <CardHeader>
                <CardTitle>Workshop Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Bay Utilization</span>
                      <span className="font-bold">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Technician Productivity</span>
                      <span className="font-bold">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Quality Score</span>
                      <span className="font-bold">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Top Performers</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Budi Santoso</span>
                        <span className="text-green-600">98% efficiency</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Dedi Kurniawan</span>
                        <span className="text-green-600">95% efficiency</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Eko Prasetyo</span>
                        <span className="text-green-600">92% efficiency</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}