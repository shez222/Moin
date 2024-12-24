// /app/api/login/route.js

import dbConnect from '../../../../lib/mongodb';
import User from '../../../..//models/User';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
const dotenv = require('dotenv');
dotenv.config();

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate request body
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await dbConnect();

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Create JWT payload
    const payload = {
      userId: user._id,
      role: user.role,
    };

    // Sign the token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    // Return the token and role
    return NextResponse.json(
      { token, role: user.role },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
