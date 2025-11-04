'use client';

import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, RefreshCw, Download, ZoomIn, TrendingUp, Activity, Users, Truck, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ComposedChart, LabelList } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface DailyReportChartsProps {
  onBack: () => void;
}

// Data untuk grafik Total Realisasi Penyaluran MT
const realisasiData = [
  { date: '1.4', target: 18.17, realisasi: 19.97, persen: 110 },
  { date: '2.4', target: 20.08, realisasi: 22.18, persen: 110 },
  { date: '3.4', target: 20.08, realisasi: 22.18, persen: 110 },
  { date: '4.4', target: 18.42, realisasi: 20.26, persen: 110 },
  { date: '5.4', target: 22.18, realisasi: 24.40, persen: 110 },
  { date: '6.4', target: 22.18, realisasi: 24.40, persen: 110 },
  { date: '7.4', target: 22.18, realisasi: 24.40, persen: 110 },
  { date: '8.4', target: 22.18, realisasi: 24.40, persen: 110 },
  { date: '9.4', target: 31.08, realisasi: 34.62, persen: 111 },
  { date: '10.4', target: 31.08, realisasi: 34.19, persen: 110 },
  { date: '11.4', target: 31.08, realisasi: 34.19, persen: 110 },
  { date: '12.4', target: 31.08, realisasi: 34.19, persen: 110 },
  { date: '13.4', target: 31.08, realisasi: 34.19, persen: 110 },
  { date: '14.4', target: 31.08, realisasi: 28.45, persen: 92 },
  { date: '15.4', target: 31.08, realisasi: 29.17, persen: 94 },
  { date: '16.4', target: 31.08, realisasi: 32.63, persen: 105 },
  { date: '17.4', target: 20.72, realisasi: 22.88, persen: 110 },
  { date: '18.4', target: 20.72, realisasi: 21.88, persen: 106 },
  { date: '19.4', target: 20.72, realisasi: 22.88, persen: 110 },
  { date: '20.4', target: 20.72, realisasi: 22.79, persen: 110 },
  { date: '21.4', target: 20.72, realisasi: 18.88, persen: 91 },
  { date: '22.4', target: 20.72, realisasi: 22.79, persen: 110 },
  { date: '23.4', target: 20.08, realisasi: 22.09, persen: 110 },
  { date: '24.4', target: 20.08, realisasi: 22.09, persen: 110 },
  { date: '25.4', target: 20.08, realisasi: 22.09, persen: 110 },
  { date: '26.4', target: 20.08, realisasi: 22.09, persen: 110 },
  { date: '27.4', target: 20.08, realisasi: 22.09, persen: 110 },
  { date: '28.4', target: 20.08, realisasi: 22.09, persen: 110 },
  { date: '29.4', target: 20.72, realisasi: 22.79, persen: 110 },
  { date: '30.4', target: 20.72, realisasi: 21.48, persen: 104 },
];

