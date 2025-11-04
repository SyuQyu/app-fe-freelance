import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Filter, Download, Upload, Truck, Calendar, AlertCircle, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { VehicleKRPForm, VehicleKRP } from './VehicleKRPForm';

export function VehicleMasterDataKRP() {
  const [vehicles, setVehicles] = useState<VehicleKRP[]>([
    {
      id: '1',
      kontrak: 'KTR-001-2024',
      region: 'purwokerto',
      fidBatch: 'FID-2024-001',
      wo: 'WO-2024-001',
      statusBPKB: 'ada',
      nopolEksisting: 'R 1234 AB',
      merkTypeMobil: 'Toyota Hilux 2.4',
      noRangka: 'MHKA42G3JEK123456',
      noMesin: '2KD-FTV123456',
      merk: 'Toyota',
      tahun: 2024,
      kontrakLeasing: 'LS-2024-001',
      namaLeasing: 'PT Adira Finance',
      awalKredit: '2024-01-01',
      akhirKredit: '2027-01-01',
      kontrakPolis: 'POL-2024-001',
      namaPolis: 'PT Asuransi Sinar Mas',
      masaBerlakuPolis: '2025-01-01',
      jenisKendaraanBaru: 'pickup',
      awalMasaSewa: '2024-01-01',
      akhirMasaSewa: '2027-01-01',
      lokasi: 'Purwokerto',
      alokasi: 'Operasional Area Purwokerto',
      alamatAwal: 'Jl. Jenderal Sudirman No. 123, Purwokerto',
      alokasiUpdate: 'Operasional Area Purwokerto - Updated',
      alamatUpdate: 'Jl. Jenderal Sudirman No. 123, Purwokerto',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      kontrak: 'KTR-002-2024',
      region: 'semarang',
      fidBatch: 'FID-2024-002',
      wo: 'WO-2024-002',
      statusBPKB: 'proses',
      nopolEksisting: 'H 5678 CD',
      merkTypeMobil: 'Isuzu Elf NLR 55',
      noRangka: 'MHKLR55G4JE789012',
      noMesin: '4JJ1-TC789012',
      merk: 'Isuzu',
      tahun: 2023,
      kontrakLeasing: 'LS-2024-002',
      namaLeasing: 'PT BCA Finance',
      awalKredit: '2023-06-01',
      akhirKredit: '2026-06-01',
      kontrakPolis: 'POL-2024-002',
      namaPolis: 'PT Asuransi Jasa Indonesia',
      masaBerlakuPolis: '2024-12-01',
      jenisKendaraanBaru: 'truck',
      awalMasaSewa: '2023-06-01',
      akhirMasaSewa: '2026-06-01',
      lokasi: 'Semarang',
      alokasi: 'Operasional Area Semarang',
      alamatAwal: 'Jl. Ahmad Yani No. 456, Semarang',
      alokasiUpdate: 'Operasional Area Semarang - Updated',
      alamatUpdate: 'Jl. Ahmad Yani No. 456, Semarang',
      createdAt: '2023-06-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleKRP | null>(null);
  const [viewingVehicle, setViewingVehicle] = useState<VehicleKRP | null>(null);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.nopolEksisting.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.merkTypeMobil.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.kontrak.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = filterRegion === 'All' || vehicle.region === filterRegion;
    const matchesStatus = filterStatus === 'All' || vehicle.statusBPKB === filterStatus;
    
    return matchesSearch && matchesRegion && matchesStatus;
  });

  const handleSaveVehicle = (vehicleData: VehicleKRP) => {
    if (editingVehicle) {
      setVehicles(prev => prev.map(v => v.id === editingVehicle.id ? { ...vehicleData, updatedAt: new Date().toISOString() } : v));
      setEditingVehicle(null);
    } else {
      const newVehicle = {
        ...vehicleData,
        id: (vehicles.length + 1).toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setVehicles(prev => [...prev, newVehicle]);
    }
    setIsFormOpen(false);
  };

  const handleDeleteVehicle = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data kendaraan ini?')) {
      setVehicles(prev => prev.filter(v => v.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ada: { label: 'Ada', color: 'bg-green-100 text-green-800' },
      proses: { label: 'Dalam Proses', color: 'bg-yellow-100 text-yellow-800' },
      'belum-ada': { label: 'Belum Ada', color: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['belum-ada'];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const handleExportData = () => {
    const exportData = filteredVehicles.map(vehicle => ({
      'Kontrak': vehicle.kontrak,
      'Region': vehicle.region,
      'FID BATCH': vehicle.fidBatch,
      'WO': vehicle.wo,
      'Status BPKB': vehicle.statusBPKB,
      'Nopol Eksisting': vehicle.nopolEksisting,
      'Merk/Type Mobil': vehicle.merkTypeMobil,
      'No. Rangka': vehicle.noRangka,
      'No. Mesin': vehicle.noMesin,
      'Merk': vehicle.merk,
      'Tahun': vehicle.tahun,
      'Kontrak Leasing': vehicle.kontrakLeasing,
      'Nama Leasing': vehicle.namaLeasing,
      'Lokasi': vehicle.lokasi,
      'Alokasi': vehicle.alokasi
    }));

    const headers = Object.keys(exportData[0]).join(',');
    const csvContent = [
      headers,
      ...exportData.map(row => 
        Object.values(row).map(value => 
          `"${String(value).replace(/"/g, '""')}"`
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `master-data-kendaraan-krp-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Master Data Kendaraan KRP</h1>
          <p className="text-gray-600 mt-1">
            Kelola data kendaraan KRP (Kredit Rental Pembiayaan)
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700">
            <Upload className="w-4 h-4" />
            Import Data
          </Button>
          
          <Button 
            onClick={handleExportData}
            variant="outline" 
            className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            Export Data
          </Button>
          
          <Button 
            onClick={() => {
              setEditingVehicle(null);
              setIsFormOpen(true);
            }} 
            className="flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" />
            Tambah Kendaraan
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Kendaraan</p>
              <p className="text-2xl font-bold text-gray-900">{filteredVehicles.length}</p>
            </div>
            <Truck className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">BPKB Lengkap</p>
              <p className="text-2xl font-bold text-green-600">
                {filteredVehicles.filter(v => v.statusBPKB === 'ada').length}
              </p>
            </div>
            <Settings className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Dalam Proses</p>
              <p className="text-2xl font-bold text-yellow-600">
                {filteredVehicles.filter(v => v.statusBPKB === 'proses').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Belum Ada</p>
              <p className="text-2xl font-bold text-red-600">
                {filteredVehicles.filter(v => v.statusBPKB === 'belum-ada').length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari nopol, kontrak, atau merk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterRegion} onValueChange={setFilterRegion}>
            <SelectTrigger>
              <SelectValue placeholder="Filter Regional" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Semua Regional</SelectItem>
              <SelectItem value="purwokerto">Purwokerto</SelectItem>
              <SelectItem value="semarang">Semarang</SelectItem>
              <SelectItem value="cilacap">Cilacap</SelectItem>
              <SelectItem value="banyumas">Banyumas</SelectItem>
              <SelectItem value="pemalang">Pemalang</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filter Status BPKB" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Semua Status</SelectItem>
              <SelectItem value="ada">Ada</SelectItem>
              <SelectItem value="proses">Dalam Proses</SelectItem>
              <SelectItem value="belum-ada">Belum Ada</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => {
              setSearchTerm('');
              setFilterRegion('All');
              setFilterStatus('All');
            }}
          >
            <Filter className="w-4 h-4" />
            Reset Filter
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-medium text-gray-900">Kontrak</th>
                <th className="text-left p-4 font-medium text-gray-900">Nopol</th>
                <th className="text-left p-4 font-medium text-gray-900">Merk/Type</th>
                <th className="text-left p-4 font-medium text-gray-900">Region</th>
                <th className="text-left p-4 font-medium text-gray-900">Leasing</th>
                <th className="text-left p-4 font-medium text-gray-900">Status BPKB</th>
                <th className="text-left p-4 font-medium text-gray-900">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{vehicle.kontrak}</div>
                    <div className="text-sm text-gray-600">FID: {vehicle.fidBatch}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{vehicle.nopolEksisting}</div>
                    <div className="text-sm text-gray-600">Tahun {vehicle.tahun}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-900">{vehicle.merkTypeMobil}</div>
                    <div className="text-sm text-gray-600">{vehicle.merk}</div>
                  </td>
                  <td className="p-4 text-gray-700 capitalize">{vehicle.region}</td>
                  <td className="p-4">
                    <div className="text-gray-900">{vehicle.namaLeasing}</div>
                    <div className="text-sm text-gray-600">{vehicle.kontrakLeasing}</div>
                  </td>
                  <td className="p-4">{getStatusBadge(vehicle.statusBPKB)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingVehicle(vehicle)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingVehicle(vehicle);
                          setIsFormOpen(true);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Truck className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Tidak ada data kendaraan yang ditemukan</p>
          </div>
        )}
      </div>

      {/* Add/Edit Form Dialog */}
      {isFormOpen && (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingVehicle ? 'Edit Kendaraan KRP' : 'Tambah Kendaraan KRP Baru'}
              </DialogTitle>
            </DialogHeader>
            <VehicleKRPForm
              vehicle={editingVehicle || undefined}
              onSave={handleSaveVehicle}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingVehicle(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* View Detail Dialog */}
      {viewingVehicle && (
        <Dialog open={!!viewingVehicle} onOpenChange={() => setViewingVehicle(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detail Kendaraan KRP</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Kontrak</p>
                      <p className="font-medium">{viewingVehicle.kontrak}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Region</p>
                      <p className="font-medium capitalize">{viewingVehicle.region}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">FID BATCH</p>
                      <p className="font-medium">{viewingVehicle.fidBatch}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">WO</p>
                      <p className="font-medium">{viewingVehicle.wo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Nopol Eksisting</p>
                      <p className="font-medium">{viewingVehicle.nopolEksisting}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status BPKB</p>
                      {getStatusBadge(viewingVehicle.statusBPKB)}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Merk/Type Mobil</p>
                      <p className="font-medium">{viewingVehicle.merkTypeMobil}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tahun</p>
                      <p className="font-medium">{viewingVehicle.tahun}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">No. Rangka</p>
                      <p className="font-medium">{viewingVehicle.noRangka}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">No. Mesin</p>
                      <p className="font-medium">{viewingVehicle.noMesin}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Nama Leasing</p>
                      <p className="font-medium">{viewingVehicle.namaLeasing}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Kontrak Leasing</p>
                      <p className="font-medium">{viewingVehicle.kontrakLeasing}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Periode Kredit</p>
                      <p className="font-medium">{viewingVehicle.awalKredit} s/d {viewingVehicle.akhirKredit}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Nama Polis</p>
                      <p className="font-medium">{viewingVehicle.namaPolis}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Masa Berlaku Polis</p>
                      <p className="font-medium">{viewingVehicle.masaBerlakuPolis}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Jenis Kendaraan</p>
                      <p className="font-medium capitalize">{viewingVehicle.jenisKendaraanBaru}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Periode Sewa</p>
                      <p className="font-medium">{viewingVehicle.awalMasaSewa} s/d {viewingVehicle.akhirMasaSewa}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Lokasi</p>
                      <p className="font-medium">{viewingVehicle.lokasi}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Alokasi</p>
                      <p className="font-medium">{viewingVehicle.alokasi}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Alamat Awal</p>
                      <p className="font-medium">{viewingVehicle.alamatAwal}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Alokasi Update</p>
                      <p className="font-medium">{viewingVehicle.alokasiUpdate}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Alamat Update</p>
                      <p className="font-medium">{viewingVehicle.alamatUpdate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={() => setViewingVehicle(null)}>
                  Tutup
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
