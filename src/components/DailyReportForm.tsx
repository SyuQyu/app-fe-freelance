import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ArrowLeft, Calendar as CalendarIcon, Save, Calculator, AlertCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

interface FormData {
  tanggal: string;
  region: string;
  shift: string;
  lokasi: string;
  pelapor: string;
  supervisor: string;
  items: {
    [key: number]: string;
  };
}

interface ChecklistFormItem {
  no: number;
  itemCheck: string;
  isAutoCalculated: boolean;
  isMandatory: boolean;
  unit: string;
  placeholder?: string;
  type: 'number' | 'text' | 'time' | 'percentage';
}

const checklistFormItems: ChecklistFormItem[] = [
  { no: 1, itemCheck: 'LO Plan (KL)', isAutoCalculated: false, isMandatory: true, unit: 'KL', placeholder: 'Masukkan nilai', type: 'number' },
  { no: 2, itemCheck: 'LO Realisasi (KL)', isAutoCalculated: false, isMandatory: true, unit: 'KL', placeholder: 'Masukkan nilai', type: 'number' },
  { no: 3, itemCheck: 'Prosentase Realisasi Penyaluran', isAutoCalculated: true, isMandatory: true, unit: '%', placeholder: '—', type: 'percentage' },
  { no: 4, itemCheck: 'Total MT', isAutoCalculated: false, isMandatory: true, unit: 'unit', placeholder: 'Masukkan nilai', type: 'number' },
  { no: 5, itemCheck: 'Total Volume MT (KL)', isAutoCalculated: true, isMandatory: true, unit: 'KL', placeholder: '—', type: 'number' },
  { no: 6, itemCheck: 'MT Beroperasi (unit)', isAutoCalculated: false, isMandatory: true, unit: 'unit', placeholder: 'Masukkan nilai', type: 'number' },
  { no: 7, itemCheck: 'Prosentase MT Ops (Unit)', isAutoCalculated: true, isMandatory: true, unit: '%', placeholder: '—', type: 'percentage' },
  { no: 8, itemCheck: 'Prosentase MT Ops (KL)', isAutoCalculated: true, isMandatory: true, unit: '%', placeholder: '—', type: 'percentage' },
  { no: 9, itemCheck: 'Tidak beroperasi (KL)', isAutoCalculated: true, isMandatory: false, unit: 'KL', placeholder: '—', type: 'number' },
  { no: 10, itemCheck: 'Tidak beroperasi (unit)', isAutoCalculated: false, isMandatory: true, unit: 'unit', placeholder: 'Masukkan nilai', type: 'number' },
  { no: 11, itemCheck: 'MT Rusak (unit)', isAutoCalculated: false, isMandatory: true, unit: 'unit', placeholder: 'Masukkan nilai', type: 'number' },
  { no: 12, itemCheck: 'AMT I Tersedia (Reff. Kontrak - Orang)', isAutoCalculated: false, isMandatory: true, unit: 'orang', placeholder: 'Masukkan nilai', type: 'number' },
  { no: 13, itemCheck: 'AMT II Tersedia (Reff. Kontrak - Orang)', isAutoCalculated: false, isMandatory: true, unit: 'orang', placeholder: 'Masukkan nilai', type: 'number' },
  { no: 14, itemCheck: 'Total AMT Tersedia', isAutoCalculated: true, isMandatory: true, unit: 'orang', placeholder: '0', type: 'number' },
  { no: 15, itemCheck: 'Total AMT Ops', isAutoCalculated: true, isMandatory: true, unit: 'orang', placeholder: '0', type: 'number' },
  { no: 16, itemCheck: 'AMT I Hadir - Orang', isAutoCalculated: false, isMandatory: true, unit: 'orang', placeholder: 'Masukkan nilai', type: 'number' },
  { no: 17, itemCheck: 'AMT II Hadir - Orang', isAutoCalculated: false, isMandatory: true, unit: 'orang', placeholder: 'Masukkan nilai', type: 'number' },
  { no: 18, itemCheck: 'Prosentase Kehadiran AMT', isAutoCalculated: true, isMandatory: true, unit: '%', placeholder: '—', type: 'percentage' },
  { no: 19, itemCheck: 'Total AMT Tidak Hadir', isAutoCalculated: true, isMandatory: true, unit: 'orang', placeholder: '0', type: 'number' },
  { no: 20, itemCheck: 'Mulai Ops (Jam) -> Diisi jam:menit', isAutoCalculated: false, isMandatory: true, unit: 'jam', placeholder: '--:--', type: 'time' },
  { no: 21, itemCheck: 'Selesai Ops (Jam) -> Diisi jam:menit', isAutoCalculated: false, isMandatory: true, unit: 'jam', placeholder: '--:--', type: 'time' },
  { no: 22, itemCheck: 'Lama Penyaluran Beroperasi (jam)', isAutoCalculated: true, isMandatory: true, unit: 'jam', placeholder: '—', type: 'text' },
  { no: 23, itemCheck: 'Ritase Penyaluran', isAutoCalculated: true, isMandatory: true, unit: 'ritase', placeholder: '—', type: 'number' },
];

