// /app/api/doctor/profile/finalize/route.js

import dbConnect from "@/../lib/mongodb";
import Doctor from "@/../models/Docform";
import User from "@/../models/User";
import { NextResponse } from "next/server";
import { verifyToken } from "@/../utils/auth";
import nodemailer from 'nodemailer';

export async function POST(request) {
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
      return NextResponse.json({ error: "Doctor not found." }, { status: 404 });
    }

    if (doctor.isFinalized) {
      return NextResponse.json({ error: "Profile has already been finalized." }, { status: 400 });
    }

    // Finalize the profile
    doctor.isFinalized = true;
    doctor.approvalStatus = 'Pending'; // Set to Pending for admin approval

    await doctor.save();

//     // Notify admin about the new finalized profile
//     // Configure the transporter
//     const transporter = nodemailer.createTransport({
//       host: process.env.EMAIL_HOST, // e.g., 'smtp.gmail.com'
//       port: process.env.EMAIL_PORT, // e.g., 587
//       secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
//       auth: {
//         user: process.env.EMAIL_USER, // Your email address
//         pass: process.env.EMAIL_PASS, // Your email password or app-specific password
//       },
//     });

//     // Email content to admin
//     const adminEmail = process.env.ADMIN_EMAIL; // Define this in your .env.local

//     const mailOptions = {
//       from: `"PSN System" <${process.env.EMAIL_FROM}>`, // Sender address
//       to: adminEmail, // Admin's email address
//       subject: "New Doctor Profile Pending Approval",
//       text: `Dear Admin,

// A new doctor profile has been finalized and is pending your approval.

// Doctor Name: ${doctor.name}
// Email: ${doctor.email}
// PMDC Number: ${doctor.pmdcNumber}

// Please review and approve or reject the profile.

// Best regards,
// PSN System`,
//       html: `
//         <p>Dear Admin,</p>
//         <p>A new doctor profile has been finalized and is pending your approval.</p>
//         <p><strong>Doctor Details:</strong></p>
//         <ul>
//           <li><strong>Name:</strong> ${doctor.name}</li>
//           <li><strong>Email:</strong> ${doctor.email}</li>
//           <li><strong>PMDC Number:</strong> ${doctor.pmdcNumber}</li>
//         </ul>
//         <p>Please review and approve or reject the profile.</p>
//         <p>Best regards,<br/>PSN System</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Profile finalized and sent for approval." }, { status: 200 });
  } catch (error) {
    console.error("Finalize Profile Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
