// /context/AuthContext.js

"use client";
import React, { createContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";

// Create the Auth Context
export const AuthContext = createContext();

// Create the Auth Provider component
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, role: null });
  const [loading, setLoading] = useState(true);

  // Initialize authentication state on component mount
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp && decoded.exp < currentTime) {
            // Token has expired
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            setAuth({ token: null, role: null });
          } else {
            setAuth({ token, role });
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setAuth({ token: null, role: null });
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Function to log in the user
  const login = (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setAuth({ token, role });
    return true;
  };

  // Function to log out the user
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setAuth({ token: null, role: null });
    return true;
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout,setAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
