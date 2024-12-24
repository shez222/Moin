// /app/api/admin/doctors/[id]/payment-approve/route.js

import { NextResponse } from 'next/server';
import Doctor from '@/../models/Docform';
import { adminAuth } from '@/../middleware/adminAuth';

export async function PUT(request, { params }) {
  const authResponse = await adminAuth(request);
  if (authResponse instanceof NextResponse) {
    return authResponse;
  }

  const { id } = params;

  try {
    const { action } = await request.json();

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    }

    const update = {
      paymentApprovalStatus: action === 'approve' ? 'Approved' : 'Rejected',
    };

    const doctor = await Doctor.findByIdAndUpdate(id, update, { new: true });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found." }, { status: 404 });
    }

    return NextResponse.json({ message: `Payment ${action}d successfully.`, doctor }, { status: 200 });
  } catch (error) {
    console.error("Admin Payment Approve PUT Error:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}
