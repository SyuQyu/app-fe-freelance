'use client';

import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Filter, Download, Upload, Truck, Calendar, MapPin, User, Fuel, Settings, AlertCircle, FileText, Camera, File } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DatePicker } from './DatePicker';
import { toast } from 'sonner';
import { useDropdownSettings } from './DropdownSettingsContext';
const exampleImage = '/assets/c44388eb1ef9d8e063211f8bab324a80f4c0e22c.png';
const exampleTruckImage = '/assets/18da02685b40a6d858b6c680dda16079eb3f9574.png';

interface KIRPairingHistory {
  id: string;
  vehicleId: string;
  nopol: string;
  kirHead: string;
  kirTrailer: string;
  pairedDate: string;
  pairedBy: string;
}

interface Vehicle {
  id: string;
  // Basic Info
  nopol: string;
  noMesin: string;
  noRangka: string;
  area: string;
  lokasiItFt: string;
  jenisAngkutan: string;
  jenisSewa: string;
  sewaTarif: number;
  kapasitas: number;
  mataAnggaran: string;
  hargaInvestasi: number;
  hargaSewa: number;
  utilisasiProyek: string;
  statusPerijinan: string;
  
  // Vehicle Specs
  merkHead: string;
  merkTangki: string;
  typeHead: string;
  typeTanki: string;
  bahanTangki: string;
  warna: string;
  tahunPembuatan: number;
  pic: string;
  
  // Insurance
  perusahaanAsuransi: string;
  asuransiMulai: string;
  asuransiSampai: string;
  agingAsuransi: number;
  asuransiPatlogPn: string;
  sisaUmurAsuransi: string;
  fotoAsuransi?: string;
  
  // STNK
  stnk: string;
  stnkMulai: string;
  stnkSampai: string;
  sisaUmurStnk: string;
  fotoStnk?: string;
  
  // KIR Head
  kirHead: string;
  kirHeadMulai: string;
  kirHeadSampai: string;
  sisaUmurKirHead: string;
  fotoKirHead?: string;
  
  // KIR Trailer
  kirTrailer: string;
  kirTrailerMulai: string;
  kirTrailerSampai: string;
  sisaUmurKirTrailer: string;
  fotoKirTrailer?: string;
  
  // Documents & Others
  fotoMt4SisiPdf: string;
  mdr: string;
  fotoMdr?: string;
  fat: string;
  fotoFat?: string;
  teraSertifikatPsvPv: string;
  fotoTera?: string;
  keterangan: string;
  perizinanMigas: string;
  gps: string;
  
  createdAt: string;
  updatedAt: string;
}

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSave: (vehicle: Vehicle) => void;
  onCancel: () => void;
}

