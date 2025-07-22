// app/lib/controllers/hrController.ts
import User from '@/app/models/User';
import LeaveApplication from '@/app/models/LeaveApplication';
import mongoose from 'mongoose';

export async function getHRStats() {
  const totalEmployees = await User.countDocuments();
  const activeEmployees = await User.countDocuments({ status: 'Active' });
  const totalDepartments = await User.distinct('department').then(a => a.length);

  const leaves = await LeaveApplication.find();
  const pendingLeaves = leaves.filter(l => l.status === 'pending').length;
  const approvedLeaves = leaves.filter(l => l.status === 'approved').length;
  const rejectedLeaves = leaves.filter(l => l.status === 'rejected').length;

  return { totalEmployees, activeEmployees, totalDepartments, pendingLeaves, approvedLeaves, rejectedLeaves };
}

export async function getRecentEmployees(limit = 3) {
  return await User.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('_id fullName employeeId department position status');
}

export async function getPendingLeaves() {
  return await LeaveApplication.find({ status: 'pending' })
    .sort({ createdAt: -1 })
    .populate('employee', 'fullName');
}

export async function updateLeaveStatus(leaveId: string, status: 'approved' | 'rejected') {
  return await LeaveApplication.findByIdAndUpdate(leaveId, { status }, { new: true });
}
