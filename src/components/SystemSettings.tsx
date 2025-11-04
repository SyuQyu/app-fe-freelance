import { useState } from 'react';
import { Settings, Plus, Edit, Trash2, Eye, EyeOff, Search, Save, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useDropdownSettings, DropdownOption } from './DropdownSettingsContext';
import { toast } from 'sonner@2.0.3';

export function SystemSettings() {
  const { categories, getOptions, addOption, updateOption, deleteOption, toggleOption } = useDropdownSettings();
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<DropdownOption | null>(null);
  const [formValue, setFormValue] = useState('');
  const [formLabel, setFormLabel] = useState('');

  const currentCategory = categories.find(c => c.id === selectedCategory);
  const allOptions = currentCategory?.options || [];
  
  const filteredOptions = allOptions.filter(opt => 
    opt.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOption = () => {
    if (!formValue || !formLabel) {
      toast.error('Error', {
        description: 'Value dan Label harus diisi'
      });
      return;
    }

    addOption(selectedCategory, formValue, formLabel);
    toast.success('Berhasil', {
      description: `Opsi "${formLabel}" berhasil ditambahkan`
    });
    
    setFormValue('');
    setFormLabel('');
    setIsAddDialogOpen(false);
  };

  const handleUpdateOption = () => {
    if (!editingOption || !formValue || !formLabel) {
      toast.error('Error', {
        description: 'Value dan Label harus diisi'
      });
      return;
    }

    updateOption(selectedCategory, editingOption.id, formValue, formLabel);
    toast.success('Berhasil', {
      description: `Opsi "${formLabel}" berhasil diupdate`
    });
    
    setEditingOption(null);
    setFormValue('');
    setFormLabel('');
    setIsEditDialogOpen(false);
  };

  const handleDeleteOption = (optionId: string, optionLabel: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus opsi "${optionLabel}"?`)) {
      deleteOption(selectedCategory, optionId);
      toast.success('Berhasil', {
        description: `Opsi "${optionLabel}" berhasil dihapus`
      });
    }
  };

  const handleToggleStatus = (optionId: string, optionLabel: string, currentStatus: boolean) => {
    toggleOption(selectedCategory, optionId);
    toast.success('Berhasil', {
      description: `Opsi "${optionLabel}" ${currentStatus ? 'dinonaktifkan' : 'diaktifkan'}`
    });
  };

  const openEditDialog = (option: DropdownOption) => {
    setEditingOption(option);
    setFormValue(option.value);
    setFormLabel(option.label);
    setIsEditDialogOpen(true);
  };

  const openAddDialog = () => {
    setFormValue('');
    setFormLabel('');
    setIsAddDialogOpen(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-600">Kelola dropdown options untuk semua menu</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Category List - Sidebar */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kategori Dropdown</CardTitle>
              <CardDescription>Pilih kategori untuk dikelola</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-l-4 ${
                      selectedCategory === category.id 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-transparent'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{category.name}</div>
                    <div className="text-sm text-gray-600">{category.options.length} opsi</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Options Management */}
        <div className="col-span-9">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{currentCategory?.name}</CardTitle>
                  <CardDescription>{currentCategory?.description}</CardDescription>
                </div>
                <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Opsi
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Cari opsi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-600 mb-1">Total Opsi</p>
                  <p className="text-2xl font-bold text-blue-900">{allOptions.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-green-600 mb-1">Aktif</p>
                  <p className="text-2xl font-bold text-green-900">
                    {allOptions.filter(o => o.isActive).length}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Non-Aktif</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {allOptions.filter(o => !o.isActive).length}
                  </p>
                </div>
              </div>

              {/* Options Table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-900">Value</th>
                      <th className="text-left p-4 font-medium text-gray-900">Label</th>
                      <th className="text-left p-4 font-medium text-gray-900">Status</th>
                      <th className="text-left p-4 font-medium text-gray-900">Terakhir Update</th>
                      <th className="text-left p-4 font-medium text-gray-900">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredOptions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-500">
                          Tidak ada data
                        </td>
                      </tr>
                    ) : (
                      filteredOptions.map(option => (
                        <tr key={option.id} className="hover:bg-gray-50">
                          <td className="p-4">
                            <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                              {option.value}
                            </code>
                          </td>
                          <td className="p-4 font-medium text-gray-900">{option.label}</td>
                          <td className="p-4">
                            {option.isActive ? (
                              <Badge className="bg-green-100 text-green-800">Aktif</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-800">Non-Aktif</Badge>
                            )}
                          </td>
                          <td className="p-4 text-sm text-gray-600">
                            {new Date(option.updatedAt).toLocaleDateString('id-ID')}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleStatus(option.id, option.label, option.isActive)}
                                className="h-8 w-8 p-0"
                                title={option.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                              >
                                {option.isActive ? (
                                  <Eye className="w-4 h-4" />
                                ) : (
                                  <EyeOff className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(option)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteOption(option.id, option.label)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Opsi Baru - {currentCategory?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="add-value">Value (untuk sistem)</Label>
              <Input
                id="add-value"
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                placeholder="contoh: MOR IX"
              />
              <p className="text-xs text-gray-500 mt-1">Value yang akan disimpan di database</p>
            </div>
            <div>
              <Label htmlFor="add-label">Label (untuk tampilan)</Label>
              <Input
                id="add-label"
                value={formLabel}
                onChange={(e) => setFormLabel(e.target.value)}
                placeholder="contoh: MOR IX"
              />
              <p className="text-xs text-gray-500 mt-1">Label yang akan ditampilkan di dropdown</p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
            <Button onClick={handleAddOption} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Opsi - {currentCategory?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-value">Value (untuk sistem)</Label>
              <Input
                id="edit-value"
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                placeholder="contoh: MOR IX"
              />
              <p className="text-xs text-gray-500 mt-1">Value yang akan disimpan di database</p>
            </div>
            <div>
              <Label htmlFor="edit-label">Label (untuk tampilan)</Label>
              <Input
                id="edit-label"
                value={formLabel}
                onChange={(e) => setFormLabel(e.target.value)}
                placeholder="contoh: MOR IX"
              />
              <p className="text-xs text-gray-500 mt-1">Label yang akan ditampilkan di dropdown</p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
            <Button onClick={handleUpdateOption} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
