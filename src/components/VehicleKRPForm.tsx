'use client';

import { useState } from 'react';
import { Save, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DatePicker } from './DatePicker';

export interface VehicleKRP {
  id: string;
  kontrak: string;
  region: string;
  fidBatch: string;
  wo: string;
  statusBPKB: string;
  nopolEksisting: string;
  merkTypeMobil: string;
  noRangka: string;
  noMesin: string;
  merk: string;
  tahun: number;
  kontrakLeasing: string;
  namaLeasing: string;
  awalKredit: string;
  akhirKredit: string;
  kontrakPolis: string;
  namaPolis: string;
  masaBerlakuPolis: string;
  jenisKendaraanBaru: string;
  awalMasaSewa: string;
  akhirMasaSewa: string;
  lokasi: string;
  alokasi: string;
  alamatAwal: string;
  alokasiUpdate: string;
  alamatUpdate: string;
  createdAt: string;
  updatedAt: string;
}

interface VehicleKRPFormProps {
  vehicle?: VehicleKRP;
  onSave: (vehicle: VehicleKRP) => void;
  onCancel: () => void;
}

export function VehicleKRPForm({ vehicle, onSave, onCancel }: VehicleKRPFormProps) {
  const [formData, setFormData] = useState<VehicleKRP>(
    vehicle || {
      id: '',
      kontrak: '',
      region: '',
      fidBatch: '',
      wo: '',
      statusBPKB: '',
      nopolEksisting: '',
      merkTypeMobil: '',
      noRangka: '',
      noMesin: '',
      merk: '',
      tahun: new Date().getFullYear(),
      kontrakLeasing: '',
      namaLeasing: '',
      awalKredit: '',
      akhirKredit: '',
      kontrakPolis: '',
      namaPolis: '',
      masaBerlakuPolis: '',
      jenisKendaraanBaru: '',
      awalMasaSewa: '',
      akhirMasaSewa: '',
      lokasi: '',
      alokasi: '',
      alamatAwal: '',
      alokasiUpdate: '',
      alamatUpdate: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  );

  const updateFormData = (field: keyof VehicleKRP, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="max-h-[70vh] overflow-y-auto px-1">
        {/* Informasi Kontrak */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Informasi Kontrak</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="kontrak">Kontrak</Label>
                <Input
                  id="kontrak"
                  value={formData.kontrak}
                  onChange={(e) => updateFormData('kontrak', e.target.value)}
                  placeholder="Nomor kontrak"
                />
              </div>
              <div>
                <Label htmlFor="region">Region</Label>
                <Select value={formData.region} onValueChange={(value) => updateFormData('region', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purwokerto">Purwokerto</SelectItem>
                    <SelectItem value="semarang">Semarang</SelectItem>
                    <SelectItem value="cilacap">Cilacap</SelectItem>
                    <SelectItem value="banyumas">Banyumas</SelectItem>
                    <SelectItem value="pemalang">Pemalang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fidBatch">FID BATCH</Label>
                <Input
                  id="fidBatch"
                  value={formData.fidBatch}
                  onChange={(e) => updateFormData('fidBatch', e.target.value)}
                  placeholder="FID BATCH"
                />
              </div>
              <div>
                <Label htmlFor="wo">WO</Label>
                <Input
                  id="wo"
                  value={formData.wo}
                  onChange={(e) => updateFormData('wo', e.target.value)}
                  placeholder="Work Order"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informasi Kendaraan */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Informasi Kendaraan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="statusBPKB">Status BPKB</Label>
                <Select value={formData.statusBPKB} onValueChange={(value) => updateFormData('statusBPKB', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Status BPKB" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ada">Ada</SelectItem>
                    <SelectItem value="leasing">Leasing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="nopolEksisting">Nopol Eksisting</Label>
                <Input
                  id="nopolEksisting"
                  value={formData.nopolEksisting}
                  onChange={(e) => updateFormData('nopolEksisting', e.target.value)}
                  placeholder="B 1234 XYZ"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="merkTypeMobil">Merk/Type Mobil</Label>
              <Input
                id="merkTypeMobil"
                value={formData.merkTypeMobil}
                onChange={(e) => updateFormData('merkTypeMobil', e.target.value)}
                placeholder="Mitsubishi Fuso FN517"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="noRangka">No. Rangka</Label>
                <Input
                  id="noRangka"
                  value={formData.noRangka}
                  onChange={(e) => updateFormData('noRangka', e.target.value)}
                  placeholder="Nomor rangka"
                />
              </div>
              <div>
                <Label htmlFor="noMesin">No. Mesin</Label>
                <Input
                  id="noMesin"
                  value={formData.noMesin}
                  onChange={(e) => updateFormData('noMesin', e.target.value)}
                  placeholder="Nomor mesin"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="merk">Merk</Label>
                <Input
                  id="merk"
                  value={formData.merk}
                  onChange={(e) => updateFormData('merk', e.target.value)}
                  placeholder="Merk kendaraan"
                />
              </div>
              <div>
                <Label htmlFor="tahun">Tahun</Label>
                <Input
                  id="tahun"
                  type="number"
                  value={formData.tahun}
                  onChange={(e) => updateFormData('tahun', parseInt(e.target.value))}
                  placeholder="2024"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="jenisKendaraanBaru">Jenis Kendaraan Baru</Label>
              <Select value={formData.jenisKendaraanBaru} onValueChange={(value) => updateFormData('jenisKendaraanBaru', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Jenis Kendaraan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tanker">Tanker</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="pickup">Pickup</SelectItem>
                  <SelectItem value="minibus">Minibus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Informasi Leasing */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Informasi Leasing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="kontrakLeasing">Kontrak Leasing</Label>
                <Input
                  id="kontrakLeasing"
                  value={formData.kontrakLeasing}
                  onChange={(e) => updateFormData('kontrakLeasing', e.target.value)}
                  placeholder="Nomor kontrak leasing"
                />
              </div>
              <div>
                <Label htmlFor="namaLeasing">Nama Leasing</Label>
                <Input
                  id="namaLeasing"
                  value={formData.namaLeasing}
                  onChange={(e) => updateFormData('namaLeasing', e.target.value)}
                  placeholder="Nama perusahaan leasing"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="awalKredit">Awal Kredit</Label>
                <DatePicker
                  id="awalKredit"
                  value={formData.awalKredit}
                  onChange={(value) => updateFormData('awalKredit', value)}
                  placeholder="dd/mm/yyyy"
                />
              </div>
              <div>
                <Label htmlFor="akhirKredit">Akhir Kredit</Label>
                <DatePicker
                  id="akhirKredit"
                  value={formData.akhirKredit}
                  onChange={(value) => updateFormData('akhirKredit', value)}
                  placeholder="dd/mm/yyyy"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informasi Polis */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Informasi Polis Asuransi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="kontrakPolis">Kontrak Polis</Label>
                <Input
                  id="kontrakPolis"
                  value={formData.kontrakPolis}
                  onChange={(e) => updateFormData('kontrakPolis', e.target.value)}
                  placeholder="Nomor kontrak polis"
                />
              </div>
              <div>
                <Label htmlFor="namaPolis">Nama Polis</Label>
                <Input
                  id="namaPolis"
                  value={formData.namaPolis}
                  onChange={(e) => updateFormData('namaPolis', e.target.value)}
                  placeholder="Nama polis asuransi"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="masaBerlakuPolis">Masa Berlaku Polis</Label>
              <DatePicker
                id="masaBerlakuPolis"
                value={formData.masaBerlakuPolis}
                onChange={(value) => updateFormData('masaBerlakuPolis', value)}
                placeholder="dd/mm/yyyy"
              />
            </div>
          </CardContent>
        </Card>

        {/* Informasi Sewa & Lokasi */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Informasi Sewa & Lokasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="awalMasaSewa">Awal Masa Sewa</Label>
                <DatePicker
                  id="awalMasaSewa"
                  value={formData.awalMasaSewa}
                  onChange={(value) => updateFormData('awalMasaSewa', value)}
                  placeholder="dd/mm/yyyy"
                />
              </div>
              <div>
                <Label htmlFor="akhirMasaSewa">Akhir Masa Sewa</Label>
                <DatePicker
                  id="akhirMasaSewa"
                  value={formData.akhirMasaSewa}
                  onChange={(value) => updateFormData('akhirMasaSewa', value)}
                  placeholder="dd/mm/yyyy"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="lokasi">Lokasi</Label>
              <Input
                id="lokasi"
                value={formData.lokasi}
                onChange={(e) => updateFormData('lokasi', e.target.value)}
                placeholder="Lokasi kendaraan"
              />
            </div>

            <div>
              <Label htmlFor="alokasi">Alokasi</Label>
              <Input
                id="alokasi"
                value={formData.alokasi}
                onChange={(e) => updateFormData('alokasi', e.target.value)}
                placeholder="Alokasi kendaraan"
              />
            </div>

            <div>
              <Label htmlFor="alamatAwal">Alamat Awal</Label>
              <Input
                id="alamatAwal"
                value={formData.alamatAwal}
                onChange={(e) => updateFormData('alamatAwal', e.target.value)}
                placeholder="Alamat awal"
              />
            </div>

            <div>
              <Label htmlFor="alokasiUpdate">Alokasi Update</Label>
              <Input
                id="alokasiUpdate"
                value={formData.alokasiUpdate}
                onChange={(e) => updateFormData('alokasiUpdate', e.target.value)}
                placeholder="Alokasi update"
              />
            </div>

            <div>
              <Label htmlFor="alamatUpdate">Alamat Update</Label>
              <Input
                id="alamatUpdate"
                value={formData.alamatUpdate}
                onChange={(e) => updateFormData('alamatUpdate', e.target.value)}
                placeholder="Alamat update"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Batal
        </Button>
        <Button type="submit">
          <Save className="w-4 h-4 mr-2" />
          Simpan Data
        </Button>
      </div>
    </form>
  );
}
