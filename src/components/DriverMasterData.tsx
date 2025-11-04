'use client';

import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Filter, Download, Upload, User, IdCard, AlertCircle } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
const exampleImage = '/assets/51a0776848d18d18d035bb3b264650029fb3c807.png';

interface Driver {
  id: string;
  employeeId: string;
  namaLengkap: string;
  foto?: string; // Photo of the employee
  nik: string;
  noTelepon: string;
  email: string;
  alamat: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  agama: string;
  statusPernikahan: 'Belum Menikah' | 'Menikah' | 'Cerai';
  pendidikanTerakhir: string;
  posisi: string;
  departemen: string;
  statusKaryawan: 'Tetap' | 'Kontrak' | 'Harian';
  tanggalMasuk: string;
  noSim: string;
  jenisSim: string;
  tanggalExpiredSim: string;
  hasilMCU: 'Lulus' | 'Tidak Lulus' | 'Belum' | 'Dalam Proses';
  tanggalMCU: string;
  tanggalExpiredMCU: string;
  fotoMCU?: string; // Photo upload for MCU
  hasilDDT: 'Lulus' | 'Tidak Lulus' | 'Belum' | 'Dalam Proses';
  tanggalDDT: string;
  tanggalExpiredDDT: string;
  fotoB3?: string; // Photo upload for Sertifikat B3
  statusAktif: 'Aktif' | 'Tidak Aktif';
  kontakDarurat: string;
  hubunganKontakDarurat: string;
  noTeleponDarurat: string;
  createdAt: string;
  updatedAt: string;
}

interface DriverFormProps {
  driver?: Driver;
  onSave: (driver: Driver) => void;
  onCancel: () => void;
  employeeType?: 'AMT' | 'Driver';
}

