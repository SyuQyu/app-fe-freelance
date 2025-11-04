# System Settings - Dropdown Management Guide

## 📚 Overview
Sistem Settings memungkinkan admin untuk mengelola semua dropdown options yang ada di seluruh aplikasi secara terpusat.

## 🎯 Fitur Utama
1. **Kelola Dropdown Options** - Tambah, Edit, Hapus opsi
2. **Toggle Status** - Aktifkan/Nonaktifkan opsi tanpa menghapus
3. **Real-time Update** - Perubahan langsung terlihat di semua menu
4. **Kategori Terstruktur** - Dropdown dikelompokkan berdasarkan kategori

## 📋 Kategori Dropdown yang Tersedia

### 1. **Regional**
- Deskripsi: Regional area untuk kendaraan (MOR I - VIII)
- Digunakan di: Master Data Kendaraan MT, Master Data Kendaraan KRP
- Default Options: MOR I, MOR II, MOR III, MOR IV, MOR V, MOR VI, MOR VII, MOR VIII

### 2. **Jenis Angkutan**
- Deskripsi: Jenis angkutan kendaraan
- Digunakan di: Master Data Kendaraan MT
- Default Options: BBM, LPG, BBK

### 3. **Jenis Sewa**
- Deskripsi: Jenis sewa kendaraan
- Digunakan di: Master Data Kendaraan MT
- Default Options: Sewa, Tarif

### 4. **Status Perijinan**
- Deskripsi: Status perijinan kendaraan
- Digunakan di: Master Data Kendaraan MT, Filter
- Default Options: Lengkap, Dalam Proses, Expired, Tidak Ada

### 5. **Hasil MCU/DDT/B3**
- Deskripsi: Status hasil Medical Check Up, DDT, dan Sertifikat B3
- Digunakan di: Master Data Personel (AMT & Driver)
- Default Options: Lulus, Tidak Lulus, Dalam Proses

### 6. **Merk Head**
- Deskripsi: Merk kendaraan head/kepala
- Digunakan di: Master Data Kendaraan MT
- Default Options: Hino, UD Trucks, Mercedes-Benz, Mitsubishi Fuso, Isuzu

### 7. **Merk Tangki**
- Deskripsi: Merk tangki kendaraan
- Digunakan di: Master Data Kendaraan MT
- Default Options: Aweco, Geluran Adikarya, Antika Raya

### 8. **Type Tangki**
- Deskripsi: Type tangki kendaraan
- Digunakan di: Master Data Kendaraan MT
- Default Options: Rigid, Trailer

### 9. **Bahan Tangki**
- Deskripsi: Bahan material tangki
- Digunakan di: Master Data Kendaraan MT
- Default Options: Carbon Steel, Aluminium Alloy, Mild Steel, Stainless Steel

### 10. **Warna Kendaraan**
- Deskripsi: Warna kendaraan
- Digunakan di: Master Data Kendaraan MT
- Default Options: Merah Putih, Biru Putih, Kuning

### 11. **Kondisi Maintenance**
- Deskripsi: Kondisi untuk workflow maintenance
- Digunakan di: Workflow Maintenance (semua jenis)
- Default Options: Critical, Non Critical

### 12. **Perusahaan Asuransi**
- Deskripsi: Daftar perusahaan asuransi
- Digunakan di: Master Data Kendaraan MT
- Default Options: PT Asuransi Indonesia, PT Asuransi Jasa Indonesia, PT Asuransi Allianz

### 13. **Inspection Interior Kendaraan**
- Deskripsi: Item pemeriksaan interior kendaraan untuk checklist harian
- Digunakan di: Inspection Kendaraan, Dispatcher Inspection
- Default Options: Dashboard & Instrumen, Sabuk Pengaman, Klakson, Kaca Spion, Wiper & Air Wiper, AC/Ventilasi, Tempat Duduk, Kebersihan Interior, Aki & Kelistrikan

### 14. **Inspection Eksterior Kendaraan**
- Deskripsi: Item pemeriksaan eksterior kendaraan untuk checklist harian
- Digunakan di: Inspection Kendaraan, Dispatcher Inspection
- Default Options: Ban & Tekanan Angin, Rem (Kaki & Tangan), Lampu Depan & Sein, Lampu Belakang & Sein, Oli Mesin, Air Radiator, Body/Karoseri, Nomor Polisi & STNK, Kebersihan Eksterior

## 🚀 Cara Menggunakan

### Mengakses System Settings
1. Klik menu **"System Settings"** di sidebar bawah
2. Pilih kategori dropdown yang ingin dikelola di panel kiri
3. Lihat dan kelola opsi di panel kanan

