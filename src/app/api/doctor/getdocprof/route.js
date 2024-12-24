// /app/api/admin/doctors/route.js

import { NextResponse } from 'next/server';
import Doctor from '@/../models/Docform';
import { adminAuth } from '@/../middleware/adminAuth';

export async function GET(request) {
  const authResponse = await adminAuth(request);
  if (authResponse instanceof NextResponse) {
    return authResponse;
  }

  try {
    const doctors = await Doctor.find().select('-__v').sort({ createdAt: -1 });
    return NextResponse.json({ doctors }, { status: 200 });
  } catch (error) {
    console.error("Admin Doctors GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}
