'use client';

import { useState } from 'react';
import { ArrowLeft, Download, Calendar, Filter, Search, FileSpreadsheet, Eye, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

interface ExcelData {
  itemCheck: string;
  values: { [key: string]: number | string | null };
}

const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate();
};

const generateAprilData = (): ExcelData[] => {
  const daysInApril = getDaysInMonth(4, 2024); // April 2024
  const days: { [key: string]: number | string | null } = {};
  
  // Generate data for each day (7-31 as shown in image)
  for (let day = 7; day <= daysInApril; day++) {
    days[day.toString()] = null;
  }

  return [
    {
      itemCheck: 'LO Plan (KL)',
      values: {
        ...Object.fromEntries(Object.keys(days).map(day => [day, 208])),
      }
    },
    {
      itemCheck: 'LO Realisasi (KL)',
      values: {
        ...Object.fromEntries(Object.keys(days).map(day => [day, 208])),
      }
    },
    {
      itemCheck: 'Prosentase Realisasi Penyaluran',
      values: {
        ...Object.fromEntries(Object.keys(days).map(day => [day, '100%'])),
      }
    },
    {
      itemCheck: 'Total MT',
      values: {
        ...Object.fromEntries(Object.keys(days).map(day => [day, 13])),
      }
    },
    {
      itemCheck: 'Total Volume MT (KL)',
      values: {
        ...Object.fromEntries(Object.keys(days).map(day => [day, 208])),
      }
    },
    {
      itemCheck: 'MT Beroperasi (unit)',
      values: {
        ...Object.fromEntries(Object.keys(days).map(day => [day, 13])),
      }
    },
    {
      itemCheck: 'Prosentase MT Ops (Unit)',
      values: {
        ...Object.fromEntries(Object.keys(days).map(day => [day, '100%'])),
      }
    },
    {
      itemCheck: 'Prosentase MT Ops (KL)',
      values: {
        ...Object.fromEntries(Object.keys(days).map(day => [day, '100%'])),
      }
    },
    {
      itemCheck: 'MT Tidak beroperasi (unit)',
      values: {
        ...Object.fromEntries(Object.keys(days).map(day => [day, 0])),
      }
    },
    {
      itemCheck: 'MT Rusak (unit)',
      values: {
        ...Object.fromEntries(Object.keys(days).map(day => [day, 0])),
      }
    },
    {
      itemCheck: 'AMT I Tersedia (Reff. Kontrak - Orang)',
      values: {
        ...Object.fromEntries(Object.keys(days).map(day => [day, 13])),
      }
    },
    {
      itemCheck: 'AMT II Tersedia (Reff. Kontrak - Orang)',
      values: {
        ...Object.fromEntries(Object.keys(days).map(day => [day, 13])),
      }
    },
    {
      itemCheck: 'Total AMT Tersedia',
      values: {
        ...Object.fromEntries(Object.keys(days).map(day => [day, 26])),
      }
    },
    {
      itemCheck: 'Total AMT',
      values: {
        ...Object.fromEntries(Object.keys(days).map(day => [day, 26])),
      }
    },
    {
      itemCheck: 'AMT I Hadir - Orang',
      values: {
        ...Object.fromEntries(Object.keys(days).map(day => [day, 13])),
      }
    },
    {
      itemCheck: 'AMT II Hadir - Orang',
      values: {
        ...Object.fromEntries(Object.keys(days).map(day => [day, 13])),
      }
    },
    {
      itemCheck: 'Prosentase Kehadiran AMT',
      values: {
        ...Object.fromEntries(Object.keys(days).map(day => [day, '100%'])),
      }
    },
    {
      itemCheck: 'Total AMT Tidak Hadir',
      values: {
        ...Object.fromEntries(Object.keys(days).map(day => [day, '#REF!'])),
      }
    },
    {
      itemCheck: 'Mulai Ops (Jam) - Diisi jam:menit',
      values: {
        ...Object.fromEntries(Object.keys(days).map(day => [day, '07:00'])),
      }
    },
    {
      itemCheck: 'Selesai Ops (Jam) - Diisi jam:menit',
      values: {
        ...Object.fromEntries(Object.keys(days).map(day => [day, '15:00'])),
      }
    },
    {
      itemCheck: 'Lama Penyaluran Beroperasi (jam)',
      values: {
        ...Object.fromEntries(Object.keys(days).map(day => [day, '08:00'])),
      }
    },
    {
      itemCheck: 'Ritase Penyaluran',
      values: {
        ...Object.fromEntries(Object.keys(days).map(day => [day, 1.3])),
      }
    }
  ];
};

interface ExcelExportProps {
  onBack: () => void;
}

