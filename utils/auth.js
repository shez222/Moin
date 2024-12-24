// /utils/auth.js

import jwt from 'jsonwebtoken';  
export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error("Token Verification Error:", error);
    return null;
  }
}
