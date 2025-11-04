import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Calendar, BarChart3, FileDown, TrendingUp, Plus, Percent, Clock, Hash, Edit } from 'lucide-react';
import { DailyReportForm } from './DailyReportForm';
import { ExcelExportDailyReport } from './ExcelExportDailyReport';
import { DailyReportCharts } from './DailyReportCharts';

interface PerformanceMetric {
  metrik: string;
  nilai: string | number;
  unit: string;
  status: 'Excellent' | 'Good' | 'Average' | 'Poor';
  perubahan: string;
}

interface ChecklistItem {
  no: number;
  itemCheck: string;
  col1: string | number;
  col2: string | number;
  col3: string | number;
  col4: string | number;
  col5: string | number;
}

interface ReportData {
  tanggal: string;
  region: string;
  shift: string;
  lokasi: string;
  pelapor: string;
  supervisor: string;
  items: {
    [key: number]: string;
  };
  calculatedValues: {
    [key: number]: string;
  };
  submittedAt: string;
}

const performanceData: PerformanceMetric[] = [
  {
    metrik: 'Total Kendaraan Aktif',
    nilai: 13,
    unit: 'unit',
    status: 'Excellent',
    perubahan: '+0%',
  },
  {
    metrik: 'Volume Distribusi',
    nilai: 208,
    unit: 'KL/hari',
    status: 'Excellent',
    perubahan: '+0%',
  },
  {
    metrik: 'Efisiensi Operasional',
    nilai: 100,
    unit: '%',
    status: 'Excellent',
    perubahan: '+0%',
  },
  {
    metrik: 'Tingkat Kehadiran Driver',
    nilai: 100,
    unit: '%',
    status: 'Excellent',
    perubahan: '+0%',
  },
  {
    metrik: 'Rata-rata Ritase',
    nilai: 1.3,
    unit: 'rit/hari',
    status: 'Good',
    perubahan: '+0%',
  },
  {
    metrik: 'Durasi Operasional',
    nilai: 8,
    unit: 'jam',
    status: 'Excellent',
    perubahan: '+0%',
  },
];

const checklistData: ChecklistItem[] = [
  { no: 1, itemCheck: 'LO Plan (KL)', col1: 208, col2: 208, col3: 208, col4: 208, col5: 208 },
  { no: 2, itemCheck: 'LO Realisasi (KL)', col1: 208, col2: 208, col3: 208, col4: 208, col5: 208 },
  { no: 3, itemCheck: 'Prosentase Realisasi Penyaluran', col1: '100%', col2: '100%', col3: '100%', col4: '100%', col5: '100%' },
  { no: 4, itemCheck: 'Total MT', col1: 13, col2: 13, col3: 13, col4: 13, col5: 13 },
  { no: 5, itemCheck: 'Total Volume MT (KL)', col1: 208, col2: 208, col3: 208, col4: 208, col5: 208 },
  { no: 6, itemCheck: 'MT Beroperasi (unit)', col1: 13, col2: 13, col3: 13, col4: 13, col5: 13 },
  { no: 7, itemCheck: 'Prosentase MT Ops (Unit)', col1: '100%', col2: '100%', col3: '100%', col4: '100%', col5: '100%' },
  { no: 8, itemCheck: 'Prosentase MT Ops (KL)', col1: '100%', col2: '100%', col3: '100%', col4: '100%', col5: '100%' },
  { no: 9, itemCheck: 'Tidak beroperasi (KL)', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0 },
  { no: 10, itemCheck: 'Tidak beroperasi (unit)', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0 },
  { no: 11, itemCheck: 'MT Rusak (unit)', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0 },
  { no: 12, itemCheck: 'AMT I Tersedia (Reff. Kontrak - Orang)', col1: 13, col2: 13, col3: 13, col4: 13, col5: 13 },
  { no: 13, itemCheck: 'AMT II Tersedia (Reff. Kontrak - Orang)', col1: 13, col2: 13, col3: 13, col4: 13, col5: 13 },
  { no: 14, itemCheck: 'Total AMT Tersedia', col1: 26, col2: 26, col3: 26, col4: 26, col5: 26 },
  { no: 15, itemCheck: 'Total AMT Ops', col1: 26, col2: 26, col3: 26, col4: 26, col5: 26 },
  { no: 16, itemCheck: 'AMT I Hadir - Orang', col1: 13, col2: 13, col3: 13, col4: 13, col5: 13 },
  { no: 17, itemCheck: 'AMT II Hadir - Orang', col1: 13, col2: 13, col3: 13, col4: 13, col5: 13 },
  { no: 18, itemCheck: 'Prosentase Kehadiran AMT', col1: '100%', col2: '100%', col3: '100%', col4: '100%', col5: '100%' },
  { no: 19, itemCheck: 'Total AMT Tidak Hadir', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0 },
  { no: 20, itemCheck: 'Mulai Ops (Jam) -> Diisi jam:menit', col1: '07:00', col2: '07:00', col3: '07:00', col4: '07:00', col5: '07:00' },
  { no: 21, itemCheck: 'Selesai Ops (Jam) -> Diisi jam:menit', col1: '15:00', col2: '15:00', col3: '15:00', col4: '15:00', col5: '15:00' },
  { no: 22, itemCheck: 'Lama Penyaluran Beroperasi (jam)', col1: '08:00', col2: '08:00', col3: '08:00', col4: '08:00', col5: '08:00' },
  { no: 23, itemCheck: 'Ritase Penyaluran', col1: 1.3, col2: 1.3, col3: 1.3, col4: 1.3, col5: 1.3 },
];

