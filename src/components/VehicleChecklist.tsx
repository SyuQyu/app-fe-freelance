import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { VehicleChecklistForm } from './VehicleChecklistForm';
import { ExcelExportChecklist } from './ExcelExportChecklist';
import { Search, Plus, Filter, Eye, Edit, Trash2, Calendar, FileText, ClipboardCheck } from 'lucide-react';
import exampleImage from 'figma:asset/aca0b85c34367e255db38332274fec06fc930dcc.png';

interface VehicleCheckRecord {
  id: string;
  brand: string;
  nomorKendaraan: string;
  waktuPengecekan: string;
  checkBy: string;
  status: 'Baik' | 'Rusak' | 'Maintenance';
  statusSelesai: 'Belum Dimulai' | 'Berlangsung' | 'Selesai';
  approvedBy: string;
  keterangan: string;
}

export function VehicleChecklist() {
  const [checkRecords, setCheckRecords] = useState<VehicleCheckRecord[]>([
    {
      id: '1',
      brand: 'PT. Pos Logistik',
      nomorKendaraan: 'B 9765 TEZ',
      waktuPengecekan: '23 September 2023',
      checkBy: 'Suginta Santoso',
      status: 'Baik',
      statusSelesai: 'Selesai',
      approvedBy: 'Kalla Santoso',
      keterangan: ''
    },
    {
      id: '2',
      brand: 'PT. Pos Logistik',
      nomorKendaraan: 'B 8234 TEZ',
      waktuPengecekan: '23 September 2023',
      checkBy: 'Ahmad',
      status: 'Baik',
      statusSelesai: 'Selesai',
      approvedBy: 'Kalla Santoso',
      keterangan: ''
    },
    {
      id: '3',
      brand: 'PT. Pos Logistik',
      nomorKendaraan: 'B 8234 TEI',
      waktuPengecekan: '23 September 2023',
      checkBy: 'Suryanto',
      status: 'Baik',
      statusSelesai: 'Selesai',
      approvedBy: 'Jajak',
      keterangan: ''
    },
    {
      id: '4',
      brand: 'PT. Pos Logistik',
      nomorKendaraan: 'B 8334 TEI',
      waktuPengecekan: '22 September 2023',
      checkBy: 'Santal',
      status: 'Baik',
      statusSelesai: 'Selesai',
      approvedBy: 'Muhammad',
      keterangan: ''
    },
    {
      id: '5',
      brand: 'PT. Pos Logistik',
      nomorKendaraan: 'B 8987 TEZ',
      waktuPengecekan: '23 September 2023',
      checkBy: 'Khofifah',
      status: 'Baik',
      statusSelesai: 'Selesai',
      approvedBy: 'Muhammad',
      keterangan: ''
    },
    {
      id: '6',
      brand: 'PT. Pos Logistik',
      nomorKendaraan: 'B 8987 TEZ',
      waktuPengecekan: '23 September 2023',
      checkBy: 'Muhammad',
      status: 'Baik',
      statusSelesai: 'Selesai',
      approvedBy: 'Muhammad',
      keterangan: ''
    },
    {
      id: '7',
      brand: 'PT. Pos Logistik',
      nomorKendaraan: 'B 8765 TEZ',
      waktuPengecekan: '23 September 2023',
      checkBy: 'Adie Hastira Gunawan',
      status: 'Baik',
      statusSelesai: 'Selesai',
      approvedBy: 'Muhammad',
      keterangan: ''
    },
    {
      id: '8',
      brand: 'PT. Pos Logistik',
      nomorKendaraan: 'B 8765 TEZ',
      waktuPengecekan: '23 September 2023',
      checkBy: 'Mahfud',
      status: 'Baik',
      statusSelesai: 'Selesai',
      approvedBy: 'Muhammad',
      keterangan: ''
    },
    {
      id: '9',
      brand: 'PT. Pos Logistik',
      nomorKendaraan: 'B 8765 TEZ',
      waktuPengecekan: '23 September 2023',
      checkBy: 'Mahfud',
      status: 'Baik',
      statusSelesai: 'Selesai',
      approvedBy: 'Muhammad',
      keterangan: ''
    },
    {
      id: '10',
      brand: 'PT. Pos Logistik',
      nomorKendaraan: 'B 8456 TEZ',
      waktuPengecekan: '23 September 2023',
      checkBy: 'M Nizar Murdasa',
      status: 'Baik',
      statusSelesai: 'Selesai',
      approvedBy: 'Muhammad',
      keterangan: 'Dinas Rugas Malarea'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const filteredRecords = checkRecords.filter(record => {
    const matchesSearch = record.nomorKendaraan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.checkBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.approvedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = filterBrand === 'All' || record.brand === filterBrand;
    const matchesStatus = filterStatus === 'All' || record.status === filterStatus;
    
    return matchesSearch && matchesBrand && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + recordsPerPage);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Baik: { label: 'Baik Good', color: 'bg-green-100 text-green-800' },
      Rusak: { label: 'Rusak', color: 'bg-red-100 text-red-800' },
      Maintenance: { label: 'Maintenance', color: 'bg-yellow-100 text-yellow-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Baik'];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getStatusSelesaiBadge = (status: string) => {
    const statusConfig = {
      'Belum Dimulai': { label: 'Belum Dimulai', color: 'bg-gray-100 text-gray-800' },
      'Berlangsung': { label: 'Berlangsung', color: 'bg-blue-100 text-blue-800' },
      'Selesai': { label: 'Selesai', color: 'bg-green-100 text-green-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Belum Dimulai'];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const handleFormSave = (formData: any) => {
    const newRecord: VehicleCheckRecord = {
      id: (checkRecords.length + 1).toString(),
      brand: 'PT. Pos Logistik',
      nomorKendaraan: formData.nomorPolisi,
      waktuPengecekan: new Date().toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
      checkBy: formData.namaPengemudi,
      status: 'Baik',
      statusSelesai: 'Selesai',
      approvedBy: 'Admin',
      keterangan: formData.keteranganTambahan || ''
    };
    
    setCheckRecords(prev => [newRecord, ...prev]);
  };

  const handleDeleteRecord = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data checklist ini?')) {
      setCheckRecords(prev => prev.filter(record => record.id !== id));
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Checklist Harian MT</h1>
          <p className="text-gray-600 mt-1">
            Monitoring dan tracking checklist harian kendaraan
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => {
              setFilterBrand('All');
              setFilterStatus('All');
              setSearchTerm('');
            }}
          >
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          
          <ExcelExportChecklist data={filteredRecords} />
          
          <Button 
            onClick={() => setIsFormOpen(true)} 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari nomor kendaraan, checker, approver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterBrand} onValueChange={setFilterBrand}>
            <SelectTrigger>
              <SelectValue placeholder="Filter Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Semua Brand</SelectItem>
              <SelectItem value="PT. Pos Logistik">PT. Pos Logistik</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Semua Status</SelectItem>
              <SelectItem value="Baik">Baik</SelectItem>
              <SelectItem value="Rusak">Rusak</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Menampilkan {startIndex + 1} - {Math.min(startIndex + recordsPerPage, filteredRecords.length)} dari {filteredRecords.length} data
            </span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Checklist</p>
              <p className="text-2xl font-bold text-gray-900">{checkRecords.length}</p>
            </div>
            <ClipboardCheck className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Status Baik</p>
              <p className="text-2xl font-bold text-green-600">
                {checkRecords.filter(r => r.status === 'Baik').length}
              </p>
            </div>
            <ClipboardCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Perlu Maintenance</p>
              <p className="text-2xl font-bold text-yellow-600">
                {checkRecords.filter(r => r.status === 'Maintenance' || r.status === 'Rusak').length}
              </p>
            </div>
            <ClipboardCheck className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hari Ini</p>
              <p className="text-2xl font-bold text-blue-600">
                {checkRecords.filter(r => r.waktuPengecekan.includes('23 September 2023')).length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-medium text-gray-900">Brand</th>
                <th className="text-left p-4 font-medium text-gray-900">No Kendaraan</th>
                <th className="text-left p-4 font-medium text-gray-900">Waktu Pengecekan</th>
                <th className="text-left p-4 font-medium text-gray-900">Check By</th>
                <th className="text-left p-4 font-medium text-gray-900">Status</th>
                <th className="text-left p-4 font-medium text-gray-900">Status Selesai</th>
                <th className="text-left p-4 font-medium text-gray-900">Approved By</th>
                <th className="text-left p-4 font-medium text-gray-900">Keterangan</th>
                <th className="text-left p-4 font-medium text-gray-900">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="p-4 text-gray-900">{record.brand}</td>
                  <td className="p-4 text-gray-900">{record.nomorKendaraan}</td>
                  <td className="p-4 text-gray-700">{record.waktuPengecekan}</td>
                  <td className="p-4 text-gray-700">{record.checkBy}</td>
                  <td className="p-4">{getStatusBadge(record.status)}</td>
                  <td className="p-4">{getStatusSelesaiBadge(record.statusSelesai)}</td>
                  <td className="p-4 text-gray-700">{record.approvedBy}</td>
                  <td className="p-4 text-gray-700">{record.keterangan || '-'}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRecord(record.id)}
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

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Menampilkan {startIndex + 1} - {Math.min(startIndex + recordsPerPage, filteredRecords.length)} dari {filteredRecords.length} entri
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Form Dialog */}
      <VehicleChecklistForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleFormSave}
      />
    </div>
  );
}