export function ExcelExport({ onBack }: ExcelExportProps) {
  const [excelData] = useState<ExcelData[]>(generateAprilData());
  const [selectedMonth, setSelectedMonth] = useState('April 2024');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'preview'>('table');

  const daysInApril = getDaysInMonth(4, 2024);
  const dayColumns = Array.from({ length: daysInApril - 6 }, (_, i) => (i + 7).toString());

  const filteredData = excelData.filter(item =>
    item.itemCheck.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportExcel = () => {
    // Simulate Excel export
    console.log('Exporting to Excel...', excelData);
    alert('File Excel berhasil di-export!\nFile: Laporan_Harian_April_2024.xlsx');
  };

  const getCellValue = (value: number | string | null): string => {
    if (value === null) return '';
    if (value === '#REF!') return '#REF!';
    if (typeof value === 'string' && value.includes('%')) return value;
    if (typeof value === 'string' && value.includes(':')) return value;
    return value.toString();
  };

  const getCellClassName = (value: number | string | null): string => {
    if (value === '#REF!') return 'text-red-600 bg-red-50 font-medium';
    if (typeof value === 'string' && value.includes('%')) return 'text-blue-600 font-medium';
    if (typeof value === 'string' && value.includes(':')) return 'text-purple-600 font-medium';
    return 'text-gray-900';
  };

  return (
    <div className="p-6 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Export Laporan Excel</h1>
            <p className="text-gray-600">Data laporan harian operasional untuk periode April 2024</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4" />
            {filteredData.length} Items
          </Badge>
          <Button 
            variant="outline" 
            onClick={() => setViewMode(viewMode === 'table' ? 'preview' : 'table')}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {viewMode === 'table' ? 'Preview Mode' : 'Table Mode'}
          </Button>
          <Button onClick={handleExportExcel} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Periode</label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="April 2024">April 2024</SelectItem>
              <SelectItem value="Maret 2024">Maret 2024</SelectItem>
              <SelectItem value="Februari 2024">Februari 2024</SelectItem>
              <SelectItem value="Januari 2024">Januari 2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Pencarian</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari item check..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Format Export</label>
          <Select defaultValue="xlsx">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
              <SelectItem value="csv">CSV (.csv)</SelectItem>
              <SelectItem value="pdf">PDF (.pdf)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button variant="outline" className="w-full flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Export Settings
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-blue-600">{excelData.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Days Coverage</p>
              <p className="text-2xl font-bold text-green-600">{dayColumns.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Data Points</p>
              <p className="text-2xl font-bold text-purple-600">{excelData.length * dayColumns.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-orange-600">98.5%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Excel Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-green-600" />
            Preview Laporan Harian - {selectedMonth}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-max">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 p-2 text-left font-semibold text-gray-700 min-w-[250px] sticky left-0 bg-blue-50 z-10">
                      Item Check
                    </th>
                    <th className="border border-gray-300 p-2 text-center font-semibold text-gray-700 bg-orange-100">
                      April
                    </th>
                    {dayColumns.map(day => (
                      <th key={day} className="border border-gray-300 p-2 text-center font-semibold text-gray-700 min-w-[60px]">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-300 p-2 font-medium text-gray-900 sticky left-0 bg-inherit z-10">
                        {row.itemCheck}
                      </td>
                      <td className="border border-gray-300 p-2 text-center bg-orange-50 font-medium text-orange-800">
                        2024
                      </td>
                      {dayColumns.map(day => (
                        <td 
                          key={day} 
                          className={`border border-gray-300 p-2 text-center text-sm ${getCellClassName(row.values[day])}`}
                        >
                          {getCellValue(row.values[day])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-50 border border-red-200"></div>
              <span className="text-red-600">#REF! - Error Formula</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-50 border border-blue-200"></div>
              <span className="text-blue-600">Persentase (%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-50 border border-purple-200"></div>
              <span className="text-purple-600">Waktu (HH:MM)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-50 border border-gray-200"></div>
              <span className="text-gray-600">Nilai Numerik</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle>Opsi Export</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-800">Excel Format (.xlsx)</p>
                  <p className="text-sm text-green-600">Recommended for data analysis</p>
                </div>
                <div className="text-green-600 font-bold">✓</div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">CSV Format (.csv)</p>
                  <p className="text-sm text-gray-600">Compatible with all systems</p>
                </div>
                <div className="text-gray-400">○</div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">PDF Format (.pdf)</p>
                  <p className="text-sm text-gray-600">For printing and sharing</p>
                </div>
                <div className="text-gray-400">○</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi File</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Nama File:</span>
                <span className="font-medium">Laporan_Harian_April_2024.xlsx</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ukuran Estimasi:</span>
                <span className="font-medium">~2.5 MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Jumlah Sheet:</span>
                <span className="font-medium">1 Sheet</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Periode Data:</span>
                <span className="font-medium">7 - 30 April 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Cells:</span>
                <span className="font-medium">{(excelData.length * dayColumns.length).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium">{new Date().toLocaleDateString('id-ID')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
        <Button variant="outline" onClick={onBack}>
          Batal
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Preview Excel
        </Button>
        <Button onClick={handleExportExcel} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download Excel
        </Button>
      </div>
    </div>
  );
}