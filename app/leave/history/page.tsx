'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Leave {
  _id: string;
  leaveType: string;
  reason: string;
  status: string;
  fromDate: string;
  toDate: string;
  createdAt: string;
}

export default function LeaveHistory() {
  const [userLeaves, setUserLeaves] = useState<Leave[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    const fetchLeaves = async () => {
      try {
        const res = await fetch(`/api/employee?type=userleaves&id=${parsedUser._id}`);
        const data = await res.json();
        console.log(data)
        if (!res.ok) throw new Error(data.error || 'Failed to fetch leave history');
        setUserLeaves(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'annual': return 'bg-blue-100 text-blue-800';
      case 'sick': return 'bg-purple-100 text-purple-800';
      case 'personal': return 'bg-indigo-100 text-indigo-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleDateString();
  };

  const filteredLeaves = userLeaves.filter((leave) =>
    leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
   console.log(filteredLeaves)
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/dashboard/employee" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Leave History</h1>
            <p className="text-gray-600">Complete history of all your leave applications</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by type, reason, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Leave Requests</CardTitle>
            <CardDescription>Complete history of all your leave applications</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading leave history...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : filteredLeaves.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No leave requests found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLeaves.map((leave) => (
                  <div key={leave._id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getLeaveTypeColor(leave.leaveType)}>{leave.leaveType}</Badge>
                          <Badge className={getStatusColor(leave.status)}>{leave.status}</Badge>
                        </div>
                        <h3 className="font-semibold text-lg mb-1">
                          {formatDate(leave.fromDate)} to {formatDate(leave.toDate)}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          <strong>Reason:</strong> {leave.reason || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-500">
                          <strong>Applied on:</strong> {formatDate(leave.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
