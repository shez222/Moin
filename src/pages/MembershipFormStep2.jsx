import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useRouter } from "next/navigation";
const MembershipFormStep2 = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [agreementError, setAgreementError] = useState("");
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

  const handleAgreementChange = (e) => {
    setIsAgreed(e.target.checked);
    if (e.target.checked) {
      setAgreementError("");
    }
  };

  const handleNextClick = () => {
    router.push("/membershipForm/step3");
    if (!isAgreed) {
      setAgreementError("You must agree to proceed.");
    } else {
      // Proceed to the next step
      // Implement your navigation logic here
      console.log("Proceeding to Step 3");
    }
  };

  return (
    <section className="bg-white py-12 min-h-screen">
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
        <p className="text-gray-600 font-medium mb-8 text-left">Step 2 of 3</p>

        {/* Form Section */}
        <div className="bg-[#F4FBFF] rounded-lg p-8 shadow-md">
          {/* Section Title */}
          <h2 className="text-2xl font-bold text-[#1D3851] mb-6">
            Member's <span className="text-[#45C0C9]">Photograph</span>
          </h2>

          {/* Upload Field */}
          <div className="mb-6">
            <label htmlFor="uploadPhoto" className="block text-[#1D3851] font-semibold mb-2">
              Upload Photograph
            </label>
            <div className="flex items-center">
              <label
                htmlFor="uploadPhoto"
                className="flex items-center justify-center w-full md:w-auto bg-[#45C0C9] hover:bg-[#3dadb7] text-white font-semibold py-2 px-4 rounded cursor-pointer transition duration-300 shadow-sm"
              >
                <FiUpload className="mr-2" />
                {selectedFile ? "Change Photo" : "Choose File"}
              </label>
              {selectedFile && (
                <span className="ml-4 text-gray-700 text-sm">
                  {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              )}
            </div>
            <input
              type="file"
              id="uploadPhoto"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-gray-500 text-sm mt-2">Max file size {MAX_FILE_SIZE_MB} MB</p>
            {fileError && (
              <p className="text-red-500 text-sm mt-1" role="alert">
                {fileError}
              </p>
            )}
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-start mb-8">
            <input
              type="checkbox"
              id="agreement"
              checked={isAgreed}
              onChange={handleAgreementChange}
              className="w-5 h-5 text-[#45C0C9] border-gray-300 rounded focus:ring-[#45C0C9] focus:ring-2 mr-3"
            />
            <label
              htmlFor="agreement"
              className="text-gray-700 text-sm sm:text-base leading-relaxed"
            >
              I agree to abide by the Pakistan Society of Neurology's code of ethics
              and privacy policy
            </label>
          </div>
          {agreementError && (
            <p className="text-red-500 text-sm mb-4" role="alert">
              {agreementError}
            </p>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col md:flex-row justify-between">
            <button
              type="button"
              className="w-full md:w-auto bg-white border border-[#45C0C9] text-[#45C0C9] font-semibold py-3 px-8 rounded hover:bg-[#E6F2F9] transition duration-300 shadow-sm mb-4 md:mb-0"
              onClick={() => router.push("/membershipForm/step1")}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={handleNextClick}
              disabled={!selectedFile || fileError !== "" || !isAgreed}
              className={`w-full md:w-auto ${
                !selectedFile || fileError !== "" || !isAgreed
                  ? "bg-[#A0D2E7] cursor-not-allowed"
                  : "bg-[#45C0C9] hover:bg-[#3dadb7]"
              } text-white font-semibold py-3 px-8 rounded transition duration-300 shadow-sm`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MembershipFormStep2;
