'use client';

import { useState } from 'react';
import { Upload, FileText, Download, Eye, Trash2, Plus, Search, Filter, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ExcelExportSPP } from './ExcelExportSPP';

interface SPPDocument {
  id: string;
  nomorSPP: string;
  tanggalSPP: string;
  namaProject: string;
  kendaraan: string;
  driver: string;
  jumlahPemesanan: number;
  jenisProduk: string;
  pemesan: string;
  tujuan: string;
  noShipment: string;
  jamKeluar: string;
  stockTerimaBBM: number;
  noSegel: string;
  status: 'Draft' | 'Pending' | 'Approved' | 'Rejected';
  fileName: string;
  uploadDate: string;
  uploadedBy: string;
  approvedBy?: string;
  notes?: string;
}

const sppData: SPPDocument[] = [
  {
    id: '1',
    nomorSPP: 'SPP/2024/001',
    tanggalSPP: '2024-10-01',
    namaProject: 'Transportasi BBM Kilang Dumai',
    kendaraan: 'B 1234 ABC',
    driver: 'Ahmad Rizki',
    jumlahPemesanan: 25000,
    jenisProduk: 'Solar',
    pemesan: 'PT Pertamina',
    tujuan: 'SPBU Dumai Utara',
    noShipment: 'SHP/2024/001',
    jamKeluar: '08:30',
    stockTerimaBBM: 24950,
    noSegel: 'SGL001234',
    status: 'Approved',
    fileName: 'SPP_001_Dumai.pdf',
    uploadDate: '2024-10-01 09:30',
    uploadedBy: 'Joni Talang',
    approvedBy: 'Manager Fleet',
    notes: 'Dokumen lengkap dan sesuai'
  },
  {
    id: '2',
    nomorSPP: 'SPP/2024/002',
    tanggalSPP: '2024-10-02',
    namaProject: 'Distribusi Solar Jakarta-Bogor',
    kendaraan: 'B 5678 DEF',
    driver: 'Budi Santoso',
    jumlahPemesanan: 18000,
    jenisProduk: 'Pertalite',
    pemesan: 'PT Shell Indonesia',
    tujuan: 'SPBU Bogor Raya',
    noShipment: 'SHP/2024/002',
    jamKeluar: '14:15',
    stockTerimaBBM: 17980,
    noSegel: 'SGL005678',
    status: 'Pending',
    fileName: 'SPP_002_Jakarta.pdf',
    uploadDate: '2024-10-02 14:15',
    uploadedBy: 'Joni Talang'
  },
  {
    id: '3',
    nomorSPP: 'SPP/2024/003',
    tanggalSPP: '2024-10-03',
    namaProject: 'Angkutan Crude Oil Balikpapan',
    kendaraan: 'B 9101 GHI',
    driver: 'Charlie Wijaya',
    jumlahPemesanan: 35000,
    jenisProduk: 'Crude Oil',
    pemesan: 'PT Chevron Pacific',
    tujuan: 'Kilang Balikpapan',
    noShipment: 'SHP/2024/003',
    jamKeluar: '06:45',
    stockTerimaBBM: 34850,
    noSegel: 'SGL009101',
    status: 'Draft',
    fileName: 'SPP_003_Balikpapan.pdf',
    uploadDate: '2024-10-03 08:45',
    uploadedBy: 'Joni Talang'
  }
];

