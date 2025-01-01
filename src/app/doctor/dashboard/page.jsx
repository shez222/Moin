// /app/doctor/dashboard/page.js

"use client";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/../context/AuthContext"; // Adjusted path
import { useRouter } from "next/navigation";
import UploadProfileImage from "@/app/pages/UploadProfileImage";
import UploadBankSlip from "@/app/pages/UploadBankSlip";
import {
  FiUser,
  FiMail,
  FiMapPin,
  FiPhone,
  FiCalendar,
  FiClipboard,
  FiBook,
  FiImage, // Imported FiIdBadge for ID Card tab
} from "react-icons/fi";
import IDCard from "@/app/admin/Idcard/IDCard"; // Imported IDCard component
import LogoutButton from "@/app/logout/LogoutButton"; // Import the LogoutButton component

const DoctorDashboard = () => {
  const { auth, loading } = useContext(AuthContext);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("profile"); // Manage active tab

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
    additionalTrainingInfo: {
      name: "",
      institution: "",
      duration: "",
    },
    applicantAffiliation: {
      institution: "",
      duration: "",
      designation: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [isFinalized, setIsFinalized] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState("");
  const [paymentApprovalStatus, setPaymentApprovalStatus] = useState(""); // New state for payment approval

  // Fetch doctor's profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/doctor/profile/getdocprofile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`, // Fixed syntax
          },
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            // Unauthorized, redirect to login
            router.push('/login');
          } else {
            setSubmissionError(data.error || 'Failed to fetch profile.');
          }
        } else {
          console.log('data', typeof (data.formDataId.isFinalized));

          setFormData(data.formDataId);
          setIsFinalized(data.formDataId.isFinalized);
          setApprovalStatus(data.formDataId.approvalStatus);
          setPaymentApprovalStatus(data.formDataId.paymentApprovalStatus); // Set payment approval status
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setSubmissionError('An unexpected error occurred while fetching profile.');
      }
    };

    if (!loading && auth.token) {
      fetchProfile();
    }
  }, [auth, loading, router]);

  // Handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;

    // Check if the id includes a dot, indicating a nested field
    if (id.includes(".")) {
      const [parent, child] = id.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));

      // Remove error message for the nested field
      setErrors((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: "",
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));

      // Remove error message upon input
      setErrors((prev) => ({
        ...prev,
        [id]: "",
      }));
    }
  };

  // Validate form data
  const validate = () => {
    const newErrors = {};

    // Validate top-level fields
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address.";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    // Add other top-level validations as necessary

    // Validate additionalTrainingInfo fields
    const trainingErrors = {};
    if (!formData.additionalTrainingInfo.name.trim()) {
      trainingErrors.name = "Name is required.";
    }
    if (!formData.additionalTrainingInfo.institution.trim()) {
      trainingErrors.institution = "Institution is required.";
    }
    if (!formData.additionalTrainingInfo.duration.trim()) {
      trainingErrors.duration = "Duration is required.";
    }
    if (Object.keys(trainingErrors).length > 0) {
      newErrors.additionalTrainingInfo = trainingErrors;
    }

    // Validate applicantAffiliation fields
    const affiliationErrors = {};
    if (!formData.applicantAffiliation.institution.trim()) {
      affiliationErrors.institution = "Institution is required.";
    }
    if (!formData.applicantAffiliation.duration.trim()) {
      affiliationErrors.duration = "Duration is required.";
    }
    if (!formData.applicantAffiliation.designation.trim()) {
      affiliationErrors.designation = "Designation is required.";
    }
    if (Object.keys(affiliationErrors).length > 0) {
      newErrors.applicantAffiliation = affiliationErrors;
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const formErrors = validate();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors); // Set validation errors
      return;
    }

    setIsSubmitting(true);
    setSubmissionError("");

    try {
      const response = await fetch('/api/doctor/profile/updatedocprofile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`, // Fixed syntax
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle errors returned by the API
        setSubmissionError(data.error || 'Something went wrong. Please try again.');
        setIsSubmitting(false);
      } else {
        // Success: Optionally, show a success message
        alert('Profile updated successfully.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Handle form finalization
  const handleFinalize = async () => {
    const confirmFinalize = confirm("Are you sure you want to finalize your profile? You will not be able to make changes afterward.");

    if (!confirmFinalize) return;

    setIsSubmitting(true);
    setSubmissionError("");

    try {
      const response = await fetch('/api/doctor/profile/finalize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`, // Fixed syntax
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle errors returned by the API
        setSubmissionError(data.error || 'Something went wrong. Please try again.');
        setIsSubmitting(false);
      } else {
        // Success: Update local state to reflect finalization
        alert('Profile finalized successfully and sent for admin approval.');
        setIsFinalized(true);
        setApprovalStatus('Pending');
        setPaymentApprovalStatus('Pending'); // Initialize payment approval status
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error finalizing profile:', error);
      setSubmissionError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Helper function to render input fields
  const renderInput = (field, parent = null) => {
    const fieldId = parent ? `${parent}.${field.id}` : field.id;
    const fieldValue = parent ? formData[parent][field.id] : formData[field.id];
    const fieldError = parent
      ? errors[parent]?.[field.id]
      : errors[field.id];

    return (
      <div key={field.id} className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 text-lg mt-7">
          {field.icon}
        </div>
        <div className="w-full">
          <label htmlFor={fieldId} className="block text-[#1D3851] font-semibold mb-2">
            {field.label}
          </label>
          <input
            type={
              field.id === "dob"
                ? "date"
                : field.id === "email"
                  ? "email"
                  : "text"
            }
            id={fieldId}
            placeholder={field.placeholder}
            value={fieldValue}
            onChange={handleChange}
            disabled={isFinalized} // Disable input if finalized
            className={`w-full pl-12 border ${fieldError ? "border-red-500" : "border-gray-300"
              } rounded-md py-3 px-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#45C0C9] focus:outline-none shadow-sm ${isFinalized ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
          />
          {/* Display Validation Error */}
          {fieldError && (
            <p className="text-red-500 text-sm mt-1" role="alert">
              {fieldError}
            </p>
          )}
        </div>
      </div>
    );
  };

  // If loading or not authenticated, show nothing or a loader
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login (handled by AuthContext)
  if (!auth.token) {

    return null;
  }

  return (
    <div className="min-h-screen bg-[#F4FBFF] py-12 px-4">
      <div className="container mx-auto max-w-6xl bg-white p-8 rounded-md shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#1D3851]">Doctor Dashboard</h1>
          <LogoutButton /> {/* Render the LogoutButton here */}
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-4 border-b-2 border-gray-200">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-2 px-4 ${activeTab === "profile"
                  ? "border-b-4 border-[#45C0C9] text-[#45C0C9] font-semibold"
                  : "text-gray-500 hover:text-[#45C0C9]"
                }`}
              aria-current={activeTab === "profile" ? "page" : undefined}
            >
              <FiUser className="inline-block mr-1" />
              Profile Information
            </button>
            {isFinalized === true && (
              <button
                onClick={() => setActiveTab("professional")}
                className={`py-2 px-4 ${activeTab === "professional"
                    ? "border-b-4 border-[#45C0C9] text-[#45C0C9] font-semibold"
                    : "text-gray-500 hover:text-[#45C0C9]"
                  }`}
                aria-current={activeTab === "professional" ? "page" : undefined}
              >
                <FiImage className="inline-block mr-1" />
                Upload Profile Image
              </button>
            )}
            {approvalStatus === "Approved" && isFinalized === true && (
              <button
                onClick={() => setActiveTab("publications")}
                className={`py-2 px-4 ${activeTab === "publications"
                    ? "border-b-4 border-[#45C0C9] text-[#45C0C9] font-semibold"
                    : "text-gray-500 hover:text-[#45C0C9]"
                  }`}
                aria-current={activeTab === "publications" ? "page" : undefined}
              >
                <FiBook className="inline-block mr-1" />
                Upload Bank Slip
              </button>
            )}
            {/* Conditionally render the ID Card tab */}
            {approvalStatus === "Approved" && paymentApprovalStatus === "Approved" && isFinalized === true && (
              <button
                onClick={() => setActiveTab("idcard")}
                className={`py-2 px-4 ${activeTab === "idcard"
                    ? "border-b-4 border-[#45C0C9] text-[#45C0C9] font-semibold"
                    : "text-gray-500 hover:text-[#45C0C9]"
                  }`}
                aria-current={activeTab === "idcard" ? "page" : undefined}
              >
                <FiImage className="inline-block mr-1" />
                Generate ID Card
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "profile" && (
            <>
              {/* Display Approval Status */}
              <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                <p><strong>Finalization Status:</strong> {isFinalized ? "Finalized" : "Not Finalized"}</p>
                <p><strong>Profile Approval Status:</strong> {approvalStatus}</p>
                <p><strong>Payment Approval Status:</strong> {paymentApprovalStatus}</p>
              </div>

              {/* Display Submission Error */}
              {submissionError && (
                <div className="mb-4 text-red-500 text-center">
                  {submissionError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Applicant Particulars */}
                <h2 className="text-2xl font-semibold text-[#1D3851] mb-4">
                  Applicant <span className="text-[#45C0C9]">Particulars</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Left Column Fields */}
                  <div className="space-y-4">
                    {[
                      { id: "name", label: "Name", placeholder: "Enter your full name", icon: <FiUser /> },
                      { id: "residence", label: "Member Residence", placeholder: "Enter your residence", icon: <FiMapPin /> },
                      { id: "gender", label: "Gender", placeholder: "Enter your gender", icon: <FiUser /> },
                      { id: "pmdcNumber", label: "PMDC Number", placeholder: "Enter your PMDC number", icon: <FiClipboard /> },
                      { id: "address", label: "Address", placeholder: "Enter your address", icon: <FiMapPin /> },
                      { id: "province", label: "Province", placeholder: "Enter your province", icon: <FiMapPin /> },
                      { id: "country", label: "Country", placeholder: "Enter your country", icon: <FiMapPin /> },
                      { id: "email", label: "Email", placeholder: "Enter your email", icon: <FiMail /> },
                    ].map((field) => renderInput(field))}
                  </div>

                  {/* Right Column Fields */}
                  <div className="space-y-4">
                    {[
                      { id: "fathersName", label: "Father's Name", placeholder: "Enter your father's name", icon: <FiUser /> },
                      { id: "dob", label: "Date of Birth", placeholder: "", icon: <FiCalendar /> },
                      { id: "cnic", label: "CNIC Number", placeholder: "Enter your CNIC number", icon: <FiClipboard /> },
                      { id: "fellowshipNumber", label: "Fellowship Number", placeholder: "Enter your fellowship number", icon: <FiClipboard /> },
                      { id: "city", label: "City", placeholder: "Enter your city", icon: <FiMapPin /> },
                      { id: "zip", label: "Zip/Postal Code", placeholder: "Enter your zip/postal code", icon: <FiMapPin /> },
                      { id: "phone", label: "Phone with WhatsApp", placeholder: "Enter your phone number", icon: <FiPhone /> },
                    ].map((field) => renderInput(field))}
                  </div>
                </div>

                {/* Additional Training or Fellowship */}
                <h2 className="text-2xl font-semibold text-[#1D3851] mb-4">
                  Additional Training <span className="text-[#45C0C9]">or</span> Fellowship
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Left Column Fields */}
                  <div className="space-y-4">
                    {[
                      { id: "name", label: "Name", placeholder: "Enter your full name", icon: <FiUser /> },
                      { id: "institution", label: "Institution", placeholder: "Enter your institution", icon: <FiMapPin /> },
                    ].map((field) => renderInput(field, "additionalTrainingInfo"))}
                  </div>

                  {/* Right Column Fields */}
                  <div className="space-y-4">
                    {[
                      { id: "duration", label: "Duration", placeholder: "Enter the duration", icon: <FiCalendar /> },
                    ].map((field) => renderInput(field, "additionalTrainingInfo"))}
                  </div>
                </div>

                {/* Applicant Affiliation */}
                <h2 className="text-2xl font-semibold text-[#1D3851] mb-4">
                  Applicant <span className="text-[#45C0C9]">Affiliation</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Left Column Fields */}
                  <div className="space-y-4">
                    {[
                      { id: "institution", label: "Institution", placeholder: "Enter your institution", icon: <FiMapPin /> },
                      { id: "duration", label: "Duration", placeholder: "Enter the duration", icon: <FiCalendar /> },
                    ].map((field) => renderInput(field, "applicantAffiliation"))}
                  </div>

                  {/* Right Column Fields */}
                  <div className="space-y-4">
                    {[
                      { id: "designation", label: "Designation", placeholder: "Enter your designation", icon: <FiUser /> },
                    ].map((field) => renderInput(field, "applicantAffiliation"))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col md:flex-row justify-end space-y-4 md:space-y-0 md:space-x-4">
                  {/* Save Button */}
                  {!isFinalized && (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`bg-[#45C0C9] hover:bg-[#3dadb7] text-white font-semibold py-2 px-6 rounded transition duration-300 shadow-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  )}

                  {/* Finalize Button */}
                  {!isFinalized && (
                    <button
                      type="button"
                      onClick={handleFinalize}
                      disabled={isSubmitting}
                      className={`bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded transition duration-300 shadow-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                      {isSubmitting ? 'Finalizing...' : 'Finalize Submission'}
                    </button>
                  )}

                  {/* View Approval Status */}
                  {isFinalized && (
                    <button
                      type="button"
                      className="bg-gray-500 text-white font-semibold py-2 px-6 rounded cursor-default"
                      disabled
                    >
                      Finalized
                    </button>
                  )}
                </div>
              </form>
            </>
          )}

          {activeTab === "professional" && (
            <div>
              <UploadProfileImage />
            </div>
          )}

          {activeTab === "publications" && (
            <div>
              <UploadBankSlip />
            </div>
          )}

          {/* Render IDCard component only if the tab is active and both approvals are Approved */}
          {activeTab === "idcard" && approvalStatus === "Approved" && paymentApprovalStatus === "Approved" && isFinalized === true && (
            <IDCard formData={formData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;










