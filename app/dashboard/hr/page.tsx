'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Building2,
  Hourglass,
  CheckCircle,
  XCircle,
  Plus,
} from 'lucide-react';
import Link from 'next/link';

type Stats = {
  totalEmployees: number;
  activeEmployees: number;
  totalDepartments: number;
  pendingLeaves: number;
  approvedLeaves: number;
  rejectedLeaves: number;
};

type LeaveRequest = {
  _id: string;
  employee: { fullName: string };
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: string;
};

type Employee = {
  _id: string;
  fullName: string;
  employeeId: string;
  department: string;
  position: string;
  status: string;
};

export default function HRDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
  const [recentEmployees, setRecentEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      const res = await fetch('/api/hr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getDashboardData' }),
      });
  
      const json = await res.json();
      if (json.success) {
        setStats(json.stats);
        setRecentEmployees(json.recent);
        setPendingLeaves(json.leaves);
      }
    }
  
    loadDashboardData();
  }, []);
  
  const handleLeaveAction = async (id: string, decision: 'approved' | 'rejected') => {
    const res = await fetch('/api/hr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approveLeave', leaveId: id, decision }),
    });
  
    const json = await res.json();
  
    if (json.success) {
      const refreshed = await fetch('/api/hr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getDashboardData' }),
      });
  
      const data = await refreshed.json();
      if (data.success) {
        setStats(data.stats);
        setPendingLeaves(data.leaves);
        setRecentEmployees(data.recent); // optional
      }
    }
  };
  
  

  if (!stats) return <DashboardLayout><p className="text-center py-10">Loading dashboard...</p></DashboardLayout>;

  const formatDate = (d: string) => new Date(d).toLocaleDateString();

  const calcDays = (from: string, to: string) =>
    Math.ceil((new Date(to).getTime() - new Date(from).getTime()) / (86400e3)) + 1;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">HR Dashboard</h1>
            <p className="text-gray-600">Overview of your organization</p>
          </div>
          <Link href="/employees">
            <Button><Plus className="w-4 h-4 mr-2" /> Add Employee</Button>
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="py-6 flex flex-col items-start">
              <Users className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm text-gray-500">Total Employees</p>
              <p className="text-2xl font-bold">{stats.totalEmployees}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6 flex flex-col items-start">
              <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
              <p className="text-sm text-gray-500">Active Employees</p>
              <p className="text-2xl font-bold">{stats.activeEmployees}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6 flex flex-col items-start">
              <Building2 className="w-6 h-6 text-indigo-600 mb-2" />
              <p className="text-sm text-gray-500">Departments</p>
              <p className="text-2xl font-bold">{stats.totalDepartments}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6 space-y-2">
              <div className="flex justify-between">
                <span>Pending</span>
                <Badge variant="outline" className="text-yellow-600 border-yellow-400">{stats.pendingLeaves}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Approved</span>
                <Badge variant="outline" className="text-green-600 border-green-400">{stats.approvedLeaves}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Rejected</span>
                <Badge variant="outline" className="text-red-600 border-red-400">{stats.rejectedLeaves}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Leaves */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Leave Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingLeaves.length === 0 ? (
              <p className="text-gray-500">No pending leave requests</p>
            ) : (
              pendingLeaves.map((l) => (
                <div key={l._id} className="border p-4 rounded flex flex-col md:flex-row md:items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold">{l.employee.fullName}</p>
                    <p className="text-sm text-gray-500">
                      {l.leaveType} • {formatDate(l.fromDate)} to {formatDate(l.toDate)} ({calcDays(l.fromDate, l.toDate)} days)
                    </p>
                    <p className="text-sm text-gray-600 italic">Reason: {l.reason || '—'}</p>
                  </div>
                  <div className="flex gap-2 mt-3 md:mt-0">
                    <Button size="sm" onClick={() => handleLeaveAction(l._id, 'approved')} className="bg-green-600 hover:bg-green-700">Approve</Button>
                    <Button size="sm" onClick={() => handleLeaveAction(l._id, 'rejected')} className="bg-red-600 hover:bg-red-700">Reject</Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Employees */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Employees</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentEmployees.length === 0 ? (
              <p className="text-gray-500">No recent employees</p>
            ) : (
              recentEmployees.map((e) => (
                <div key={e._id} className="border p-4 rounded flex justify-between items-center">
                  <div>
                    <p className="font-medium">{e.fullName}</p>
                    <p className="text-sm text-gray-500">{e.department} • {e.position}</p>
                  </div>
                  <Badge variant="outline" className={e.status === 'active' ? 'text-green-600 border-green-400' : 'text-yellow-600 border-yellow-400'}>
                    {e.status}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
