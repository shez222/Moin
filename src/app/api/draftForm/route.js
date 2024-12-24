// /app/api/membership/route.js

import dbConnect from "@/../lib/mongodb"; // Ensure this path is correct
import Doctor from "@/../models/Docform"; // Ensure this path is correct
import User from "@/../models/User";
import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { sendEmail } from "../../../../lib/emailSender";

export async function POST(request) {
  try {
    const formData = await request.json();

    // Connect to MongoDB
    await dbConnect();

    // Check if email already exists
    const existingDoctor = await Doctor.findOne({ email: formData.email });
    if (existingDoctor) {
      return NextResponse.json(
        { error: "A user with this email already exists." },
        { status: 400 }
      );
    }

    // Generate a random password
    const plainPassword = crypto.randomBytes(8).toString('hex'); // Generates a 16-character hex string

    // Create a new doctor instance
    const newDoctor = new Doctor({
      name: formData.name,
      residence: formData.residence,
      gender: formData.gender,
      pmdcNumber: formData.pmdcNumber,
      address: formData.address,
      province: formData.province,
      country: formData.country,
      email: formData.email,
      fathersName: formData.fathersName,
      dob: formData.dob,
      cnic: formData.cnic,
      fellowshipNumber: formData.fellowshipNumber,
      city: formData.city,
      zip: formData.zip,
      phone: formData.phone,
      additionalTrainingInfo: formData.additionalTrainingInfo,
      applicantAffiliation: formData.applicantAffiliation,
    });

    const savedDoctor = await newDoctor.save();
    console.log("Saved Doctor:", savedDoctor);

    // Create a new user instance
    const newUser = new User({
      email: formData.email,
      password: plainPassword,
      role: 'doctor',
      formDataId: savedDoctor._id,
    });

    // Save the new user to the database
    await newUser.save();
    const emailSubject = "PSN Membership Registration";
    const emailHtml = `
      <p>Hello Dr. ${formData.name},</p>
      <p>Thank you for registering with the Pakistan Society of Neurology (PSN). Your account has been created successfully.</p>
      <p>Next steps:</p>
      <p>Please log in to your dashboard and update your profile.</p>
      <p>Your credentials are as follows:</p>
      <p>Username: ${formData.email}</p>
      <p>Password: ${plainPassword}</p>
      <p>Please log in to your dashboard and change your password immediately for security purposes.</p>
      <p>Best regards,<br/>PSN Team</p>
    `;


    await sendEmail({
      to: formData.email,
      subject: emailSubject,
      // text: emailText,
      html: emailHtml,
    });


    return NextResponse.json(
      { message: "Membership registered successfully. Credentials sent to email." },
      { status: 201 }
    );

  } catch (error) {
    console.error("Membership Registration Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
