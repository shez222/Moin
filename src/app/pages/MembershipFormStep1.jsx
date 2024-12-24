// /app/membership-form/page.js

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js App Router
import Link from "next/link"; // For navigation links
import { FiUser, FiMail, FiMapPin, FiPhone, FiCalendar, FiClipboard } from "react-icons/fi";

const MembershipFormStep = () => {
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

  // State for form validation errors
  const [errors, setErrors] = useState({});

  // State for submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

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
      const response = await fetch('/api/draftForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle errors returned by the API
        setSubmissionError(data.error || 'Something went wrong. Please try again.');
        setIsSubmitting(false);
      } else {
        // Success: Redirect to the thank you page
        router.push('/thanks');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
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
            className={`w-full pl-12 border ${
              fieldError ? "border-red-500" : "border-gray-300"
            } rounded-md py-3 px-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#45C0C9] focus:outline-none shadow-sm`}
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
          <form onSubmit={handleSubmit}>
            {/* Applicant Particulars */}
            <h2 className="text-4xl font-bold text-[#1D3851] mb-6">
              Applicant <span className="text-[#45C0C9]">Particulars</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Left Column Fields */}
              <div className="space-y-6">
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
              <div className="space-y-6">
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
            <h2 className="text-4xl font-bold text-[#1D3851] mb-6">
              Additional Training <span className="text-[#45C0C9]">or</span> Fellowship
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Left Column Fields */}
              <div className="space-y-6">
                {[
                  { id: "name", label: "Name", placeholder: "Enter your full name", icon: <FiUser /> },
                  { id: "institution", label: "Institution", placeholder: "Enter your institution", icon: <FiMapPin /> },
                ].map((field) => renderInput(field, "additionalTrainingInfo"))}
              </div>

              {/* Right Column Fields */}
              <div className="space-y-6">
                {[
                  { id: "duration", label: "Duration", placeholder: "Enter the duration", icon: <FiCalendar /> },
                ].map((field) => renderInput(field, "additionalTrainingInfo"))}
              </div>
            </div>

            {/* Applicant Affiliation */}
            <h2 className="text-4xl font-bold text-[#1D3851] mb-6">
              Applicant <span className="text-[#45C0C9]">Affiliation</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Left Column Fields */}
              <div className="space-y-6">
                {[
                  { id: "institution", label: "Institution", placeholder: "Enter your institution", icon: <FiMapPin /> },
                  { id: "duration", label: "Duration", placeholder: "Enter the duration", icon: <FiCalendar /> },
                ].map((field) => renderInput(field, "applicantAffiliation"))}
              </div>

              {/* Right Column Fields */}
              <div className="space-y-6">
                {[
                  { id: "designation", label: "Designation", placeholder: "Enter your designation", icon: <FiUser /> },
                ].map((field) => renderInput(field, "applicantAffiliation"))}
              </div>
            </div>

            {/* Display Submission Error */}
            {submissionError && (
              <div className="mb-4 text-red-500 text-center">
                {submissionError}
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col md:flex-row justify-center mt-8 space-y-4 md:space-y-0">
              {/* Previous Button */}
              {/* <button
                type="button"
                onClick={() => router.push("/landingPage")}
                className="w-full md:w-auto bg-white border border-[#45C0C9] text-[#45C0C9] font-semibold py-3 px-8 rounded hover:bg-[#E6F2F9] transition duration-300 shadow-sm"
              >
                Previous
              </button> */}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full md:w-auto bg-[#45C0C9] hover:bg-[#3dadb7] text-white font-semibold py-3 px-8 rounded transition duration-300 shadow-sm ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Draft Complete'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default MembershipFormStep;













// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation"; // Next.js App Router
// import Link from "next/link"; // For navigation links
// import { FiUser, FiMail, FiMapPin, FiPhone, FiCalendar, FiClipboard } from "react-icons/fi";

// const MembershipFormStep = () => {
//   const router = useRouter(); // Initialize useRouter

//   // State for form fields
//   const [formData, setFormData] = useState({
//     name: "",
//     residence: "",
//     gender: "",
//     pmdcNumber: "",
//     address: "",
//     province: "",
//     country: "",
//     email: "",
//     fathersName: "",
//     dob: "",
//     cnic: "",
//     fellowshipNumber: "",
//     city: "",
//     zip: "",
//     phone: "",
//     additionalTrainingInfo: {
//       name: "",
//       institution: "",
//       duration: "",
//     },
//     applicantAffiliation: {
//       institution: "",
//       duration: "",
//       designation: "",
//     },
//   });

//   // State for form validation errors
//   const [errors, setErrors] = useState({});

//   // State for submission status
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submissionError, setSubmissionError] = useState("");

//   // Handle input change
//   const handleChange = (e) => {
//     const { id, value } = e.target;

//     // Check if the id includes a dot, indicating a nested field
//     if (id.includes(".")) {
//       const [parent, child] = id.split(".");
//       setFormData((prev) => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: value,
//         },
//       }));

//       // Remove error message for the nested field
//       setErrors((prev) => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: "",
//         },
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [id]: value,
//       }));

//       // Remove error message upon input
//       setErrors((prev) => ({
//         ...prev,
//         [id]: "",
//       }));
//     }
//   };

//   // Validate form data
//   const validate = () => {
//     const newErrors = {};

//     // Validate top-level fields
//     if (!formData.name.trim()) newErrors.name = "Name is required.";
//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required.";
//     } else if (
//       !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
//     ) {
//       newErrors.email = "Invalid email address.";
//     }
//     if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
//     // Add other top-level validations as necessary

//     // Validate additionalTrainingInfo fields
//     const trainingErrors = {};
//     if (!formData.additionalTrainingInfo.name.trim()) {
//       trainingErrors.name = "Name is required.";
//     }
//     if (!formData.additionalTrainingInfo.institution.trim()) {
//       trainingErrors.institution = "Institution is required.";
//     }
//     if (!formData.additionalTrainingInfo.duration.trim()) {
//       trainingErrors.duration = "Duration is required.";
//     }
//     if (Object.keys(trainingErrors).length > 0) {
//       newErrors.additionalTrainingInfo = trainingErrors;
//     }

//     // Validate applicantAffiliation fields
//     const affiliationErrors = {};
//     if (!formData.applicantAffiliation.institution.trim()) {
//       affiliationErrors.institution = "Institution is required.";
//     }
//     if (!formData.applicantAffiliation.duration.trim()) {
//       affiliationErrors.duration = "Duration is required.";
//     }
//     if (!formData.applicantAffiliation.designation.trim()) {
//       affiliationErrors.designation = "Designation is required.";
//     }
//     if (Object.keys(affiliationErrors).length > 0) {
//       newErrors.applicantAffiliation = affiliationErrors;
//     }

//     return newErrors;
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent default form submission

//     const formErrors = validate();

//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors); // Set validation errors
//       return;
//     }

//     setIsSubmitting(true);
//     setSubmissionError("");

//     try {
//       const response = await fetch('/api/membership', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         // Handle errors returned by the API
//         setSubmissionError(data.error || 'Something went wrong. Please try again.');
//         setIsSubmitting(false);
//       } else {
//         // Success: Redirect to the thank you page
//         router.push('/thanks');
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       setSubmissionError('An unexpected error occurred. Please try again.');
//       setIsSubmitting(false);
//     }
//   };

//   // Helper function to render input fields
//   const renderInput = (field, parent = null) => {
//     const fieldId = parent ? `${parent}.${field.id}` : field.id;
//     const fieldValue = parent ? formData[parent][field.id] : formData[field.id];
//     const fieldError = parent
//       ? errors[parent]?.[field.id]
//       : errors[field.id];

//     return (
//       <div key={field.id} className="relative flex items-center">
//         <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 text-lg mt-7">
//           {field.icon}
//         </div>
//         <div className="w-full">
//           <label htmlFor={fieldId} className="block text-[#1D3851] font-semibold mb-2">
//             {field.label}
//           </label>
//           <input
//             type={
//               field.id === "dob"
//                 ? "date"
//                 : field.id === "email"
//                 ? "email"
//                 : "text"
//             }
//             id={fieldId}
//             placeholder={field.placeholder}
//             value={fieldValue}
//             onChange={handleChange}
//             className={`w-full pl-12 border ${
//               fieldError ? "border-red-500" : "border-gray-300"
//             } rounded-md py-3 px-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#45C0C9] focus:outline-none shadow-sm`}
//           />
//           {/* Display Validation Error */}
//           {fieldError && (
//             <p className="text-red-500 text-sm mt-1" role="alert">
//               {fieldError}
//             </p>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       {/* Intro Section */}
//       <div className="bg-white">
//         <div className="container mx-auto px-4 py-8 max-w-6xl">
//           <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1D3851] mb-4 leading-tight">
//             Pakistan <span className="text-[#45C0C9]">Society Of Neurology</span> Membership Form!
//           </h1>
//           <p className="text-[#1D3851] text-base md:text-lg mb-8 max-w-2xl">
//             Welcome to the Pakistan Society of Neurology (PSN)! We are excited to have you join our community 
//             of professionals dedicated to advancing the field of neurology in Pakistan. To become a member, 
//             please complete the following steps in the membership registration process.
//           </p>
//         </div>
//       </div>

//       {/* Membership Form Section */}
//       <section className="bg-[#F4FBFF] py-12">
//         <div className="container mx-auto px-4 max-w-6xl">


//           <form onSubmit={handleSubmit}>
//             {/* Applicant Particulars */}
//             <h2 className="text-4xl font-bold text-[#1D3851] mb-6">
//               Applicant <span className="text-[#45C0C9]">Particulars</span>
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
//               {/* Left Column Fields */}
//               <div className="space-y-6">
//                 {[
//                   { id: "name", label: "Name", placeholder: "Enter your full name", icon: <FiUser /> },
//                   { id: "residence", label: "Member Residence", placeholder: "Enter your residence", icon: <FiMapPin /> },
//                   { id: "gender", label: "Gender", placeholder: "Enter your gender", icon: <FiUser /> },
//                   { id: "pmdcNumber", label: "PMDC Number", placeholder: "Enter your PMDC number", icon: <FiClipboard /> },
//                   { id: "address", label: "Address", placeholder: "Enter your address", icon: <FiMapPin /> },
//                   { id: "province", label: "Province", placeholder: "Enter your province", icon: <FiMapPin /> },
//                   { id: "country", label: "Country", placeholder: "Enter your country", icon: <FiMapPin /> },
//                   { id: "email", label: "Email", placeholder: "Enter your email", icon: <FiMail /> },
//                 ].map((field) => renderInput(field))}
//               </div>

//               {/* Right Column Fields */}
//               <div className="space-y-6">
//                 {[
//                   { id: "fathersName", label: "Father's Name", placeholder: "Enter your father's name", icon: <FiUser /> },
//                   { id: "dob", label: "Date of Birth", placeholder: "", icon: <FiCalendar /> },
//                   { id: "cnic", label: "CNIC Number", placeholder: "Enter your CNIC number", icon: <FiClipboard /> },
//                   { id: "fellowshipNumber", label: "Fellowship Number", placeholder: "Enter your fellowship number", icon: <FiClipboard /> },
//                   { id: "city", label: "City", placeholder: "Enter your city", icon: <FiMapPin /> },
//                   { id: "zip", label: "Zip/Postal Code", placeholder: "Enter your zip/postal code", icon: <FiMapPin /> },
//                   { id: "phone", label: "Phone with WhatsApp", placeholder: "Enter your phone number", icon: <FiPhone /> },
//                 ].map((field) => renderInput(field))}
//               </div>
//             </div>

//             {/* Additional Training or Fellowship */}
//             <h2 className="text-4xl font-bold text-[#1D3851] mb-6">
//               Additional Training <span className="text-[#45C0C9]">or</span> Fellowship
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
//               {/* Left Column Fields */}
//               <div className="space-y-6">
//                 {[
//                   { id: "name", label: "Name", placeholder: "Enter your full name", icon: <FiUser /> },
//                   { id: "institution", label: "Institution", placeholder: "Enter your institution", icon: <FiMapPin /> },
//                 ].map((field) => renderInput(field, "additionalTrainingInfo"))}
//               </div>

//               {/* Right Column Fields */}
//               <div className="space-y-6">
//                 {[
//                   { id: "duration", label: "Duration", placeholder: "Enter the duration", icon: <FiCalendar /> },
//                 ].map((field) => renderInput(field, "additionalTrainingInfo"))}
//               </div>
//             </div>

//             {/* Applicant Affiliation */}
//             <h2 className="text-4xl font-bold text-[#1D3851] mb-6">
//               Applicant <span className="text-[#45C0C9]">Affiliation</span>
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
//               {/* Left Column Fields */}
//               <div className="space-y-6">
//                 {[
//                   { id: "institution", label: "Institution", placeholder: "Enter your institution", icon: <FiMapPin /> },
//                   { id: "duration", label: "Duration", placeholder: "Enter the duration", icon: <FiCalendar /> },
//                 ].map((field) => renderInput(field, "applicantAffiliation"))}
//               </div>

//               {/* Right Column Fields */}
//               <div className="space-y-6">
//                 {[
//                   { id: "designation", label: "Designation", placeholder: "Enter your designation", icon: <FiUser /> },
//                 ].map((field) => renderInput(field, "applicantAffiliation"))}
//               </div>
//             </div>

//             {/* Display Submission Error */}
//             {submissionError && (
//               <div className="mb-4 text-red-500 text-center">
//                 {submissionError}
//               </div>
//             )}

//             {/* Buttons */}
//             <div className="flex flex-col md:flex-row justify-center mt-8 space-y-4 md:space-y-0">
//               {/* Previous Button */}
//               {/* <button
//                 type="button"
//                 onClick={() => router.push("/landingPage")}
//                 className="w-full md:w-auto bg-white border border-[#45C0C9] text-[#45C0C9] font-semibold py-3 px-8 rounded hover:bg-[#E6F2F9] transition duration-300 shadow-sm"
//               >
//                 Previous
//               </button> */}

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className={`w-full md:w-auto bg-[#45C0C9] hover:bg-[#3dadb7] text-white font-semibold py-3 px-8 rounded transition duration-300 shadow-sm ${
//                   isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
//                 }`}
//               >
//                 {isSubmitting ? 'Submitting...' : 'Draft Complete'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </section>
//     </>
//   );
// };

// export default MembershipFormStep;















// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation"; // Import useRouter from Next.js App Router
// import Link from "next/link"; // For navigation links
// import { FiUser, FiMail, FiMapPin, FiPhone, FiCalendar, FiClipboard } from "react-icons/fi";

// const MembershipFormStep1 = () => {
//   const router = useRouter(); // Initialize useRouter

//   // State for form fields
//   const [formData, setFormData] = useState({
//     name: "",
//     residence: "",
//     gender: "",
//     pmdcNumber: "",
//     address: "",
//     province: "",
//     country: "",
//     email: "",
//     fathersName: "",
//     dob: "",
//     cnic: "",
//     fellowshipNumber: "",
//     city: "",
//     zip: "",
//     phone: "",
//     additionalTrainingInfo:{
//       name: "",
//       institution: "",
//       duration: "",
//     },
//     applicantAffiliation: {
//       institution: "",
//       duration: "",
//       designation: "",
//     },
//   });

//   // State for form validation errors
//   const [errors, setErrors] = useState({});

//   // Handle input change
//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [id]: value,
//     }));

//     // Remove error message upon input
//     setErrors((prev) => ({
//       ...prev,
//       [id]: "",
//     }));
//   };

//   // Validate form data
//   const validate = () => {
//     const newErrors = {};

//     // Example validations (you can add more as needed)
//     if (!formData.name.trim()) newErrors.name = "Name is required.";
//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required.";
//     } else if (
//       !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
//     ) {
//       newErrors.email = "Invalid email address.";
//     }
//     if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
//     // Add other validations as necessary

//     return newErrors;
//   };

//   // Handle form submission
//   const handleSubmit = (e) => {
//     router.push("/thanks");

//     e.preventDefault(); // Prevent default form submission

//     const formErrors = validate();

//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors); // Set validation errors
//     } else {
//       // Proceed to Step 2
//       // You can also save formData to a global state or context here
//       // router.push("/membershipForm/step2");
//     }
//   };

//   return (
//     <>
//       {/* Intro Section */}
//       <div className="bg-white">
//         <div className="container mx-auto px-4 py-8 max-w-6xl">
//           <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1D3851] mb-4 leading-tight">
//             Pakistan <span className="text-[#45C0C9]">Society Of Neurology</span> Membership Form!
//           </h1>
//           <p className="text-[#1D3851] text-base md:text-lg mb-8 max-w-2xl">
//             Welcome to the Pakistan Society of Neurology (PSN)! We are excited to have you join our community 
//             of professionals dedicated to advancing the field of neurology in Pakistan. To become a member, 
//             please complete the following steps in the membership registration process.
//           </p>
//         </div>
//       </div>

//       {/* Membership Form Section */}
//       <section className="bg-[#F4FBFF] py-12">
//         <div className="container mx-auto px-4 max-w-6xl">
//           {/* Step Indicator */}
//           <p className="text-gray-600 mb-8 font-medium text-center md:text-left">Step 1 of 3</p>



//           <form onSubmit={handleSubmit}>
//             {/* Applicant Particulars */}
//             <h2 className="text-4xl font-bold text-[#1D3851] mb-6">
//               Applicant <span className="text-[#45C0C9]">Particulars</span>
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
//               {/* Left Column Fields */}
//               <div className="space-y-6">
//                 {[
//                   { id: 'name', label: 'Name', placeholder: 'Enter your full name', icon: <FiUser /> },
//                   { id: 'residence', label: 'Member Residence', placeholder: 'Enter your residence', icon: <FiMapPin /> },
//                   { id: 'gender', label: 'Gender', placeholder: 'Enter your gender', icon: <FiUser /> },
//                   { id: 'pmdcNumber', label: 'PMDC Number', placeholder: 'Enter your PMDC number', icon: <FiClipboard /> },
//                   { id: 'address', label: 'Address', placeholder: 'Enter your address', icon: <FiMapPin /> },
//                   { id: 'province', label: 'Province', placeholder: 'Enter your province', icon: <FiMapPin /> },
//                   { id: 'country', label: 'Country', placeholder: 'Enter your country', icon: <FiMapPin /> },
//                   { id: 'email', label: 'Email', placeholder: 'Enter your email', icon: <FiMail /> },
//                 ].map((field, index) => (
//                   <div key={index} className="relative flex items-center">
//                     <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 text-lg mt-7">
//                       {field.icon}
//                     </div>
//                     <div className="w-full">
//                       <label htmlFor={field.id} className="block text-[#1D3851] font-semibold mb-2">
//                         {field.label}
//                       </label>
//                       <input
//                         type={field.id === 'email' ? 'email' : 'text'}
//                         id={field.id}
//                         placeholder={field.placeholder}
//                         value={formData[field.id]}
//                         onChange={handleChange}
//                         className={`w-full pl-12 border border-gray-300 rounded-md py-3 px-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#45C0C9] focus:outline-none shadow-sm ${
//                           errors[field.id] ? 'border-red-500' : ''
//                         }`}
//                       />
//                       {/* Display Validation Error */}
//                       {errors[field.id] && (
//                         <p className="text-red-500 text-sm mt-1" role="alert">
//                           {errors[field.id]}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Right Column Fields */}
//               <div className="space-y-6">
//                 {[
//                   { id: 'fathersName', label: "Father's Name", placeholder: "Enter your father's name", icon: <FiUser /> },
//                   { id: 'dob', label: 'Date of Birth', placeholder: '', icon: <FiCalendar /> },
//                   { id: 'cnic', label: 'CNIC Number', placeholder: 'Enter your CNIC number', icon: <FiClipboard /> },
//                   { id: 'fellowshipNumber', label: 'Fellowship Number', placeholder: 'Enter your fellowship number', icon: <FiClipboard /> },
//                   { id: 'city', label: 'City', placeholder: 'Enter your city', icon: <FiMapPin /> },
//                   { id: 'zip', label: 'Zip/Postal Code', placeholder: 'Enter your zip/postal code', icon: <FiMapPin /> },
//                   { id: 'phone', label: 'Phone with WhatsApp', placeholder: 'Enter your phone number', icon: <FiPhone /> },
//                 ].map((field, index) => (
//                   <div key={index} className="relative flex items-center">
//                     <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 text-lg mt-7">
//                       {field.icon}
//                     </div>
//                     <div className="w-full">
//                       <label htmlFor={field.id} className="block text-[#1D3851] font-semibold mb-2">
//                         {field.label}
//                       </label>
//                       <input
//                         type={
//                           field.id === 'dob'
//                             ? 'date'
//                             : field.id === 'email'
//                             ? 'email'
//                             : 'text'
//                         }
//                         id={field.id}
//                         placeholder={field.placeholder}
//                         value={formData[field.id]}
//                         onChange={handleChange}
//                         className={`w-full pl-12 border border-gray-300 rounded-md py-3 px-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#45C0C9] focus:outline-none shadow-sm ${
//                           errors[field.id] ? 'border-red-500' : ''
//                         }`}
//                       />
//                       {/* Display Validation Error */}
//                       {errors[field.id] && (
//                         <p className="text-red-500 text-sm mt-1" role="alert">
//                           {errors[field.id]}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Additional Training or Fellowship */}
//             <h2 className="text-4xl font-bold text-[#1D3851] mb-6">
//               Additional Training  <span className="text-[#45C0C9]">or</span> Fellowship
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
//               {/* Left Column Fields */}
//               <div className="space-y-6">
//                 {[
//                   { id: 'name', label: 'Name', placeholder: 'Enter your full name', icon: <FiUser /> },
//                   { id: 'residence', label: 'Member Residence', placeholder: 'Enter your residence', icon: <FiMapPin /> },
//                 ].map((field, index) => (
//                   <div key={index} className="relative flex items-center">
//                     <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 text-lg mt-7">
//                       {field.icon}
//                     </div>
//                     <div className="w-full">
//                       <label htmlFor={field.id} className="block text-[#1D3851] font-semibold mb-2">
//                         {field.label}
//                       </label>
//                       <input
//                         type={field.id === 'email' ? 'email' : 'text'}
//                         id={field.id}
//                         placeholder={field.placeholder}
//                         value={formData[field.id]}
//                         onChange={handleChange}
//                         className={`w-full pl-12 border border-gray-300 rounded-md py-3 px-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#45C0C9] focus:outline-none shadow-sm ${
//                           errors[field.id] ? 'border-red-500' : ''
//                         }`}
//                       />
//                       {/* Display Validation Error */}
//                       {errors[field.id] && (
//                         <p className="text-red-500 text-sm mt-1" role="alert">
//                           {errors[field.id]}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Right Column Fields */}
//               <div className="space-y-6">
//                 {[
//                   { id: 'fathersName', label: "Father's Name", placeholder: "Enter your father's name", icon: <FiUser /> },
//                 ].map((field, index) => (
//                   <div key={index} className="relative flex items-center">
//                     <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 text-lg mt-7">
//                       {field.icon}
//                     </div>
//                     <div className="w-full">
//                       <label htmlFor={field.id} className="block text-[#1D3851] font-semibold mb-2">
//                         {field.label}
//                       </label>
//                       <input
//                         type={
//                           field.id === 'dob'
//                             ? 'date'
//                             : field.id === 'email'
//                             ? 'email'
//                             : 'text'
//                         }
//                         id={field.id}
//                         placeholder={field.placeholder}
//                         value={formData[field.id]}
//                         onChange={handleChange}
//                         className={`w-full pl-12 border border-gray-300 rounded-md py-3 px-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#45C0C9] focus:outline-none shadow-sm ${
//                           errors[field.id] ? 'border-red-500' : ''
//                         }`}
//                       />
//                       {/* Display Validation Error */}
//                       {errors[field.id] && (
//                         <p className="text-red-500 text-sm mt-1" role="alert">
//                           {errors[field.id]}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             {/* Applicant Affiliation */}
//             <h2 className="text-4xl font-bold text-[#1D3851] mb-6">
//               Applicant <span className="text-[#45C0C9]">Affiliation</span>
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
//               {/* Left Column Fields */}
//               <div className="space-y-6">
//                 {[
//                   { id: 'name', label: 'Name', placeholder: 'Enter your full name', icon: <FiUser /> },
//                   { id: 'residence', label: 'Member Residence', placeholder: 'Enter your residence', icon: <FiMapPin /> },
//                 ].map((field, index) => (
//                   <div key={index} className="relative flex items-center">
//                     <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 text-lg mt-7">
//                       {field.icon}
//                     </div>
//                     <div className="w-full">
//                       <label htmlFor={field.id} className="block text-[#1D3851] font-semibold mb-2">
//                         {field.label}
//                       </label>
//                       <input
//                         type={field.id === 'email' ? 'email' : 'text'}
//                         id={field.id}
//                         placeholder={field.placeholder}
//                         value={formData[field.id]}
//                         onChange={handleChange}
//                         className={`w-full pl-12 border border-gray-300 rounded-md py-3 px-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#45C0C9] focus:outline-none shadow-sm ${
//                           errors[field.id] ? 'border-red-500' : ''
//                         }`}
//                       />
//                       {/* Display Validation Error */}
//                       {errors[field.id] && (
//                         <p className="text-red-500 text-sm mt-1" role="alert">
//                           {errors[field.id]}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Right Column Fields */}
//               <div className="space-y-6">
//                 {[
//                   { id: 'fathersName', label: "Father's Name", placeholder: "Enter your father's name", icon: <FiUser /> },
//                 ].map((field, index) => (
//                   <div key={index} className="relative flex items-center">
//                     <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 text-lg mt-7">
//                       {field.icon}
//                     </div>
//                     <div className="w-full">
//                       <label htmlFor={field.id} className="block text-[#1D3851] font-semibold mb-2">
//                         {field.label}
//                       </label>
//                       <input
//                         type={
//                           field.id === 'dob'
//                             ? 'date'
//                             : field.id === 'email'
//                             ? 'email'
//                             : 'text'
//                         }
//                         id={field.id}
//                         placeholder={field.placeholder}
//                         value={formData[field.id]}
//                         onChange={handleChange}
//                         className={`w-full pl-12 border border-gray-300 rounded-md py-3 px-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#45C0C9] focus:outline-none shadow-sm ${
//                           errors[field.id] ? 'border-red-500' : ''
//                         }`}
//                       />
//                       {/* Display Validation Error */}
//                       {errors[field.id] && (
//                         <p className="text-red-500 text-sm mt-1" role="alert">
//                           {errors[field.id]}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Buttons */}
//             <div className="flex flex-col md:flex-row justify-center mt-8 space-y-4 md:space-y-0">
//               {/* Previous Button */}
//               {/* <button
//                 type="button"
//                 onClick={() => router.push("/landingPage")}
//                 className="w-full md:w-auto bg-white border border-[#45C0C9] text-[#45C0C9] font-semibold py-3 px-8 rounded hover:bg-[#E6F2F9] transition duration-300 shadow-sm"
//               >
//                 Previous
//               </button> */}

//               {/* Next Button */}
//               <button
//                 type="submit"
//                 className="w-full md:w-auto bg-[#45C0C9] hover:bg-[#3dadb7] text-white font-semibold py-3 px-8 rounded transition duration-300 shadow-sm"
//               >
//                 Draft Complete
//               </button>
//             </div>
//           </form>
//         </div>
//       </section>
//     </>
//   );
// };

// export default MembershipFormStep1;