function VehicleForm({ vehicle, onSave, onCancel }: VehicleFormProps) {
  const { getOptions } = useDropdownSettings();
  
  const [formData, setFormData] = useState<Vehicle>(
    vehicle || {
      id: '',
      nopol: '',
      noMesin: '',
      noRangka: '',
      area: '',
      lokasiItFt: '',
      jenisAngkutan: '',
      jenisSewa: '',
      sewaTarif: 0,
      kapasitas: 0,
      mataAnggaran: '',
      hargaInvestasi: 0,
      hargaSewa: 0,
      utilisasiProyek: '',
      statusPerijinan: '',
      merkHead: '',
      merkTangki: '',
      typeHead: '',
      typeTanki: '',
      bahanTangki: '',
      warna: '',
      tahunPembuatan: new Date().getFullYear(),
      pic: '',
      perusahaanAsuransi: '',
      asuransiMulai: '',
      asuransiSampai: '',
      agingAsuransi: 0,
      asuransiPatlogPn: '',
      sisaUmurAsuransi: '',
      fotoAsuransi: undefined,
      stnk: '',
      stnkMulai: '',
      stnkSampai: '',
      sisaUmurStnk: '',
      fotoStnk: undefined,
      kirHead: '',
      kirHeadMulai: '',
      kirHeadSampai: '',
      sisaUmurKirHead: '',
      fotoKirHead: undefined,
      kirTrailer: '',
      kirTrailerMulai: '',
      kirTrailerSampai: '',
      sisaUmurKirTrailer: '',
      fotoKirTrailer: undefined,
      fotoMt4SisiPdf: '',
      mdr: '',
      fotoMdr: undefined,
      fat: '',
      fotoFat: undefined,
      teraSertifikatPsvPv: '',
      fotoTera: undefined,
      keterangan: '',
      perizinanMigas: '',
      gps: '',
      createdAt: '',
      updatedAt: ''
    }
  );

  const [activeTab, setActiveTab] = useState('basic');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      updatedAt: new Date().toISOString(),
      createdAt: formData.createdAt || new Date().toISOString()
    });
  };

  const calculateSisaUmur = (endDate: string): string => {
    if (!endDate) return '';
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return `${diffDays} hari lagi`;
    } else if (diffDays === 0) {
      return 'Berakhir hari ini';
    } else {
      return `-${Math.abs(diffDays)} hari (terlewat)`;
    }
  };

  const updateFormData = (field: keyof Vehicle, value: any) => {
    const newData = { ...formData, [field]: value };
    
    // Auto-calculate sisa umur when dates change
    if (field === 'asuransiSampai') {
      newData.sisaUmurAsuransi = calculateSisaUmur(newData.asuransiSampai);
    }
    if (field === 'stnkSampai') {
      newData.sisaUmurStnk = calculateSisaUmur(newData.stnkSampai);
    }
    if (field === 'kirHeadSampai') {
      newData.sisaUmurKirHead = calculateSisaUmur(newData.kirHeadSampai);
    }
    if (field === 'kirTrailerSampai') {
      newData.sisaUmurKirTrailer = calculateSisaUmur(newData.kirTrailerSampai);
    }
    
    // Remove spaces from nopol
    if (field === 'nopol') {
      newData.nopol = value.replace(/\s+/g, '');
    }
    
    setFormData(newData);
  };

  const handlePhotoUpload = (field: keyof Vehicle, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          updateFormData(field, reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Data Dasar</TabsTrigger>
          <TabsTrigger value="specs">Spesifikasi</TabsTrigger>
          <TabsTrigger value="documents">Dokumen</TabsTrigger>
          <TabsTrigger value="permits">Perizinan</TabsTrigger>
          <TabsTrigger value="others">Lainnya</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="nopol">Nomor Polisi (Tanpa Spasi) *</Label>
              <Input
                id="nopol"
                value={formData.nopol}
                onChange={(e) => updateFormData('nopol', e.target.value)}
                placeholder="B1234XYZ"
                required
              />
            </div>
            <div>
              <Label htmlFor="noMesin">No. Mesin *</Label>
              <Input
                id="noMesin"
                value={formData.noMesin}
                onChange={(e) => updateFormData('noMesin', e.target.value)}
                placeholder="Nomor mesin"
                required
              />
            </div>
            <div>
              <Label htmlFor="noRangka">No. Rangka *</Label>
              <Input
                id="noRangka"
                value={formData.noRangka}
                onChange={(e) => updateFormData('noRangka', e.target.value)}
                placeholder="Nomor rangka"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="area">Regional</Label>
              <Select value={formData.area} onValueChange={(value) => updateFormData('area', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Regional" />
                </SelectTrigger>
                <SelectContent>
                  {getOptions('regional').map((option) => (
                    <SelectItem key={option.id} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="lokasiItFt">Lokasi IT/FT</Label>
              <Input
                id="lokasiItFt"
                value={formData.lokasiItFt}
                onChange={(e) => updateFormData('lokasiItFt', e.target.value)}
                placeholder="Lokasi IT/FT"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="jenisAngkutan">Jenis Angkutan</Label>
              <Select value={formData.jenisAngkutan} onValueChange={(value) => updateFormData('jenisAngkutan', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Jenis Angkutan" />
                </SelectTrigger>
                <SelectContent>
                  {getOptions('jenis-angkutan').map((option) => (
                    <SelectItem key={option.id} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="jenisSewa">Jenis Sewa</Label>
              <Select value={formData.jenisSewa} onValueChange={(value) => updateFormData('jenisSewa', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Jenis Sewa" />
                </SelectTrigger>
                <SelectContent>
                  {getOptions('jenis-sewa').map((option) => (
                    <SelectItem key={option.id} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="kapasitas">Kapasitas (Liter/Ton)</Label>
              <Input
                id="kapasitas"
                type="number"
                value={formData.kapasitas}
                onChange={(e) => updateFormData('kapasitas', parseInt(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sewaTarif">Sewa/Tarif (Rp)</Label>
              <Input
                id="sewaTarif"
                type="number"
                value={formData.sewaTarif}
                onChange={(e) => updateFormData('sewaTarif', parseInt(e.target.value))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="hargaInvestasi">Harga Investasi (Rp)</Label>
              <Input
                id="hargaInvestasi"
                type="number"
                value={formData.hargaInvestasi}
                onChange={(e) => updateFormData('hargaInvestasi', parseInt(e.target.value))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="hargaSewa">Harga Sewa (Rp)</Label>
              <Input
                id="hargaSewa"
                type="number"
                value={formData.hargaSewa}
                onChange={(e) => updateFormData('hargaSewa', parseInt(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mataAnggaran">Mata Anggaran</Label>
              <Input
                id="mataAnggaran"
                value={formData.mataAnggaran}
                onChange={(e) => updateFormData('mataAnggaran', e.target.value)}
                placeholder="Kode mata anggaran"
              />
            </div>
            <div>
              <Label htmlFor="utilisasiProyek">Utilisasi Proyek</Label>
              <Input
                id="utilisasiProyek"
                value={formData.utilisasiProyek}
                onChange={(e) => updateFormData('utilisasiProyek', e.target.value)}
                placeholder="Proyek yang digunakan"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="specs" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="merkHead">Merk Head</Label>
              <Select value={formData.merkHead} onValueChange={(value) => updateFormData('merkHead', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Merk Head" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hino">Hino</SelectItem>
                  <SelectItem value="UD Trucks">UD Trucks</SelectItem>
                  <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="merkTangki">Merk Tangki</Label>
              <Select value={formData.merkTangki} onValueChange={(value) => updateFormData('merkTangki', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Merk Tangki" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aweco">Aweco</SelectItem>
                  <SelectItem value="Geluran Adikarya">Geluran Adikarya</SelectItem>
                  <SelectItem value="Antika Raya">Antika Raya</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="typeHead">Type Head</Label>
              <Input
                id="typeHead"
                value={formData.typeHead}
                onChange={(e) => updateFormData('typeHead', e.target.value)}
                placeholder="Type head"
              />
            </div>
            <div>
              <Label htmlFor="typeTanki">Type Tanki</Label>
              <Select value={formData.typeTanki} onValueChange={(value) => updateFormData('typeTanki', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Type Tanki" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rigid">Rigid</SelectItem>
                  <SelectItem value="Trailer">Trailer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="bahanTangki">Bahan Tangki</Label>
              <Select value={formData.bahanTangki} onValueChange={(value) => updateFormData('bahanTangki', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Bahan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aluminium alloy">Aluminium Alloy</SelectItem>
                  <SelectItem value="mild steel">Mild Steel</SelectItem>
                  <SelectItem value="carbon steel">Carbon Steel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="warna">Warna</Label>
              <Select value={formData.warna} onValueChange={(value) => updateFormData('warna', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Warna" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="merah putih">Merah Putih</SelectItem>
                  <SelectItem value="biru putih">Biru Putih</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tahunPembuatan">Tahun Pembuatan</Label>
              <Input
                id="tahunPembuatan"
                type="number"
                value={formData.tahunPembuatan}
                onChange={(e) => updateFormData('tahunPembuatan', parseInt(e.target.value))}
                min="1990"
                max={new Date().getFullYear() + 1}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pic">PIC (Person in Charge)</Label>
              <Input
                id="pic"
                value={formData.pic}
                onChange={(e) => updateFormData('pic', e.target.value)}
                placeholder="Nama PIC"
              />
            </div>
            <div>
              <Label htmlFor="statusPerijinan">Status Perijinan</Label>
              <Select value={formData.statusPerijinan} onValueChange={(value) => updateFormData('statusPerijinan', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status Perijinan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lengkap">Lengkap</SelectItem>
                  <SelectItem value="proses">Dalam Proses</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="tidak-ada">Tidak Ada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          {/* Insurance Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Asuransi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="perusahaanAsuransi">Perusahaan Asuransi</Label>
                  <Input
                    id="perusahaanAsuransi"
                    value={formData.perusahaanAsuransi}
                    onChange={(e) => updateFormData('perusahaanAsuransi', e.target.value)}
                    placeholder="Nama perusahaan asuransi"
                  />
                </div>
                <div>
                  <Label htmlFor="asuransiMulai">Mulai</Label>
                  <DatePicker
                    id="asuransiMulai"
                    value={formData.asuransiMulai}
                    onChange={(value) => updateFormData('asuransiMulai', value)}
                  />
                </div>
                <div>
                  <Label htmlFor="asuransiSampai">Sampai</Label>
                  <DatePicker
                    id="asuransiSampai"
                    value={formData.asuransiSampai}
                    onChange={(value) => updateFormData('asuransiSampai', value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="asuransiPatlogPn">Asuransi Patlog/PN</Label>
                  <Select value={formData.asuransiPatlogPn} onValueChange={(value) => updateFormData('asuransiPatlogPn', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Asuransi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PT. Patra Logistik">PT. Patra Logistik</SelectItem>
                      <SelectItem value="PT. Patra Niaga">PT. Patra Niaga</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Aging</Label>
                  <div className="p-2 bg-gray-100 rounded border text-center">
                    {formData.sisaUmurAsuransi || '-'}
                  </div>
                </div>
              </div>
              
              {/* Upload Foto Asuransi */}
              <div>
                <Label htmlFor="fotoAsuransi">Upload Foto Asuransi</Label>
                <div className="mt-2">
                  {formData.fotoAsuransi ? (
                    <div className="flex items-start gap-4">
                      <div className="relative group">
                        <img 
                          src={formData.fotoAsuransi} 
                          alt="Foto Asuransi" 
                          className="w-32 h-32 object-cover rounded-lg border-2 border-blue-300"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="absolute top-1 right-1 bg-white/90 hover:bg-white h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => updateFormData('fotoAsuransi', undefined)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex-1">
                        <Input
                          id="fotoAsuransi"
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={(e) => handlePhotoUpload('fotoAsuransi', e)}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('fotoAsuransi')?.click()}
                        >
                          Ganti Foto
                        </Button>
                        <p className="text-xs text-gray-500 mt-1">Format: PNG, JPG, JPEG</p>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center bg-white">
                      <Camera className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                      <p className="text-sm text-gray-600 mb-2">Upload foto Asuransi</p>
                      <Input
                        id="fotoAsuransi"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={(e) => handlePhotoUpload('fotoAsuransi', e)}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('fotoAsuransi')?.click()}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Pilih Foto
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">Format: PNG, JPG, JPEG</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* STNK Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">STNK</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="stnk">Nomor STNK</Label>
                <Input
                  id="stnk"
                  value={formData.stnk}
                  onChange={(e) => updateFormData('stnk', e.target.value)}
                  placeholder="Nomor STNK"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="stnkMulai">Mulai</Label>
                  <DatePicker
                    id="stnkMulai"
                    value={formData.stnkMulai}
                    onChange={(value) => updateFormData('stnkMulai', value)}
                  />
                </div>
                <div>
                  <Label htmlFor="stnkSampai">Tanggal Akhir</Label>
                  <DatePicker
                    id="stnkSampai"
                    value={formData.stnkSampai}
                    onChange={(value) => updateFormData('stnkSampai', value)}
                  />
                </div>
                <div>
                  <Label>Sisa Umur</Label>
                  <div className="p-2 bg-gray-100 rounded border text-center">
                    {formData.sisaUmurStnk || '-'}
                  </div>
                </div>
              </div>
              
              {/* Upload Foto STNK */}
              <div>
                <Label htmlFor="fotoStnk">Upload Foto STNK</Label>
                <div className="mt-2">
                  {formData.fotoStnk ? (
                    <div className="flex items-start gap-4">
                      <div className="relative group">
                        <img 
                          src={formData.fotoStnk} 
                          alt="Foto STNK" 
                          className="w-32 h-32 object-cover rounded-lg border-2 border-green-300"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="absolute top-1 right-1 bg-white/90 hover:bg-white h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => updateFormData('fotoStnk', undefined)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex-1">
                        <Input
                          id="fotoStnk"
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={(e) => handlePhotoUpload('fotoStnk', e)}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('fotoStnk')?.click()}
                        >
                          Ganti Foto
                        </Button>
                        <p className="text-xs text-gray-500 mt-1">Format: PNG, JPG, JPEG</p>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-green-300 rounded-lg p-4 text-center bg-white">
                      <Camera className="w-8 h-8 mx-auto mb-2 text-green-400" />
                      <p className="text-sm text-gray-600 mb-2">Upload foto STNK</p>
                      <Input
                        id="fotoStnk"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={(e) => handlePhotoUpload('fotoStnk', e)}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('fotoStnk')?.click()}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Pilih Foto
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">Format: PNG, JPG, JPEG</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KIR Head Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">KIR Head</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="kirHead">Nomor KIR Head</Label>
                <Input
                  id="kirHead"
                  value={formData.kirHead}
                  onChange={(e) => updateFormData('kirHead', e.target.value)}
                  placeholder="Nomor KIR Head"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="kirHeadMulai">Mulai</Label>
                  <DatePicker
                    id="kirHeadMulai"
                    value={formData.kirHeadMulai}
                    onChange={(value) => updateFormData('kirHeadMulai', value)}
                  />
                </div>
                <div>
                  <Label htmlFor="kirHeadSampai">Tanggal Akhir</Label>
                  <DatePicker
                    id="kirHeadSampai"
                    value={formData.kirHeadSampai}
                    onChange={(value) => updateFormData('kirHeadSampai', value)}
                  />
                </div>
                <div>
                  <Label>Sisa Umur</Label>
                  <div className="p-2 bg-gray-100 rounded border text-center">
                    {formData.sisaUmurKirHead || '-'}
                  </div>
                </div>
              </div>
              
              {/* Upload Foto KIR Head */}
              <div>
                <Label htmlFor="fotoKirHead">Upload Foto KIR Head</Label>
                <div className="mt-2">
                  {formData.fotoKirHead ? (
                    <div className="flex items-start gap-4">
                      <div className="relative group">
                        <img 
                          src={formData.fotoKirHead} 
                          alt="Foto KIR Head" 
                          className="w-32 h-32 object-cover rounded-lg border-2 border-purple-300"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="absolute top-1 right-1 bg-white/90 hover:bg-white h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => updateFormData('fotoKirHead', undefined)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex-1">
                        <Input
                          id="fotoKirHead"
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={(e) => handlePhotoUpload('fotoKirHead', e)}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('fotoKirHead')?.click()}
                        >
                          Ganti Foto
                        </Button>
                        <p className="text-xs text-gray-500 mt-1">Format: PNG, JPG, JPEG</p>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center bg-white">
                      <Camera className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                      <p className="text-sm text-gray-600 mb-2">Upload foto KIR Head</p>
                      <Input
                        id="fotoKirHead"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={(e) => handlePhotoUpload('fotoKirHead', e)}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('fotoKirHead')?.click()}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Pilih Foto
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">Format: PNG, JPG, JPEG</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KIR Trailer Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">KIR Trailer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="kirTrailer">Nomor KIR Trailer</Label>
                <Input
                  id="kirTrailer"
                  value={formData.kirTrailer}
                  onChange={(e) => updateFormData('kirTrailer', e.target.value)}
                  placeholder="Nomor KIR Trailer"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="kirTrailerMulai">Mulai</Label>
                  <DatePicker
                    id="kirTrailerMulai"
                    value={formData.kirTrailerMulai}
                    onChange={(value) => updateFormData('kirTrailerMulai', value)}
                  />
                </div>
                <div>
                  <Label htmlFor="kirTrailerSampai">Tanggal Akhir</Label>
                  <DatePicker
                    id="kirTrailerSampai"
                    value={formData.kirTrailerSampai}
                    onChange={(value) => updateFormData('kirTrailerSampai', value)}
                  />
                </div>
                <div>
                  <Label>Sisa Umur</Label>
                  <div className="p-2 bg-gray-100 rounded border text-center">
                    {formData.sisaUmurKirTrailer || '-'}
                  </div>
                </div>
              </div>
              
              {/* Upload Foto KIR Trailer */}
              <div>
                <Label htmlFor="fotoKirTrailer">Upload Foto KIR Trailer</Label>
                <div className="mt-2">
                  {formData.fotoKirTrailer ? (
                    <div className="flex items-start gap-4">
                      <div className="relative group">
                        <img 
                          src={formData.fotoKirTrailer} 
                          alt="Foto KIR Trailer" 
                          className="w-32 h-32 object-cover rounded-lg border-2 border-indigo-300"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="absolute top-1 right-1 bg-white/90 hover:bg-white h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => updateFormData('fotoKirTrailer', undefined)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex-1">
                        <Input
                          id="fotoKirTrailer"
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={(e) => handlePhotoUpload('fotoKirTrailer', e)}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('fotoKirTrailer')?.click()}
                        >
                          Ganti Foto
                        </Button>
                        <p className="text-xs text-gray-500 mt-1">Format: PNG, JPG, JPEG</p>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-indigo-300 rounded-lg p-4 text-center bg-white">
                      <Camera className="w-8 h-8 mx-auto mb-2 text-indigo-400" />
                      <p className="text-sm text-gray-600 mb-2">Upload foto KIR Trailer</p>
                      <Input
                        id="fotoKirTrailer"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={(e) => handlePhotoUpload('fotoKirTrailer', e)}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('fotoKirTrailer')?.click()}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Pilih Foto
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">Format: PNG, JPG, JPEG</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* MDR */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">MDR</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="mdr">Nomor MDR</Label>
                <Input
                  id="mdr"
                  value={formData.mdr}
                  onChange={(e) => updateFormData('mdr', e.target.value)}
                  placeholder="Nomor MDR"
                />
              </div>
              
              {/* Upload Foto MDR */}
              <div>
                <Label htmlFor="fotoMdr">Upload Foto MDR</Label>
                <div className="mt-2">
                  {formData.fotoMdr ? (
                    <div className="flex items-start gap-4">
                      <div className="relative group">
                        <img 
                          src={formData.fotoMdr} 
                          alt="Foto MDR" 
                          className="w-32 h-32 object-cover rounded-lg border-2 border-yellow-300"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="absolute top-1 right-1 bg-white/90 hover:bg-white h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => updateFormData('fotoMdr', undefined)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex-1">
                        <Input
                          id="fotoMdr"
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={(e) => handlePhotoUpload('fotoMdr', e)}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('fotoMdr')?.click()}
                        >
                          Ganti Foto
                        </Button>
                        <p className="text-xs text-gray-500 mt-1">Format: PNG, JPG, JPEG</p>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-yellow-300 rounded-lg p-4 text-center bg-white">
                      <Camera className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                      <p className="text-sm text-gray-600 mb-2">Upload foto MDR</p>
                      <Input
                        id="fotoMdr"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={(e) => handlePhotoUpload('fotoMdr', e)}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('fotoMdr')?.click()}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Pilih Foto
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">Format: PNG, JPG, JPEG</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAT */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">FAT</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fat">Nomor FAT</Label>
                <Input
                  id="fat"
                  value={formData.fat}
                  onChange={(e) => updateFormData('fat', e.target.value)}
                  placeholder="Nomor FAT"
                />
              </div>
              
              {/* Upload Foto FAT */}
              <div>
                <Label htmlFor="fotoFat">Upload Foto FAT</Label>
                <div className="mt-2">
                  {formData.fotoFat ? (
                    <div className="flex items-start gap-4">
                      <div className="relative group">
                        <img 
                          src={formData.fotoFat} 
                          alt="Foto FAT" 
                          className="w-32 h-32 object-cover rounded-lg border-2 border-pink-300"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="absolute top-1 right-1 bg-white/90 hover:bg-white h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => updateFormData('fotoFat', undefined)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex-1">
                        <Input
                          id="fotoFat"
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={(e) => handlePhotoUpload('fotoFat', e)}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('fotoFat')?.click()}
                        >
                          Ganti Foto
                        </Button>
                        <p className="text-xs text-gray-500 mt-1">Format: PNG, JPG, JPEG</p>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-pink-300 rounded-lg p-4 text-center bg-white">
                      <Camera className="w-8 h-8 mx-auto mb-2 text-pink-400" />
                      <p className="text-sm text-gray-600 mb-2">Upload foto FAT</p>
                      <Input
                        id="fotoFat"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={(e) => handlePhotoUpload('fotoFat', e)}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('fotoFat')?.click()}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Pilih Foto
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">Format: PNG, JPG, JPEG</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* TERA */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">TERA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="teraSertifikatPsvPv">Nomor TERA</Label>
                <Input
                  id="teraSertifikatPsvPv"
                  value={formData.teraSertifikatPsvPv}
                  onChange={(e) => updateFormData('teraSertifikatPsvPv', e.target.value)}
                  placeholder="Nomor TERA"
                />
              </div>
              
              {/* Upload Foto TERA */}
              <div>
                <Label htmlFor="fotoTera">Upload Foto TERA</Label>
                <div className="mt-2">
                  {formData.fotoTera ? (
                    <div className="flex items-start gap-4">
                      <div className="relative group">
                        <img 
                          src={formData.fotoTera} 
                          alt="Foto TERA" 
                          className="w-32 h-32 object-cover rounded-lg border-2 border-orange-300"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="absolute top-1 right-1 bg-white/90 hover:bg-white h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => updateFormData('fotoTera', undefined)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex-1">
                        <Input
                          id="fotoTera"
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={(e) => handlePhotoUpload('fotoTera', e)}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('fotoTera')?.click()}
                        >
                          Ganti Foto
                        </Button>
                        <p className="text-xs text-gray-500 mt-1">Format: PNG, JPG, JPEG</p>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-orange-300 rounded-lg p-4 text-center bg-white">
                      <Camera className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                      <p className="text-sm text-gray-600 mb-2">Upload foto TERA</p>
                      <Input
                        id="fotoTera"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={(e) => handlePhotoUpload('fotoTera', e)}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('fotoTera')?.click()}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Pilih Foto
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">Format: PNG, JPG, JPEG</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permits" className="space-y-4">
          <div>
            <Label htmlFor="perizinanMigas">Perizinan Migas</Label>
            <Textarea
              id="perizinanMigas"
              value={formData.perizinanMigas}
              onChange={(e) => updateFormData('perizinanMigas', e.target.value)}
              placeholder="Detail perizinan migas..."
              rows={3}
            />
          </div>
        </TabsContent>

        <TabsContent value="others" className="space-y-4">
          <div>
            <Label htmlFor="gps">GPS</Label>
            <Input
              id="gps"
              value={formData.gps}
              onChange={(e) => updateFormData('gps', e.target.value)}
              placeholder="ID GPS atau koordinat"
            />
          </div>

          <div>
            <Label htmlFor="keterangan">Keterangan</Label>
            <Textarea
              id="keterangan"
              value={formData.keterangan}
              onChange={(e) => updateFormData('keterangan', e.target.value)}
              placeholder="Catatan tambahan tentang kendaraan..."
              rows={4}
            />
          </div>

          <div>
            <Label>Foto MT 4 Sisi (PDF)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {formData.fotoMt4SisiPdf ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="text-sm">Dokumen PDF telah diupload</span>
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Lihat
                      </Button>
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateFormData('fotoMt4SisiPdf', '')}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Hapus
                      </Button>
                    </div>
                  </div>
                  <Button type="button" variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload PDF Baru
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-3">Upload foto kendaraan 4 sisi dalam format PDF</p>
                  <Button type="button" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload PDF
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">Format: PDF (Max 10MB)</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit">
          Simpan Data
        </Button>
      </div>
    </form>
  );
}

interface VehicleMasterDataProps {
  vehicleType?: 'Biru Putih' | 'KRP';
}

export function VehicleMasterData({ vehicleType }: VehicleMasterDataProps = {}) {
  const { getOptions } = useDropdownSettings();
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: '1',
      nopol: 'B1234ABC',
      noMesin: 'ABC123456',
      noRangka: 'XYZ789012',
      area: 'MOR III',
      lokasiItFt: 'Jakarta Utara',
      jenisAngkutan: 'BBM',
      jenisSewa: 'Sewa',
      sewaTarif: 2500000,
      kapasitas: 32000,
      mataAnggaran: 'MA-001',
      hargaInvestasi: 850000000,
      hargaSewa: 2500000,
      utilisasiProyek: 'Proyek A',
      statusPerijinan: 'lengkap',
      merkHead: 'Hino',
      merkTangki: 'Aweco',
      typeHead: 'Fuso FN517',
      typeTanki: 'Rigid',
      bahanTangki: 'carbon steel',
      warna: 'merah putih',
      tahunPembuatan: 2020,
      pic: 'John Doe',
      perusahaanAsuransi: 'PT Asuransi Indonesia',
      asuransiMulai: '2024-01-01',
      asuransiSampai: '2025-01-01',
      agingAsuransi: 0,
      asuransiPatlogPn: 'APN001',
      sisaUmurAsuransi: '45 hari lagi',
      stnk: 'STNK001',
      stnkMulai: '2024-01-01',
      stnkSampai: '2025-01-01',
      sisaUmurStnk: '45 hari lagi',
      kirHead: 'KIRH001',
      kirHeadMulai: '2024-01-01',
      kirHeadSampai: '2025-01-01',
      sisaUmurKirHead: '45 hari lagi',
      kirTrailer: 'KIRT001',
      kirTrailerMulai: '2024-01-01',
      kirTrailerSampai: '2025-01-01',
      sisaUmurKirTrailer: '45 hari lagi',
      fotoMt4SisiPdf: '',
      mdr: 'MDR001',
      fat: 'FAT001',
      teraSertifikatPsvPv: 'TERA001',
      keterangan: 'Kendaraan dalam kondisi baik',
      perizinanMigas: 'Lengkap semua perizinan migas',
      gps: 'GPS001',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      nopol: 'D5678EFG',
      noMesin: 'DEF456789',
      noRangka: 'UVW123456',
      area: 'MOR V',
      lokasiItFt: 'Surabaya Timur',
      jenisAngkutan: 'LPG',
      jenisSewa: 'Tarif',
      sewaTarif: 2800000,
      kapasitas: 40000,
      mataAnggaran: 'MA-002',
      hargaInvestasi: 950000000,
      hargaSewa: 2800000,
      utilisasiProyek: 'Proyek B',
      statusPerijinan: 'proses',
      merkHead: 'UD Trucks',
      merkTangki: 'Geluran Adikarya',
      typeHead: 'Ranger FM 285',
      typeTanki: 'Trailer',
      bahanTangki: 'aluminium alloy',
      warna: 'biru putih',
      tahunPembuatan: 2021,
      pic: 'Jane Smith',
      perusahaanAsuransi: 'PT Asuransi Indonesia',
      asuransiMulai: '2024-03-01',
      asuransiSampai: '2025-03-01',
      agingAsuransi: 0,
      asuransiPatlogPn: 'APN002',
      sisaUmurAsuransi: '105 hari lagi',
      stnk: 'STNK002',
      stnkMulai: '2024-02-01',
      stnkSampai: '2025-02-01',
      sisaUmurStnk: '76 hari lagi',
      kirHead: 'KIRH002',
      kirHeadMulai: '2024-04-01',
      kirHeadSampai: '2025-04-01',
      sisaUmurKirHead: '135 hari lagi',
      kirTrailer: 'KIRT002',
      kirTrailerMulai: '2024-04-01',
      kirTrailerSampai: '2025-04-01',
      sisaUmurKirTrailer: '135 hari lagi',
      fotoMt4SisiPdf: '',
      mdr: 'MDR002',
      fat: 'FAT002',
      teraSertifikatPsvPv: 'TERA002',
      keterangan: 'Kendaraan sedang dalam pemeliharaan',
      perizinanMigas: 'Sedang proses perpanjangan',
      gps: 'GPS002',
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-02-01T00:00:00Z'
    },
    {
      id: '3',
      nopol: 'BK9012HIJ',
      noMesin: 'GHI789012',
      noRangka: 'RST456789',
      area: 'MOR VI',
      lokasiItFt: 'Balikpapan Selatan',
      jenisAngkutan: 'BBK',
      jenisSewa: 'Sewa',
      sewaTarif: 2200000,
      kapasitas: 25000,
      mataAnggaran: 'MA-003',
      hargaInvestasi: 720000000,
      hargaSewa: 2200000,
      utilisasiProyek: 'Proyek C',
      statusPerijinan: 'lengkap',
      merkHead: 'Mercedes-Benz',
      merkTangki: 'Antika Raya',
      typeHead: 'Giga FRR',
      typeTanki: 'Rigid',
      bahanTangki: 'mild steel',
      warna: 'merah putih',
      tahunPembuatan: 2019,
      pic: 'Ahmad Subaedi',
      perusahaanAsuransi: 'PT Asuransi Indonesia',
      asuransiMulai: '2024-01-15',
      asuransiSampai: '2025-01-15',
      agingAsuransi: 0,
      asuransiPatlogPn: 'APN003',
      sisaUmurAsuransi: '59 hari lagi',
      stnk: 'STNK003',
      stnkMulai: '2024-01-10',
      stnkSampai: '2025-01-10',
      sisaUmurStnk: '54 hari lagi',
      kirHead: 'KIRH003',
      kirHeadMulai: '2024-01-20',
      kirHeadSampai: '2025-01-20',
      sisaUmurKirHead: '64 hari lagi',
      kirTrailer: 'KIRT003',
      kirTrailerMulai: '2024-01-20',
      kirTrailerSampai: '2025-01-20',
      sisaUmurKirTrailer: '64 hari lagi',
      fotoMt4SisiPdf: '',
      mdr: 'MDR003',
      fat: 'FAT003',
      teraSertifikatPsvPv: 'TERA003',
      keterangan: 'Kendaraan siap operasi',
      perizinanMigas: 'Lengkap dan valid',
      gps: 'GPS003',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [viewingVehicle, setViewingVehicle] = useState<Vehicle | null>(null);
  const [kirPairingHistory, setKirPairingHistory] = useState<KIRPairingHistory[]>([
    {
      id: '1',
      vehicleId: '1',
      nopol: 'B1234ABC',
      kirHead: 'KIRH001',
      kirTrailer: 'KIRT001',
      pairedDate: '2024-01-01T10:30:00Z',
      pairedBy: 'Admin System'
    },
    {
      id: '2',
      vehicleId: '1',
      nopol: 'B1234ABC',
      kirHead: 'KIRH001-OLD',
      kirTrailer: 'KIRT001-OLD',
      pairedDate: '2023-06-15T14:20:00Z',
      pairedBy: 'John Doe'
    },
    {
      id: '3',
      vehicleId: '2',
      nopol: 'D5678EFG',
      kirHead: 'KIRH002',
      kirTrailer: 'KIRT002',
      pairedDate: '2024-04-01T09:15:00Z',
      pairedBy: 'Admin System'
    }
  ]);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.nopol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.merkHead.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.pic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = filterArea === 'All' || vehicle.area === filterArea;
    const matchesStatus = filterStatus === 'All' || vehicle.statusPerijinan === filterStatus;
    
    return matchesSearch && matchesArea && matchesStatus;
  });

  const handleSaveVehicle = (vehicleData: Vehicle) => {
    const now = new Date().toISOString();
    
    if (editingVehicle) {
      // Cek apakah KIR Head atau KIR Trailer berubah
      const kirChanged = 
        editingVehicle.kirHead !== vehicleData.kirHead || 
        editingVehicle.kirTrailer !== vehicleData.kirTrailer;
      
      if (kirChanged && vehicleData.kirHead && vehicleData.kirTrailer) {
        // Tambahkan ke history pairing
        const newPairing: KIRPairingHistory = {
          id: (kirPairingHistory.length + 1).toString(),
          vehicleId: vehicleData.id,
          nopol: vehicleData.nopol,
          kirHead: vehicleData.kirHead,
          kirTrailer: vehicleData.kirTrailer,
          pairedDate: now,
          pairedBy: 'Current User' // Bisa diganti dengan user yang sedang login
        };
        setKirPairingHistory(prev => [...prev, newPairing]);
        
        toast.success('Data Berhasil Disimpan', {
          description: `History pairing KIR Head (${vehicleData.kirHead}) dengan KIR Trailer (${vehicleData.kirTrailer}) telah tercatat`
        });
      } else {
        toast.success('Data Berhasil Disimpan', {
          description: 'Data kendaraan berhasil diperbarui'
        });
      }
      
      setVehicles(prev => prev.map(v => v.id === editingVehicle.id ? vehicleData : v));
      setEditingVehicle(null);
    } else {
      const newVehicle = {
        ...vehicleData,
        id: (vehicles.length + 1).toString(),
        createdAt: now,
        updatedAt: now
      };
      
      // Jika kendaraan baru dan sudah ada KIR Head & Trailer, tambahkan ke history
      if (newVehicle.kirHead && newVehicle.kirTrailer) {
        const newPairing: KIRPairingHistory = {
          id: (kirPairingHistory.length + 1).toString(),
          vehicleId: newVehicle.id,
          nopol: newVehicle.nopol,
          kirHead: newVehicle.kirHead,
          kirTrailer: newVehicle.kirTrailer,
          pairedDate: now,
          pairedBy: 'Current User'
        };
        setKirPairingHistory(prev => [...prev, newPairing]);
        
        toast.success('Data Berhasil Disimpan', {
          description: `Kendaraan baru ditambahkan dengan KIR Head (${newVehicle.kirHead}) dan KIR Trailer (${newVehicle.kirTrailer})`
        });
      } else {
        toast.success('Data Berhasil Disimpan', {
          description: 'Kendaraan baru berhasil ditambahkan'
        });
      }
      
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
      lengkap: { label: 'Lengkap', color: 'bg-green-100 text-green-800' },
      proses: { label: 'Dalam Proses', color: 'bg-yellow-100 text-yellow-800' },
      expired: { label: 'Expired', color: 'bg-red-100 text-red-800' },
      'tidak-ada': { label: 'Tidak Ada', color: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['tidak-ada'];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleExportData = () => {
    // Prepare export data with specified columns
    const exportData = filteredVehicles.map(vehicle => ({
      'No. Polisi': vehicle.nopol,
      'No. Mesin': vehicle.noMesin,
      'No. Rangka': vehicle.noRangka,
      'Region': vehicle.area || '-',
      'Lokasi IT/FT': vehicle.lokasiItFt || '-'
    }));

    // Convert to CSV format
    const headers = Object.keys(exportData[0]).join(',');
    const csvContent = [
      headers,
      ...exportData.map(row => 
        Object.values(row).map(value => 
          `"${String(value).replace(/"/g, '""')}"`
        ).join(',')
      )
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `master-data-kendaraan-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter vehicles by type if specified
  const displayedVehicles = vehicleType 
    ? filteredVehicles.filter(v => {
        if (vehicleType === 'Biru Putih') {
          return v.warna.toLowerCase().includes('putih') || v.warna.toLowerCase().includes('biru');
        } else if (vehicleType === 'KRP') {
          return !v.warna.toLowerCase().includes('putih') && !v.warna.toLowerCase().includes('biru');
        }
        return true;
      })
    : filteredVehicles;

  const pageTitle = vehicleType 
    ? `Master Data Kendaraan ${vehicleType}` 
    : 'Master Data Kendaraan';
  
  const pageDescription = vehicleType
    ? `Kelola data kendaraan ${vehicleType}`
    : 'Kelola data lengkap kendaraan migas dan industrial';

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
          <p className="text-gray-600 mt-1">
            {pageDescription}
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Kendaraan</p>
              <p className="text-2xl font-bold text-gray-900">{displayedVehicles.length}</p>
            </div>
            <Truck className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Perijinan Lengkap</p>
              <p className="text-2xl font-bold text-green-600">
                {displayedVehicles.filter(v => v.statusPerijinan === 'lengkap').length}
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
                {displayedVehicles.filter(v => v.statusPerijinan === 'proses').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Dokumen Kritis</p>
              <p className="text-2xl font-bold text-red-600">
                {displayedVehicles.filter(v => v.statusPerijinan === 'expired').length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {vehicleType !== 'Biru Putih' && (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unit Tanker</p>
                <p className="text-2xl font-bold text-purple-600">
                  {displayedVehicles.filter(v => v.jenisAngkutan === 'tanker').length}
                </p>
              </div>
              <Fuel className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari nomor polisi, merk, atau PIC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterArea} onValueChange={setFilterArea}>
            <SelectTrigger>
              <SelectValue placeholder="Filter Regional" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Semua Regional</SelectItem>
              {getOptions('regional').map((option) => (
                <SelectItem key={option.id} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Semua Status</SelectItem>
              <SelectItem value="lengkap">Lengkap</SelectItem>
              <SelectItem value="proses">Dalam Proses</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="tidak-ada">Tidak Ada</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="flex items-center gap-2">
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
                <th className="text-left p-4 font-medium text-gray-900">Kendaraan</th>
                <th className="text-left p-4 font-medium text-gray-900">Spesifikasi</th>
                <th className="text-left p-4 font-medium text-gray-900">Regional</th>
                <th className="text-left p-4 font-medium text-gray-900">Lokasi IT/FT</th>
                <th className="text-left p-4 font-medium text-gray-900">PIC</th>
                <th className="text-left p-4 font-medium text-gray-900">Status Perijinan</th>
                <th className="text-left p-4 font-medium text-gray-900">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{vehicle.nopol}</div>
                    <div className="text-sm text-gray-600">{vehicle.jenisAngkutan} - {vehicle.kapasitas}L</div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-900">{vehicle.merkHead}</div>
                    <div className="text-sm text-gray-600">{vehicle.typeHead}</div>
                  </td>
                  <td className="p-4 text-gray-700 capitalize">{vehicle.area}</td>
                  <td className="p-4 text-gray-700">{vehicle.lokasiItFt}</td>
                  <td className="p-4 text-gray-700">{vehicle.pic}</td>
                  <td className="p-4">{getStatusBadge(vehicle.statusPerijinan)}</td>
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
      </div>

      {/* Add/Edit Form Dialog */}
      {isFormOpen && (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingVehicle ? 'Edit Kendaraan' : 'Tambah Kendaraan Baru'}
              </DialogTitle>
            </DialogHeader>
            <VehicleForm
              vehicle={editingVehicle || undefined}
              onSave={handleSaveVehicle}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* View Details Dialog */}
      {viewingVehicle && (
        <Dialog open={viewingVehicle !== null} onOpenChange={() => setViewingVehicle(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detail Kendaraan</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              {/* Vehicle Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src={exampleImage} 
                    alt="Vehicle Icon" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Vehicle Information Grid */}
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Merk Head</Label>
                    <div className="p-2 bg-gray-100 rounded border text-sm">
                      {viewingVehicle.merkHead || 'Mitsubishi'}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Type Head</Label>
                    <div className="p-2 bg-gray-100 rounded border text-sm">
                      {viewingVehicle.typeHead || 'Fuso'}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Bahan Tangki</Label>
                    <div className="p-2 bg-gray-100 rounded border text-sm">
                      {viewingVehicle.bahanTangki === 'stainless-steel' ? 'Stainless Steel' : 
                       viewingVehicle.bahanTangki === 'carbon-steel' ? 'Carbon Steel' :
                       viewingVehicle.bahanTangki || 'Stainless Steel'}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">PIC (Person in Charge)</Label>
                    <div className="p-2 bg-gray-100 rounded border text-sm">
                      {viewingVehicle.pic || 'Ahmad Subaedi'}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Nomor Polisi *</Label>
                    <div className="p-2 bg-gray-100 rounded border text-sm">
                      {viewingVehicle.nopol}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Regional</Label>
                    <div className="p-2 bg-gray-100 rounded border text-sm capitalize">
                      {viewingVehicle.area === 'jakarta' ? 'Jakarta' :
                       viewingVehicle.area === 'surabaya' ? 'Surabaya' :
                       viewingVehicle.area === 'medan' ? 'Medan' :
                       viewingVehicle.area === 'balikpapan' ? 'Balikpapan' :
                       viewingVehicle.area === 'palembang' ? 'Palembang' :
                       viewingVehicle.area || 'Jakarta'}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Jenis Angkutan</Label>
                    <div className="p-2 bg-gray-100 rounded border text-sm capitalize">
                      {viewingVehicle.jenisAngkutan || 'Tanker'}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Merk Tangki</Label>
                    <div className="p-2 bg-gray-100 rounded border text-sm">
                      {viewingVehicle.merkTangki || 'Tangki'}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Type Tangki</Label>
                    <div className="p-2 bg-gray-100 rounded border text-sm">
                      {viewingVehicle.typeTanki || 'Tank 32KL'}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Warna</Label>
                    <div className="p-2 bg-gray-100 rounded border text-sm">
                      {viewingVehicle.warna || 'Putih'}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Status Perijinan</Label>
                    <div className="p-2">
                      {getStatusBadge(viewingVehicle.statusPerijinan)}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">No. Mesin *</Label>
                    <div className="p-2 bg-gray-100 rounded border text-sm">
                      {viewingVehicle.noMesin}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Lokasi IT/FT</Label>
                    <div className="p-2 bg-gray-100 rounded border text-sm">
                      {viewingVehicle.lokasiItFt || 'Jakarta Timur'}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Kapasitas (Liter/Ton)</Label>
                    <div className="p-2 bg-gray-100 rounded border text-sm">
                      {viewingVehicle.kapasitas ? `${viewingVehicle.kapasitas.toLocaleString('id-ID')}` : '32.000'}
                    </div>
                  </div>
                </div>
              </div>

              {/* KIR Pairing History */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">History Pairing KIR Head & Trailer</h4>
                  <p className="text-xs text-gray-600">Riwayat pemasangan KIR Head dengan KIR Trailer pada kendaraan ini</p>
                </div>
                
                {kirPairingHistory.filter(h => h.vehicleId === viewingVehicle.id).length > 0 ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left p-3 font-medium text-gray-700">No. KIR Head</th>
                          <th className="text-left p-3 font-medium text-gray-700">No. KIR Trailer</th>
                          <th className="text-left p-3 font-medium text-gray-700">Tanggal Pairing</th>
                          <th className="text-left p-3 font-medium text-gray-700">Dipasang Oleh</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {kirPairingHistory
                          .filter(h => h.vehicleId === viewingVehicle.id)
                          .sort((a, b) => new Date(b.pairedDate).getTime() - new Date(a.pairedDate).getTime())
                          .map((history) => (
                            <tr key={history.id} className="hover:bg-gray-50">
                              <td className="p-3 text-gray-900 font-medium">{history.kirHead}</td>
                              <td className="p-3 text-gray-900 font-medium">{history.kirTrailer}</td>
                              <td className="p-3 text-gray-600">
                                {new Date(history.pairedDate).toLocaleDateString('id-ID', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </td>
                              <td className="p-3 text-gray-600">{history.pairedBy}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Belum ada history pairing KIR untuk kendaraan ini</p>
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">No. Rangka *</Label>
                    <div className="p-2 bg-gray-100 rounded border text-sm">
                      {viewingVehicle.noRangka}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Tahun Pembuatan</Label>
                    <div className="p-2 bg-gray-100 rounded border text-sm">
                      {viewingVehicle.tahunPembuatan || '2020'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
