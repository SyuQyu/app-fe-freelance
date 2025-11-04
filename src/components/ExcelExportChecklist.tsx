'use client';

import { Download } from 'lucide-react';
import { Button } from './ui/button';

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

interface ExcelExportChecklistProps {
  data: VehicleCheckRecord[];
}

export function ExcelExportChecklist({ data }: ExcelExportChecklistProps) {
  const exportToExcel = () => {
    // Create CSV content
    const headers = ['No', 'Brand', 'No Kendaraan', 'Waktu Pengecekan', 'Check By', 'Status', 'Status Selesai', 'Approved By', 'Keterangan'];
    const csvContent = [
      headers.join(','),
      ...data.map((record, index) => [
        index + 1,
        record.brand,
        record.nomorKendaraan,
        record.waktuPengecekan,
        record.checkBy,
        record.status,
        record.statusSelesai,
        record.approvedBy,
        record.keterangan || '-'
      ].join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Checklist_Harian_MT_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button 
      onClick={exportToExcel}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
    >
      <Download className="w-4 h-4" />
      Export Excel
    </Button>
  );
}
