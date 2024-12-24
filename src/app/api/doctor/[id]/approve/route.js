// /app/api/admin/doctors/[id]/approve/route.js

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
    console.log("Action:", action, id);
    
    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    }

    const update = {
      approvalStatus: action === 'approve' ? 'Approved' : 'Rejected',
    };

    const doctor = await Doctor.findByIdAndUpdate(id, update, { new: true });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found." }, { status: 404 });
    }

    return NextResponse.json({ message: `Profile ${action}d successfully.`, doctor }, { status: 200 });
  } catch (error) {
    console.error("Admin Approve PUT Error:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}
