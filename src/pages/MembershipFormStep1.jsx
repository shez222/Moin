"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from Next.js App Router
import Link from "next/link"; // For navigation links
import { FiUser, FiMail, FiMapPin, FiPhone, FiCalendar, FiClipboard } from "react-icons/fi";

const MembershipFormStep1 = () => {
  const router = useRouter(); // Initialize useRouter

  // State for form fields
  const [formData, setFormData] = useState({
    name: "",
    residence: "",
    gender: "",
    pmdcNumber: "",
    address: "",
    province: "",
    country: "",
    email: "",
    fathersName: "",
    dob: "",
    cnic: "",
    fellowshipNumber: "",
    city: "",
    zip: "",
    phone: "",
  });

  // State for form validation errors
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Remove error message upon input
    setErrors((prev) => ({
      ...prev,
      [id]: "",
    }));
  };

  // Validate form data
  const validate = () => {
    const newErrors = {};

    // Example validations (you can add more as needed)
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address.";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    // Add other validations as necessary

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    router.push("/membershipForm/step2");

    e.preventDefault(); // Prevent default form submission

    // const formErrors = validate();

    // if (Object.keys(formErrors).length > 0) {
    //   setErrors(formErrors); // Set validation errors
    // } else {
    //   // Proceed to Step 2
    //   // You can also save formData to a global state or context here
    //   router.push("/membershipForm/step2");
    // }
  };

  return (
    <>
      {/* Intro Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1D3851] mb-4 leading-tight">
            Pakistan <span className="text-[#45C0C9]">Society Of Neurology</span> Membership Form!
          </h1>
          <p className="text-[#1D3851] text-base md:text-lg mb-8 max-w-2xl">
            Welcome to the Pakistan Society of Neurology (PSN)! We are excited to have you join our community 
            of professionals dedicated to advancing the field of neurology in Pakistan. To become a member, 
            please complete the following steps in the membership registration process.
          </p>
        </div>
      </div>

      {/* Membership Form Section */}
      <section className="bg-[#F4FBFF] py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Step Indicator */}
          <p className="text-gray-600 mb-8 font-medium text-center md:text-left">Step 1 of 3</p>

          {/* Applicant Particulars */}
          <h2 className="text-2xl font-bold text-[#1D3851] mb-6">
            Applicant <span className="text-[#45C0C9]">Particulars</span>
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Left Column Fields */}
              <div className="space-y-6">
                {[
                  { id: 'name', label: 'Name', placeholder: 'Enter your full name', icon: <FiUser /> },
                  { id: 'residence', label: 'Member Residence', placeholder: 'Enter your residence', icon: <FiMapPin /> },
                  { id: 'gender', label: 'Gender', placeholder: 'Enter your gender', icon: <FiUser /> },
                  { id: 'pmdcNumber', label: 'PMDC Number', placeholder: 'Enter your PMDC number', icon: <FiClipboard /> },
                  { id: 'address', label: 'Address', placeholder: 'Enter your address', icon: <FiMapPin /> },
                  { id: 'province', label: 'Province', placeholder: 'Enter your province', icon: <FiMapPin /> },
                  { id: 'country', label: 'Country', placeholder: 'Enter your country', icon: <FiMapPin /> },
                  { id: 'email', label: 'Email', placeholder: 'Enter your email', icon: <FiMail /> },
                ].map((field, index) => (
                  <div key={index} className="relative flex items-center">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 text-lg mt-7">
                      {field.icon}
                    </div>
                    <div className="w-full">
                      <label htmlFor={field.id} className="block text-[#1D3851] font-semibold mb-2">
                        {field.label}
                      </label>
                      <input
                        type={field.id === 'email' ? 'email' : 'text'}
                        id={field.id}
                        placeholder={field.placeholder}
                        value={formData[field.id]}
                        onChange={handleChange}
                        className={`w-full pl-12 border border-gray-300 rounded-md py-3 px-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#45C0C9] focus:outline-none shadow-sm ${
                          errors[field.id] ? 'border-red-500' : ''
                        }`}
                      />
                      {/* Display Validation Error */}
                      {errors[field.id] && (
                        <p className="text-red-500 text-sm mt-1" role="alert">
                          {errors[field.id]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column Fields */}
              <div className="space-y-6">
                {[
                  { id: 'fathersName', label: "Father's Name", placeholder: "Enter your father's name", icon: <FiUser /> },
                  { id: 'dob', label: 'Date of Birth', placeholder: '', icon: <FiCalendar /> },
                  { id: 'cnic', label: 'CNIC Number', placeholder: 'Enter your CNIC number', icon: <FiClipboard /> },
                  { id: 'fellowshipNumber', label: 'Fellowship Number', placeholder: 'Enter your fellowship number', icon: <FiClipboard /> },
                  { id: 'city', label: 'City', placeholder: 'Enter your city', icon: <FiMapPin /> },
                  { id: 'zip', label: 'Zip/Postal Code', placeholder: 'Enter your zip/postal code', icon: <FiMapPin /> },
                  { id: 'phone', label: 'Phone with WhatsApp', placeholder: 'Enter your phone number', icon: <FiPhone /> },
                ].map((field, index) => (
                  <div key={index} className="relative flex items-center">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 text-lg mt-7">
                      {field.icon}
                    </div>
                    <div className="w-full">
                      <label htmlFor={field.id} className="block text-[#1D3851] font-semibold mb-2">
                        {field.label}
                      </label>
                      <input
                        type={
                          field.id === 'dob'
                            ? 'date'
                            : field.id === 'email'
                            ? 'email'
                            : 'text'
                        }
                        id={field.id}
                        placeholder={field.placeholder}
                        value={formData[field.id]}
                        onChange={handleChange}
                        className={`w-full pl-12 border border-gray-300 rounded-md py-3 px-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#45C0C9] focus:outline-none shadow-sm ${
                          errors[field.id] ? 'border-red-500' : ''
                        }`}
                      />
                      {/* Display Validation Error */}
                      {errors[field.id] && (
                        <p className="text-red-500 text-sm mt-1" role="alert">
                          {errors[field.id]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row justify-between mt-8 space-y-4 md:space-y-0">
              {/* Previous Button */}
              <button
                type="button"
                onClick={() => router.push("/landingPage")}
                className="w-full md:w-auto bg-white border border-[#45C0C9] text-[#45C0C9] font-semibold py-3 px-8 rounded hover:bg-[#E6F2F9] transition duration-300 shadow-sm"
              >
                Previous
              </button>

              {/* Next Button */}
              <button
                type="submit"
                className="w-full md:w-auto bg-[#45C0C9] hover:bg-[#3dadb7] text-white font-semibold py-3 px-8 rounded transition duration-300 shadow-sm"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default MembershipFormStep1;