// Data untuk grafik MT Operasional
const mtOperasionalData = [
  { date: '1.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
  { date: '2.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
  { date: '3.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
  { date: '4.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
  { date: '5.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
  { date: '6.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
  { date: '7.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
  { date: '8.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
  { date: '9.4', kontrak: 13, beroperasi: 12, tidakBeroperasi: 1, persen: 92 },
  { date: '10.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
  { date: '11.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
  { date: '12.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
  { date: '13.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
  { date: '14.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
  { date: '15.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
  { date: '16.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
  { date: '17.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
  { date: '18.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
  { date: '19.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
  { date: '20.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
  { date: '21.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
  { date: '22.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
  { date: '23.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
  { date: '24.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
  { date: '25.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
  { date: '26.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
  { date: '27.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
  { date: '28.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
  { date: '29.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
  { date: '30.4', kontrak: 13, beroperasi: 13, tidakBeroperasi: 0, persen: 100 },
];

// Data untuk grafik Ketersediaan AMT
const ketersediaanAmtData = [
  { date: '1.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
  { date: '2.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
  { date: '3.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
  { date: '4.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
  { date: '5.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
  { date: '6.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
  { date: '7.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
  { date: '8.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
  { date: '9.4', tersedia: 26, hadir: 25, tidakHadir: 1, persen: 96 },
  { date: '10.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
  { date: '11.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
  { date: '12.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
  { date: '13.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
  { date: '14.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
  { date: '15.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
  { date: '16.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
  { date: '17.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
  { date: '18.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
  { date: '19.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
  { date: '20.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
  { date: '21.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
  { date: '22.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
  { date: '23.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
  { date: '24.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
  { date: '25.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
  { date: '26.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
  { date: '27.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
  { date: '28.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
  { date: '29.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
  { date: '30.4', tersedia: 26, hadir: 26, tidakHadir: 0, persen: 100 },
];

// Data untuk grafik Kehadiran AMT RJBT Detail
const kehadiranAmtDetailData = [
  { region: 'Semarang', kontrak: 341, hadir: 341, tidakHadir: 0, persen: 100 },
  { region: 'Tegal', kontrak: 277, hadir: 277, tidakHadir: 0, persen: 100 },
  { region: 'Cilacap', kontrak: 203, hadir: 197, tidakHadir: 6, persen: 97 },
  { region: 'BOPMALI', kontrak: 127, hadir: 105, tidakHadir: 22, persen: 83 },
  { region: 'CEPK', kontrak: 56, hadir: 52, tidakHadir: 4, persen: 93 },
  { region: 'Kudus', kontrak: 38, hadir: 33, tidakHadir: 5, persen: 87 },
  { region: 'Pekalongan', kontrak: 32, hadir: 6, tidakHadir: 26, persen: 19 },
  { region: 'Purwokerto', kontrak: 25, hadir: 4, tidakHadir: 21, persen: 16 },
];

// Data untuk grafik Operasional MT RJBT Detail
const operasionalMtDetailData = [
  { region: 'Semarang', kontrak: 135, beroperasi: 135, tidakBeroperasi: 0, persen: 100 },
  { region: 'Tegal', kontrak: 109, beroperasi: 109, tidakBeroperasi: 0, persen: 100 },
  { region: 'BOPMALI', kontrak: 77, beroperasi: 59, tidakBeroperasi: 18, persen: 77 },
  { region: 'Cilacap', kontrak: 98, beroperasi: 70, tidakBeroperasi: 28, persen: 71 },
  { region: 'CEPK', kontrak: 101, beroperasi: 79, tidakBeroperasi: 22, persen: 78 },
  { region: 'Kudus', kontrak: 54, beroperasi: 23, tidakBeroperasi: 31, persen: 43 },
  { region: 'Pekalongan', kontrak: 42, beroperasi: 6, tidakBeroperasi: 36, persen: 14 },
  { region: 'Purwokerto', kontrak: 31, beroperasi: 3, tidakBeroperasi: 28, persen: 10 },
];

// Custom label component for percentage
const renderCustomLabel = (props: any) => {
  const { x, y, width, value } = props;
  return (
    <text 
      x={x + width / 2} 
      y={y - 5} 
      fill="#fff" 
      textAnchor="middle" 
      fontSize={10}
      fontWeight="600"
    >
      {value}%
    </text>
  );
};

export function DailyReportCharts({ onBack }: DailyReportChartsProps) {
  const [periode, setPeriode] = useState('April 2024');
  const [tampilan, setTampilan] = useState('Semua Grafik');
  const [tipeData, setTipeData] = useState('Harian');
  const [namaFilter, setNamaFilter] = useState('19.000 KL');

  const handleRefresh = () => {
    console.log('Refreshing data...');
  };

  const handleExportAll = () => {
    console.log('Exporting all charts...');
  };

  const handleExportChart = (chartName: string) => {
    console.log(`Exporting ${chartName}...`);
  };

  return (
    <div className="p-6 max-w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Laporan Harian
        </Button>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Grafik Laporan Harian</h1>
            <p className="text-gray-600 mt-1">
              Visualisasi data operasional dalam bentuk grafik interaktif
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-sm font-medium text-blue-700">5 Charts Active</span>
            </div>
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center gap-2 bg-white"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </Button>
            <Button
              onClick={handleExportAll}
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white"
            >
              <Download className="w-4 h-4" />
              Export All
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Periode</span>
            <Select value={periode} onValueChange={setPeriode}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="April 2024">April 2024</SelectItem>
                <SelectItem value="Maret 2024">Maret 2024</SelectItem>
                <SelectItem value="Februari 2024">Februari 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Tampilan</span>
            <Select value={tampilan} onValueChange={setTampilan}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua Grafik">Semua Grafik</SelectItem>
                <SelectItem value="Realisasi">Realisasi</SelectItem>
                <SelectItem value="Operasional">Operasional</SelectItem>
                <SelectItem value="Kehadiran">Kehadiran</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Tipe Data</span>
            <Select value={tipeData} onValueChange={setTipeData}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Harian">Harian</SelectItem>
                <SelectItem value="Mingguan">Mingguan</SelectItem>
                <SelectItem value="Bulanan">Bulanan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" className="bg-white">
            Chart Settings
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Total Realisasi</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">6,240 KL</h2>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+5.2% vs target</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">MT Operasional</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">432 units</h2>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <span>66.8% utilization</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">AMT Hadir</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">1,015 org</h2>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <span>92.4% attendance</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Efisiensi</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">98.5%</h2>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <Award className="w-4 h-4" />
                <span>Above target</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Chart 1: Total Realisasi Penyaluran MT Industri Patra Logistik */}
      <Card className="bg-[#4a4a4a] shadow-sm border border-gray-600 mb-8 overflow-hidden">
        <div className="p-4 border-b border-gray-600 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Select value={namaFilter} onValueChange={setNamaFilter}>
              <SelectTrigger className="w-[140px] bg-gray-600 text-white border-gray-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="19.000 KL">Nama: 19.000 KL</SelectItem>
                <SelectItem value="20.000 KL">Nama: 20.000 KL</SelectItem>
                <SelectItem value="21.000 KL">Nama: 21.000 KL</SelectItem>
              </SelectContent>
            </Select>
            <h3 className="font-semibold text-white">
              Total Realisasi Penyaluran MT Industri Patra Logistik
            </h3>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportChart('Realisasi Penyaluran')}
              className="bg-gray-600 text-white border-gray-500 hover:bg-gray-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gray-600 text-white border-gray-500 hover:bg-gray-700"
            >
              <ZoomIn className="w-4 h-4 mr-2" />
              Zoom
            </Button>
          </div>
        </div>

        <div className="p-6 bg-[#4a4a4a]">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={realisasiData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#ffffff', fontSize: 11 }}
                stroke="#ffffff"
                axisLine={{ stroke: '#ffffff' }}
              />
              <YAxis 
                tick={{ fill: '#ffffff', fontSize: 11 }}
                stroke="#ffffff"
                axisLine={{ stroke: '#ffffff' }}
                domain={[0, 40]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#2d2d2d', 
                  border: '1px solid #555', 
                  borderRadius: '4px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="target" fill="#5b7fa8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="realisasi" fill="#ff8c42" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="persen" content={renderCustomLabel} />
              </Bar>
              <Line 
                type="monotone" 
                dataKey="persen" 
                stroke="#ffd700" 
                strokeWidth={2}
                dot={{ fill: '#ffd700', r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Data Table */}
          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-600 hover:bg-[#4a4a4a]">
                  <TableHead className="text-white bg-[#4a4a4a]">Metric</TableHead>
                  {realisasiData.map((item) => (
                    <TableHead key={item.date} className="text-white text-center bg-[#4a4a4a] min-w-[60px]">
                      {item.date}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-gray-600 hover:bg-[#525252]">
                  <TableCell className="text-white font-medium">LO Plan (KL)</TableCell>
                  {realisasiData.map((item, idx) => (
                    <TableCell key={idx} className="text-white text-center">
                      {item.target}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow className="border-gray-600 hover:bg-[#525252]">
                  <TableCell className="text-white font-medium">LO Realisasi (KL)</TableCell>
                  {realisasiData.map((item, idx) => (
                    <TableCell key={idx} className="text-white text-center">
                      {item.realisasi}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow className="border-gray-600 hover:bg-[#525252]">
                  <TableCell className="text-white font-medium">%</TableCell>
                  {realisasiData.map((item, idx) => (
                    <TableCell key={idx} className="text-white text-center">
                      {item.persen}%
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      {/* Chart 2: Realisasi MT Operasional */}
      <Card className="bg-[#4a4a4a] shadow-sm border border-gray-600 mb-8 overflow-hidden">
        <div className="p-4 border-b border-gray-600 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Select value={namaFilter} onValueChange={setNamaFilter}>
              <SelectTrigger className="w-[140px] bg-gray-600 text-white border-gray-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="19.000 KL">Nama: 19.000 KL</SelectItem>
                <SelectItem value="20.000 KL">Nama: 20.000 KL</SelectItem>
              </SelectContent>
            </Select>
            <h3 className="font-semibold text-white">
              Realisasi MT Operasional Milik PT Patra Logistik
            </h3>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportChart('MT Operasional')}
              className="bg-gray-600 text-white border-gray-500 hover:bg-gray-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gray-600 text-white border-gray-500 hover:bg-gray-700"
            >
              <ZoomIn className="w-4 h-4 mr-2" />
              Zoom
            </Button>
          </div>
        </div>

        <div className="p-6 bg-[#4a4a4a]">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={mtOperasionalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#ffffff', fontSize: 11 }}
                stroke="#ffffff"
                axisLine={{ stroke: '#ffffff' }}
              />
              <YAxis 
                tick={{ fill: '#ffffff', fontSize: 11 }}
                stroke="#ffffff"
                axisLine={{ stroke: '#ffffff' }}
                domain={[0, 15]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#2d2d2d', 
                  border: '1px solid #555', 
                  borderRadius: '4px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="kontrak" fill="#5b7fa8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="beroperasi" fill="#ff8c42" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="persen" content={renderCustomLabel} />
              </Bar>
              <Line 
                type="monotone" 
                dataKey="persen" 
                stroke="#ffd700" 
                strokeWidth={2}
                dot={{ fill: '#ffd700', r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Data Table */}
          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-600 hover:bg-[#4a4a4a]">
                  <TableHead className="text-white bg-[#4a4a4a]">Metric</TableHead>
                  {mtOperasionalData.map((item) => (
                    <TableHead key={item.date} className="text-white text-center bg-[#4a4a4a] min-w-[60px]">
                      {item.date}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-gray-600 hover:bg-[#525252]">
                  <TableCell className="text-white font-medium">MT Kontrak</TableCell>
                  {mtOperasionalData.map((item, idx) => (
                    <TableCell key={idx} className="text-white text-center">
                      {item.kontrak}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow className="border-gray-600 hover:bg-[#525252]">
                  <TableCell className="text-white font-medium">MT Beroperasi</TableCell>
                  {mtOperasionalData.map((item, idx) => (
                    <TableCell key={idx} className="text-white text-center">
                      {item.beroperasi}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow className="border-gray-600 hover:bg-[#525252]">
                  <TableCell className="text-white font-medium">%</TableCell>
                  {mtOperasionalData.map((item, idx) => (
                    <TableCell key={idx} className="text-white text-center">
                      {item.persen}%
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      {/* Chart 3: Ketersediaan AMT */}
      <Card className="bg-[#4a4a4a] shadow-sm border border-gray-600 mb-8 overflow-hidden">
        <div className="p-4 border-b border-gray-600 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Select value={namaFilter} onValueChange={setNamaFilter}>
              <SelectTrigger className="w-[140px] bg-gray-600 text-white border-gray-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="19.000 KL">Nama: 19.000 KL</SelectItem>
                <SelectItem value="20.000 KL">Nama: 20.000 KL</SelectItem>
              </SelectContent>
            </Select>
            <h3 className="font-semibold text-white">
              Ketersediaan AMT
            </h3>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportChart('Ketersediaan AMT')}
              className="bg-gray-600 text-white border-gray-500 hover:bg-gray-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gray-600 text-white border-gray-500 hover:bg-gray-700"
            >
              <ZoomIn className="w-4 h-4 mr-2" />
              Zoom
            </Button>
          </div>
        </div>

        <div className="p-6 bg-[#4a4a4a]">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={ketersediaanAmtData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#ffffff', fontSize: 11 }}
                stroke="#ffffff"
                axisLine={{ stroke: '#ffffff' }}
              />
              <YAxis 
                tick={{ fill: '#ffffff', fontSize: 11 }}
                stroke="#ffffff"
                axisLine={{ stroke: '#ffffff' }}
                domain={[0, 30]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#2d2d2d', 
                  border: '1px solid #555', 
                  borderRadius: '4px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="tersedia" fill="#5b7fa8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="hadir" fill="#ff8c42" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="persen" content={renderCustomLabel} />
              </Bar>
              <Line 
                type="monotone" 
                dataKey="persen" 
                stroke="#ffd700" 
                strokeWidth={2}
                dot={{ fill: '#ffd700', r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Data Table */}
          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-600 hover:bg-[#4a4a4a]">
                  <TableHead className="text-white bg-[#4a4a4a]">Metric</TableHead>
                  {ketersediaanAmtData.map((item) => (
                    <TableHead key={item.date} className="text-white text-center bg-[#4a4a4a] min-w-[60px]">
                      {item.date}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-gray-600 hover:bg-[#525252]">
                  <TableCell className="text-white font-medium">AMT Tersedia</TableCell>
                  {ketersediaanAmtData.map((item, idx) => (
                    <TableCell key={idx} className="text-white text-center">
                      {item.tersedia}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow className="border-gray-600 hover:bg-[#525252]">
                  <TableCell className="text-white font-medium">AMT Hadir</TableCell>
                  {ketersediaanAmtData.map((item, idx) => (
                    <TableCell key={idx} className="text-white text-center">
                      {item.hadir}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow className="border-gray-600 hover:bg-[#525252]">
                  <TableCell className="text-white font-medium">%</TableCell>
                  {ketersediaanAmtData.map((item, idx) => (
                    <TableCell key={idx} className="text-white text-center">
                      {item.persen}%
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      {/* Chart 4: Grafik Kehadiran AMT RJBT Detail */}
      <Card className="bg-[#4a4a4a] shadow-sm border border-gray-600 mb-8 overflow-hidden">
        <div className="p-4 border-b border-gray-600 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Select value={namaFilter} onValueChange={setNamaFilter}>
              <SelectTrigger className="w-[140px] bg-gray-600 text-white border-gray-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="19.000 KL">Nama: 19.000 KL</SelectItem>
                <SelectItem value="20.000 KL">Nama: 20.000 KL</SelectItem>
              </SelectContent>
            </Select>
            <h3 className="font-semibold text-white">
              Grafik Kehadiran AMT RJBT Tanggal 30.04.2024
            </h3>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportChart('Kehadiran AMT Detail')}
              className="bg-gray-600 text-white border-gray-500 hover:bg-gray-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gray-600 text-white border-gray-500 hover:bg-gray-700"
            >
              <ZoomIn className="w-4 h-4 mr-2" />
              Zoom
            </Button>
          </div>
        </div>

        <div className="p-6 bg-[#4a4a4a]">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={kehadiranAmtDetailData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" vertical={false} />
              <XAxis 
                dataKey="region" 
                tick={{ fill: '#ffffff', fontSize: 11 }}
                stroke="#ffffff"
                axisLine={{ stroke: '#ffffff' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fill: '#ffffff', fontSize: 11 }}
                stroke="#ffffff"
                axisLine={{ stroke: '#ffffff' }}
                domain={[0, 400]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#2d2d2d', 
                  border: '1px solid #555', 
                  borderRadius: '4px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="kontrak" fill="#5b7fa8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="hadir" fill="#ff8c42" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="persen" content={renderCustomLabel} />
              </Bar>
              <Line 
                type="monotone" 
                dataKey="persen" 
                stroke="#ffd700" 
                strokeWidth={2}
                dot={{ fill: '#ffd700', r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Data Table */}
          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-600 hover:bg-[#4a4a4a]">
                  <TableHead className="text-white bg-[#4a4a4a]">Metric</TableHead>
                  {kehadiranAmtDetailData.map((item) => (
                    <TableHead key={item.region} className="text-white text-center bg-[#4a4a4a] min-w-[100px]">
                      {item.region}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-gray-600 hover:bg-[#525252]">
                  <TableCell className="text-white font-medium">AMT Kontrak</TableCell>
                  {kehadiranAmtDetailData.map((item, idx) => (
                    <TableCell key={idx} className="text-white text-center">
                      {item.kontrak}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow className="border-gray-600 hover:bg-[#525252]">
                  <TableCell className="text-white font-medium">AMT Hadir</TableCell>
                  {kehadiranAmtDetailData.map((item, idx) => (
                    <TableCell key={idx} className="text-white text-center">
                      {item.hadir}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow className="border-gray-600 hover:bg-[#525252]">
                  <TableCell className="text-white font-medium">%</TableCell>
                  {kehadiranAmtDetailData.map((item, idx) => (
                    <TableCell key={idx} className="text-white text-center">
                      {item.persen}%
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      {/* Chart 5: Grafik Operasional Mobil Tangki RJBT Detail */}
      <Card className="bg-[#4a4a4a] shadow-sm border border-gray-600 mb-8 overflow-hidden">
        <div className="p-4 border-b border-gray-600 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Select value={namaFilter} onValueChange={setNamaFilter}>
              <SelectTrigger className="w-[140px] bg-gray-600 text-white border-gray-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="19.000 KL">Nama: 19.000 KL</SelectItem>
                <SelectItem value="20.000 KL">Nama: 20.000 KL</SelectItem>
              </SelectContent>
            </Select>
            <h3 className="font-semibold text-white">
              Grafik Operasional Mobil Tangki RJBT TGL 30.04.2024
            </h3>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportChart('Operasional MT Detail')}
              className="bg-gray-600 text-white border-gray-500 hover:bg-gray-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gray-600 text-white border-gray-500 hover:bg-gray-700"
            >
              <ZoomIn className="w-4 h-4 mr-2" />
              Zoom
            </Button>
          </div>
        </div>

        <div className="p-6 bg-[#4a4a4a]">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={operasionalMtDetailData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" vertical={false} />
              <XAxis 
                dataKey="region" 
                tick={{ fill: '#ffffff', fontSize: 11 }}
                stroke="#ffffff"
                axisLine={{ stroke: '#ffffff' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fill: '#ffffff', fontSize: 11 }}
                stroke="#ffffff"
                axisLine={{ stroke: '#ffffff' }}
                domain={[0, 150]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#2d2d2d', 
                  border: '1px solid #555', 
                  borderRadius: '4px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="kontrak" fill="#5b7fa8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="beroperasi" fill="#ff8c42" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="persen" content={renderCustomLabel} />
              </Bar>
              <Line 
                type="monotone" 
                dataKey="persen" 
                stroke="#ffd700" 
                strokeWidth={2}
                dot={{ fill: '#ffd700', r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Data Table */}
          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-600 hover:bg-[#4a4a4a]">
                  <TableHead className="text-white bg-[#4a4a4a]">Metric</TableHead>
                  {operasionalMtDetailData.map((item) => (
                    <TableHead key={item.region} className="text-white text-center bg-[#4a4a4a] min-w-[100px]">
                      {item.region}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-gray-600 hover:bg-[#525252]">
                  <TableCell className="text-white font-medium">MT Kontrak</TableCell>
                  {operasionalMtDetailData.map((item, idx) => (
                    <TableCell key={idx} className="text-white text-center">
                      {item.kontrak}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow className="border-gray-600 hover:bg-[#525252]">
                  <TableCell className="text-white font-medium">MT Beroperasi</TableCell>
                  {operasionalMtDetailData.map((item, idx) => (
                    <TableCell key={idx} className="text-white text-center">
                      {item.beroperasi}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow className="border-gray-600 hover:bg-[#525252]">
                  <TableCell className="text-white font-medium">%</TableCell>
                  {operasionalMtDetailData.map((item, idx) => (
                    <TableCell key={idx} className="text-white text-center">
                      {item.persen}%
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
}
