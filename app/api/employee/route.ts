import { NextRequest, NextResponse } from 'next/server';
import connectdb from '@/app/lib/connectdb';
import User from '@/app/models/User';
import {
  getEmployees,
  addEmployee,
  applyLeave,
  changePassword,
  updateLeaveStatus,
  getCurrentUser,
  getUserLeaves,
  updateUserProfile,
  getAllLeaveRequests
} from '@/app/lib/controllers/employeeController';

export async function GET(req: NextRequest) {
  await connectdb();

  const type = req.nextUrl.searchParams.get('type');
  const id = req.nextUrl.searchParams.get('id');

  try {
    if (type === 'current') {
      const user = await getCurrentUser(); // assuming session-based
      return NextResponse.json(user);
    }

    if (type === 'userleaves' && id) {
      const leaves = await getUserLeaves(id);
      return NextResponse.json(leaves);
    }

    if (type === 'allleaves') {
      const allLeaves = await getAllLeaveRequests();
      return NextResponse.json(allLeaves);
    }
    const employees = await getEmployees(id || undefined);
    return NextResponse.json(employees);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectdb();
  const body = await req.json();

  try {
    if (body.action === 'addEmployee') {
      const newUser = await addEmployee(body);
      return NextResponse.json(newUser, { status: 201 });
    }

    if (body.action === 'applyLeave') {
      const leave = await applyLeave(body);
      return NextResponse.json(leave, { status: 201 });
    }
    if(body.action === 'addEmployee')
    {
      const employees = await User.find({ role: { $ne: 'hr' } });
      return NextResponse.json({ success: true, data: employees });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await connectdb();
  const body = await req.json();

  try {
    if (body.action === 'changePassword') {
      const result = await changePassword(body.id, body.currentPassword, body.newPassword);
      return NextResponse.json(result);
    }

    if (body.action === 'updateLeaveStatus') {
      const result = await updateLeaveStatus(body.leaveId, body.status);
      return NextResponse.json(result);
    }
    if (body.action === 'updateProfile') {
      const updatedUser = await updateUserProfile(body.id, body.data);
      return NextResponse.json(updatedUser);
    }    

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
