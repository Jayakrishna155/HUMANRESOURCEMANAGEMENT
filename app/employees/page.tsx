'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, Search, Plus, Edit, Trash2, ArrowLeft, Mail, Phone
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from '@/components/ui/select';
import type { Employee } from '@/types';

const DEPTS = ['Engineering', 'Marketing', 'Finance', 'Human Resources', 'Sales'];

export default function ManageEmployees() {
  const [stats, setStats] = useState({ totalEmployees: 0, activeEmployees: 0, totalDepartments: 0 });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filtered, setFiltered] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<Partial<Employee>>({});
  const [selected, setSelected] = useState<Employee | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    fetch('/api/hr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getDashboardData' })
    })
      .then(r => r.json())
      .then(j => j.success && setStats(j.stats));

    fetch('/api/hr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getEmployees' })
    })
      .then(r => r.json())
      .then(j => j.success && (setEmployees(j.data), setFiltered(j.data)));
  }, []);

  useEffect(() => {
    const s = search.toLowerCase();
    setFiltered(employees.filter(emp =>
      [emp.fullName, emp.email, emp.department, emp.position, emp.employeeId]
        .some(f => f?.toLowerCase().includes(s))
    ));
  }, [search, employees]);

  const updateForm = (k: keyof Employee, v: any) =>
    setForm(f => ({ ...f, [k]: v }));

  const reset = () => {
    setForm({});
    setSelected(null);
    setAddOpen(false);
    setEditOpen(false);
  };

  async function doAction(action: string, payload: any) {
    const res = await fetch('/api/hr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...payload })
    });
    return res.json();
  }

  const handleAdd = async () => {
    const j = await doAction('addEmployee', form);
    if (j.success && j.data) {
      setEmployees(prev => [...prev, j.data]);
      setFiltered(prev => [...prev, j.data]);
      reset(); // Close modal & clear form
    }
  };
  
  const handleUpdate = async () => {
    if (!selected?._id) return;
    const j = await doAction('updateEmployee', { id: selected._id, data: form });
    if (j.success && j.data) {
      setEmployees(prev => prev.map(e => e._id === j.data._id ? j.data : e));
      setFiltered(prev => prev.map(e => e._id === j.data._id ? j.data : e));
      reset(); // Close modal & clear form
    }
  };
  

  const handleDelete = async (id: string) => {
    const j = await doAction('deleteEmployee', { id });
    if (j.success) {
      setEmployees(prev => prev.filter(e => e._id !== id));
      setFiltered(prev => prev.filter(e => e._id !== id));
    }
  };

  const openEdit = (emp: Employee) => {
    setSelected(emp);
    setForm(emp);
    setEditOpen(true);
  };

  const renderFormFields = () => (
    <div className="grid grid-cols-2 gap-4">
      <div><Label>Full Name</Label><Input value={form.fullName || ''} onChange={e => updateForm('fullName', e.target.value)} /></div>
      <div><Label>Email</Label><Input value={form.email || ''} onChange={e => updateForm('email', e.target.value)} /></div>
      <div><Label>Department</Label>
        <Select value={form.department || ''} onValueChange={v => updateForm('department', v)}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            {DEPTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div><Label>Position</Label><Input value={form.position || ''} onChange={e => updateForm('position', e.target.value)} /></div>
      <div><Label>Join Date</Label><Input type="date" value={form.joinDate?.split('T')[0] || ''} onChange={e => updateForm('joinDate', e.target.value)} /></div>
      <div><Label>Phone</Label><Input value={form.phone || ''} onChange={e => updateForm('phone', e.target.value)} /></div>
      <div><Label>Address</Label><Input value={form.address || ''} onChange={e => updateForm('address', e.target.value)} /></div>
      <div><Label>Reports To</Label><Input value={form.reportingTo || ''} onChange={e => updateForm('reportingTo', e.target.value)} /></div>
      <div><Label>Salary</Label><Input type="number" value={String(form.salary || '')} onChange={e => updateForm('salary', Number(e.target.value))} /></div>
      <div><Label>Status</Label>
      <Select value={form.status || 'Active'} onValueChange={v => updateForm('status', v as Employee['status'])}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">active</SelectItem>
            <SelectItem value="Inactive">inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <Link href="/dashboard/hr" className="inline-flex items-center text-blue-600">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold">Manage Employees</h1>
          </div>
          <Button onClick={() => setAddOpen(true)}><Plus className="mr-2" /> Add Employee</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card><CardHeader><CardTitle>Total</CardTitle></CardHeader><CardContent>{stats.totalEmployees}</CardContent></Card>
          <Card><CardHeader><CardTitle>Active</CardTitle></CardHeader><CardContent>{stats.activeEmployees}</CardContent></Card>
          <Card><CardHeader><CardTitle>Departments</CardTitle></CardHeader><CardContent>{stats.totalDepartments}</CardContent></Card>
        </div>

        {/* Search */}
        <Card>
          <CardHeader><CardTitle><Search className="inline mr-2" /> Search Employees</CardTitle></CardHeader>
          <CardContent><Input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} /></CardContent>
        </Card>

        {/* List */}
        <Card>
          <CardHeader><CardTitle>Employees</CardTitle><CardDescription>Company roster</CardDescription></CardHeader>
          <CardContent>
            {filtered.length === 0 ? <p>No employees found.</p> : filtered.map(emp => (
              <div key={emp._id} className="flex justify-between p-4 border rounded mb-3">
                <div>
                  <div className="flex gap-2 mb-1"><Badge>{emp.employeeId}</Badge><Badge variant="secondary">{emp.status}</Badge></div>
                  <h3 className="font-semibold">{emp.fullName}</h3>
                  <p>{emp.position} • {emp.department}</p>
                  <div className="flex gap-3 text-gray-600"><Mail size={16}/> {emp.email}{emp.phone && <><Phone size={16}/> {emp.phone}</>}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => openEdit(emp)}><Edit size={16} /></Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(emp._id)}><Trash2 size={16} /></Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Add Modal */}
      <Dialog open={addOpen} onOpenChange={reset}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Employee</DialogTitle></DialogHeader>
          {renderFormFields()}
          <div className="flex justify-end mt-4 gap-2">
            <Button variant="outline" onClick={reset}>Cancel</Button>
            <Button onClick={handleAdd}>Add</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={reset}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Employee</DialogTitle></DialogHeader>
          {renderFormFields()}
          <div className="flex justify-end mt-4 gap-2">
            <Button variant="outline" onClick={reset}>Cancel</Button>
            <Button onClick={handleUpdate}>Update</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
