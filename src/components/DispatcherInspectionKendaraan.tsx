'use client';

import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Search, Plus, Filter, Eye, Trash2, ClipboardCheck, CheckCircle, AlertCircle, Calendar, User, Truck, Shield, ChevronsUpDown, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useDropdownSettings } from './DropdownSettingsContext';

interface InspectionChecklistItem {
  id: number;
  item: string;
  kondisi: 'Baik' | 'Rusak' | '';
  keterangan: string;
}

interface InspectionRecord {
  id: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  plateNumber: string;
  vehicleType: string;
  tanggalInspeksi: string;
  jamInspeksi: string;
  inspectedBy: string;
  status: 'Baik' | 'Rusak' | 'Perlu Perbaikan';
  statusInspeksi: 'Belum Selesai' | 'Selesai';
  itemsInterior: InspectionChecklistItem[];
  itemsEksterior: InspectionChecklistItem[];
  keteranganTambahan: string;
  createdAt: string;
}

export function DispatcherInspectionKendaraan() {
  const { getOptions } = useDropdownSettings();
  
  // Master Data - Data dari Master Data Supir
  const [masterDrivers] = useState([
    { id: '1', employeeId: 'DRV001', namaLengkap: 'Budi Santoso', jenisSim: 'SIM B1' },
    { id: '2', employeeId: 'DRV002', namaLengkap: 'Agus Prasetyo', jenisSim: 'SIM B2' },
    { id: '3', employeeId: 'DRV003', namaLengkap: 'Joko Widodo', jenisSim: 'SIM B1' },
    { id: '4', employeeId: 'DRV004', namaLengkap: 'Rudi Hartono', jenisSim: 'SIM B2' },
    { id: '5', employeeId: 'DRV005', namaLengkap: 'Bambang Susilo', jenisSim: 'SIM B1' }
  ]);

  // Master Data - Data dari Master Data Kendaraan KRP
  const [masterVehicles] = useState([
    { id: '1', nopolEksisting: 'B 1234 ABC', merkTypeMobil: 'Toyota Avanza 1.5', jenisKendaraanBaru: 'Kendaraan Ringan Penumpang' },
    { id: '2', nopolEksisting: 'B 5678 DEF', merkTypeMobil: 'Toyota Innova 2.4', jenisKendaraanBaru: 'Kendaraan Ringan Penumpang' },
    { id: '3', nopolEksisting: 'B 9012 GHI', merkTypeMobil: 'Honda CR-V 2.0', jenisKendaraanBaru: 'Kendaraan Ringan Penumpang' },
    { id: '4', nopolEksisting: 'B 3456 JKL', merkTypeMobil: 'Suzuki Ertiga 1.5', jenisKendaraanBaru: 'Kendaraan Ringan Penumpang' },
    { id: '5', nopolEksisting: 'B 7890 MNO', merkTypeMobil: 'Mitsubishi Xpander 1.5', jenisKendaraanBaru: 'Kendaraan Ringan Penumpang' }
  ]);

  // Load inspection items from settings
  const getInspectionItems = (categoryId: string): InspectionChecklistItem[] => {
    const options = getOptions(categoryId);
    return options.map((opt, index) => ({
      id: index + 1,
      item: opt.label,
      kondisi: '' as 'Baik' | 'Rusak' | '',
      keterangan: ''
    }));
  };

  // Load inspection records from localStorage on mount
  const loadInspectionRecords = () => {
    const savedRecords = localStorage.getItem('inspectionRecords');
    if (savedRecords) {
      try {
        const records = JSON.parse(savedRecords);
        // Filter out records older than 1 day (24 hours)
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        
        const filteredRecords = records.filter((record: InspectionRecord) => {
          const recordDate = new Date(record.createdAt);
          return recordDate >= oneDayAgo;
        });
        
        // If we filtered some records, update localStorage
        if (filteredRecords.length !== records.length) {
          localStorage.setItem('inspectionRecords', JSON.stringify(filteredRecords));
        }
        
        return filteredRecords;
      } catch (error) {
        console.error('Error loading inspection records:', error);
        return [];
      }
    }
    return [];
  };

  const [inspectionRecords, setInspectionRecords] = useState<InspectionRecord[]>(loadInspectionRecords());
  const [showDialog, setShowDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<InspectionRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Save inspection records to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('inspectionRecords', JSON.stringify(inspectionRecords));
  }, [inspectionRecords]);

  // Form state
  const [formData, setFormData] = useState({
    driverId: '',
    driverName: '',
    vehicleId: '',
    plateNumber: '',
    tanggalInspeksi: new Date().toISOString().split('T')[0],
    jamInspeksi: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    inspectedBy: 'Dispatcher',
    keteranganTambahan: '',
    statusInspeksi: 'Belum Selesai' as 'Belum Selesai' | 'Selesai'
  });

  // State untuk combobox open/close
  const [openDriverCombobox, setOpenDriverCombobox] = useState(false);
  const [openVehicleCombobox, setOpenVehicleCombobox] = useState(false);

  // Initialize checklist items from settings
  const [itemsInterior, setItemsInterior] = useState<InspectionChecklistItem[]>(() => 
    getInspectionItems('inspection-interior')
  );
  const [itemsEksterior, setItemsEksterior] = useState<InspectionChecklistItem[]>(() => 
    getInspectionItems('inspection-eksterior')
  );

  // Update items when settings change
  useEffect(() => {
    setItemsInterior(getInspectionItems('inspection-interior'));
    setItemsEksterior(getInspectionItems('inspection-eksterior'));
  }, [getOptions]);

  // Calculate overall status based on checklist items
  const calculateOverallStatus = (): 'Baik' | 'Rusak' | 'Perlu Perbaikan' => {
    const allItems = [...itemsInterior, ...itemsEksterior];
    const hasRusak = allItems.some(item => item.kondisi === 'Rusak');
    const allBaik = allItems.every(item => item.kondisi === 'Baik');

    if (hasRusak) return 'Rusak';
    if (allBaik) return 'Baik';
    return 'Perlu Perbaikan';
  };

  const handleInteriorChange = (id: number, field: keyof InspectionChecklistItem, value: any) => {
    setItemsInterior(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleEksteriorChange = (id: number, field: keyof InspectionChecklistItem, value: any) => {
    setItemsEksterior(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = async () => {
    // Validate: either select from dropdown OR type manually
    const hasDriverInfo = formData.driverId || formData.driverName;
    const hasVehicleInfo = formData.vehicleId || formData.plateNumber;
    
    if (!hasDriverInfo || !hasVehicleInfo) {
      toast.error('Mohon lengkapi data driver dan kendaraan');
      return;
    }

    setIsSubmitting(true);

    // Get driver and vehicle info (could be from dropdown or manual input)
    const driver = masterDrivers.find(d => d.id === formData.driverId);
    const vehicle = masterVehicles.find(v => v.id === formData.vehicleId);

    // Determine values: use from master data if selected, otherwise use manual input
    const finalDriverName = driver?.namaLengkap || formData.driverName;
    const finalPlateNumber = vehicle?.nopolEksisting || formData.plateNumber;
    const finalVehicleType = vehicle?.merkTypeMobil || 'Kendaraan Manual';

    const overallStatus = calculateOverallStatus();

    const newRecord: InspectionRecord = {
      id: Date.now().toString(),
      driverId: formData.driverId || 'manual',
      driverName: finalDriverName,
      vehicleId: formData.vehicleId || 'manual',
      plateNumber: finalPlateNumber,
      vehicleType: finalVehicleType,
      tanggalInspeksi: formData.tanggalInspeksi,
      jamInspeksi: formData.jamInspeksi,
      inspectedBy: formData.inspectedBy,
      status: overallStatus,
      statusInspeksi: formData.statusInspeksi,
      itemsInterior: itemsInterior,
      itemsEksterior: itemsEksterior,
      keteranganTambahan: formData.keteranganTambahan,
      createdAt: new Date().toISOString()
    };

    // Simulate API call
    setTimeout(() => {
      setInspectionRecords(prev => [newRecord, ...prev]);
      
      if (overallStatus === 'Baik') {
        toast.success('✓ Inspeksi selesai - Status: BAIK', {
          description: `${finalDriverName} dengan kendaraan ${finalPlateNumber} siap beroperasi`
        });
      } else if (overallStatus === 'Rusak') {
        toast.error('✗ Inspeksi selesai - Status: RUSAK', {
          description: `${finalPlateNumber} memerlukan perbaikan segera`
        });
      } else {
        toast.warning('⚠ Inspeksi selesai - Status: PERLU PERBAIKAN', {
          description: `${finalPlateNumber} memerlukan pengecekan lebih lanjut`
        });
      }

      // Reset form
      setFormData({
        driverId: '',
        driverName: '',
        vehicleId: '',
        plateNumber: '',
        tanggalInspeksi: new Date().toISOString().split('T')[0],
        jamInspeksi: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        inspectedBy: 'Dispatcher',
        keteranganTambahan: '',
        statusInspeksi: 'Belum Selesai'
      });
      setItemsInterior(getInspectionItems('inspection-interior'));
      setItemsEksterior(getInspectionItems('inspection-eksterior'));
      setOpenDriverCombobox(false);
      setOpenVehicleCombobox(false);
      setShowDialog(false);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleDelete = (id: string) => {
    setInspectionRecords(prev => prev.filter(record => record.id !== id));
    toast.success('Data inspeksi berhasil dihapus');
  };

  const handleViewDetail = (record: InspectionRecord) => {
    setSelectedRecord(record);
    setShowDetailDialog(true);
  };

  // Filter records
  const filteredRecords = inspectionRecords.filter(record => {
    const matchesSearch = 
      record.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.plateNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || record.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // Stats calculations
  const totalInspections = inspectionRecords.length;
  const baikCount = inspectionRecords.filter(r => r.status === 'Baik').length;
  const rusakCount = inspectionRecords.filter(r => r.status === 'Rusak').length;
  const perluPerbaikanCount = inspectionRecords.filter(r => r.status === 'Perlu Perbaikan').length;

  // Get selected driver and vehicle info for form preview
  const selectedDriver = masterDrivers.find(d => d.id === formData.driverId);
  const selectedVehicle = masterVehicles.find(v => v.id === formData.vehicleId);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-slate-900 mb-2">Inspection Kendaraan</h1>
          <p className="text-slate-600">
            Kelola inspeksi kendaraan harian sebelum operasional
          </p>
        </div>
        <Button onClick={() => setShowDialog(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Inspeksi Baru
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Inspeksi</p>
                <p className="text-2xl text-slate-900 mt-1">{totalInspections}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ClipboardCheck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Status Baik</p>
                <p className="text-2xl text-slate-900 mt-1">{baikCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Perlu Perbaikan</p>
                <p className="text-2xl text-slate-900 mt-1">{perluPerbaikanCount}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Status Rusak</p>
                <p className="text-2xl text-slate-900 mt-1">{rusakCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Inspeksi Kendaraan</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters and Search - Moved inside table */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari berdasarkan nama driver atau plat nomor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="Baik">Baik</SelectItem>
                  <SelectItem value="Perlu Perbaikan">Perlu Perbaikan</SelectItem>
                  <SelectItem value="Rusak">Rusak</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm">Tanggal</th>
                  <th className="text-left p-3 text-sm">Waktu</th>
                  <th className="text-left p-3 text-sm">Driver</th>
                  <th className="text-left p-3 text-sm">Kendaraan</th>
                  <th className="text-left p-3 text-sm">Plat Nomor</th>
                  <th className="text-left p-3 text-sm">Status</th>
                  <th className="text-left p-3 text-sm">Inspektur</th>
                  <th className="text-left p-3 text-sm">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-gray-500">
                      {searchTerm || filterStatus !== 'all' 
                        ? 'Tidak ada data yang sesuai dengan filter'
                        : 'Belum ada data inspeksi. Klik "Inspeksi Baru" untuk memulai.'}
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm">
                        {new Date(record.tanggalInspeksi).toLocaleDateString('id-ID')}
                      </td>
                      <td className="p-3 text-sm">{record.jamInspeksi}</td>
                      <td className="p-3 text-sm">{record.driverName}</td>
                      <td className="p-3 text-sm">{record.vehicleType}</td>
                      <td className="p-3 text-sm">{record.plateNumber}</td>
                      <td className="p-3 text-sm">
                        <Badge 
                          className={
                            record.status === 'Baik' 
                              ? 'bg-green-100 text-green-700 hover:bg-green-100'
                              : record.status === 'Rusak'
                              ? 'bg-red-100 text-red-700 hover:bg-red-100'
                              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                          }
                        >
                          {record.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm">{record.inspectedBy}</td>
                      <td className="p-3 text-sm">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetail(record)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(record.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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

      {/* Add/Edit Dialog - IMPROVED VERSION */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ClipboardCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl">Form Inspection Kendaraan</DialogTitle>
                <p className="text-sm text-gray-600 mt-1">Lengkapi form inspeksi sebelum kendaraan beroperasi</p>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-6 mt-6">
            {/* SECTION 1: Informasi Dasar */}
            <Card className="border-2 border-blue-100 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent pb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg">Informasi Dasar</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Driver Selection - Auto-completion Combobox */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-500" />
                      Pilih Driver <span className="text-red-500">*</span>
                    </Label>
                    <Popover open={openDriverCombobox} onOpenChange={setOpenDriverCombobox}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openDriverCombobox}
                          className="w-full justify-between h-11 font-normal"
                        >
                          {formData.driverId 
                            ? masterDrivers.find(d => d.id === formData.driverId)?.namaLengkap
                            : formData.driverName 
                              ? formData.driverName
                              : "Pilih driver atau ketik manual..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                        <Command>
                          <CommandInput 
                            placeholder="Cari driver atau ketik manual..." 
                            onValueChange={(search) => {
                              // Update manual input jika user mengetik
                              if (search && !masterDrivers.find(d => 
                                d.namaLengkap.toLowerCase().includes(search.toLowerCase()) ||
                                d.employeeId.toLowerCase().includes(search.toLowerCase())
                              )) {
                                setFormData(prev => ({ ...prev, driverName: search, driverId: '' }));
                              }
                            }}
                          />
                          <CommandList>
                            <CommandEmpty>
                              <div className="py-6 text-center text-sm">
                                <p className="text-gray-500 mb-2">Driver tidak ditemukan</p>
                                <p className="text-xs text-gray-400">Ketik untuk input manual: "{formData.driverName}"</p>
                              </div>
                            </CommandEmpty>
                            <CommandGroup heading="Pilih dari Master Data">
                              {masterDrivers.map((driver) => (
                                <CommandItem
                                  key={driver.id}
                                  value={`${driver.namaLengkap} ${driver.employeeId}`}
                                  onSelect={() => {
                                    setFormData(prev => ({ 
                                      ...prev, 
                                      driverId: driver.id,
                                      driverName: driver.namaLengkap
                                    }));
                                    setOpenDriverCombobox(false);
                                  }}
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 ${
                                      formData.driverId === driver.id ? "opacity-100" : "opacity-0"
                                    }`}
                                  />
                                  <div className="flex items-center gap-2 flex-1">
                                    <User className="w-4 h-4 text-gray-500" />
                                    <div>
                                      <div>{driver.namaLengkap}</div>
                                      <div className="text-xs text-gray-500">{driver.employeeId} - {driver.jenisSim}</div>
                                    </div>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    
                    {selectedDriver && formData.driverId && (
                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <Badge className="bg-blue-600 text-white">{selectedDriver.jenisSim}</Badge>
                        <span className="text-sm text-gray-700">{selectedDriver.employeeId}</span>
                      </div>
                    )}
                  </div>

                  {/* Vehicle Selection - Auto-completion Combobox */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-sm">
                      <Truck className="w-4 h-4 text-gray-500" />
                      Pilih Kendaraan <span className="text-red-500">*</span>
                    </Label>
                    <Popover open={openVehicleCombobox} onOpenChange={setOpenVehicleCombobox}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openVehicleCombobox}
                          className="w-full justify-between h-11 font-normal"
                        >
                          {formData.vehicleId 
                            ? masterVehicles.find(v => v.id === formData.vehicleId)?.nopolEksisting
                            : formData.plateNumber 
                              ? formData.plateNumber
                              : "Pilih kendaraan atau ketik manual..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                        <Command>
                          <CommandInput 
                            placeholder="Cari kendaraan atau ketik plat nomor..." 
                            onValueChange={(search) => {
                              // Update manual input jika user mengetik
                              if (search && !masterVehicles.find(v => 
                                v.nopolEksisting.toLowerCase().includes(search.toLowerCase()) ||
                                v.merkTypeMobil.toLowerCase().includes(search.toLowerCase())
                              )) {
                                setFormData(prev => ({ ...prev, plateNumber: search, vehicleId: '' }));
                              }
                            }}
                          />
                          <CommandList>
                            <CommandEmpty>
                              <div className="py-6 text-center text-sm">
                                <p className="text-gray-500 mb-2">Kendaraan tidak ditemukan</p>
                                <p className="text-xs text-gray-400">Ketik untuk input manual: "{formData.plateNumber}"</p>
                              </div>
                            </CommandEmpty>
                            <CommandGroup heading="Pilih dari Master Data">
                              {masterVehicles.map((vehicle) => (
                                <CommandItem
                                  key={vehicle.id}
                                  value={`${vehicle.nopolEksisting} ${vehicle.merkTypeMobil}`}
                                  onSelect={() => {
                                    setFormData(prev => ({ 
                                      ...prev, 
                                      vehicleId: vehicle.id,
                                      plateNumber: vehicle.nopolEksisting
                                    }));
                                    setOpenVehicleCombobox(false);
                                  }}
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 ${
                                      formData.vehicleId === vehicle.id ? "opacity-100" : "opacity-0"
                                    }`}
                                  />
                                  <div className="flex items-center gap-2 flex-1">
                                    <Truck className="w-4 h-4 text-gray-500" />
                                    <div>
                                      <div>{vehicle.nopolEksisting}</div>
                                      <div className="text-xs text-gray-500">{vehicle.merkTypeMobil}</div>
                                    </div>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    
                    {selectedVehicle && formData.vehicleId && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                        <Badge className="bg-green-600 text-white">{selectedVehicle.nopolEksisting}</Badge>
                        <span className="text-sm text-gray-700">{selectedVehicle.jenisKendaraanBaru}</span>
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      Tanggal Inspeksi
                    </Label>
                    <Input
                      type="date"
                      value={formData.tanggalInspeksi}
                      onChange={(e) => setFormData(prev => ({ ...prev, tanggalInspeksi: e.target.value }))}
                      className="h-11"
                    />
                  </div>

                  {/* Time */}
                  <div className="space-y-3">
                    <Label className="text-sm">Jam Inspeksi</Label>
                    <Input
                      type="time"
                      value={formData.jamInspeksi}
                      onChange={(e) => setFormData(prev => ({ ...prev, jamInspeksi: e.target.value }))}
                      className="h-11"
                    />
                  </div>

                  {/* Inspector */}
                  <div className="space-y-3">
                    <Label className="text-sm">Inspektur</Label>
                    <Input
                      value={formData.inspectedBy}
                      onChange={(e) => setFormData(prev => ({ ...prev, inspectedBy: e.target.value }))}
                      placeholder="Nama inspektur"
                      className="h-11"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SECTION 2: Interior Checklist */}
            <Card className="border-2 border-purple-100 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent pb-4">
                <CardTitle className="text-lg">Pemeriksaan Interior</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Periksa kondisi bagian dalam kendaraan</p>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-3 mb-3 pb-3 border-b-2 border-gray-200">
                  <div className="col-span-5 text-sm font-semibold text-gray-700">Item Pemeriksaan</div>
                  <div className="col-span-2 text-sm font-semibold text-gray-700">Kondisi</div>
                  <div className="col-span-5 text-sm font-semibold text-gray-700">Keterangan</div>
                </div>
                
                {/* Checklist Items */}
                <div className="space-y-3">
                  {itemsInterior.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="grid grid-cols-12 gap-3 items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
                    >
                      <div className="col-span-5 flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-purple-600">{index + 1}</span>
                        </div>
                        <span className="text-sm text-gray-700">{item.item}</span>
                      </div>
                      <div className="col-span-2">
                        <Select
                          value={item.kondisi}
                          onValueChange={(value: 'Baik' | 'Rusak') => handleInteriorChange(item.id, 'kondisi', value)}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Pilih">
                              {item.kondisi && `Kondisi: ${item.kondisi}`}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Baik">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span>Baik</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Rusak">
                              <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-600" />
                                <span>Rusak</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-5">
                        <Input
                          placeholder="Tambahkan keterangan (opsional)"
                          value={item.keterangan}
                          onChange={(e) => handleInteriorChange(item.id, 'keterangan', e.target.value)}
                          className="h-10"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* SECTION 3: Eksterior Checklist */}
            <Card className="border-2 border-orange-100 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent pb-4">
                <CardTitle className="text-lg">Pemeriksaan Eksterior</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Periksa kondisi bagian luar kendaraan</p>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-3 mb-3 pb-3 border-b-2 border-gray-200">
                  <div className="col-span-5 text-sm font-semibold text-gray-700">Item Pemeriksaan</div>
                  <div className="col-span-2 text-sm font-semibold text-gray-700">Kondisi</div>
                  <div className="col-span-5 text-sm font-semibold text-gray-700">Keterangan</div>
                </div>
                
                {/* Checklist Items */}
                <div className="space-y-3">
                  {itemsEksterior.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="grid grid-cols-12 gap-3 items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:border-orange-300 transition-colors"
                    >
                      <div className="col-span-5 flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-orange-600">{index + 1}</span>
                        </div>
                        <span className="text-sm text-gray-700">{item.item}</span>
                      </div>
                      <div className="col-span-2">
                        <Select
                          value={item.kondisi}
                          onValueChange={(value: 'Baik' | 'Rusak') => handleEksteriorChange(item.id, 'kondisi', value)}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Pilih">
                              {item.kondisi && `Kondisi: ${item.kondisi}`}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Baik">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span>Baik</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Rusak">
                              <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-600" />
                                <span>Rusak</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-5">
                        <Input
                          placeholder="Tambahkan keterangan (opsional)"
                          value={item.keterangan}
                          onChange={(e) => handleEksteriorChange(item.id, 'keterangan', e.target.value)}
                          className="h-10"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* SECTION 4: Additional Notes */}
            <Card className="border-2 border-gray-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-transparent pb-4">
                <CardTitle className="text-lg">Keterangan Tambahan</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Catatan khusus atau temuan lainnya</p>
              </CardHeader>
              <CardContent className="pt-6">
                <Textarea
                  placeholder="Tambahkan catatan tambahan hasil inspeksi, temuan khusus, atau rekomendasi..."
                  value={formData.keteranganTambahan}
                  onChange={(e) => setFormData(prev => ({ ...prev, keteranganTambahan: e.target.value }))}
                  rows={4}
                  className="resize-none"
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t-2 border-gray-200">
              <div className="text-sm text-gray-600">
                {((selectedDriver || formData.driverName) && (selectedVehicle || formData.plateNumber)) && (
                  <p>Inspeksi untuk: <span className="font-semibold">{selectedDriver?.namaLengkap || formData.driverName}</span> - <span className="font-semibold">{selectedVehicle?.nopolEksisting || formData.plateNumber}</span></p>
                )}
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDialog(false)}
                  className="px-6"
                >
                  Batal
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || (!formData.driverId && !formData.driverName) || (!formData.vehicleId && !formData.plateNumber)}
                  className="bg-blue-600 hover:bg-blue-700 px-6"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Simpan Inspeksi
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog - IMPROVED VERSION */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl">Detail Inspeksi Kendaraan</DialogTitle>
                <p className="text-sm text-gray-600 mt-1">Informasi lengkap hasil inspeksi</p>
              </div>
            </div>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-6 mt-6">
              {/* Header Info */}
              <Card className="border-2 border-blue-100 shadow-sm">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>Driver</span>
                      </div>
                      <p className="font-semibold text-slate-900">{selectedRecord.driverName}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Truck className="w-4 h-4" />
                        <span>Kendaraan</span>
                      </div>
                      <p className="font-semibold text-slate-900">{selectedRecord.vehicleType}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Truck className="w-4 h-4" />
                        <span>Plat Nomor</span>
                      </div>
                      <p className="font-semibold text-slate-900">{selectedRecord.plateNumber}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Tanggal & Waktu</span>
                      </div>
                      <p className="font-semibold text-slate-900">
                        {new Date(selectedRecord.tanggalInspeksi).toLocaleDateString('id-ID')} {selectedRecord.jamInspeksi}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Shield className="w-4 h-4" />
                        <span>Inspektur</span>
                      </div>
                      <p className="font-semibold text-slate-900">{selectedRecord.inspectedBy}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge 
                        className={`text-base px-4 py-1 ${
                          selectedRecord.status === 'Baik' 
                            ? 'bg-green-100 text-green-700'
                            : selectedRecord.status === 'Rusak'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {selectedRecord.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interior Checklist */}
              <Card className="border-2 border-purple-100 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent">
                  <CardTitle className="text-lg">Pemeriksaan Interior</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-12 gap-3 mb-3 pb-3 border-b-2 border-gray-200">
                    <div className="col-span-6 text-sm font-semibold text-gray-700">Item</div>
                    <div className="col-span-2 text-sm font-semibold text-gray-700">Kondisi</div>
                    <div className="col-span-4 text-sm font-semibold text-gray-700">Keterangan</div>
                  </div>
                  <div className="space-y-2">
                    {selectedRecord.itemsInterior.map((item, index) => (
                      <div key={item.id} className="grid grid-cols-12 gap-3 items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="col-span-6 flex items-center gap-3">
                          <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-purple-600">{index + 1}</span>
                          </div>
                          <span className="text-sm text-gray-700">{item.item}</span>
                        </div>
                        <div className="col-span-2">
                          <Badge 
                            className={
                              item.kondisi === 'Baik' 
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }
                          >
                            {item.kondisi}
                          </Badge>
                        </div>
                        <div className="col-span-4 text-sm text-gray-600">
                          {item.keterangan || '-'}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Eksterior Checklist */}
              <Card className="border-2 border-orange-100 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent">
                  <CardTitle className="text-lg">Pemeriksaan Eksterior</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-12 gap-3 mb-3 pb-3 border-b-2 border-gray-200">
                    <div className="col-span-6 text-sm font-semibold text-gray-700">Item</div>
                    <div className="col-span-2 text-sm font-semibold text-gray-700">Kondisi</div>
                    <div className="col-span-4 text-sm font-semibold text-gray-700">Keterangan</div>
                  </div>
                  <div className="space-y-2">
                    {selectedRecord.itemsEksterior.map((item, index) => (
                      <div key={item.id} className="grid grid-cols-12 gap-3 items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="col-span-6 flex items-center gap-3">
                          <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-orange-600">{index + 1}</span>
                          </div>
                          <span className="text-sm text-gray-700">{item.item}</span>
                        </div>
                        <div className="col-span-2">
                          <Badge 
                            className={
                              item.kondisi === 'Baik' 
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }
                          >
                            {item.kondisi}
                          </Badge>
                        </div>
                        <div className="col-span-4 text-sm text-gray-600">
                          {item.keterangan || '-'}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Additional Notes */}
              {selectedRecord.keteranganTambahan && (
                <Card className="border-2 border-gray-200 shadow-sm">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-transparent">
                    <CardTitle className="text-lg">Keterangan Tambahan</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-700 leading-relaxed p-4 bg-gray-50 rounded-lg border border-gray-200">
                      {selectedRecord.keteranganTambahan}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-200">
                <Button variant="outline" onClick={() => setShowDetailDialog(false)} className="px-6">
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
