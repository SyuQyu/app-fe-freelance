'use client';

import { Download } from 'lucide-react';
import { Button } from './ui/button';

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

interface ExcelExportSPPProps {
  data: SPPDocument[];
}

export function ExcelExportSPP({ data }: ExcelExportSPPProps) {
  const exportToExcel = () => {
    // Create CSV content
    const headers = [
      'No',
      'Nomor SPP',
      'Tanggal SPP',
      'Nama Project',
      'Kendaraan',
      'Driver',
      'Jumlah Pemesanan (L)',
      'Jenis Produk',
      'Pemesan',
      'Tujuan',
      'No Shipment',
      'Jam Keluar',
      'Stock Terima BBM (L)',
      'No Segel',
      'Status',
      'Nama File',
      'Tanggal Upload',
      'Upload By',
      'Approved By',
      'Notes'
    ];
    
    const csvContent = [
      headers.join(','),
      ...data.map((doc, index) => [
        index + 1,
        doc.nomorSPP,
        doc.tanggalSPP,
        `"${doc.namaProject}"`,
        doc.kendaraan,
        doc.driver,
        doc.jumlahPemesanan,
        doc.jenisProduk,
        `"${doc.pemesan}"`,
        `"${doc.tujuan}"`,
        doc.noShipment,
        doc.jamKeluar,
        doc.stockTerimaBBM,
        doc.noSegel,
        doc.status,
        doc.fileName,
        doc.uploadDate,
        doc.uploadedBy,
        doc.approvedBy || '-',
        `"${doc.notes || '-'}"`
      ].join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Daftar_Dokumen_SPP_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button 
      onClick={exportToExcel}
      variant="outline"
      className="flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      Export Excel
    </Button>
  );
}
