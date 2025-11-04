'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit, Save, X, Camera, Briefcase, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  location: string;
  joinDate: string;
  employeeId: string;
  bio: string;
  avatar?: string;
}

export function UserProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    id: '1',
    name: user?.name || 'Joni Talang',
    email: user?.email || 'joni.talang@oilspatra.com',
    phone: '+62 812 3456 7890',
    position: user?.position || 'Fleet Manager',
    department: 'Operations',
    location: 'Jakarta Pusat',
    joinDate: '2020-03-15',
    employeeId: 'EMP-2020-001',
    bio: 'Experienced fleet manager with over 5 years in logistics and transportation management. Focused on optimizing fleet operations and ensuring safety standards.',
    avatar: ''
  });

  const [editData, setEditData] = useState<UserData>(userData);

  // Update userData when user context changes
  useEffect(() => {
    if (user) {
      setUserData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        position: user.position
      }));
    }
  }, [user]);

  const handleEdit = () => {
    setEditData(userData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);
    toast.success('Profil berhasil diupdate!');
  };

  const updateField = (field: keyof UserData, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
              <p className="text-gray-600">Kelola informasi profil Anda</p>
            </div>
          </div>
          {!isEditing ? (
            <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleCancel} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Profile Card - Left Side */}
        <div className="col-span-4">
          <Card>
            <CardContent className="p-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={userData.avatar} />
                    <AvatarFallback className="bg-blue-600 text-white text-3xl">
                      {userData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg">
                      <Camera className="w-5 h-5 text-white" />
                    </button>
                  )}
                </div>
                <h2 className="mt-4 text-xl font-bold text-gray-900">{userData.name}</h2>
                <p className="text-gray-600">{userData.position}</p>
                <Badge className="mt-2 bg-green-100 text-green-800">Active</Badge>
              </div>

              {/* Quick Info */}
              <div className="space-y-4 border-t pt-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm truncate">{userData.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm">{userData.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm">{userData.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Join Date</p>
                    <p className="text-sm">{new Date(userData.joinDate).toLocaleDateString('id-ID')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Employee ID</p>
                    <p className="text-sm font-mono">{userData.employeeId}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">245</p>
                  <p className="text-xs text-gray-500">Vehicles Managed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">98%</p>
                  <p className="text-xs text-gray-500">Uptime Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Right Side */}
        <div className="col-span-8">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Personal Info Tab */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={isEditing ? editData.name : userData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-gray-50' : ''}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={isEditing ? editData.email : userData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-gray-50' : ''}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={isEditing ? editData.phone : userData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-gray-50' : ''}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={isEditing ? editData.location : userData.location}
                        onChange={(e) => updateField('location', e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-gray-50' : ''}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      value={isEditing ? editData.bio : userData.bio}
                      onChange={(e) => updateField('bio', e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-gray-50' : ''}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Employment Tab */}
            <TabsContent value="employment">
              <Card>
                <CardHeader>
                  <CardTitle>Employment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="employeeId">Employee ID</Label>
                      <Input
                        id="employeeId"
                        value={userData.employeeId}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={isEditing ? editData.position : userData.position}
                        onChange={(e) => updateField('position', e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-gray-50' : ''}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={isEditing ? editData.department : userData.department}
                        onChange={(e) => updateField('department', e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-gray-50' : ''}
                      />
                    </div>
                    <div>
                      <Label htmlFor="joinDate">Join Date</Label>
                      <Input
                        id="joinDate"
                        type="date"
                        value={userData.joinDate}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Additional Employment Info */}
                  <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-600">Experience</p>
                        <p className="font-semibold text-gray-900">
                          {Math.floor((new Date().getTime() - new Date(userData.joinDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} Years
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-600">Company</p>
                        <p className="font-semibold text-gray-900">OILS Patra</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-600">Status</p>
                        <p className="font-semibold text-green-600">Permanent</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Enter current password"
                    />
                  </div>

                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Update Password
                  </Button>

                  {/* Additional Security Info */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Password Requirements</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                        Minimal 8 karakter
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                        Mengandung huruf besar dan kecil
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                        Mengandung angka
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                        Mengandung karakter spesial (!@#$%^&*)
                      </li>
                    </ul>
                  </div>

                  {/* Last Login Info */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Session Information</h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600">
                        Last Login: <span className="font-medium text-gray-900">Nov 3, 2024 - 09:30 AM</span>
                      </p>
                      <p className="text-gray-600">
                        IP Address: <span className="font-medium text-gray-900">192.168.1.100</span>
                      </p>
                      <p className="text-gray-600">
                        Browser: <span className="font-medium text-gray-900">Chrome 119.0</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
