// // /app/api/register/route.js

// import dbConnect from '@/lib/mongodb';
// import User from '@/models/User';
// import { NextResponse } from 'next/server';

// export async function POST(request) {
//   try {
//     const { email, password, role } = await request.json();

//     // Validate request body
//     if (!email || !password) {
//       return NextResponse.json(
//         { error: 'Email and password are required.' },
//         { status: 400 }
//       );
//     }

//     // Connect to MongoDB
//     await dbConnect();

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json(
//         { error: 'User already exists with this email.' },
//         { status: 409 }
//       );
//     }

//     // Create new user
//     const user = await User.create({
//       email,
//       password,
//       role: role || 'user', // Default role to 'user' if not provided
//     });

//     // Return success message
//     return NextResponse.json(
//       { message: 'User registered successfully.' },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('Registration Error:', error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }
