// /app/api/admin/dashboard/route.js

import { NextResponse } from 'next/server';
import Doctor from '@/../models/Docform';
import { adminAuth } from '@/../middleware/adminAuth';

export async function GET(request) {
  const authResponse = await adminAuth(request);
  if (authResponse instanceof NextResponse) {
    return authResponse;
  }

  try {
    // Total Forms Submitted
    const totalForms = await Doctor.countDocuments();

    // Finalized Forms
    const finalized = await Doctor.countDocuments({ isFinalized: true });

    // Approved Profiles
    const approved = await Doctor.countDocuments({ approvalStatus: 'Approved' });

    // Payment Approved
    const paymentApproved = await Doctor.countDocuments({ paymentApprovalStatus: 'Approved' });

    const stats = {
      totalForms,
      finalized,
      approved,
      paymentApproved,
    };

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error) {
    console.error("Admin Dashboard GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}
