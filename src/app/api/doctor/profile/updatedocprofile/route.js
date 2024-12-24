// /app/api/doctor/profile/route.js

import dbConnect from "@/../lib/mongodb";
import Doctor from "@/../models/Docform";
import { NextResponse } from "next/server";
import { verifyToken } from "@/../utils/auth";
import User from "@/../models/User";

export async function PUT(request) {
  try {
    // Extract token from headers
    const token = request.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: "Authentication token missing." }, { status: 401 });
    }

    // Verify token and get user ID
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 401 });
    }

    const updatedData = await request.json();

    await dbConnect();

    // Find the user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }
    // Extract formDataId
    const formDataId = user.formDataId;

    // Fetch the corresponding Doctor profile
    const doctor = await Doctor.findById(formDataId);
    if (!doctor) {
      return NextResponse.json(
        { error: "Doctor profile not found." },
        { status: 404 }
      );
    }

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found." }, { status: 404 });
    }

    if (doctor.isFinalized) {
      return NextResponse.json({ error: "Profile has been finalized and cannot be edited." }, { status: 400 });
    }

    // Update doctor's profile
    Object.keys(updatedData).forEach((key) => {
      if (key === 'additionalTrainingInfo' || key === 'applicantAffiliation') {
        Object.keys(updatedData[key]).forEach((subKey) => {
          doctor[key][subKey] = updatedData[key][subKey];
        });
      } else {
        doctor[key] = updatedData[key];
      }
    });

    await doctor.save();

    return NextResponse.json({ message: "Profile updated successfully." }, { status: 200 });
  } catch (error) {
    console.error("Update Doctor Profile Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