export function DailyReport() {
  const [showChart, setShowChart] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showExportExcel, setShowExportExcel] = useState(false);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [editingDateIndex, setEditingDateIndex] = useState<number | null>(null);

  // Generate 5 weekdays (Monday to Friday) date headers
  const getDateHeaders = () => {
    const dates: Date[] = [];
    const today = new Date();
    
    // Get current day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const currentDay = today.getDay();
    
    // Calculate how many days back to Monday
    let daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;
    
    // Generate dates for Monday to Friday of current week
    for (let i = 0; i < 5; i++) {
      const date = new Date(today.getTime() - (daysFromMonday - i) * 24 * 60 * 60 * 1000);
      dates.push(date);
    }
    
    return dates.map(date => formatDateHeader(date));
  };

  const formatDateHeader = (date: Date) => {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Oct', 'Nov', 'Des'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    
    return `${dayName}, ${day} ${month}`;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Excellent':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Good':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Average':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Poor':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleExportExcel = () => {
    setShowExportExcel(true);
  };

  const handlePilihPeriode = () => {
    // Logic untuk pilih periode
    console.log('Memilih periode...');
  };

  const handleLihatGrafik = () => {
    setShowChart(!showChart);
  };

  const handleTambahLaporan = () => {
    setShowForm(true);
  };

  const handleSaveReport = (data: ReportData) => {
    setReports(prev => [data, ...prev]);
    setShowForm(false);
  };

  const handleBackFromForm = () => {
    setShowForm(false);
  };

  const handleBackFromExport = () => {
    setShowExportExcel(false);
  };

  const handleEditDate = (dateIndex: number) => {
    setEditingDateIndex(dateIndex);
    setShowForm(true);
  };

  // Get value from reports for a specific item and column
  const getReportValue = (itemNo: number, reportIndex: number) => {
    if (reports.length === 0 || reportIndex >= reports.length) {
      // Return mock data for display
      return checklistData.find(item => item.no === itemNo)?.[`col${reportIndex + 1}` as keyof ChecklistItem] || '';
    }
    
    const report = reports[reportIndex];
    const value = report.items[itemNo] || report.calculatedValues[itemNo];
    return value || '';
  };

  if (showForm) {
    return <DailyReportForm onBack={handleBackFromForm} onSave={handleSaveReport} />;
  }

  if (showExportExcel) {
    return <ExcelExportDailyReport onBack={handleBackFromExport} />;
  }

  if (showChart) {
    return <DailyReportCharts onBack={() => setShowChart(false)} />;
  }

  const dateHeaders = getDateHeaders();

  return (
    <div className="p-6 max-w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Laporan Harian Operasional</h1>
          <p className="text-gray-600 mt-1">
            Monitoring dan pelaporan operasional harian kendaraan fleet
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handlePilihPeriode}
            className="flex items-center gap-2 bg-white"
          >
            <Calendar className="w-4 h-4" />
            Pilih Periode
          </Button>
          <Button
            variant="outline"
            onClick={handleLihatGrafik}
            className="flex items-center gap-2 bg-white"
          >
            <BarChart3 className="w-4 h-4" />
            Lihat Grafik
          </Button>
          <Button
            onClick={handleExportExcel}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white"
          >
            <FileDown className="w-4 h-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Periode Tracking Card */}
        <Card className="bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Periode Tracking</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-1">5 Days</h2>
              <p className="text-sm text-gray-500">Senin - Jumat (Hari Kerja)</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        {/* Data Points Card */}
        <Card className="bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Data Points</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-1">115</h2>
              <p className="text-sm text-gray-500">Total data terkumpul (23 item x 5 hari)</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Analytics Table */}
      <Card className="bg-white shadow-sm border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-700" />
            <h3 className="font-semibold text-gray-900">Performance Analytics</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200">
                <TableHead className="font-semibold text-gray-700">Metrik</TableHead>
                <TableHead className="font-semibold text-gray-700 text-center">Nilai</TableHead>
                <TableHead className="font-semibold text-gray-700 text-center">Unit</TableHead>
                <TableHead className="font-semibold text-gray-700 text-center">Status</TableHead>
                <TableHead className="font-semibold text-gray-700 text-center">Perubahan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performanceData.map((metric, index) => (
                <TableRow key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">{metric.metrik}</TableCell>
                  <TableCell className="text-center text-blue-600 font-semibold">
                    {metric.nilai}
                  </TableCell>
                  <TableCell className="text-center text-gray-600">{metric.unit}</TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant="outline" 
                      className={getStatusBadgeClass(metric.status)}
                    >
                      {metric.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-green-600 font-medium">
                    {metric.perubahan}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Checklist Table */}
      <Card className="bg-white shadow-sm border border-gray-200 mt-8">
        <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="font-semibold text-gray-900">Laporan Operasional Harian - Item Check List</h3>
          </div>
          <Button
            onClick={handleTambahLaporan}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4" />
            Tambah Laporan
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200">
                <TableHead className="font-semibold text-gray-700 w-16 text-center">No</TableHead>
                <TableHead className="font-semibold text-gray-700 min-w-[320px]">Item Check</TableHead>
                <TableHead className="font-semibold text-gray-700 text-center min-w-[140px]">
                  <div className="flex flex-col items-center gap-2">
                    <span>{dateHeaders[0]}</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-7 px-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700"
                      onClick={() => handleEditDate(0)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-center min-w-[140px]">
                  <div className="flex flex-col items-center gap-2">
                    <span>{dateHeaders[1]}</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-7 px-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700"
                      onClick={() => handleEditDate(1)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-center min-w-[140px]">
                  <div className="flex flex-col items-center gap-2">
                    <span>{dateHeaders[2]}</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-7 px-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700"
                      onClick={() => handleEditDate(2)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-center min-w-[140px]">
                  <div className="flex flex-col items-center gap-2">
                    <span>{dateHeaders[3]}</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-7 px-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700"
                      onClick={() => handleEditDate(3)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-center min-w-[140px]">
                  <div className="flex flex-col items-center gap-2">
                    <span>{dateHeaders[4]}</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-7 px-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700"
                      onClick={() => handleEditDate(4)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checklistData.map((item) => (
                <TableRow key={item.no} className="border-b border-gray-100 hover:bg-gray-50">
                  <TableCell className="text-center text-gray-600">{item.no}</TableCell>
                  <TableCell className="text-gray-900">{item.itemCheck}</TableCell>
                  <TableCell className="text-center text-gray-900 font-medium">{getReportValue(item.no, 0) || item.col1}</TableCell>
                  <TableCell className="text-center text-gray-900 font-medium">{getReportValue(item.no, 1) || item.col2}</TableCell>
                  <TableCell className="text-center text-gray-900 font-medium">{getReportValue(item.no, 2) || item.col3}</TableCell>
                  <TableCell className="text-center text-gray-900 font-medium">{getReportValue(item.no, 3) || item.col4}</TableCell>
                  <TableCell className="text-center text-gray-900 font-medium">{getReportValue(item.no, 4) || item.col5}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="text-sm text-gray-600">
              Menampilkan <span className="font-semibold">23</span> dari <span className="font-semibold">23</span> item check
            </p>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700">Persentase (%)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Waktu (HH:MM)</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-purple-600" />
                <span className="text-gray-700">Nilai Numerik</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