### Menambah Opsi Baru
1. Pilih kategori dropdown
2. Klik tombol **"Tambah Opsi"**
3. Isi **Value** (untuk sistem/database)
4. Isi **Label** (untuk tampilan user)
5. Klik **"Simpan"**

**Contoh:**
- Value: `MOR IX`
- Label: `MOR IX`

### Mengedit Opsi
1. Klik icon **Edit (pensil)** pada baris opsi
2. Ubah Value atau Label
3. Klik **"Update"**

### Menghapus Opsi
1. Klik icon **Trash (sampah)** pada baris opsi
2. Konfirmasi penghapusan

⚠️ **Warning:** Menghapus opsi yang sedang digunakan dapat menyebabkan data tidak konsisten!

### Aktif/Nonaktifkan Opsi
1. Klik icon **Eye/EyeOff** pada baris opsi
2. Opsi yang non-aktif tidak akan muncul di dropdown
3. Data lama dengan opsi non-aktif tetap tersimpan

## 💻 Implementasi untuk Developer

### 1. Import Context di Komponen
```tsx
import { useDropdownSettings } from './DropdownSettingsContext';
```

### 2. Gunakan Hook di Komponen
```tsx
function MyComponent() {
  const { getOptions } = useDropdownSettings();
  
  // Get options untuk kategori tertentu
  const regionalOptions = getOptions('regional');
  
  return (
    <Select>
      <SelectContent>
        {regionalOptions.map((option) => (
          <SelectItem key={option.id} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

### 3. Kategori ID yang Tersedia
- `regional` - Regional MOR
- `jenis-angkutan` - Jenis Angkutan
- `jenis-sewa` - Jenis Sewa
- `status-perijinan` - Status Perijinan
- `hasil-mcu` - Hasil MCU/DDT/B3
- `merk-head` - Merk Head
- `merk-tangki` - Merk Tangki
- `type-tangki` - Type Tangki
- `bahan-tangki` - Bahan Tangki
- `warna-kendaraan` - Warna Kendaraan
- `kondisi-maintenance` - Kondisi Maintenance
- `perusahaan-asuransi` - Perusahaan Asuransi
- `inspection-interior` - Inspection Interior Kendaraan
- `inspection-eksterior` - Inspection Eksterior Kendaraan

### 4. Menambah Kategori Baru
Edit file `/components/DropdownSettingsContext.tsx`:

```tsx
const defaultCategories: DropdownCategory[] = [
  // ... existing categories
  {
    id: 'kategori-baru',
    name: 'Nama Kategori',
    description: 'Deskripsi kategori',
    options: [
      { 
        id: '1', 
        value: 'value1', 
        label: 'Label 1', 
        isActive: true, 
        createdAt: '2024-01-01', 
        updatedAt: '2024-01-01' 
      },
    ]
  }
];
```

## 📊 Best Practices

### ✅ Do's
- Gunakan naming convention yang konsisten untuk value
- Buat label yang user-friendly dan jelas
- Test perubahan di development sebelum production
- Backup data sebelum menghapus opsi
- Nonaktifkan opsi daripada menghapus jika masih digunakan

### ❌ Don'ts
- Jangan hapus opsi yang sedang digunakan di data aktif
- Jangan ubah value yang sudah ada di database
- Jangan buat duplicate value dalam satu kategori
- Jangan gunakan spasi berlebihan di value

## 🔄 Migration dari Hardcoded ke Settings

### Before:
```tsx
<Select>
  <SelectContent>
    <SelectItem value="MOR I">MOR I</SelectItem>
    <SelectItem value="MOR II">MOR II</SelectItem>
  </SelectContent>
</Select>
```

### After:
```tsx
const { getOptions } = useDropdownSettings();

<Select>
  <SelectContent>
    {getOptions('regional').map((option) => (
      <SelectItem key={option.id} value={option.value}>
        {option.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

## 📝 Notes
- Perubahan dropdown options bersifat real-time untuk semua user
- Data yang sudah ada dengan value lama tetap valid
- Sistem ini menggunakan Context API untuk state management
- Setiap perubahan akan ter-track dengan timestamp

## 🆘 Troubleshooting

### Problem: Opsi tidak muncul di dropdown
**Solution:** 
- Check apakah opsi dalam status "Aktif"
- Pastikan kategori ID benar
- Refresh halaman

### Problem: Perubahan tidak tersimpan
**Solution:**
- Check koneksi internet
- Check browser console untuk error
- Clear browser cache

### Problem: Duplicate options
**Solution:**
- Hapus salah satu opsi duplicate
- Atau edit untuk membedakan value-nya

---

## 📞 Support
Jika ada pertanyaan atau masalah, hubungi tim development.

**Last Updated:** November 2024
