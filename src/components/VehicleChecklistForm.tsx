import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Calendar, Truck, User, Save, Printer } from 'lucide-react';
import exampleImage from 'figma:asset/ae67a0fdc3a802d2bad6d56b28f4b975b1ee0579.png';
import { useDropdownSettings } from './DropdownSettingsContext';

interface ChecklistItem {
  id: number;
  item: string;
  kondisi: 'Baik' | 'Rusak' | '';
  keterangan: string;
}

interface ChecklistForm {
  namaPengemudi: string;
  nomorPolisi: string;
  jenisKendaraan: string;
  tanggal: string;
  jam: string;
  itemsInterior: ChecklistItem[];
  itemsEksterior: ChecklistItem[];
  keteranganTambahan: string;
}

interface VehicleChecklistFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ChecklistForm) => void;
}

export function VehicleChecklistForm({ isOpen, onClose, onSave }: VehicleChecklistFormProps) {
  const { getOptions } = useDropdownSettings();
  
  // Sample data from Master Data Supir
  const driversList = [
    { id: '1', name: 'Budi Santoso', employeeId: 'DRV001' },
    { id: '2', name: 'Agus Prasetyo', employeeId: 'DRV002' },
    { id: '3', name: 'Joko Widodo', employeeId: 'DRV003' },
    { id: '4', name: 'Rudi Hartono', employeeId: 'DRV004' },
    { id: '5', name: 'Andi Wijaya', employeeId: 'DRV005' }
  ];

  // Sample data from Master Data Kendaraan KRP
  const vehiclesList = [
    { id: '1', plateNumber: 'B 1234 ABC', type: 'Toyota Avanza' },
    { id: '2', plateNumber: 'B 5678 DEF', type: 'Daihatsu Xenia' },
    { id: '3', plateNumber: 'B 9012 GHI', type: 'Toyota Innova' },
    { id: '4', plateNumber: 'R 1234 AB', type: 'Toyota Hilux' },
    { id: '5', plateNumber: 'H 5678 CD', type: 'Isuzu Elf' }
  ];

  // Load inspection items from settings
  const getInspectionItems = (categoryId: string) => {
    const options = getOptions(categoryId);
    return options.map((opt, index) => ({
      id: index + 1,
      item: opt.label,
      kondisi: '' as 'Baik' | 'Rusak' | '',
      keterangan: ''
    }));
  };

  const [formData, setFormData] = useState<ChecklistForm>({
    namaPengemudi: '',
    nomorPolisi: '',
    jenisKendaraan: '',
    tanggal: new Date().toISOString().split('T')[0],
    jam: new Date().toTimeString().slice(0, 5),
    itemsInterior: getInspectionItems('inspection-interior'),
    itemsEksterior: getInspectionItems('inspection-eksterior'),
    keteranganTambahan: ''
  });

  // Update items when context changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      itemsInterior: getInspectionItems('inspection-interior'),
      itemsEksterior: getInspectionItems('inspection-eksterior')
    }));
  }, [getOptions]);

  const updateFormField = (field: keyof ChecklistForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateChecklistItem = (category: 'interior' | 'eksterior', id: number, field: keyof ChecklistItem, value: any) => {
    const itemsKey = category === 'interior' ? 'itemsInterior' : 'itemsEksterior';
    
    setFormData(prev => ({
      ...prev,
      [itemsKey]: prev[itemsKey].map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
    // Reset form
    setFormData({
      namaPengemudi: '',
      nomorPolisi: '',
      jenisKendaraan: '',
      tanggal: new Date().toISOString().split('T')[0],
      jam: new Date().toTimeString().slice(0, 5),
      itemsInterior: getInspectionItems('inspection-interior'),
      itemsEksterior: getInspectionItems('inspection-eksterior'),
      keteranganTambahan: ''
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                Form Checklist Harian MT
              </DialogTitle>
              <p className="text-gray-600">Inspection harian kendaraan untuk memastikan keamanan dan kelayakan operasional</p>
            </div>
            <div className="flex items-center gap-2">
              <img 
                src={exampleImage} 
                alt="Pertamina Logo" 
                className="h-12 object-contain"
              />
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="namaPengemudi" className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4" />
                Nama Pengemudi
              </Label>
              <Select value={formData.namaPengemudi} onValueChange={(value) => updateFormField('namaPengemudi', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih pengemudi" />
                </SelectTrigger>
                <SelectContent>
                  {driversList.map(driver => (
                    <SelectItem key={driver.id} value={driver.name}>
                      {driver.name} ({driver.employeeId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="nomorPolisi" className="flex items-center gap-2 mb-2">
                <Truck className="w-4 h-4" />
                Nomor Polisi
              </Label>
              <Select value={formData.nomorPolisi} onValueChange={(value) => updateFormField('nomorPolisi', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih nomor polisi" />
                </SelectTrigger>
                <SelectContent>
                  {vehiclesList.map(vehicle => (
                    <SelectItem key={vehicle.id} value={vehicle.plateNumber}>
                      {vehicle.plateNumber} - {vehicle.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="jenisKendaraan" className="mb-2 block">Jenis Kendaraan</Label>
              <Input
                id="jenisKendaraan"
                value={formData.jenisKendaraan}
                onChange={(e) => updateFormField('jenisKendaraan', e.target.value)}
                placeholder="Masukkan jenis kendaraan"
              />
            </div>
            
            <div>
              <Label htmlFor="tanggalJam" className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4" />
                Tanggal/Jam
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) => updateFormField('tanggal', e.target.value)}
                />
                <Input
                  type="time"
                  value={formData.jam}
                  onChange={(e) => updateFormField('jam', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Checklist Tables - Interior & Eksterior */}
          <div className="space-y-6">
            {/* Interior Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-6 bg-blue-600 rounded"></div>
                <h3 className="text-lg font-semibold text-gray-900">Pengecekan Interior</h3>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-blue-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-3 font-medium text-gray-900 w-16">No</th>
                      <th className="text-left p-3 font-medium text-gray-900">Item Pengecekan Interior</th>
                      <th className="text-left p-3 font-medium text-gray-900 w-40">Kondisi</th>
                      <th className="text-left p-3 font-medium text-gray-900">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.itemsInterior.map((item, index) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 text-gray-700">{item.id}</td>
                        <td className="p-3 text-gray-900">{item.item}</td>
                        <td className="p-3">
                          <Select 
                            value={item.kondisi} 
                            onValueChange={(value) => updateChecklistItem('interior', item.id, 'kondisi', value as 'Baik' | 'Rusak')}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Pilih kondisi" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Baik">Baik</SelectItem>
                              <SelectItem value="Rusak">Rusak</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-3">
                          <Input
                            value={item.keterangan}
                            onChange={(e) => updateChecklistItem('interior', item.id, 'keterangan', e.target.value)}
                            placeholder="Masukkan keterangan..."
                            className="w-full"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Eksterior Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-6 bg-green-600 rounded"></div>
                <h3 className="text-lg font-semibold text-gray-900">Pengecekan Eksterior</h3>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-green-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-3 font-medium text-gray-900 w-16">No</th>
                      <th className="text-left p-3 font-medium text-gray-900">Item Pengecekan Eksterior</th>
                      <th className="text-left p-3 font-medium text-gray-900 w-40">Kondisi</th>
                      <th className="text-left p-3 font-medium text-gray-900">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.itemsEksterior.map((item, index) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 text-gray-700">{item.id}</td>
                        <td className="p-3 text-gray-900">{item.item}</td>
                        <td className="p-3">
                          <Select 
                            value={item.kondisi} 
                            onValueChange={(value) => updateChecklistItem('eksterior', item.id, 'kondisi', value as 'Baik' | 'Rusak')}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Pilih kondisi" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Baik">Baik</SelectItem>
                              <SelectItem value="Rusak">Rusak</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-3">
                          <Input
                            value={item.keterangan}
                            onChange={(e) => updateChecklistItem('eksterior', item.id, 'keterangan', e.target.value)}
                            placeholder="Masukkan keterangan..."
                            className="w-full"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="keteranganTambahan" className="mb-2 block">Keterangan Tambahan :</Label>
            <Textarea
              id="keteranganTambahan"
              value={formData.keteranganTambahan}
              onChange={(e) => updateFormField('keteranganTambahan', e.target.value)}
              placeholder="Masukkan keterangan tambahan jika diperlukan..."
              rows={3}
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4" />
              Simpan Checklist
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}