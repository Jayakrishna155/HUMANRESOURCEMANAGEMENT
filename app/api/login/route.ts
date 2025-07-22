import { NextRequest, NextResponse } from 'next/server';
import connectdb from '@/app/lib/connectdb';
import User from '@/app/models/User'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  await connectdb();

  const user = await User.findOne({ email });

  if (!user || user.password !== password) {
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  }

  return NextResponse.json({ success: true, user });
}
