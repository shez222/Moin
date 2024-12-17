import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useRouter } from "next/navigation";

const MembershipFormStep3 = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  const router = useRouter();
  const MAX_FILE_SIZE_MB = 50;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // 50 MB in bytes

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFileError(
          `File size exceeds ${MAX_FILE_SIZE_MB} MB. Please choose a smaller file.`
        );
        setSelectedFile(null);
      } else {
        setFileError("");
        setSelectedFile(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    router.push("/thanks");
    e.preventDefault();

    if (!selectedFile) {
      setFileError("Please upload your bank slip or screenshot.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionError("");
    setSubmissionSuccess(false);

    // Simulate form submission (Replace this with your actual submission logic)
    try {
      // Example: Upload the file to a server or cloud storage
      // const formData = new FormData();
      // formData.append("bankSlip", selectedFile);
      // await axios.post("/api/submit-fee", formData);

      // Simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSubmissionSuccess(true);
    } catch (error) {
      setSubmissionError("An error occurred while submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white min-h-screen py-12 flex items-center">
      {/* Container */}
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1D3851] mb-4 leading-tight">
            Pakistan{" "}
            <span className="text-[#45C0C9]">Society Of Neurology</span> Membership
            Form!
          </h1>
          <p className="text-[#1D3851] text-base md:text-lg max-w-2xl mx-auto">
            Welcome to the Pakistan Society of Neurology (PSN)! We are excited to
            have you join our community of professionals dedicated to advancing the
            field of neurology in Pakistan. To become a member, please complete the
            following steps in the membership registration process.
          </p>
        </div>

        {/* Step Indicator */}
        <p className="text-gray-600 font-medium mb-6 text-left">Step 3 of 3</p>

        {/* Content Section */}
        <form
          className="bg-[#F4FBFF] rounded-lg p-8 shadow-md"
          onSubmit={handleSubmit}
        >
          {/* Section Title */}
          <h2 className="text-2xl font-bold text-[#1D3851] mb-6">
            Members <span className="text-[#45C0C9]">Fee</span>
          </h2>
          <p className="text-gray-700 text-base mb-6 leading-relaxed">
            Kindly submit Rs. 5000/- into the PSN account provided below and upload
            the bank slip or screenshot to confirm your payment.
          </p>

          {/* Bank Account Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#1D3851] mb-2">PSN Bank Account</h3>
            <p className="text-gray-700">
              <strong>Bank Name:</strong> Allied Bank Limited
            </p>
            <p className="text-gray-700">
              <strong>Account Number:</strong> 1234567890
            </p>
            <p className="text-gray-700">
              <strong>Account Title:</strong> Pakistan Society of Neurology
            </p>
            <p className="text-gray-700">
              <strong>Branch:</strong> Karachi
            </p>
          </div>

          {/* Upload Field */}
          <div className="mb-6">
            <label htmlFor="bankSlip" className="block text-[#1D3851] font-semibold mb-2">
              Bank Slip / Screenshot
            </label>
            <div className="flex items-center">
              <label
                htmlFor="bankSlip"
                className="flex items-center justify-center w-full md:w-auto bg-[#45C0C9] hover:bg-[#3dadb7] text-white font-semibold py-2 px-4 rounded cursor-pointer transition duration-300 shadow-sm"
              >
                <FiUpload className="mr-2" />
                {selectedFile ? "Change File" : "Choose File"}
              </label>
              {selectedFile && (
                <span className="ml-4 text-gray-700 text-sm">
                  {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              )}
            </div>
            <input
              type="file"
              id="bankSlip"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-gray-500 text-sm mt-2">
              Max file size {MAX_FILE_SIZE_MB} MB. Accepted formats: JPG, PNG, PDF.
            </p>
            {fileError && (
              <p className="text-red-500 text-sm mt-1" role="alert">
                {fileError}
              </p>
            )}
          </div>

          {/* Submission Feedback */}
          {submissionSuccess && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded">
              Your membership fee has been successfully submitted!
            </div>
          )}
          {submissionError && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
              {submissionError}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col md:flex-row justify-between">
            <button
              type="button"
              className="w-full md:w-auto bg-white border border-[#45C0C9] text-[#45C0C9] font-semibold py-3 px-8 rounded hover:bg-[#E6F2F9] transition duration-300 shadow-sm mb-4 md:mb-0"
              onClick={() => {
                router.push("/membershipForm/step2");
              }}
              disabled={isSubmitting}
            >
              Previous
            </button>
            <button
              type="submit"
              disabled={!selectedFile || fileError !== "" || isSubmitting}
              className={`w-full md:w-auto ${
                !selectedFile || fileError !== "" || isSubmitting
                  ? "bg-[#A0D2E7] cursor-not-allowed"
                  : "bg-[#45C0C9] hover:bg-[#3dadb7]"
              } text-white font-semibold py-3 px-8 rounded transition duration-300 shadow-sm`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default MembershipFormStep3;