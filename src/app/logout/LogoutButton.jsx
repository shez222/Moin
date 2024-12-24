// /components/LogoutButton.js

"use client";
import React, { useContext } from 'react';
import { AuthContext } from '@/../context/AuthContext'; // Adjust the path as necessary
import { FiLogOut } from 'react-icons/fi'; // Using an icon for better UX

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  
  const handleLogout = () => {
    const isLoggedOut = logout();

    if (isLoggedOut) {
      // Handle successful logout, e.g., redirect to login page
      window.location.href = '/'; // Replace with your login page URL
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
      aria-label="Logout"
    >
      <FiLogOut className="mr-2" />
      Logout
    </button>
  );
};

export default LogoutButton;
