'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface DropdownOption {
  id: string;
  value: string;
  label: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DropdownCategory {
  id: string;
  name: string;
  description: string;
  options: DropdownOption[];
}

interface DropdownSettingsContextType {
  categories: DropdownCategory[];
  getOptions: (categoryId: string) => DropdownOption[];
  addOption: (categoryId: string, value: string, label: string) => void;
  updateOption: (categoryId: string, optionId: string, value: string, label: string) => void;
  deleteOption: (categoryId: string, optionId: string) => void;
  toggleOption: (categoryId: string, optionId: string) => void;
}

const DropdownSettingsContext = createContext<DropdownSettingsContextType | undefined>(undefined);

const defaultCategories: DropdownCategory[] = [
  {
    id: 'regional',
    name: 'Regional',
    description: 'Regional area untuk kendaraan (MOR I - VIII)',
    options: [
      { id: '1', value: 'MOR I', label: 'MOR I', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '2', value: 'MOR II', label: 'MOR II', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '3', value: 'MOR III', label: 'MOR III', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '4', value: 'MOR IV', label: 'MOR IV', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '5', value: 'MOR V', label: 'MOR V', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '6', value: 'MOR VI', label: 'MOR VI', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '7', value: 'MOR VII', label: 'MOR VII', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '8', value: 'MOR VIII', label: 'MOR VIII', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ]
  },
  {
    id: 'jenis-angkutan',
    name: 'Jenis Angkutan',
    description: 'Jenis angkutan kendaraan',
    options: [
      { id: '1', value: 'BBM', label: 'BBM', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '2', value: 'LPG', label: 'LPG', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '3', value: 'BBK', label: 'BBK', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ]
  },
  {
    id: 'jenis-sewa',
    name: 'Jenis Sewa',
    description: 'Jenis sewa kendaraan',
    options: [
      { id: '1', value: 'Sewa', label: 'Sewa', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '2', value: 'Tarif', label: 'Tarif', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ]
  },
  {
    id: 'status-perijinan',
    name: 'Status Perijinan',
    description: 'Status perijinan kendaraan',
    options: [
      { id: '1', value: 'lengkap', label: 'Lengkap', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '2', value: 'proses', label: 'Dalam Proses', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '3', value: 'expired', label: 'Expired', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '4', value: 'tidak-ada', label: 'Tidak Ada', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ]
  },
  {
    id: 'hasil-mcu',
    name: 'Hasil MCU/DDT/B3',
    description: 'Status hasil Medical Check Up, DDT, dan Sertifikat B3',
    options: [
      { id: '1', value: 'Lulus', label: 'Lulus', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '2', value: 'Tidak Lulus', label: 'Tidak Lulus', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '3', value: 'Dalam Proses', label: 'Dalam Proses', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ]
  },
  {
    id: 'merk-head',
    name: 'Merk Head',
    description: 'Merk kendaraan head/kepala',
    options: [
      { id: '1', value: 'Hino', label: 'Hino', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '2', value: 'UD Trucks', label: 'UD Trucks', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '3', value: 'Mercedes-Benz', label: 'Mercedes-Benz', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '4', value: 'Mitsubishi Fuso', label: 'Mitsubishi Fuso', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '5', value: 'Isuzu', label: 'Isuzu', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ]
  },
  {
    id: 'merk-tangki',
    name: 'Merk Tangki',
    description: 'Merk tangki kendaraan',
    options: [
      { id: '1', value: 'Aweco', label: 'Aweco', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '2', value: 'Geluran Adikarya', label: 'Geluran Adikarya', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '3', value: 'Antika Raya', label: 'Antika Raya', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ]
  },
  {
    id: 'type-tangki',
    name: 'Type Tangki',
    description: 'Type tangki kendaraan',
    options: [
      { id: '1', value: 'Rigid', label: 'Rigid', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '2', value: 'Trailer', label: 'Trailer', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ]
  },
  {
    id: 'bahan-tangki',
    name: 'Bahan Tangki',
    description: 'Bahan material tangki',
    options: [
      { id: '1', value: 'carbon steel', label: 'Carbon Steel', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '2', value: 'aluminium alloy', label: 'Aluminium Alloy', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '3', value: 'mild steel', label: 'Mild Steel', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '4', value: 'stainless steel', label: 'Stainless Steel', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ]
  },
  {
    id: 'warna-kendaraan',
    name: 'Warna Kendaraan',
    description: 'Warna kendaraan',
    options: [
      { id: '1', value: 'merah putih', label: 'Merah Putih', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '2', value: 'biru putih', label: 'Biru Putih', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '3', value: 'kuning', label: 'Kuning', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ]
  },
  {
    id: 'kondisi-maintenance',
    name: 'Kondisi Maintenance',
    description: 'Kondisi untuk workflow maintenance',
    options: [
      { id: '1', value: 'Critical', label: 'Critical', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '2', value: 'Non Critical', label: 'Non Critical', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ]
  },
  {
    id: 'perusahaan-asuransi',
    name: 'Perusahaan Asuransi',
    description: 'Daftar perusahaan asuransi',
    options: [
      { id: '1', value: 'PT Asuransi Indonesia', label: 'PT Asuransi Indonesia', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '2', value: 'PT Asuransi Jasa Indonesia', label: 'PT Asuransi Jasa Indonesia', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '3', value: 'PT Asuransi Allianz', label: 'PT Asuransi Allianz', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ]
  },
  {
    id: 'inspection-interior',
    name: 'Inspection Interior Kendaraan',
    description: 'Item pemeriksaan interior kendaraan untuk checklist harian',
    options: [
      { id: '1', value: 'Dashboard & Instrumen', label: 'Dashboard & Instrumen', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '2', value: 'Sabuk Pengaman', label: 'Sabuk Pengaman', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '3', value: 'Klakson', label: 'Klakson', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '4', value: 'Kaca Spion', label: 'Kaca Spion', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '5', value: 'Wiper & Air Wiper', label: 'Wiper & Air Wiper', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '6', value: 'AC/Ventilasi', label: 'AC/Ventilasi', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '7', value: 'Tempat Duduk', label: 'Tempat Duduk', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '8', value: 'Kebersihan Interior', label: 'Kebersihan Interior', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '9', value: 'Aki & Kelistrikan', label: 'Aki & Kelistrikan', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ]
  },
  {
    id: 'inspection-eksterior',
    name: 'Inspection Eksterior Kendaraan',
    description: 'Item pemeriksaan eksterior kendaraan untuk checklist harian',
    options: [
      { id: '1', value: 'Ban & Tekanan Angin', label: 'Ban & Tekanan Angin', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '2', value: 'Rem (Kaki & Tangan)', label: 'Rem (Kaki & Tangan)', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '3', value: 'Lampu Depan & Sein', label: 'Lampu Depan & Sein', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '4', value: 'Lampu Belakang & Sein', label: 'Lampu Belakang & Sein', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '5', value: 'Oli Mesin', label: 'Oli Mesin', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '6', value: 'Air Radiator', label: 'Air Radiator', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '7', value: 'Body/Karoseri', label: 'Body/Karoseri', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '8', value: 'Nomor Polisi & STNK', label: 'Nomor Polisi & STNK', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '9', value: 'Kebersihan Eksterior', label: 'Kebersihan Eksterior', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ]
  },
];

export function DropdownSettingsProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<DropdownCategory[]>(defaultCategories);

  const getOptions = (categoryId: string): DropdownOption[] => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.options.filter(opt => opt.isActive) : [];
  };

  const addOption = (categoryId: string, value: string, label: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        const newOption: DropdownOption = {
          id: (cat.options.length + 1).toString(),
          value,
          label,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        return {
          ...cat,
          options: [...cat.options, newOption]
        };
      }
      return cat;
    }));
  };

  const updateOption = (categoryId: string, optionId: string, value: string, label: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          options: cat.options.map(opt => 
            opt.id === optionId 
              ? { ...opt, value, label, updatedAt: new Date().toISOString() }
              : opt
          )
        };
      }
      return cat;
    }));
  };

  const deleteOption = (categoryId: string, optionId: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          options: cat.options.filter(opt => opt.id !== optionId)
        };
      }
      return cat;
    }));
  };

  const toggleOption = (categoryId: string, optionId: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          options: cat.options.map(opt => 
            opt.id === optionId 
              ? { ...opt, isActive: !opt.isActive, updatedAt: new Date().toISOString() }
              : opt
          )
        };
      }
      return cat;
    }));
  };

  return (
    <DropdownSettingsContext.Provider 
      value={{ 
        categories, 
        getOptions, 
        addOption, 
        updateOption, 
        deleteOption, 
        toggleOption 
      }}
    >
      {children}
    </DropdownSettingsContext.Provider>
  );
}

export function useDropdownSettings() {
  const context = useContext(DropdownSettingsContext);
  if (!context) {
    throw new Error('useDropdownSettings must be used within DropdownSettingsProvider');
  }
  return context;
}