interface DailyReportFormProps {
  onBack: () => void;
  onSave: (data: any) => void;
}

export function DailyReportForm({ onBack, onSave }: DailyReportFormProps) {
  const [formData, setFormData] = useState<FormData>({
    tanggal: '',
    region: '',
    shift: '',
    lokasi: '',
    pelapor: '',
    supervisor: '',
    items: {},
  });

  const [calculatedValues, setCalculatedValues] = useState<{ [key: number]: string }>({});

  // Auto-calculate values
  useEffect(() => {
    const items = formData.items;
    const newCalculated: { [key: number]: string } = {};

    // Prosentase Realisasi Penyaluran (item 3) = (LO Realisasi / LO Plan) * 100
    if (items[1] && items[2]) {
      const plan = parseFloat(items[1]);
      const realisasi = parseFloat(items[2]);
      if (plan > 0) {
        newCalculated[3] = ((realisasi / plan) * 100).toFixed(1) + '%';
      }
    }

    // Total Volume MT (KL) (item 5) = Total MT (item 4) × 16
    if (items[4]) {
      const totalMT = parseFloat(items[4]);
      newCalculated[5] = (totalMT * 16).toFixed(1);
    }

    // Prosentase MT Ops (Unit) (item 7) = (MT Beroperasi / Total MT) * 100
    if (items[4] && items[6]) {
      const totalMT = parseFloat(items[4]);
      const mtBeroperasi = parseFloat(items[6]);
      if (totalMT > 0) {
        newCalculated[7] = ((mtBeroperasi / totalMT) * 100).toFixed(1) + '%';
      }
    }

    // Prosentase MT Ops (KL) (item 8) = (Total Volume MT / LO Realisasi) * 100
    // Menggunakan item 5 (Total Volume MT) dan item 2 (LO Realisasi)
    if (items[2] && newCalculated[5]) {
      const loRealisasi = parseFloat(items[2]);
      const volumeMT = parseFloat(newCalculated[5]);
      if (loRealisasi > 0) {
        newCalculated[8] = ((volumeMT / loRealisasi) * 100).toFixed(1) + '%';
      }
    }

    // Tidak beroperasi (KL) (item 9) = Total MT (item 4) - MT Beroperasi (item 6)
    if (items[4] && items[6]) {
      const totalMT = parseFloat(items[4]);
      const mtBeroperasi = parseFloat(items[6]);
      newCalculated[9] = (totalMT - mtBeroperasi).toFixed(1);
    }

    // Total AMT Tersedia (item 14) = AMT I + AMT II
    if (items[12] && items[13]) {
      const amt1 = parseFloat(items[12]);
      const amt2 = parseFloat(items[13]);
      newCalculated[14] = (amt1 + amt2).toString();
    }

    // Total AMT Ops (item 15) = AMT I Hadir + AMT II Hadir
    if (items[16] && items[17]) {
      const amt1Hadir = parseFloat(items[16]);
      const amt2Hadir = parseFloat(items[17]);
      newCalculated[15] = (amt1Hadir + amt2Hadir).toString();
    }

    // Prosentase Kehadiran AMT (item 18) = (Total AMT Ops / Total AMT Tersedia) * 100
    if (newCalculated[14] && newCalculated[15]) {
      const totalTersedia = parseFloat(newCalculated[14]);
      const totalOps = parseFloat(newCalculated[15]);
      if (totalTersedia > 0) {
        newCalculated[18] = ((totalOps / totalTersedia) * 100).toFixed(1) + '%';
      }
    }

    // Total AMT Tidak Hadir (item 19) = Total AMT Tersedia - Total AMT Ops
    if (newCalculated[14] && newCalculated[15]) {
      const totalTersedia = parseFloat(newCalculated[14]);
      const totalOps = parseFloat(newCalculated[15]);
      newCalculated[19] = (totalTersedia - totalOps).toString();
    }

    // Lama Penyaluran (item 22) = |Selesai Ops - Mulai Ops| (nilai mutlak dalam HH:MM format)
    if (items[20] && items[21]) {
      const mulai = items[20].split(':');
      const selesai = items[21].split(':');
      if (mulai.length === 2 && selesai.length === 2) {
        const mulaiMinutes = parseInt(mulai[0]) * 60 + parseInt(mulai[1]);
        const selesaiMinutes = parseInt(selesai[0]) * 60 + parseInt(selesai[1]);
        
        // Gunakan nilai mutlak (absolute value) untuk selisih
        const diffMinutes = Math.abs(selesaiMinutes - mulaiMinutes);
        
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;
        newCalculated[22] = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
    }

    // Ritase Penyaluran (item 23) = Total Volume MT (item 5) ÷ 16
    if (newCalculated[5]) {
      const volumeMT = parseFloat(newCalculated[5]);
      newCalculated[23] = (volumeMT / 16).toFixed(1);
    }

    setCalculatedValues(newCalculated);
  }, [formData.items]);

  const handleItemChange = (no: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      items: {
        ...prev.items,
        [no]: value,
      },
    }));
  };

  const totalItems = checklistFormItems.length; // Total 23 items
  
  // Hitung semua item yang terisi (baik manual maupun auto-calculated)
  let dataFilled = 0;
  let mandatoryFieldsFilled = 0;
  let totalMandatoryFields = 0;
  
  checklistFormItems.forEach(item => {
    const itemNo = item.no;
    
    // Hitung total mandatory fields
    if (item.isMandatory) {
      totalMandatoryFields++;
    }
    
    if (item.isAutoCalculated) {
      // Untuk field auto-calculated, cek apakah ada nilai di calculatedValues
      const calculatedValue = calculatedValues[itemNo];
      if (calculatedValue && calculatedValue !== '—' && calculatedValue !== '') {
        dataFilled++;
        if (item.isMandatory) {
          mandatoryFieldsFilled++;
        }
      }
    } else {
      // Untuk field manual input, cek apakah ada nilai di formData.items
      const manualValue = formData.items[itemNo];
      if (manualValue && manualValue.trim() !== '') {
        dataFilled++;
        if (item.isMandatory) {
          mandatoryFieldsFilled++;
        }
      }
    }
  });
  
  const completionPercentage = Math.round((dataFilled / totalItems) * 100);
  
  // Cek apakah semua field mandatory sudah terisi
  const isFormValid = mandatoryFieldsFilled === totalMandatoryFields;

  const handleSubmit = () => {
    if (!isFormValid) {
      // Cari field mandatory yang belum terisi
      const missingFields: string[] = [];
      checklistFormItems.forEach(item => {
        if (item.isMandatory) {
          if (item.isAutoCalculated) {
            const calculatedValue = calculatedValues[item.no];
            if (!calculatedValue || calculatedValue === '—' || calculatedValue === '') {
              missingFields.push(`No. ${item.no} - ${item.itemCheck}`);
            }
          } else {
            const manualValue = formData.items[item.no];
            if (!manualValue || manualValue.trim() === '') {
              missingFields.push(`No. ${item.no} - ${item.itemCheck}`);
            }
          }
        }
      });
      
      toast.error('Form Tidak Lengkap', {
        description: `Mohon lengkapi ${missingFields.length} field wajib yang belum diisi (ditandai dengan *)`,
      });
      return;
    }
    
    const reportData = {
      ...formData,
      calculatedValues,
      submittedAt: new Date().toISOString(),
    };
    
    toast.success('Laporan Berhasil Disimpan', {
      description: 'Data laporan harian telah berhasil disimpan ke sistem',
    });
    
    onSave(reportData);
  };

  return (
    <div className="p-6 max-w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tambah Laporan</h1>
            <p className="text-gray-600 mt-1">
              Form pengisian laporan operasional harian
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="w-4 h-4" />
            Simpan Laporan
          </Button>
        </div>
      </div>

      {/* Informasi Laporan */}
      <Card className="bg-white shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Informasi Laporan</h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="tanggal">Tanggal</Label>
              <div className="relative">
                <Input
                  id="tanggal"
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  className="pr-10"
                />
                <CalendarIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="region1">Region 1</SelectItem>
                  <SelectItem value="region2">Region 2</SelectItem>
                  <SelectItem value="region3">Region 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shift">Shift</Label>
              <Select value={formData.shift} onValueChange={(value) => setFormData({ ...formData, shift: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Shift" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pagi">Shift Pagi</SelectItem>
                  <SelectItem value="siang">Shift Siang</SelectItem>
                  <SelectItem value="malam">Shift Malam</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lokasi">Lokasi</Label>
              <Select value={formData.lokasi} onValueChange={(value) => setFormData({ ...formData, lokasi: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Lokasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lokasi1">Lokasi 1</SelectItem>
                  <SelectItem value="lokasi2">Lokasi 2</SelectItem>
                  <SelectItem value="lokasi3">Lokasi 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pelapor">Nama Pelapor</Label>
              <Input
                id="pelapor"
                value={formData.pelapor}
                onChange={(e) => setFormData({ ...formData, pelapor: e.target.value })}
                placeholder="Masukkan nama pelapor"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supervisor">Supervisor</Label>
              <Select value={formData.supervisor} onValueChange={(value) => setFormData({ ...formData, supervisor: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Supervisor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supervisor1">Supervisor 1</SelectItem>
                  <SelectItem value="supervisor2">Supervisor 2</SelectItem>
                  <SelectItem value="supervisor3">Supervisor 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Auto-Calculated Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 mb-6">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Formula otomatis (Auto-calculated)</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
              <p className="text-sm text-gray-600 mb-1">Total Item</p>
              <p className="text-3xl font-bold text-gray-900">{totalItems}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
              <p className="text-sm text-gray-600 mb-1">Data Terisi</p>
              <p className="text-3xl font-bold text-blue-600">{dataFilled}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
              <p className="text-sm text-gray-600 mb-2">Kelengkapan Data</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-600 transition-all duration-300 rounded-full" 
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <p className="text-2xl font-bold text-green-600">{completionPercentage}%</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Item Check Operasional */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Item Check Operasional</h3>
              <p className="text-sm text-gray-600">
                <span className="text-red-500">*</span> Menandakan field wajib diisi
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                Kelengkapan: {completionPercentage}%
              </Badge>
              <Badge className={`${isFormValid ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-100 text-orange-700 border-orange-200'}`}>
                Mandatory: {mandatoryFieldsFilled}/{totalMandatoryFields}
              </Badge>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200">
                <TableHead className="font-semibold text-gray-700 w-16 text-center">No</TableHead>
                <TableHead className="font-semibold text-gray-700 min-w-[320px]">Item Check</TableHead>
                <TableHead className="font-semibold text-gray-700 min-w-[280px]">Nilai</TableHead>
                <TableHead className="font-semibold text-gray-700 w-24">Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checklistFormItems.map((item) => {
                const calculatedValue = calculatedValues[item.no];
                const inputValue = formData.items[item.no] || '';
                const displayValue = item.isAutoCalculated ? calculatedValue : inputValue;

                return (
                  <TableRow key={item.no} className="border-b border-gray-100">
                    <TableCell className="text-center text-gray-600">{item.no}</TableCell>
                    <TableCell className="text-gray-900">
                      <div className="flex items-center gap-2">
                        <span>
                          {item.itemCheck}
                          {item.isMandatory && <span className="text-red-500 ml-1">*</span>}
                        </span>
                        {item.isAutoCalculated && (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                            Auto
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.isAutoCalculated ? (
                        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 font-medium">
                          {calculatedValue || item.placeholder}
                        </div>
                      ) : (
                        <Input
                          type={item.type === 'time' ? 'time' : item.type === 'number' ? 'number' : 'text'}
                          value={inputValue}
                          onChange={(e) => handleItemChange(item.no, e.target.value)}
                          placeholder={item.placeholder}
                          step={item.type === 'number' ? '0.1' : undefined}
                        />
                      )}
                    </TableCell>
                    <TableCell className="text-gray-600">{item.unit}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Bottom Save Button */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              <p className="mb-1">
                <span className="text-red-500">*</span> Field wajib diisi
              </p>
              <p>
                Field mandatory terisi: <span className="font-semibold text-blue-600">{mandatoryFieldsFilled}/{totalMandatoryFields}</span>
              </p>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Simpan
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
