import { NextRequest, NextResponse } from 'next/server';
import connectdb from '@/app/lib/connectdb';
import User from '@/app/models/User';
import LeaveApplication from '@/app/models/LeaveApplication';
import { Types } from 'mongoose';

// await connectdb();

async function getHRStats() {
  const totalEmployees = await User.countDocuments({ role: { $ne: 'hr' } });
  const activeEmployees = await User.countDocuments({ role: { $ne: 'hr' }, status: 'Active' });
  const totalDepartments = await User.distinct('department').then(d => d.length);

  const leaves = await LeaveApplication.find();
  const pendingLeaves = leaves.filter(l => l.status === 'pending').length;
  const approvedLeaves = leaves.filter(l => l.status === 'approved').length;
  const rejectedLeaves = leaves.filter(l => l.status === 'rejected').length;

  return { totalEmployees, activeEmployees, totalDepartments, pendingLeaves, approvedLeaves, rejectedLeaves };
}

async function getRecentEmployees(limit = 3) {
  return await User.find({ role: { $ne: 'hr' } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('_id fullName employeeId department position status');
}

async function getPendingLeaves() {
  return await LeaveApplication.find({ status: 'pending' })
    .sort({ createdAt: -1 })
    .populate('employee', 'fullName');
}

export async function POST(req: NextRequest) {
  await connectdb();
  const body = await req.json();

  try {
    switch (body.action) {
      case 'getDashboardData': {
        const stats = await getHRStats();
        const recent = await getRecentEmployees();
        const leaves = await getPendingLeaves();

        return NextResponse.json({ success: true, stats, recent, leaves });
      }

      case 'getEmployees': {
        const employees = await User.find({ role: { $ne: 'hr' } });
        return NextResponse.json({ success: true, data: employees });
      }

case 'addEmployee': {
  const {
    fullName,
    email,
    role = 'employee',
    department,
    position,
    joinDate,
    phone,
    address,
    salary,
    reportingTo,
    status = 'Active',
  } = body;

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json(
      { success: false, error: 'Email already exists' },
      { status: 400 }
    );
  }

  const user = await User.create({
    fullName,
    email,
    role,
    department,
    position,
    employeeId: 'EMP' + Date.now(),
    joinDate,
    phone,
    address,
    salary,
    reportingTo,
    status,
    password: 'password', 
  });
  return NextResponse.json({ success: true, data: user }, { status: 201 });
}


      case 'updateEmployee': {
        const { id, data } = body;
        if (!id || !Types.ObjectId.isValid(id)) {
          return NextResponse.json({ success: false, error: 'Invalid user ID' }, { status: 400 });
        }

        const updated = await User.findByIdAndUpdate(id, data, { new: true });
        return NextResponse.json({ success: true, data: updated });
      }

      case 'deleteEmployee': {
        const { id } = body;
        if (!id || !Types.ObjectId.isValid(id)) {
          return NextResponse.json({ success: false, error: 'Invalid user ID' }, { status: 400 });
        }

        await User.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: 'Employee deleted' });
      }

      case 'getLeaveRequests': {
        const leaveRequests = await LeaveApplication.find()
          .populate('employee', 'fullName')
          .lean();

        const formatted = leaveRequests.map((leave: any) => ({
          _id: leave._id,
          leaveType: leave.leaveType,
          fromDate: leave.fromDate,
          toDate: leave.toDate,
          reason: leave.reason,
          status: leave.status,
          appliedAt: leave.createdAt,
          employeeName: leave.employee?.fullName || 'Unknown',
        }));

        return NextResponse.json({ success: true, data: formatted });
      }

      case 'approveLeave': {
        const { leaveId, decision, reviewerId, comments } = body;

        if (!leaveId || !decision) {
          return NextResponse.json(
            { success: false, error: 'Missing leaveId or decision' },
            { status: 400 }
          );
        }

        if (!['approved', 'rejected'].includes(decision.toLowerCase())) {
          return NextResponse.json(
            { success: false, error: 'Invalid decision value' },
            { status: 400 }
          );
        }

        await LeaveApplication.findByIdAndUpdate(leaveId, {
          status: decision.toLowerCase(),
          approvedBy: reviewerId || null,
          approvedDate: new Date(),
          comments,
        });

        return NextResponse.json({ success: true, message: `Leave ${decision}` });
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (err: any) {
    console.error('HR API Error:', err);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}
