// /middleware.js

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Define public paths that don't require authentication
  const publicPaths = ['/api/login', '/api/register', '/favicon.ico'];

  // Check if the request is for a public path
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Get the token from the Authorization header
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to the request for downstream use
    request.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware JWT Error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Define the paths to apply the middleware
export const config = {
  matcher: ['/protected/:path*'], // Apply middleware to protected routes
};
