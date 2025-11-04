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
  
  // Generate data for each day (7-30 as shown in image)
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
      itemCheck: 'Tidak beroperasi (KL)',
      values: {
        ...Object.fromEntries(Object.keys(days).map(day => [day, 0])),
      }
    },
    {
      itemCheck: 'Tidak beroperasi (unit)',
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
      itemCheck: 'Total AMT Ops',
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
        ...Object.fromEntries(Object.keys(days).map(day => [day, 0])),
      }
    },
    {
      itemCheck: 'Mulai Ops (Jam) -> Diisi jam:menit',
      values: {
        ...Object.fromEntries(Object.keys(days).map(day => [day, '07:00'])),
      }
    },
    {
      itemCheck: 'Selesai Ops (Jam) -> Diisi jam:menit',
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
    },
  ];
};

interface ExcelExportDailyReportProps {
  onBack: () => void;
}

export function ExcelExportDailyReport({ onBack }: ExcelExportDailyReportProps) {
  const [excelData] = useState<ExcelData[]>(generateAprilData());
  const [selectedMonth, setSelectedMonth] = useState('April 2024');
  const [searchTerm, setSearchTerm] = useState('');

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
    if (typeof value === 'string' && value.includes('%')) return value;
    return value.toString();
  };

  const getCellClassName = (value: number | string | null): string => {
    if (typeof value === 'string' && value.includes('%')) return 'text-blue-600';
    return 'text-gray-900';
  };

  // Calculate stats
  const totalItems = 23;
  const dataCoverage = 24;
  const dataPoints = 552;
  const completionRate = 98.5;

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
            <h1 className="text-3xl font-bold text-gray-900">Export Laporan Excel</h1>
            <p className="text-gray-600 mt-1">
              Data laporan harian operasional untuk periode April 2024
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5">
              <Calendar className="w-4 h-4" />
              {filteredData.length} Items
            </Badge>
            <Button variant="outline" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview Mode
            </Button>
            <Button onClick={handleExportExcel} className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white">
              <Download className="w-4 h-4" />
              Export Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="text-sm text-gray-600 mb-2 block">Periode</label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="bg-white">
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
          <label className="text-sm text-gray-600 mb-2 block">Pencarian</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari item check..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-2 block">Format Export</label>
          <Select defaultValue="xlsx">
            <SelectTrigger className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
              <SelectItem value="csv">CSV (.csv)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button variant="outline" className="w-full flex items-center justify-center gap-2 bg-white">
            <Settings className="w-4 h-4" />
            Export Settings
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Total Items</p>
              <p className="text-4xl font-bold text-blue-600">{totalItems}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Data Coverage</p>
              <p className="text-4xl font-bold text-green-600">{dataCoverage}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Data Points</p>
              <p className="text-4xl font-bold text-purple-600">{dataPoints}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Completion Rate</p>
              <p className="text-4xl font-bold text-orange-600">{completionRate}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Excel Table Preview */}
      <Card className="bg-white shadow-sm border-0">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-green-600" />
            <CardTitle>Preview Laporan Harian - April 2024</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-max">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 p-3 text-left font-semibold text-gray-700 min-w-[280px] sticky left-0 bg-gray-50 z-10">
                      Item Check
                    </th>
                    <th className="border border-gray-200 p-3 text-center font-semibold text-gray-700 bg-orange-50">
                      April
                    </th>
                    {dayColumns.map(day => (
                      <th key={day} className="border border-gray-200 p-3 text-center font-semibold text-gray-700 min-w-[70px]">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-200 p-3 text-gray-900 sticky left-0 bg-white z-10">
                        {row.itemCheck}
                      </td>
                      <td className="border border-gray-200 p-3 text-center bg-orange-50 font-medium text-orange-800">
                        2024
                      </td>
                      {dayColumns.map(day => (
                        <td 
                          key={day} 
                          className={`border border-gray-200 p-3 text-center text-sm ${getCellClassName(row.values[day])}`}
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
        </CardContent>
      </Card>
    </div>
  );
}
