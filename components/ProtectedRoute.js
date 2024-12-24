// /components/ProtectedRoute.js

"use client";
import React, { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Adjust the path as needed
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { auth, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!auth.token) {
        // If not authenticated, redirect to login
        router.push("/login");
      } else if (allowedRoles && !allowedRoles.includes(auth.role)) {
        // If role is not allowed, redirect to unauthorized page
        router.push("/unauthorized");
      }
      // Else, allow access
    }
  }, [auth, loading, allowedRoles, router]);

  if (loading || (!auth.token && !loading)) {
    // Optional: Render a loading spinner or placeholder
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
