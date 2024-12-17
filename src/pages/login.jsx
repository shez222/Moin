"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from Next.js App Router
import Link from "next/link"; // For navigation links

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [error, setError] = useState(""); // State for error messages

  const router = useRouter(); // Initialize useRouter

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    router.push("/landingPage");
    e.preventDefault(); // Prevent default form submission

    // Basic form validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    // Simulated authentication logic
    // Replace this with real authentication (e.g., API call) as needed
    const validEmail = "test@example.com";
    const validPassword = "password123";

    if (email === validEmail && password === validPassword) {
      // Clear any existing errors
      setError("");

      // Navigate to the Landing Page
      router.push("/landingPage");
    } else {
      // Set error message for invalid credentials
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* Left Section */}
      <div className="w-full lg:w-3/5 max-h-96 mt-0 lg:mt-72 bg-gradient-to-r from-blue-600 to-orange-500 p-8 flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left Logo */}
          <img
            src="/logo.png" // Replace with your actual logo path
            alt="Pakistan Society of Neurology"
            className="w-48 lg:w-80 h-auto mx-auto lg:mx-0 -mt-10 -ml-0 lg:-ml-9 mb-4 lg:mb-0"
          />

          {/* Right Brain Network Image */}
          <img
            src="/images.jpeg" // Replace with your actual brain network image path
            alt="Neurology Network"
            className="w-40 lg:w-60 mx-auto lg:mx-0"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-2/5 my-8 mx-auto bg-white rounded-lg shadow-xl px-8 lg:px-32 py-12 lg:py-52 mr-0 lg:mr-5">
        <h1 className="text-2xl lg:text-4xl font-semibold mb-4 lg:mb-6 text-gray-700 text-left">
          Welcome to{" "}
          <br />
          <span className="text-teal-500 font-bold">
            Pakistan Society of Neurology
          </span>
        </h1>

        {/* Display Error Message */}
        {error && (
          <div
            className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">✉️</span>
              <input
                type="email"
                id="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-400"
                // required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">🔑</span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="**********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-teal-400"
                // required
              />
              {/* Eye Icon */}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-gray-500 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // Eye Closed Icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l1.418 1.418C2.948 6.092 1.5 8.756 1.5 10c0 1.244 1.448 3.908 4.205 6.291l1.414 1.414a1 1 0 001.414-1.414L5.619 16.705C4.191 15.471 3.5 13.828 3.5 13c0-.828.691-2.471 2.119-3.705l1.414-1.414a5.975 5.975 0 012.462-1.502l1.414-1.414A1 1 0 0010 6a1 1 0 00-.293-.707l-1.414-1.414A1 1 0 006 3a5.978 5.978 0 00-2.293.707L3.707 2.293zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  // Eye Open Icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 3C5 3 1.73 7.11 1.73 10c0 2.89 3.27 7 8.27 7s8.27-4.11 8.27-7c0-2.89-3.27-7-8.27-7zm0 12a5 5 0 110-10 5 5 0 010 10z" />
                    <circle cx="10" cy="10" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <div className="flex items-center mb-2 sm:mb-0">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 text-teal-500"
              />
              <label htmlFor="remember" className="ml-2 text-gray-700">
                Remember me
              </label>
            </div>
            {/* <Link href="/forgot-password">
              <a className="text-teal-500 hover:underline text-sm font-medium">
                Forgot Password?
              </a>
            </Link> */}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-2 rounded-md font-medium hover:bg-teal-600 transition duration-200"
          >
            Login
          </button>

          {/* Footer */}
          <p className="text-center mt-8 text-gray-500 text-sm">
            Facilitation by Helix Pharma (Pvt) Ltd. Developed by Softsols Pakistan
          </p>
        </form>
      </div>
    </div>
  );
}