export function DocumentSPP() {
  const [documents, setDocuments] = useState<SPPDocument[]>(sppData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchTerm 
      ? doc.noShipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.nomorSPP.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.namaProject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.kendaraan.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    const matchesStatus = filterStatus === 'all' ? true : doc.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatQuantity = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount) + ' Liter';
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari no shipment, nomor SPP, project, atau kendaraan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-3">
          <ExcelExportSPP data={filteredDocuments} />
          
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Upload SPP Baru
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Dokumen SPP</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nomorSPP">Nomor SPP</Label>
                  <Input id="nomorSPP" placeholder="SPP/2024/004" />
                </div>
                <div>
                  <Label htmlFor="tanggalSPP">Tanggal SPP</Label>
                  <Input id="tanggalSPP" type="date" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="namaProject">Nama Project</Label>
                <Input id="namaProject" placeholder="Nama project..." />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="kendaraan">Kendaraan</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kendaraan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="B 1234 ABC">B 1234 ABC</SelectItem>
                      <SelectItem value="B 5678 DEF">B 5678 DEF</SelectItem>
                      <SelectItem value="B 9101 GHI">B 9101 GHI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="driver">Driver</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih driver" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ahmad Rizki">Ahmad Rizki</SelectItem>
                      <SelectItem value="Budi Santoso">Budi Santoso</SelectItem>
                      <SelectItem value="Charlie Wijaya">Charlie Wijaya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jumlahPemesanan">Jumlah Pemesanan (Liter)</Label>
                  <Input id="jumlahPemesanan" type="number" placeholder="25000" />
                </div>
                <div>
                  <Label htmlFor="jenisProduk">Jenis Produk</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis produk" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Solar">Solar</SelectItem>
                      <SelectItem value="Pertalite">Pertalite</SelectItem>
                      <SelectItem value="Pertamax">Pertamax</SelectItem>
                      <SelectItem value="Crude Oil">Crude Oil</SelectItem>
                      <SelectItem value="Avtur">Avtur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pemesan">Pemesan</Label>
                  <Input id="pemesan" placeholder="PT Pertamina" />
                </div>
                <div>
                  <Label htmlFor="tujuan">Tujuan</Label>
                  <Input id="tujuan" placeholder="SPBU Jakarta Pusat" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="noShipment">No Shipment</Label>
                  <Input id="noShipment" placeholder="SHP/2024/004" />
                </div>
                <div>
                  <Label htmlFor="noSegel">No Segel</Label>
                  <Input id="noSegel" placeholder="SGL001234" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jamKeluar">Jam Keluar</Label>
                  <Input id="jamKeluar" type="time" placeholder="08:30" />
                </div>
                <div>
                  <Label htmlFor="stockTerimaBBM">Volume Supply BBM (Liter)</Label>
                  <Input id="stockTerimaBBM" type="number" placeholder="24950" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="file">Upload File Foto</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Drag & drop file PNG/JPG atau klik untuk browse</p>
                  <Input type="file" accept=".png,.jpg,.jpeg,image/png,image/jpeg" className="hidden" id="file" />
                  <Label htmlFor="file" className="cursor-pointer">
                    <Button variant="outline" type="button">
                      Pilih File
                    </Button>
                  </Label>
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Catatan</Label>
                <Textarea id="notes" placeholder="Catatan tambahan..." />
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                  Batal
                </Button>
                <Button onClick={() => setIsUploadOpen(false)}>
                  Upload SPP
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Dokumen SPP</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-3 font-semibold text-gray-700">No Shipment</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Nomor SPP</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Tanggal</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Project</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Kendaraan</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Jenis Produk</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Pemesan</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Jumlah Pemesanan</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Status</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 font-medium text-blue-600">{doc.noShipment}</td>
                    <td className="p-3 font-medium text-gray-600">{doc.nomorSPP}</td>
                    <td className="p-3">{doc.tanggalSPP}</td>
                    <td className="p-3">
                      <div className="max-w-xs truncate" title={doc.namaProject}>
                        {doc.namaProject}
                      </div>
                    </td>
                    <td className="p-3 font-medium">{doc.kendaraan}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium">
                        {doc.jenisProduk}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="max-w-xs truncate" title={doc.pemesan}>
                        {doc.pemesan}
                      </div>
                    </td>
                    <td className="p-3 font-medium">{formatQuantity(doc.jumlahPemesanan)}</td>
                    <td className="p-3">
                      <Badge className={getStatusColor(doc.status)}>
                        {doc.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" title="Lihat Detail">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" title="Download">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" title="Hapus">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredDocuments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p>Tidak ada dokumen SPP yang ditemukan</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Pemesanan</p>
              <p className="text-xl font-bold text-blue-600">
                {formatQuantity(documents.reduce((sum, doc) => sum + doc.jumlahPemesanan, 0))}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Volume Supply</p>
              <p className="text-xl font-bold text-green-600">
                {formatQuantity(documents.reduce((sum, doc) => sum + doc.stockTerimaBBM, 0))}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Rata-rata Penerimaan</p>
              <p className="text-xl font-bold text-purple-600">
                {(((documents.reduce((sum, doc) => sum + doc.stockTerimaBBM, 0) / 
                    documents.reduce((sum, doc) => sum + doc.jumlahPemesanan, 0)) * 100).toFixed(1))}%
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Shipment</p>
              <p className="text-xl font-bold text-indigo-600">
                {documents.length} Unit
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Approval Rate</p>
              <p className="text-xl font-bold text-orange-600">
                {((documents.filter(doc => doc.status === 'Approved').length / documents.length) * 100).toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Detail Pengiriman Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents.slice(0, 3).map((doc) => (
                <div key={doc.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">{doc.noShipment}</p>
                      <p className="text-sm text-gray-500">{doc.nomorSPP}</p>
                    </div>
                    <Badge className={getStatusColor(doc.status)}>
                      {doc.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Tujuan:</span>
                        <span className="font-medium">{doc.tujuan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Jam Keluar:</span>
                        <span className="font-medium">{doc.jamKeluar}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Volume Supply:</span>
                        <span className="font-medium">{formatQuantity(doc.stockTerimaBBM)}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Segel:</span>
                        <span className="font-medium">{doc.noSegel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Produk:</span>
                        <span className="font-medium">{doc.jenisProduk}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Driver:</span>
                        <span className="font-medium">{doc.driver}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(
                documents.reduce((acc, doc) => {
                  acc[doc.jenisProduk] = (acc[doc.jenisProduk] || 0) + doc.jumlahPemesanan;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([produk, jumlah]) => (
                <div key={produk} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">{produk}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-blue-600 block">{formatQuantity(jumlah)}</span>
                    <span className="text-xs text-gray-500">
                      {formatQuantity(documents.filter(doc => doc.jenisProduk === produk)
                        .reduce((sum, doc) => sum + doc.stockTerimaBBM, 0))} diterima
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Efficiency Analysis */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Analisis Efisiensi Operasional</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Efisiensi Penerimaan</h4>
              <div className="space-y-3">
                {documents.map((doc) => {
                  const efficiency = ((doc.stockTerimaBBM / doc.jumlahPemesanan) * 100);
                  const lossPercentage = 100 - efficiency;
                  
                  return (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">{doc.noShipment}</span>
                        <p className="text-sm text-gray-600">{doc.jenisProduk}</p>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold ${efficiency >= 99 ? 'text-green-600' : efficiency >= 98 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {efficiency.toFixed(2)}%
                        </span>
                        <p className="text-xs text-gray-500">Loss: {lossPercentage.toFixed(2)}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Volume Pengiriman per Kendaraan</h4>
              <div className="space-y-3">
                {documents.map((doc) => {
                  const percentage = ((doc.jumlahPemesanan / documents.reduce((sum, d) => sum + d.jumlahPemesanan, 0)) * 100);
                  
                  return (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">{doc.kendaraan}</span>
                        <p className="text-sm text-gray-600">{doc.noShipment}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-blue-600">
                          {formatQuantity(doc.jumlahPemesanan)}
                        </span>
                        <p className="text-xs text-gray-500">{percentage.toFixed(1)}% dari total</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}