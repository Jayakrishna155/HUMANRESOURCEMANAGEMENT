'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User as UserIcon, Mail, Phone, MapPin, Calendar, Building, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { User } from '@/types';
import { mockAuth } from '@/lib/dummy-data';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});

  useEffect(() => {
    const currentUser = mockAuth.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData(currentUser);
    }
  }, []);

  const handleSave = async () => {
    if (!user) return;
  
    try {
      const res = await fetch('/api/employee', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateProfile',
          id: user._id,
          data: {
            fullName: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            email: formData.email
          }
        }),
      });
  
      const updated = await res.json();
      if (res.ok) {
        setUser(updated);
        setFormData(updated);
        setIsEditing(false);
        localStorage.setItem('user', JSON.stringify(updated)); // Optional
      } else {
        console.error(updated.error || 'Update failed');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };
  

  const handleCancel = () => {
    setFormData(user || {});
    setIsEditing(false);
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href={user.role === 'hr' ? '/dashboard/hr' : '/dashboard/employee'} className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">View and manage your personal information</p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-bold">
                    {user.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl">{user.fullName}</CardTitle>
              <CardDescription className="flex items-center justify-center space-x-2">
                <Badge variant="secondary" className="capitalize">{user.role}</Badge>
                <Badge variant="outline">{user.employeeId}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{user.department}</p>
                    <p className="text-sm text-gray-600">{user.position}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Join Date</p>
                    <p className="text-sm text-gray-600">{user.joinDate}</p>
                  </div>
                </div>
                {user.reportingTo && (
                  <div className="flex items-center space-x-3">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Reports To</p>
                      <p className="text-sm text-gray-600">{user.reportingTo}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                {isEditing ? 'Update your personal details' : 'Your personal and contact information'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="fullName"
                        value={formData.fullName || ''}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{user.fullName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{user.email}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="mt-1"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{user.phone || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <p className="mt-1 text-gray-900">{user.employeeId}</p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={formData.address || ''}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="mt-1"
                      placeholder="Enter your address"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{user.address || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Work Information</CardTitle>
            <CardDescription>
              Your employment and organizational details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <Label>Department</Label>
                <p className="mt-1 text-gray-900">{user.department}</p>
              </div>
              <div>
                <Label>Position</Label>
                <p className="mt-1 text-gray-900">{user.position}</p>
              </div>
              <div>
                <Label>Role</Label>
                <Badge variant="secondary" className="mt-1 capitalize">
                  {user.role}
                </Badge>
              </div>
              <div>
                <Label>Join Date</Label>
                <p className="mt-1 text-gray-900">{user.joinDate}</p>
              </div>
              {user.reportingTo && (
                <div>
                  <Label>Reporting Manager</Label>
                  <p className="mt-1 text-gray-900">{user.reportingTo}</p>
                </div>
              )}
              <div>
                <Label>Status</Label>
                <Badge variant="outline" className="mt-1 bg-green-50 text-green-700">
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your account preferences and security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Link href="/settings/password">
                <Button variant="outline" className="w-full justify-start">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
