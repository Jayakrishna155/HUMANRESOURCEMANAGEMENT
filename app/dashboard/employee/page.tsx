'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import { LeaveRequest, User } from '@/types';

export default function EmployeeDashboard() {
  const [userLeaves, setUserLeaves] = useState<LeaveRequest[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndLeaves = async () => {
      try {
        const localUser = localStorage.getItem('user');
        if (!localUser) return;
  
        const userData = JSON.parse(localUser);
        setUser(userData);
  
        const leaveRes = await fetch(
          `/api/employee?type=userleaves&id=${userData._id}`
        );
        const leaveData = await leaveRes.json();
  
        const formattedLeaves: LeaveRequest[] = leaveData.map((leave: any) => ({
          _id: leave._id,
          type: leave.leaveType,
          startDate: new Date(leave.fromDate).toLocaleDateString(),
          endDate: new Date(leave.toDate).toLocaleDateString(),
          reason: leave.reason,
          status: leave.status.toLowerCase(),
          days:
            Math.round(
              (new Date(leave.toDate).getTime() -
                new Date(leave.fromDate).getTime()) /
                (1000 * 60 * 60 * 24)
            ) + 1,
          appliedDate: new Date(leave.appliedOn).toLocaleDateString(),
        }));
  
        setUserLeaves(formattedLeaves);
      } catch (err) {
        console.error('Failed to fetch user or leaves:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserAndLeaves();
  }, []);
  

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-10 text-gray-500">Loading dashboard...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.fullName || 'Employee'}!
            </h1>
            <p className="text-gray-600">Here's your dashboard overview</p>
          </div>
          <Link href="/leave/apply">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Apply Leave
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex justify-between">
              <CardTitle className="text-sm font-medium">Total Leave Requests</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userLeaves.length}</div>
              <p className="text-xs text-muted-foreground">All time requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between">
              <CardTitle className="text-sm font-medium">Approved Leaves</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {userLeaves.filter((l) => l.status === 'approved').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {userLeaves
                  .filter((l) => l.status === 'approved')
                  .reduce((sum, l) => sum + l.days, 0)}{' '}
                days total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {userLeaves.filter((l) => l.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Leave Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Leave Requests</CardTitle>
            <CardDescription>Your latest leave applications and their status</CardDescription>
          </CardHeader>
          <CardContent>
            {userLeaves.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No leave requests yet</p>
                <p className="text-sm text-gray-400">Apply for your first leave to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userLeaves.slice(0, 5).map((leave) => (
                  <div
                    key={leave._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(leave.status)}
                      <div>
                        <h4 className="font-medium capitalize">{leave.leaveType} Leave</h4>
                        <p className="text-sm text-gray-600">
                          {leave.fromDate} to {leave.toDate} ({leave.days} days)
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{leave.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(leave.status)}>{leave.status}</Badge>
                      {/* <p className="text-xs text-gray-500 mt-1">Applied: {leave.appliedDate}</p> */}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/leave/apply">
                <Button variant="outline" className="w-full justify-start h-auto p-4">
                  <Plus className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Apply for Leave</div>
                    <div className="text-sm text-gray-500">Submit a new leave request</div>
                  </div>
                </Button>
              </Link>

              <Link href="/leave/history">
                <Button variant="outline" className="w-full justify-start h-auto p-4">
                  <FileText className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">View Leave History</div>
                    <div className="text-sm text-gray-500">Check all your past requests</div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
