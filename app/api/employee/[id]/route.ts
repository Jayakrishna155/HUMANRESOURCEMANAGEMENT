import { NextRequest, NextResponse } from 'next/server';
import connectdb from '@/app/lib/connectdb';
import User from '@/app/models/User';

export async function PUT(req: NextRequest) {
  await connectdb();
  const body = await req.json();
  const updated = await User.findByIdAndUpdate(body.id, body, { new: true });
  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(req: NextRequest) {
  await connectdb();
  const body = await req.json();
  await User.findByIdAndDelete(body.id);
  return NextResponse.json({ success: true });
}