function DriverForm({ driver, onSave, onCancel, employeeType }: DriverFormProps) {
  const [formData, setFormData] = useState<Driver>(
    driver || {
      id: '',
      employeeId: '',
      namaLengkap: '',
      foto: undefined,
      nik: '',
      noTelepon: '',
      email: '',
      alamat: '',
      tempatLahir: '',
      tanggalLahir: '',
      jenisKelamin: 'Laki-laki',
      agama: '',
      statusPernikahan: 'Belum Menikah',
      pendidikanTerakhir: '',
      posisi: '',
      departemen: '',
      statusKaryawan: 'Tetap',
      tanggalMasuk: '',
      noSim: '',
      jenisSim: '',
      tanggalExpiredSim: '',
      hasilMCU: 'Belum',
      tanggalMCU: '',
      tanggalExpiredMCU: '',
      fotoMCU: undefined,
      hasilDDT: 'Belum',
      tanggalDDT: '',
      tanggalExpiredDDT: '',
      fotoB3: undefined,
      statusAktif: 'Aktif',
      kontakDarurat: '',
      hubunganKontakDarurat: '',
      noTeleponDarurat: '',
      createdAt: '',
      updatedAt: ''
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      updatedAt: new Date().toISOString(),
      createdAt: formData.createdAt || new Date().toISOString()
    });
  };

  const updateFormData = (field: keyof Driver, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          updateFormData('foto', reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleMCUPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          updateFormData('fotoMCU', reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleB3PhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          updateFormData('fotoB3', reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Data Pribadi</h3>
        
        {/* Photo Upload Section - First */}
        <div>
          <Label htmlFor="foto">Foto Personel</Label>
          <div className="mt-2 flex items-start gap-4">
            {formData.foto ? (
              <div className="flex gap-4">
                <div className="relative group">
                  <img 
                    src={formData.foto} 
                    alt="Foto Personel" 
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="absolute top-1 right-1 bg-white/90 hover:bg-white h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => updateFormData('foto', undefined)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex-1">
                  <Input
                    id="foto"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('foto')?.click()}
                  >
                    Ganti Foto
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">Format: PNG, JPG, JPEG</p>
                </div>
              </div>
            ) : (
              <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <User className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-2">Upload foto personel</p>
                <Input
                  id="foto"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('foto')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Pilih Foto
                </Button>
                <p className="text-xs text-gray-500 mt-1">Format: PNG, JPG, JPEG</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="employeeId">ID Personel *</Label>
            <Input
              id="employeeId"
              value={formData.employeeId}
              onChange={(e) => updateFormData('employeeId', e.target.value)}
              placeholder="DRV001"
              required
            />
          </div>
          <div>
            <Label htmlFor="namaLengkap">Nama Lengkap *</Label>
            <Input
              id="namaLengkap"
              value={formData.namaLengkap}
              onChange={(e) => updateFormData('namaLengkap', e.target.value)}
              placeholder="Nama lengkap personel"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nik">NIK *</Label>
            <Input
              id="nik"
              value={formData.nik}
              onChange={(e) => updateFormData('nik', e.target.value)}
              placeholder="3174012345678901"
              maxLength={16}
              required
            />
          </div>
          <div>
            <Label htmlFor="jenisKelamin">Jenis Kelamin</Label>
            <Select value={formData.jenisKelamin} onValueChange={(value) => updateFormData('jenisKelamin', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis kelamin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                <SelectItem value="Perempuan">Perempuan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tempatLahir">Tempat Lahir</Label>
            <Input
              id="tempatLahir"
              value={formData.tempatLahir}
              onChange={(e) => updateFormData('tempatLahir', e.target.value)}
              placeholder="Jakarta"
            />
          </div>
          <div>
            <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
            <Input
              id="tanggalLahir"
              type="date"
              value={formData.tanggalLahir}
              onChange={(e) => updateFormData('tanggalLahir', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="agama">Agama</Label>
            <Select value={formData.agama} onValueChange={(value) => updateFormData('agama', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih agama" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Islam">Islam</SelectItem>
                <SelectItem value="Kristen">Kristen</SelectItem>
                <SelectItem value="Katolik">Katolik</SelectItem>
                <SelectItem value="Hindu">Hindu</SelectItem>
                <SelectItem value="Buddha">Buddha</SelectItem>
                <SelectItem value="Khonghucu">Khonghucu</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="statusPernikahan">Status Pernikahan</Label>
            <Select value={formData.statusPernikahan} onValueChange={(value) => updateFormData('statusPernikahan', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Status pernikahan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Belum Menikah">Belum Menikah</SelectItem>
                <SelectItem value="Menikah">Menikah</SelectItem>
                <SelectItem value="Cerai">Cerai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="alamat">Alamat Lengkap</Label>
          <Input
            id="alamat"
            value={formData.alamat}
            onChange={(e) => updateFormData('alamat', e.target.value)}
            placeholder="Alamat lengkap tempat tinggal"
          />
        </div>

        <div>
          <Label htmlFor="pendidikanTerakhir">Pendidikan Terakhir</Label>
          <Select value={formData.pendidikanTerakhir} onValueChange={(value) => updateFormData('pendidikanTerakhir', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih pendidikan terakhir" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SMA/SMK">SMA/SMK</SelectItem>
              <SelectItem value="D3">D3</SelectItem>
              <SelectItem value="S1">S1</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Informasi Kontak</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="noTelepon">No. Telepon *</Label>
            <Input
              id="noTelepon"
              value={formData.noTelepon}
              onChange={(e) => updateFormData('noTelepon', e.target.value)}
              placeholder="08123456789"
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              placeholder="nama@company.com"
            />
          </div>
        </div>
      </div>

      {/* Employment Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Informasi Pekerjaan</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="posisi">Posisi *</Label>
            {employeeType === 'AMT' ? (
              <Select value={formData.posisi} onValueChange={(value) => updateFormData('posisi', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih posisi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AMT 1">AMT 1</SelectItem>
                  <SelectItem value="AMT 2">AMT 2</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="posisi"
                value={formData.posisi}
                onChange={(e) => updateFormData('posisi', e.target.value)}
                placeholder="Supir"
                required
              />
            )}
          </div>
          <div>
            <Label htmlFor="departemen">Departemen</Label>
            <Select value={formData.departemen} onValueChange={(value) => updateFormData('departemen', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih departemen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Logistics">Logistics</SelectItem>
                <SelectItem value="Safety">Safety</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="statusKaryawan">Status Personel</Label>
            <Select value={formData.statusKaryawan} onValueChange={(value) => updateFormData('statusKaryawan', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Status personel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tetap">Tetap</SelectItem>
                <SelectItem value="Kontrak">Kontrak</SelectItem>
                <SelectItem value="Harian">Harian</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="tanggalMasuk">Tanggal Masuk</Label>
            <Input
              id="tanggalMasuk"
              type="date"
              value={formData.tanggalMasuk}
              onChange={(e) => updateFormData('tanggalMasuk', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="statusAktif">Status Aktif</Label>
          <Select value={formData.statusAktif} onValueChange={(value) => updateFormData('statusAktif', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Status aktif" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Aktif">Aktif</SelectItem>
              <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* License Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Informasi SIM</h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="noSim">No. SIM</Label>
            <Input
              id="noSim"
              value={formData.noSim}
              onChange={(e) => updateFormData('noSim', e.target.value)}
              placeholder="SIM1234567890"
            />
          </div>
          <div>
            <Label htmlFor="jenisSim">Jenis SIM</Label>
            <Select value={formData.jenisSim} onValueChange={(value) => updateFormData('jenisSim', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Jenis SIM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SIM A">SIM A</SelectItem>
                <SelectItem value="SIM B1">SIM B1</SelectItem>
                <SelectItem value="SIM B2">SIM B2</SelectItem>
                <SelectItem value="SIM C">SIM C</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="tanggalExpiredSim">Tanggal Expired SIM</Label>
            <Input
              id="tanggalExpiredSim"
              type="date"
              value={formData.tanggalExpiredSim}
              onChange={(e) => updateFormData('tanggalExpiredSim', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Health & Safety Check Results */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          Hasil Pemeriksaan Kesehatan & Kelayakan
        </h3>
        
        {/* MCU - Medical Check Up */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            MCU (Medical Check Up)
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="hasilMCU">Hasil MCU</Label>
              <Select value={formData.hasilMCU} onValueChange={(value) => updateFormData('hasilMCU', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih hasil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lulus">Lulus</SelectItem>
                  <SelectItem value="Tidak Lulus">Tidak Lulus</SelectItem>
                  <SelectItem value="Belum">Belum</SelectItem>
                  <SelectItem value="Dalam Proses">Dalam Proses</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tanggalMCU">Tanggal MCU</Label>
              <Input
                id="tanggalMCU"
                type="date"
                value={formData.tanggalMCU}
                onChange={(e) => updateFormData('tanggalMCU', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="tanggalExpiredMCU">Tanggal Expired MCU</Label>
              <Input
                id="tanggalExpiredMCU"
                type="date"
                value={formData.tanggalExpiredMCU}
                onChange={(e) => updateFormData('tanggalExpiredMCU', e.target.value)}
              />
            </div>
          </div>
          
          {/* Upload Foto MCU */}
          <div className="mt-4">
            <Label htmlFor="fotoMCU">Upload Foto MCU</Label>
            <div className="mt-2">
              {formData.fotoMCU ? (
                <div className="flex items-start gap-4">
                  <div className="relative group">
                    <img 
                      src={formData.fotoMCU} 
                      alt="Foto MCU" 
                      className="w-32 h-32 object-cover rounded-lg border-2 border-blue-300"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="absolute top-1 right-1 bg-white/90 hover:bg-white h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => updateFormData('fotoMCU', undefined)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <Input
                      id="fotoMCU"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleMCUPhotoUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('fotoMCU')?.click()}
                    >
                      Ganti Foto
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">Format: PNG, JPG, JPEG</p>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center bg-white">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                  <p className="text-sm text-gray-600 mb-2">Upload foto hasil MCU</p>
                  <Input
                    id="fotoMCU"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleMCUPhotoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('fotoMCU')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Pilih Foto
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">Format: PNG, JPG, JPEG</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sertifikat B3 / DDT */}
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
            {employeeType === 'Driver' ? 'Defensive Driving Training (DDT)' : 'Sertifikat B3'}
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="hasilDDT">Hasil {employeeType === 'Driver' ? 'DDT' : 'Sertifikat B3'}</Label>
              <Select value={formData.hasilDDT} onValueChange={(value) => updateFormData('hasilDDT', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih hasil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lulus">Lulus</SelectItem>
                  <SelectItem value="Tidak Lulus">Tidak Lulus</SelectItem>
                  <SelectItem value="Belum">Belum</SelectItem>
                  <SelectItem value="Dalam Proses">Dalam Proses</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tanggalDDT">Tanggal {employeeType === 'Driver' ? 'DDT' : 'Sertifikat B3'}</Label>
              <Input
                id="tanggalDDT"
                type="date"
                value={formData.tanggalDDT}
                onChange={(e) => updateFormData('tanggalDDT', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="tanggalExpiredDDT">Tanggal Expired {employeeType === 'Driver' ? 'DDT' : 'Sertifikat B3'}</Label>
              <Input
                id="tanggalExpiredDDT"
                type="date"
                value={formData.tanggalExpiredDDT}
                onChange={(e) => updateFormData('tanggalExpiredDDT', e.target.value)}
              />
            </div>
          </div>
          
          {/* Upload Foto */}
          <div className="mt-4">
            <Label htmlFor="fotoB3">Upload Foto {employeeType === 'Driver' ? 'DDT' : 'Sertifikat B3'}</Label>
            <div className="mt-2">
              {formData.fotoB3 ? (
                <div className="flex items-start gap-4">
                  <div className="relative group">
                    <img 
                      src={formData.fotoB3} 
                      alt={`Foto ${employeeType === 'Driver' ? 'DDT' : 'Sertifikat B3'}`} 
                      className="w-32 h-32 object-cover rounded-lg border-2 border-orange-300"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="absolute top-1 right-1 bg-white/90 hover:bg-white h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => updateFormData('fotoB3', undefined)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <Input
                      id="fotoB3"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleB3PhotoUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('fotoB3')?.click()}
                    >
                      Ganti Foto
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">Format: PNG, JPG, JPEG</p>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-orange-300 rounded-lg p-4 text-center bg-white">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                  <p className="text-sm text-gray-600 mb-2">Upload foto {employeeType === 'Driver' ? 'DDT' : 'Sertifikat B3'}</p>
                  <Input
                    id="fotoB3"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleB3PhotoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('fotoB3')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Pilih Foto
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">Format: PNG, JPG, JPEG</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Kontak Darurat</h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="kontakDarurat">Nama Kontak Darurat</Label>
            <Input
              id="kontakDarurat"
              value={formData.kontakDarurat}
              onChange={(e) => updateFormData('kontakDarurat', e.target.value)}
              placeholder="Nama keluarga/kerabat"
            />
          </div>
          <div>
            <Label htmlFor="hubunganKontakDarurat">Hubungan</Label>
            <Select value={formData.hubunganKontakDarurat} onValueChange={(value) => updateFormData('hubunganKontakDarurat', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Hubungan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Orangtua">Orangtua</SelectItem>
                <SelectItem value="Suami/Istri">Suami/Istri</SelectItem>
                <SelectItem value="Anak">Anak</SelectItem>
                <SelectItem value="Saudara">Saudara</SelectItem>
                <SelectItem value="Kerabat">Kerabat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="noTeleponDarurat">No. Telepon Darurat</Label>
            <Input
              id="noTeleponDarurat"
              value={formData.noTeleponDarurat}
              onChange={(e) => updateFormData('noTeleponDarurat', e.target.value)}
              placeholder="08123456789"
            />
          </div>
        </div>
      </div>

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

interface DriverMasterDataProps {
  employeeType?: 'AMT' | 'Driver';
}

export function DriverMasterData({ employeeType }: DriverMasterDataProps = {}) {
  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: '1',
      employeeId: 'DRV001',
      namaLengkap: 'Budi Santoso',
      nik: '3174012345678901',
      noTelepon: '08123456789',
      email: 'budi.santoso@company.com',
      alamat: 'Jl. Sudirman No. 123, Jakarta Pusat',
      tempatLahir: 'Jakarta',
      tanggalLahir: '1985-05-15',
      jenisKelamin: 'Laki-laki',
      agama: 'Islam',
      statusPernikahan: 'Menikah',
      pendidikanTerakhir: 'SMA/SMK',
      posisi: 'Supir',
      departemen: 'Operations',
      statusKaryawan: 'Tetap',
      tanggalMasuk: '2020-01-15',
      noSim: 'SIM1234567890',
      jenisSim: 'SIM B1',
      tanggalExpiredSim: '2025-05-15',
      hasilMCU: 'Lulus',
      tanggalMCU: '2024-01-10',
      tanggalExpiredMCU: '2025-01-10',
      hasilDDT: 'Lulus',
      tanggalDDT: '2024-01-05',
      tanggalExpiredDDT: '2024-07-05',
      statusAktif: 'Aktif',
      kontakDarurat: 'Siti Santoso',
      hubunganKontakDarurat: 'Suami/Istri',
      noTeleponDarurat: '08987654321',
      createdAt: '2020-01-15T08:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      employeeId: 'DRV002',
      namaLengkap: 'Agus Prasetyo',
      nik: '3174023456789012',
      noTelepon: '08234567890',
      email: 'agus.prasetyo@company.com',
      alamat: 'Jl. Gatot Subroto No. 456, Jakarta Selatan',
      tempatLahir: 'Surabaya',
      tanggalLahir: '1982-08-20',
      jenisKelamin: 'Laki-laki',
      agama: 'Kristen',
      statusPernikahan: 'Menikah',
      pendidikanTerakhir: 'SMA/SMK',
      posisi: 'Supir',
      departemen: 'Operations',
      statusKaryawan: 'Tetap',
      tanggalMasuk: '2019-03-10',
      noSim: 'SIM2345678901',
      jenisSim: 'SIM B2',
      tanggalExpiredSim: '2025-08-20',
      hasilMCU: 'Lulus',
      tanggalMCU: '2023-12-05',
      tanggalExpiredMCU: '2024-12-05',
      hasilDDT: 'Lulus',
      tanggalDDT: '2024-01-20',
      tanggalExpiredDDT: '2024-07-20',
      statusAktif: 'Aktif',
      kontakDarurat: 'Rina Prasetyo',
      hubunganKontakDarurat: 'Suami/Istri',
      noTeleponDarurat: '08876543210',
      createdAt: '2019-03-10T08:00:00Z',
      updatedAt: '2024-02-10T09:15:00Z'
    },
    {
      id: '3',
      employeeId: 'DRV003',
      namaLengkap: 'Joko Widodo',
      nik: '3174034567890123',
      noTelepon: '08345678901',
      email: 'joko.widodo@company.com',
      alamat: 'Jl. Thamrin No. 789, Jakarta Pusat',
      tempatLahir: 'Bandung',
      tanggalLahir: '1988-12-10',
      jenisKelamin: 'Laki-laki',
      agama: 'Islam',
      statusPernikahan: 'Belum Menikah',
      pendidikanTerakhir: 'SMA/SMK',
      posisi: 'Driver',
      departemen: 'Operations',
      statusKaryawan: 'Kontrak',
      tanggalMasuk: '2021-06-01',
      noSim: 'SIM3456789012',
      jenisSim: 'SIM B1',
      tanggalExpiredSim: '2025-12-10',
      hasilMCU: 'Belum',
      tanggalMCU: '',
      tanggalExpiredMCU: '',
      hasilDDT: 'Belum',
      tanggalDDT: '',
      tanggalExpiredDDT: '',
      statusAktif: 'Aktif',
      kontakDarurat: 'Bambang Widodo',
      hubunganKontakDarurat: 'Orang Tua',
      noTeleponDarurat: '08765432109',
      createdAt: '2021-06-01T08:00:00Z',
      updatedAt: '2024-03-01T11:20:00Z'
    },
    {
      id: '4',
      employeeId: 'DRV004',
      namaLengkap: 'Rudi Hartono',
      nik: '3174045678901234',
      noTelepon: '08456789012',
      email: 'rudi.hartono@company.com',
      alamat: 'Jl. Sudirman No. 321, Jakarta Selatan',
      tempatLahir: 'Medan',
      tanggalLahir: '1990-03-25',
      jenisKelamin: 'Laki-laki',
      agama: 'Kristen',
      statusPernikahan: 'Menikah',
      pendidikanTerakhir: 'SMA/SMK',
      posisi: 'Driver',
      departemen: 'Logistics',
      statusKaryawan: 'Tetap',
      tanggalMasuk: '2020-09-15',
      noSim: 'SIM4567890123',
      jenisSim: 'SIM B2',
      tanggalExpiredSim: '2025-03-25',
      hasilMCU: 'Tidak Lulus',
      tanggalMCU: '2023-11-20',
      tanggalExpiredMCU: '2024-11-20',
      hasilDDT: 'Tidak Lulus',
      tanggalDDT: '2024-01-10',
      tanggalExpiredDDT: '',
      statusAktif: 'Aktif',
      kontakDarurat: 'Sari Hartono',
      hubunganKontakDarurat: 'Suami/Istri',
      noTeleponDarurat: '08654321098',
      createdAt: '2020-09-15T08:00:00Z',
      updatedAt: '2024-03-15T13:45:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDepartemen, setFilterDepartemen] = useState('All');
  const [isAddingDriver, setIsAddingDriver] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [viewingDriver, setViewingDriver] = useState<Driver | null>(null);

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.noTelepon.includes(searchTerm);
    const matchesStatus = filterStatus === 'All' || driver.statusAktif === filterStatus;
    const matchesDepartemen = filterDepartemen === 'All' || driver.departemen === filterDepartemen;
    
    return matchesSearch && matchesStatus && matchesDepartemen;
  });

  // Filter by employee type if specified
  const displayedDrivers = employeeType 
    ? filteredDrivers.filter(d => {
        if (employeeType === 'AMT') {
          return d.posisi.toLowerCase().includes('amt');
        } else if (employeeType === 'Driver') {
          return d.posisi.toLowerCase().includes('driver') || d.posisi.toLowerCase().includes('supir');
        }
        return true;
      })
    : filteredDrivers;

  const pageTitle = employeeType 
    ? `Master Data ${employeeType}` 
    : 'Master Data Personel';
  
  const pageDescription = employeeType
    ? `Kelola data personel ${employeeType.toLowerCase()}`
    : 'Kelola data personel supir dan operator kendaraan';

  const handleSaveDriver = (driverData: Driver) => {
    if (editingDriver) {
      setDrivers(prev => prev.map(d => d.id === editingDriver.id ? driverData : d));
      setEditingDriver(null);
    } else {
      const newDriver = {
        ...driverData,
        id: (drivers.length + 1).toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setDrivers(prev => [...prev, newDriver]);
      setIsAddingDriver(false);
    }
  };

  const handleDeleteDriver = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data personel ini?')) {
      setDrivers(prev => prev.filter(d => d.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Aktif: { label: 'Aktif', color: 'bg-green-100 text-green-800' },
      'Tidak Aktif': { label: 'Tidak Aktif', color: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Tidak Aktif'];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

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
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          
          <Button onClick={() => setIsAddingDriver(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Tambah Personel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari nama, ID, atau telepon..."
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
              <SelectItem value="All">Semua Status</SelectItem>
              <SelectItem value="Aktif">Aktif</SelectItem>
              <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterDepartemen} onValueChange={setFilterDepartemen}>
            <SelectTrigger>
              <SelectValue placeholder="Filter Departemen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Semua Departemen</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
              <SelectItem value="Logistics">Logistics</SelectItem>
              <SelectItem value="Safety">Safety</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Reset Filter
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Personel</p>
              <p className="text-2xl font-bold text-gray-900">{displayedDrivers.length}</p>
            </div>
            <User className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aktif</p>
              <p className="text-2xl font-bold text-green-600">
                {displayedDrivers.filter(d => d.statusAktif === 'Aktif').length}
              </p>
            </div>
            <User className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">SIM Expired</p>
              <p className="text-2xl font-bold text-red-600">2</p>
            </div>
            <IdCard className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Legend for Health Check Results */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          Keterangan Status Pemeriksaan
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-900">M = MCU</span>
            <p className="text-gray-600">(Medical Check Up)</p>
          </div>
          <div>
            <span className="font-medium text-gray-900">{employeeType === 'Driver' ? 'DDT' : 'B3'} = {employeeType === 'Driver' ? 'DDT' : 'Sertifikat B3'}</span>
            <p className="text-gray-600">{employeeType === 'Driver' ? '(Defensive Driving Training)' : '(Bahan Berbahaya Beracun)'}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-blue-300">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-100 rounded"></div>
            <span className="text-gray-700">Lulus</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-100 rounded"></div>
            <span className="text-gray-700">Tidak Lulus</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-100 rounded"></div>
            <span className="text-gray-700">Dalam Proses</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-100 rounded"></div>
            <span className="text-gray-700">Belum</span>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-medium text-gray-900">ID / Nama</th>
                <th className="text-left p-4 font-medium text-gray-900">Kontak</th>
                <th className="text-left p-4 font-medium text-gray-900">Posisi</th>
                <th className="text-left p-4 font-medium text-gray-900">SIM</th>
                <th className="text-left p-4 font-medium text-gray-900">
                  MCU / B3
                </th>
                <th className="text-left p-4 font-medium text-gray-900">Status</th>
                <th className="text-left p-4 font-medium text-gray-900">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedDrivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {driver.foto ? (
                        <img 
                          src={driver.foto} 
                          alt={driver.namaLengkap} 
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{driver.namaLengkap}</div>
                        <div className="text-sm text-gray-600">{driver.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-900">{driver.noTelepon}</div>
                    <div className="text-sm text-gray-600">{driver.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-900">{driver.posisi}</div>
                    <div className="text-sm text-gray-600">{driver.departemen}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-900">{driver.noSim}</div>
                    <div className="text-sm text-gray-600">{driver.jenisSim}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded flex items-center justify-center text-xs ${
                        driver.hasilMCU === 'Lulus' ? 'bg-green-100 text-green-700' :
                        driver.hasilMCU === 'Tidak Lulus' ? 'bg-red-100 text-red-700' :
                        driver.hasilMCU === 'Dalam Proses' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-600'
                      }`} title={`MCU: ${driver.hasilMCU}`}>
                        M
                      </div>
                      <div className={`w-6 h-6 rounded flex items-center justify-center text-xs ${
                        driver.hasilDDT === 'Lulus' ? 'bg-green-100 text-green-700' :
                        driver.hasilDDT === 'Tidak Lulus' ? 'bg-red-100 text-red-700' :
                        driver.hasilDDT === 'Dalam Proses' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-600'
                      }`} title={`${employeeType === 'Driver' ? 'DDT' : 'Sertifikat B3'}: ${driver.hasilDDT}`}>
                        {employeeType === 'Driver' ? 'DDT' : 'B3'}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{getStatusBadge(driver.statusAktif)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingDriver(driver)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingDriver(driver)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDriver(driver.id)}
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

      {/* Add/Edit Driver Dialog */}
      {(isAddingDriver || editingDriver) && (
        <Dialog open={isAddingDriver || editingDriver !== null} onOpenChange={(open) => {
          if (!open) {
            setIsAddingDriver(false);
            setEditingDriver(null);
          }
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingDriver ? 'Edit Personel' : 'Tambah Personel Baru'}
              </DialogTitle>
            </DialogHeader>
            <DriverForm
              driver={editingDriver || undefined}
              onSave={handleSaveDriver}
              onCancel={() => {
                setIsAddingDriver(false);
                setEditingDriver(null);
              }}
              employeeType={employeeType}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* View Driver Dialog */}
      <Dialog open={viewingDriver !== null} onOpenChange={(open) => {
        if (!open) setViewingDriver(null);
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Personel</DialogTitle>
          </DialogHeader>
          {viewingDriver && (
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="flex flex-col items-center space-y-4 pb-6 border-b border-gray-200">
                <div className="relative">
                  {viewingDriver.foto ? (
                    <img 
                      src={viewingDriver.foto} 
                      alt={viewingDriver.namaLengkap} 
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-200 shadow-lg">
                      <User className="w-12 h-12 text-gray-500" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900">{viewingDriver.namaLengkap}</h3>
                  <p className="text-gray-600">{viewingDriver.posisi} - {viewingDriver.departemen}</p>
                  <div className="mt-2">
                    {getStatusBadge(viewingDriver.statusAktif)}
                  </div>
                </div>
              </div>

              {/* Employee Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">ID Personel</Label>
                    <div className="p-2 bg-gray-100 rounded border">
                      {viewingDriver.employeeId}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Nama Lengkap</Label>
                    <div className="p-2 bg-gray-100 rounded border">
                      {viewingDriver.namaLengkap}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Email</Label>
                    <div className="p-2 bg-gray-100 rounded border">
                      {viewingDriver.email}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">No. Telepon</Label>
                    <div className="p-2 bg-gray-100 rounded border">
                      {viewingDriver.noTelepon}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Posisi</Label>
                    <div className="p-2 bg-gray-100 rounded border">
                      {viewingDriver.posisi}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Departemen</Label>
                    <div className="p-2 bg-gray-100 rounded border">
                      {viewingDriver.departemen}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">No. SIM</Label>
                    <div className="p-2 bg-gray-100 rounded border">
                      {viewingDriver.noSim}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Jenis SIM</Label>
                    <div className="p-2 bg-gray-100 rounded border">
                      {viewingDriver.jenisSim}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Health & Safety Check Results Section */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 flex items-center gap-2 pb-2 border-b">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  Hasil Pemeriksaan Kesehatan & Kelayakan
                </h4>
                
                {/* MCU */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      MCU (Medical Check Up)
                    </h5>
                    {viewingDriver.hasilMCU === 'Lulus' && (
                      <Badge className="bg-green-100 text-green-800">Lulus</Badge>
                    )}
                    {viewingDriver.hasilMCU === 'Tidak Lulus' && (
                      <Badge className="bg-red-100 text-red-800">Tidak Lulus</Badge>
                    )}
                    {viewingDriver.hasilMCU === 'Dalam Proses' && (
                      <Badge className="bg-yellow-100 text-yellow-800">Dalam Proses</Badge>
                    )}
                    {viewingDriver.hasilMCU === 'Belum' && (
                      <Badge className="bg-gray-100 text-gray-800">Belum</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Tanggal MCU:</span>
                      <p className="font-medium text-gray-900">{viewingDriver.tanggalMCU || '-'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Tanggal Expired:</span>
                      <p className="font-medium text-gray-900">{viewingDriver.tanggalExpiredMCU || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Sertifikat B3 / DDT */}
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900 flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                      {employeeType === 'Driver' ? 'Defensive Driving Training (DDT)' : 'Sertifikat B3'}
                    </h5>
                    {viewingDriver.hasilDDT === 'Lulus' && (
                      <Badge className="bg-green-100 text-green-800">Lulus</Badge>
                    )}
                    {viewingDriver.hasilDDT === 'Tidak Lulus' && (
                      <Badge className="bg-red-100 text-red-800">Tidak Lulus</Badge>
                    )}
                    {viewingDriver.hasilDDT === 'Dalam Proses' && (
                      <Badge className="bg-yellow-100 text-yellow-800">Dalam Proses</Badge>
                    )}
                    {viewingDriver.hasilDDT === 'Belum' && (
                      <Badge className="bg-gray-100 text-gray-800">Belum</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Tanggal {employeeType === 'Driver' ? 'DDT' : 'Sertifikat B3'}:</span>
                      <p className="font-medium text-gray-900">{viewingDriver.tanggalDDT || '-'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Tanggal Expired:</span>
                      <p className="font-medium text-gray-900">{viewingDriver.tanggalExpiredDDT || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional Info Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Informasi Tambahan</h4>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Status Karyawan:</span>
                    <p className="font-medium text-gray-900">{viewingDriver.statusKaryawan}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Tanggal Masuk:</span>
                    <p className="font-medium text-gray-900">{viewingDriver.tanggalMasuk}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
