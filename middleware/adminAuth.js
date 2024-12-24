// /middleware/adminAuth.js

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
// import Doctor from '@/models/Doctor';
import dbConnect from '../lib/mongodb'; // Ensure you have a dbConnect utility

export async function adminAuth(req) {

  const token = req.headers.get('Authorization')?.split(' ')[1];
  console.log('token', token);
  

  if (!token) {
    return NextResponse.json({ error: "Token missing." }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    await dbConnect();

    return { decoded };
  } catch (error) {
    console.error("Admin Auth Error:", error);
    return NextResponse.json({ error: "Invalid or expired token." }, { status: 401 });
  }
}
