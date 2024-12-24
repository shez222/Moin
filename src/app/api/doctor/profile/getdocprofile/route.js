import dbConnect from "@/../lib/mongodb";
import Doctor from "@/../models/Docform";
import User from "@/../models/User";
import { NextResponse } from "next/server";
import { verifyToken } from "@/../utils/auth";

export async function GET(request) {
  try {
    // Extract token from headers
    const token = request.headers.get('Authorization')?.split(' ')[1];
    console.log(token);
    
    if (!token) {
      return NextResponse.json({ error: "Authentication token missing." }, { status: 401 });
    }

    // Verify token and get user ID
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 401 });
    }

    await dbConnect();
    
    // Fetch doctor's profile by ID
    const doctor = await User.findById(decoded.userId).populate('formDataId').exec();

    console.log(doctor);
    

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found." }, { status: 404 });
    }

    return NextResponse.json(doctor, { status: 200 });
  } catch (error) {
    console.error("Fetch Doctor Profile Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
