'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Search,
  ArrowLeft,
} from 'lucide-react';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

import type { LeaveRequest } from '@/types';

export default function ManageLeaves() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [filteredLeaves, setFilteredLeaves] = useState<LeaveRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await fetch('/api/hr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'getLeaveRequests' }),
        });
        const json = await res.json();
        if (json.success) {
          setLeaves(json.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  useEffect(() => {
    setFilteredLeaves(
      leaves.filter(
        (l) =>
          l.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          l.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          l.status.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [leaves, searchTerm]);

  const handleLeaveAction = async (
    leaveId: string,
    action: 'approved' | 'rejected'
  ) => {
    try {
      const res = await fetch('/api/hr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approveLeave',
          leaveId,
          decision: action,
          comments,
        }),
      });

      const json = await res.json();

      if (json.success) {
        setLeaves((prev) =>
          prev.map((l) =>
            l._id === leaveId ? { ...l, status: action, comments } : l
          )
        );
        setSelectedLeave(null);
        setComments('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status: LeaveRequest['status']) => {
    return {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    }[status];
  };

  const getTypeColor = (type: LeaveRequest['leaveType']) => {
    return {
      annual: 'bg-blue-100 text-blue-800',
      sick: 'bg-purple-100 text-purple-800',
      personal: 'bg-indigo-100 text-indigo-800',
      emergency: 'bg-red-100 text-red-800',
    }[type];
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const stats = {
    pending: leaves.filter((l) => l.status === 'pending').length,
    approved: leaves.filter((l) => l.status === 'approved').length,
    rejected: leaves.filter((l) => l.status === 'rejected').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Link href="/dashboard/hr" className="inline-flex items-center text-blue-600 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold">Manage Leave Requests</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Pending', count: stats.pending, icon: <Calendar className="h-4 w-4 text-yellow-600" /> },
            { label: 'Approved', count: stats.approved, icon: <CheckCircle className="h-4 w-4 text-green-600" /> },
            { label: 'Rejected', count: stats.rejected, icon: <XCircle className="h-4 w-4 text-red-600" /> },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-sm">{stat.label}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.count}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" /> Search Leave Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, type, or status..."
              className="pl-10"
            />
          </CardContent>
        </Card>

        {/* Leave List */}
        <Card>
          <CardHeader>
            <CardTitle>All Leave Requests</CardTitle>
            <CardDescription>Manage employee leave applications</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : filteredLeaves.length === 0 ? (
              <p>No leave requests found.</p>
            ) : (
              filteredLeaves.map((l) => (
                <div key={l._id} className="border rounded p-4 mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className={getTypeColor(l.leaveType)}>{l.leaveType}</Badge>{' '}
                      <Badge className={getStatusColor(l.status)}>{l.status}</Badge>
                      <p className="font-semibold mt-2">{l.employeeName}</p>
                      <p className="text-sm">{formatDate(l.fromDate)} → {formatDate(l.toDate)}</p>
                      <p className="text-sm italic">Reason: {l.reason}</p>
                    </div>
                    {l.status === 'pending' && (
                      <div className="flex flex-col gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">Review</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Leave Request</DialogTitle>
                            </DialogHeader>
                            <div>
                              <p><strong>Employee:</strong> {l.employeeName}</p>
                              <p><strong>From:</strong> {formatDate(l.fromDate)}</p>
                              <p><strong>To:</strong> {formatDate(l.toDate)}</p>
                              <p><strong>Reason:</strong> {l.reason}</p>
                              <Textarea
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                placeholder="Write comments here..."
                              />
                              <div className="mt-4 flex gap-2">
                                <Button onClick={() => handleLeaveAction(l._id, 'approved')} className="bg-green-600">
                                  Approve
                                </Button>
                                <Button onClick={() => handleLeaveAction(l._id, 'rejected')} className="bg-red-600">
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
