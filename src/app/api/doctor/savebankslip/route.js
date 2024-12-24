import dbConnect from "@/../lib/mongodb";
import Doctor from "@/../models/Docform";
import User from "@/../models/User";
import { NextResponse } from "next/server";
import { verifyToken } from "@/../utils/auth";

export async function POST(request) {
  try {
    // Extract token from headers
    const token = request.headers.get('Authorization')?.split(' ')[1];
    const bankSlipPic = await request.json();
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

    const doctor = await User.findById(decoded.userId); // Fetch the doctor by ID

    if (!doctor) {
        throw new Error("Doctor not found");
    }

    const formDataId = doctor.formDataId; // Extract formDataId from the doctor

    if (!formDataId) {
        throw new Error("formDataId not found for this doctor");
    }

    // Find the form record by formDataId
    const docForm = await Doctor.findById(formDataId);

    if (!docForm) {
        throw new Error("Form not found");
    }

    // Update the form with the profilePic
    docForm.bankSlipPic = bankSlipPic; // Assuming `doctor` has a `profilePic` field

    // Save the updated form
    await docForm.save();

    console.log("Profile picture saved successfully in form:", docForm);


    
    

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Profile picture saved successfully." }, { status: 200 });
  } catch (error) {
    console.error("Fetch Doctor Profile Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
