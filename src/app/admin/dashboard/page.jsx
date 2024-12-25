"use client";
import React, { useState, useEffect, useContext } from "react";
import ProtectedRoute from "@/../components/ProtectedRoute"; // Adjust path if needed
import { AuthContext } from "@/../context/AuthContext"; // Adjust path if needed
import LogoutButton from "@/app/logout/LogoutButton"; // Adjust path if needed
import {
  FiUser,
  FiCheckCircle,
  FiXCircle,
  FiDollarSign,
  FiEye,
  FiSearch,
  FiRefreshCw,
  FiCreditCard,
} from "react-icons/fi";
import Modal from "@/../components/Modal"; // Adjust path if needed
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "@/../components/Pagination"; // Adjust path if needed

// IMPORTANT: Import the updated IdCard component
import IdCard from "@/app/doctor/Idcard/IDCard"; // Adjust this path to wherever your IdCard file is located.

const AdminDashboard = () => {
  const { auth, loading } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalForms: 0,
    finalized: 0, // from API, representing the count of finalized forms
    approved: 0,
    paymentApproved: 0,
  });
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 10;

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Modal for Doctor Details
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Tabs
  const [activeTab, setActiveTab] = useState("all");

  // NEW: ID Card modal states
  const [showIDCardModal, setShowIDCardModal] = useState(false);
  const [idCardDoctor, setIdCardDoctor] = useState(null);

  // ------------------------------
  // Fetch dashboard statistics
  // ------------------------------
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      const data = await response.json();
      console.log("Stats Data:", data);

      if (!response.ok) {
        setError(data.error || "Failed to fetch statistics.");
      } else {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError("An unexpected error occurred while fetching statistics.");
    }
  };

  // ------------------------------
  // Fetch all doctor profiles
  // ------------------------------
  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/doctor/getdocprof", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to fetch doctor profiles.");
      } else {
        setDoctors(data.doctors);
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError("An unexpected error occurred while fetching doctor profiles.");
    }
  };

  useEffect(() => {
    if (!loading && auth.token) {
      fetchStats();
      fetchDoctors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, loading]);

  // ----------------------------------
  // Handle approval (approve/reject)
  // ----------------------------------
  const handleApproval = async (doctorId, type, action) => {
    try {
      const endpoint =
        type === "approve"
          ? `/api/doctor/${doctorId}/approve`
          : `/api/doctor/${doctorId}/payment-approve`;

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ action }), // action: 'approve' or 'reject'
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || `Failed to ${action} ${type}.`);
      } else {
        toast.success(`Successfully ${action}ed ${type}.`);
        // Refresh stats and doctors list
        fetchStats();
        fetchDoctors();
      }
    } catch (err) {
      console.error(`Error during ${action}ing ${type}:`, err);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  // ----------------------------------
  // Modal open/close (Doctor Details)
  // ----------------------------------
  const openModal = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
    setUploadError("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
    setUploadError("");
  };

  // ----------------------------------
  // Handle image upload
  // ----------------------------------
  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("doctorId", selectedDoctor._id);
    formData.append("type", type); // 'profilePic' or 'bankSlipPic'

    try {
      const response = await fetch(
        `/api/admin/doctors/${selectedDoctor._id}/upload-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setUploadError(data.error || `Failed to upload ${type}.`);
      } else {
        toast.success(`Successfully uploaded ${type}.`);
        // Refresh doctors list
        fetchDoctors();
      }
    } catch (err) {
      console.error(`Error uploading ${type}:`, err);
      setUploadError("An unexpected error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  // ----------------------------------
  // Determine if a doctor is "completed"
  // ----------------------------------
  const isDoctorCompleted = (doctor) => {
    return (
      doctor.isFinalized === true &&
      doctor.approvalStatus === "Approved" &&
      doctor.paymentApprovalStatus === "Approved"
    );
  };

  // ----------------------------------
  // Generate ID Card -> show ID Card Modal
  // ----------------------------------
  const handleGenerateIDCard = (doctor) => {
    // Instead of fetching inside IdCard, 
    // we pass the doc to it:
    setIdCardDoctor(doctor);
    setShowIDCardModal(true);

    // Optional toast
    toast.success(`Preparing ID Card for ${doctor.name}...`);
  };

  // ----------------------------------
  // Filter doctors based on activeTab
  // ----------------------------------
  const filterDoctorsByTab = (allDocs) => {
    return allDocs.filter((doctor) => {
      // Search filter first
      const searchMatch =
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.pmdcNumber.toLowerCase().includes(searchTerm.toLowerCase());

      if (!searchMatch) return false;

      // Then filter by tab
      if (activeTab === "all") {
        return true;
      } else if (activeTab === "finalized") {
        return doctor.isFinalized === true;
      } else if (activeTab === "approved") {
        return doctor.approvalStatus === "Approved";
      } else if (activeTab === "paymentApproved") {
        return doctor.paymentApprovalStatus === "Approved";
      } else if (activeTab === "completed") {
        return isDoctorCompleted(doctor);
      }
      return false;
    });
  };

  // Filtered doctors based on tab + search
  const tabDoctors = filterDoctorsByTab(doctors);

  // Pagination Logic
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = tabDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 relative">
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-0">
            Admin Dashboard
          </h1>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                fetchStats();
                fetchDoctors();
                toast.info("Data refreshed.");
              }}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition duration-300"
              aria-label="Refresh Data"
            >
              <FiRefreshCw className="mr-2" />
              Refresh
            </button>
            <LogoutButton />
          </div>
        </div>

        {/* Display Errors */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Forms */}
          <div className="flex items-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
            <FiUser className="text-5xl text-blue-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Total Forms Submitted</p>
              <p className="text-3xl font-semibold text-gray-800">
                {stats.totalForms}
              </p>
            </div>
          </div>

          {/* Finalized Forms */}
          <div className="flex items-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
            <FiCheckCircle className="text-5xl text-yellow-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Finalized Forms</p>
              <p className="text-3xl font-semibold text-gray-800">
                {stats.finalized}
              </p>
            </div>
          </div>

          {/* Approved Profiles */}
          <div className="flex items-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
            <FiCheckCircle className="text-5xl text-green-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Approved Profiles</p>
              <p className="text-3xl font-semibold text-gray-800">
                {stats.approved}
              </p>
            </div>
          </div>

          {/* Payment Approved */}
          <div className="flex items-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
            <FiDollarSign className="text-5xl text-purple-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Payment Approved</p>
              <p className="text-3xl font-semibold text-gray-800">
                {stats.paymentApproved}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white p-4 mb-4 rounded-lg shadow">
          <div className="flex flex-wrap space-x-4">
            <button
              onClick={() => {
                setActiveTab("all");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded ${
                activeTab === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setActiveTab("finalized");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded ${
                activeTab === "finalized"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Finalized
            </button>
            <button
              onClick={() => {
                setActiveTab("approved");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded ${
                activeTab === "approved"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => {
                setActiveTab("paymentApproved");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded ${
                activeTab === "paymentApproved"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Payment Approved
            </button>
            <button
              onClick={() => {
                setActiveTab("completed");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded ${
                activeTab === "completed"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Doctor Profiles */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">
              {activeTab === "all"
                ? "All Doctor Profiles"
                : activeTab === "finalized"
                ? "Finalized Forms"
                : activeTab === "approved"
                ? "Approved Profiles"
                : activeTab === "paymentApproved"
                ? "Payment Approved"
                : "Completed (All Steps)"}
            </h2>
            <div className="flex items-center w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  name="search"
                  placeholder="Search by name, email, or PMDC"
                  className="w-full bg-gray-100 h-10 pl-10 pr-4 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Search Doctor Profiles"
                />
              </div>
            </div>
          </div>

          {/* Profiles Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-3 px-6 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    PMDC Number
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Finalized?
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Approval Status
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentDoctors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      No doctor profiles found.
                    </td>
                  </tr>
                ) : (
                  currentDoctors.map((doctor) => (
                    <tr key={doctor._id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 border-b text-sm text-gray-700">
                        {doctor.name}
                      </td>
                      <td className="py-4 px-6 border-b text-sm text-gray-700">
                        {doctor.email}
                      </td>
                      <td className="py-4 px-6 border-b text-sm text-gray-700">
                        {doctor.pmdcNumber}
                      </td>
                      <td className="py-4 px-6 border-b text-sm">
                        {doctor.isFinalized ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Yes
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            No
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 border-b text-sm">
                        {doctor.approvalStatus === "Approved" ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Approved
                          </span>
                        ) : doctor.approvalStatus === "Rejected" ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Rejected
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 border-b text-sm">
                        {doctor.paymentApprovalStatus === "Approved" ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Approved
                          </span>
                        ) : doctor.paymentApprovalStatus === "Rejected" ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Rejected
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 border-b text-sm text-center">
                        {/* Approve/Reject Profile */}
                        <div className="flex flex-wrap justify-center space-x-2 mb-2">
                          {doctor.approvalStatus === "Pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleApproval(doctor._id, "approve", "approve")
                                }
                                className="flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors duration-300"
                                title={`Approve profile of ${doctor.name}`}
                              >
                                <FiCheckCircle className="mr-1" />
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleApproval(doctor._id, "approve", "reject")
                                }
                                className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors duration-300"
                                title={`Reject profile of ${doctor.name}`}
                              >
                                <FiXCircle className="mr-1" />
                                Reject
                              </button>
                            </>
                          )}

                          {/* Approve/Reject Payment */}
                          {doctor.approvalStatus === "Approved" &&
                            doctor.paymentApprovalStatus === "Pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleApproval(
                                      doctor._id,
                                      "payment-approve",
                                      "approve"
                                    )
                                  }
                                  className="flex items-center bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded transition-colors duration-300"
                                  title={`Approve payment of ${doctor.name}`}
                                >
                                  <FiDollarSign className="mr-1" />
                                  Approve Payment
                                </button>
                                <button
                                  onClick={() =>
                                    handleApproval(
                                      doctor._id,
                                      "payment-approve",
                                      "reject"
                                    )
                                  }
                                  className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors duration-300"
                                  title={`Reject payment of ${doctor.name}`}
                                >
                                  <FiXCircle className="mr-1" />
                                  Reject Payment
                                </button>
                              </>
                            )}
                        </div>

                        {/* Completed: Generate ID Card */}
                        {isDoctorCompleted(doctor) && (
                          <button
                            onClick={() => handleGenerateIDCard(doctor)}
                            className="flex items-center ml-28 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-1 rounded transition-colors duration-300 mt-2 w-full sm:w-auto"
                            title={`Generate ID Card for ${doctor.name}`}
                          >
                            <FiCreditCard className="mr-1" />
                            Generate ID Card
                          </button>
                        )}

                        {/* View Details */}
                        <button
                          onClick={() => openModal(doctor)}
                          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-10 py-1 lg:ml-28 rounded transition-colors duration-300 mt-2 w-full sm:w-auto"
                          title={`View details of ${doctor.name}`}
                        >
                          <FiEye className="mr-1" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {tabDoctors.length > doctorsPerPage && (
            <Pagination
              doctorsPerPage={doctorsPerPage}
              totalDoctors={tabDoctors.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          )}
        </div>

        {/* Doctor Details Modal */}
        {isModalOpen && selectedDoctor && (
          <Modal onClose={closeModal}>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-xl overflow-y-auto max-h-screen relative">
                {/* Header with Profile Picture */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-blue-500 mb-4 sm:mb-0">
                    Doctor Details
                  </h2>
                  {selectedDoctor.profilePic ? (
                    <img
                      src={selectedDoctor.profilePic}
                      alt="Profile Picture"
                      className="w-24 h-24 object-cover rounded-full border-4 border-blue-500 shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded-full border-4 border-blue-500 shadow-lg">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-700 hover:text-blue-500 text-2xl font-bold"
                    aria-label="Close Modal"
                  >
                    &times;
                  </button>
                </div>

                {/* Doctor Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <p>
                      <span className="font-semibold text-gray-800">Name:</span>{" "}
                      {selectedDoctor.name}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">Email:</span>{" "}
                      {selectedDoctor.email}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">
                        PMDC Number:
                      </span>{" "}
                      {selectedDoctor.pmdcNumber}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">
                        Residence:
                      </span>{" "}
                      {selectedDoctor.residence}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">
                        Gender:
                      </span>{" "}
                      {selectedDoctor.gender}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p>
                      <span className="font-semibold text-gray-800">
                        Father's Name:
                      </span>{" "}
                      {selectedDoctor.fathersName}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">
                        Date of Birth:
                      </span>{" "}
                      {new Date(selectedDoctor.dob).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">
                        CNIC Number:
                      </span>{" "}
                      {selectedDoctor.cnic}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">
                        Fellowship Number:
                      </span>{" "}
                      {selectedDoctor.fellowshipNumber}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">City:</span>{" "}
                      {selectedDoctor.city}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">
                        Zip/Postal Code:
                      </span>{" "}
                      {selectedDoctor.zip}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">Phone:</span>{" "}
                      {selectedDoctor.phone}
                    </p>
                  </div>
                </div>

                {/* Additional Training/Fellowship */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-blue-500 mb-3">
                    Additional Training or Fellowship
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p>
                        <span className="font-semibold text-gray-800">
                          Name:
                        </span>{" "}
                        {selectedDoctor.additionalTrainingInfo?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p>
                        <span className="font-semibold text-gray-800">
                          Institution:
                        </span>{" "}
                        {selectedDoctor.additionalTrainingInfo?.institution ||
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <p>
                        <span className="font-semibold text-gray-800">
                          Duration:
                        </span>{" "}
                        {selectedDoctor.additionalTrainingInfo?.duration ||
                          "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Applicant Affiliation */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-blue-500 mb-3">
                    Applicant Affiliation
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p>
                        <span className="font-semibold text-gray-800">
                          Institution:
                        </span>{" "}
                        {selectedDoctor.applicantAffiliation?.institution ||
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <p>
                        <span className="font-semibold text-gray-800">
                          Duration:
                        </span>{" "}
                        {selectedDoctor.applicantAffiliation?.duration || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p>
                        <span className="font-semibold text-gray-800">
                          Designation:
                        </span>{" "}
                        {selectedDoctor.applicantAffiliation?.designation ||
                          "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bank Slip Picture */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-blue-500 mb-3">
                    Bank Slip Picture
                  </h3>
                  <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                    {selectedDoctor.bankSlipPic ? (
                      <img
                        src={selectedDoctor.bankSlipPic}
                        alt="Bank Slip"
                        className="w-full md:w-80 h-auto object-cover border-2 border-blue-500 shadow-sm rounded-md"
                      />
                    ) : (
                      <p className="text-gray-700">
                        No bank slip picture uploaded.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* ID Card Modal (using updated <IdCard />) */}
        {showIDCardModal && idCardDoctor && (
          <Modal onClose={() => setShowIDCardModal(false)}>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-3xl w-full relative">
                <button
                  onClick={() => setShowIDCardModal(false)}
                  className="absolute top-4 right-4 text-gray-700 hover:text-blue-500 text-2xl font-bold"
                  aria-label="Close ID Card Modal"
                >
                  &times;
                </button>
                {/* Pass the selected doctor object to the IdCard component */}
                <IdCard doctor={idCardDoctor} />
              </div>
            </div>
          </Modal>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;











// "use client";
// import React, { useState, useEffect, useContext } from "react";
// import ProtectedRoute from "@/../components/ProtectedRoute"; // Adjust path if needed
// import { AuthContext } from "@/../context/AuthContext"; // Adjust path if needed
// import LogoutButton from "@/app/logout/LogoutButton"; // Adjust path if needed
// import {
//   FiUser,
//   FiCheckCircle,
//   FiXCircle,
//   FiDollarSign,
//   FiEye,
//   FiUpload,
//   FiSearch,
//   FiRefreshCw,
//   FiCreditCard,
// } from "react-icons/fi";
// import Modal from "@/../components/Modal"; // Adjust path if needed
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Pagination from "@/../components/Pagination"; // Adjust path if needed

// const AdminDashboard = () => {
//   const { auth, loading } = useContext(AuthContext);
//   const [stats, setStats] = useState({
//     totalForms: 0,
//     finalized: 0, // from API, representing the count of finalized forms
//     approved: 0,
//     paymentApproved: 0,
//   });
//   const [doctors, setDoctors] = useState([]);
//   const [error, setError] = useState("");

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const doctorsPerPage = 10;

//   // Search
//   const [searchTerm, setSearchTerm] = useState("");

//   // Modal
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [uploadError, setUploadError] = useState("");

//   // NEW: Tabs
//   const [activeTab, setActiveTab] = useState("all");

//   // ------------------------------
//   // Fetch dashboard statistics
//   // ------------------------------
//   const fetchStats = async () => {
//     try {
//       const response = await fetch("/api/admin/dashboard", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${auth.token}`,
//         },
//       });

//       const data = await response.json();
//       console.log("Stats Data:", data);

//       if (!response.ok) {
//         setError(data.error || "Failed to fetch statistics.");
//       } else {
//         setStats(data.stats);
//       }
//     } catch (err) {
//       console.error("Error fetching stats:", err);
//       setError("An unexpected error occurred while fetching statistics.");
//     }
//   };

//   // ------------------------------
//   // Fetch all doctor profiles
//   // ------------------------------
//   const fetchDoctors = async () => {
//     try {
//       const response = await fetch("/api/doctor/getdocprof", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${auth.token}`,
//         },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.error || "Failed to fetch doctor profiles.");
//       } else {
//         setDoctors(data.doctors);
//       }
//     } catch (err) {
//       console.error("Error fetching doctors:", err);
//       setError("An unexpected error occurred while fetching doctor profiles.");
//     }
//   };

//   useEffect(() => {
//     if (!loading && auth.token) {
//       fetchStats();
//       fetchDoctors();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [auth, loading]);

//   // ----------------------------------
//   // Handle approval (approve/reject)
//   // ----------------------------------
//   const handleApproval = async (doctorId, type, action) => {
//     try {
//       const endpoint =
//         type === "approve"
//           ? `/api/doctor/${doctorId}/approve`
//           : `/api/doctor/${doctorId}/payment-approve`;

//       const response = await fetch(endpoint, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${auth.token}`,
//         },
//         body: JSON.stringify({ action }), // action: 'approve' or 'reject'
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         toast.error(data.error || `Failed to ${action} ${type}.`);
//       } else {
//         toast.success(`Successfully ${action}ed ${type}.`);
//         // Refresh stats and doctors list
//         fetchStats();
//         fetchDoctors();
//       }
//     } catch (err) {
//       console.error(`Error during ${action}ing ${type}:`, err);
//       toast.error("An unexpected error occurred. Please try again.");
//     }
//   };

//   // ----------------------------------
//   // Modal open/close
//   // ----------------------------------
//   const openModal = (doctor) => {
//     setSelectedDoctor(doctor);
//     setIsModalOpen(true);
//     setUploadError("");
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedDoctor(null);
//     setUploadError("");
//   };

//   // ----------------------------------
//   // Handle image upload
//   // ----------------------------------
//   const handleImageUpload = async (e, type) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploading(true);
//     setUploadError("");

//     const formData = new FormData();
//     formData.append("image", file);
//     formData.append("doctorId", selectedDoctor._id);
//     formData.append("type", type); // 'profilePic' or 'bankSlipPic'

//     try {
//       const response = await fetch(
//         `/api/admin/doctors/${selectedDoctor._id}/upload-image`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${auth.token}`,
//           },
//           body: formData,
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         setUploadError(data.error || `Failed to upload ${type}.`);
//       } else {
//         toast.success(`Successfully uploaded ${type}.`);
//         // Refresh doctors list
//         fetchDoctors();
//       }
//     } catch (err) {
//       console.error(`Error uploading ${type}:`, err);
//       setUploadError("An unexpected error occurred during upload.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // ----------------------------------
//   // Determine if a doctor is "completed"
//   // ----------------------------------
//   const isDoctorCompleted = (doctor) => {
//     return (
//       doctor.isFinalized === true &&
//       doctor.approvalStatus === "Approved" &&
//       doctor.paymentApprovalStatus === "Approved"
//     );
//   };

//   // ----------------------------------
//   // Generate ID Card (example action)
//   // ----------------------------------
//   const handleGenerateIDCard = (doctor) => {
//     // Insert logic for generating ID card or generating PDF, etc.
    
//     toast.success(`Generating ID card for ${doctor.name}...`);
//   };

//   // ----------------------------------
//   // Filter doctors based on activeTab
//   // ----------------------------------
//   const filterDoctorsByTab = (allDocs) => {
//     return allDocs.filter((doctor) => {
//       // Search filter first
//       const searchMatch =
//         doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         doctor.pmdcNumber.toLowerCase().includes(searchTerm.toLowerCase());

//       if (!searchMatch) return false;

//       // Then filter by tab
//       if (activeTab === "all") {
//         return true;
//       } else if (activeTab === "finalized") {
//         return doctor.isFinalized === true;
//       } else if (activeTab === "approved") {
//         return doctor.approvalStatus === "Approved";
//       } else if (activeTab === "paymentApproved") {
//         return doctor.paymentApprovalStatus === "Approved";
//       } else if (activeTab === "completed") {
//         return isDoctorCompleted(doctor);
//       }
//       return false;
//     });
//   };

//   // Filtered doctors based on tab + search
//   const tabDoctors = filterDoctorsByTab(doctors);

//   // Pagination Logic
//   const indexOfLastDoctor = currentPage * doctorsPerPage;
//   const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
//   const currentDoctors = tabDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   return (
//     <ProtectedRoute allowedRoles={["admin"]}>
//       <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 relative">
//         <ToastContainer position="top-right" autoClose={3000} />

//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
//           <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-0">
//             Admin Dashboard
//           </h1>
//           <div className="flex space-x-3">
//             <button
//               onClick={() => {
//                 fetchStats();
//                 fetchDoctors();
//                 toast.info("Data refreshed.");
//               }}
//               className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition duration-300"
//               aria-label="Refresh Data"
//             >
//               <FiRefreshCw className="mr-2" />
//               Refresh
//             </button>
//             <LogoutButton />
//           </div>
//         </div>

//         {/* Display Errors */}
//         {error && (
//           <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
//             {error}
//           </div>
//         )}

//         {/* Statistics */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {/* Total Forms */}
//           <div className="flex items-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
//             <FiUser className="text-5xl text-blue-500 mr-4" />
//             <div>
//               <p className="text-sm text-gray-500">Total Forms Submitted</p>
//               <p className="text-3xl font-semibold text-gray-800">
//                 {stats.totalForms}
//               </p>
//             </div>
//           </div>

//           {/* Finalized Forms */}
//           <div className="flex items-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
//             <FiCheckCircle className="text-5xl text-yellow-500 mr-4" />
//             <div>
//               <p className="text-sm text-gray-500">Finalized Forms</p>
//               <p className="text-3xl font-semibold text-gray-800">
//                 {stats.finalized}
//               </p>
//             </div>
//           </div>

//           {/* Approved Profiles */}
//           <div className="flex items-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
//             <FiCheckCircle className="text-5xl text-green-500 mr-4" />
//             <div>
//               <p className="text-sm text-gray-500">Approved Profiles</p>
//               <p className="text-3xl font-semibold text-gray-800">
//                 {stats.approved}
//               </p>
//             </div>
//           </div>

//           {/* Payment Approved */}
//           <div className="flex items-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
//             <FiDollarSign className="text-5xl text-purple-500 mr-4" />
//             <div>
//               <p className="text-sm text-gray-500">Payment Approved</p>
//               <p className="text-3xl font-semibold text-gray-800">
//                 {stats.paymentApproved}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="bg-white p-4 mb-4 rounded-lg shadow">
//           <div className="flex flex-wrap space-x-4">
//             <button
//               onClick={() => {
//                 setActiveTab("all");
//                 setCurrentPage(1);
//               }}
//               className={`px-4 py-2 rounded ${
//                 activeTab === "all"
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-200 text-gray-700"
//               }`}
//             >
//               All
//             </button>
//             <button
//               onClick={() => {
//                 setActiveTab("finalized");
//                 setCurrentPage(1);
//               }}
//               className={`px-4 py-2 rounded ${
//                 activeTab === "finalized"
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-200 text-gray-700"
//               }`}
//             >
//               Finalized
//             </button>
//             <button
//               onClick={() => {
//                 setActiveTab("approved");
//                 setCurrentPage(1);
//               }}
//               className={`px-4 py-2 rounded ${
//                 activeTab === "approved"
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-200 text-gray-700"
//               }`}
//             >
//               Approved
//             </button>
//             <button
//               onClick={() => {
//                 setActiveTab("paymentApproved");
//                 setCurrentPage(1);
//               }}
//               className={`px-4 py-2 rounded ${
//                 activeTab === "paymentApproved"
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-200 text-gray-700"
//               }`}
//             >
//               Payment Approved
//             </button>
//             <button
//               onClick={() => {
//                 setActiveTab("completed");
//                 setCurrentPage(1);
//               }}
//               className={`px-4 py-2 rounded ${
//                 activeTab === "completed"
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-200 text-gray-700"
//               }`}
//             >
//               Completed
//             </button>
//           </div>
//         </div>

//         {/* Doctor Profiles */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <div className="flex flex-col md:flex-row justify-between items-center mb-4">
//             <h2 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">
//               {activeTab === "all"
//                 ? "All Doctor Profiles"
//                 : activeTab === "finalized"
//                 ? "Finalized Forms"
//                 : activeTab === "approved"
//                 ? "Approved Profiles"
//                 : activeTab === "paymentApproved"
//                 ? "Payment Approved"
//                 : "Completed (All Steps)"}
//             </h2>
//             <div className="flex items-center w-full md:w-auto">
//               <div className="relative w-full md:w-64">
//                 <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="search"
//                   name="search"
//                   placeholder="Search by name, email, or PMDC"
//                   className="w-full bg-gray-100 h-10 pl-10 pr-4 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={searchTerm}
//                   onChange={(e) => {
//                     setSearchTerm(e.target.value);
//                     setCurrentPage(1);
//                   }}
//                   aria-label="Search Doctor Profiles"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Profiles Table */}
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white">
//               <thead>
//                 <tr>
//                   <th className="py-3 px-6 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th className="py-3 px-6 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Email
//                   </th>
//                   <th className="py-3 px-6 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     PMDC Number
//                   </th>
//                   <th className="py-3 px-6 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Finalized?
//                   </th>
//                   <th className="py-3 px-6 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Approval Status
//                   </th>
//                   <th className="py-3 px-6 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Payment Status
//                   </th>
//                   <th className="py-3 px-6 bg-gray-200 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentDoctors.length === 0 ? (
//                   <tr>
//                     <td colSpan={7} className="text-center py-6 text-gray-500">
//                       No doctor profiles found.
//                     </td>
//                   </tr>
//                 ) : (
//                   currentDoctors.map((doctor) => (
//                     <tr key={doctor._id} className="hover:bg-gray-50">
//                       <td className="py-4 px-6 border-b text-sm text-gray-700">
//                         {doctor.name}
//                       </td>
//                       <td className="py-4 px-6 border-b text-sm text-gray-700">
//                         {doctor.email}
//                       </td>
//                       <td className="py-4 px-6 border-b text-sm text-gray-700">
//                         {doctor.pmdcNumber}
//                       </td>
//                       <td className="py-4 px-6 border-b text-sm">
//                         {doctor.isFinalized ? (
//                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                             Yes
//                           </span>
//                         ) : (
//                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
//                             No
//                           </span>
//                         )}
//                       </td>
//                       <td className="py-4 px-6 border-b text-sm">
//                         {doctor.approvalStatus === "Approved" ? (
//                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                             Approved
//                           </span>
//                         ) : doctor.approvalStatus === "Rejected" ? (
//                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
//                             Rejected
//                           </span>
//                         ) : (
//                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
//                             Pending
//                           </span>
//                         )}
//                       </td>
//                       <td className="py-4 px-6 border-b text-sm">
//                         {doctor.paymentApprovalStatus === "Approved" ? (
//                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                             Approved
//                           </span>
//                         ) : doctor.paymentApprovalStatus === "Rejected" ? (
//                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
//                             Rejected
//                           </span>
//                         ) : (
//                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
//                             Pending
//                           </span>
//                         )}
//                       </td>
//                       <td className="py-4 px-6 border-b text-sm text-center">
//                         {/* Approve/Reject Profile */}
//                         <div className="flex flex-wrap justify-center space-x-2 mb-2">
//                           {doctor.approvalStatus === "Pending" && (
//                             <>
//                               <button
//                                 onClick={() =>
//                                   handleApproval(doctor._id, "approve", "approve")
//                                 }
//                                 className="flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors duration-300"
//                                 title={`Approve profile of ${doctor.name}`}
//                               >
//                                 <FiCheckCircle className="mr-1" />
//                                 Approve
//                               </button>
//                               <button
//                                 onClick={() =>
//                                   handleApproval(doctor._id, "approve", "reject")
//                                 }
//                                 className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors duration-300"
//                                 title={`Reject profile of ${doctor.name}`}
//                               >
//                                 <FiXCircle className="mr-1" />
//                                 Reject
//                               </button>
//                             </>
//                           )}

//                           {/* Approve/Reject Payment */}
//                           {doctor.approvalStatus === "Approved" &&
//                             doctor.paymentApprovalStatus === "Pending" && (
//                               <>
//                                 <button
//                                   onClick={() =>
//                                     handleApproval(
//                                       doctor._id,
//                                       "payment-approve",
//                                       "approve"
//                                     )
//                                   }
//                                   className="flex items-center bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded transition-colors duration-300"
//                                   title={`Approve payment of ${doctor.name}`}
//                                 >
//                                   <FiDollarSign className="mr-1" />
//                                   Approve Payment
//                                 </button>
//                                 <button
//                                   onClick={() =>
//                                     handleApproval(
//                                       doctor._id,
//                                       "payment-approve",
//                                       "reject"
//                                     )
//                                   }
//                                   className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors duration-300"
//                                   title={`Reject payment of ${doctor.name}`}
//                                 >
//                                   <FiXCircle className="mr-1" />
//                                   Reject Payment
//                                 </button>
//                               </>
//                             )}
//                         </div>

//                         {/* Completed: Generate ID Card */}
//                         {isDoctorCompleted(doctor) && (
//                           <button
//                             onClick={() => handleGenerateIDCard(doctor)}
//                             className="flex items-center ml-28  bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-1 rounded transition-colors duration-300 mt-2 w-full sm:w-auto"
//                             title={`Generate ID Card for ${doctor.name}`}
//                           >
//                             <FiCreditCard className="mr-1" />
//                             Generate ID Card
//                           </button>
//                         )}

//                         {/* View Details */}
//                         <button
//                           onClick={() => openModal(doctor)}
//                           className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-10 py-1 lg:ml-28 rounded transition-colors duration-300 mt-2 w-full sm:w-auto"
//                           title={`View details of ${doctor.name}`}
//                         >
//                           <FiEye className="mr-1" />
//                           View Details
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {tabDoctors.length > doctorsPerPage && (
//             <Pagination
//               doctorsPerPage={doctorsPerPage}
//               totalDoctors={tabDoctors.length}
//               paginate={paginate}
//               currentPage={currentPage}
//             />
//           )}
//         </div>

//         {/* Doctor Details Modal */}
//         {isModalOpen && selectedDoctor && (
//   <Modal onClose={closeModal}>
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-xl overflow-y-auto max-h-screen relative">
//         {/* Header with Profile Picture */}
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
//           <h2 className="text-2xl font-semibold text-blue-500 mb-4 sm:mb-0">
//             Doctor Details
//           </h2>
//           {selectedDoctor.profilePic ? (
//             <img
//               src={selectedDoctor.profilePic}
//               alt="Profile Picture"
//               className="w-24 h-24 object-cover rounded-full border-4 border-blue-500 shadow-lg"
//             />
//           ) : (
//             <div className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded-full border-4 border-blue-500 shadow-lg">
//               <span className="text-gray-500">No Image</span>
//             </div>
//           )}
//           <button
//             onClick={closeModal}
//             className="absolute top-4 right-4 text-gray-700 hover:text-blue-500 text-2xl font-bold"
//             aria-label="Close Modal"
//           >
//             &times;
//           </button>
//         </div>

//         {/* Doctor Information */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <div className="space-y-3">
//             <p>
//               <span className="font-semibold text-gray-800">Name:</span>{" "}
//               {selectedDoctor.name}
//             </p>
//             <p>
//               <span className="font-semibold text-gray-800">Email:</span>{" "}
//               {selectedDoctor.email}
//             </p>
//             <p>
//               <span className="font-semibold text-gray-800">PMDC Number:</span>{" "}
//               {selectedDoctor.pmdcNumber}
//             </p>
//             <p>
//               <span className="font-semibold text-gray-800">Residence:</span>{" "}
//               {selectedDoctor.residence}
//             </p>
//             <p>
//               <span className="font-semibold text-gray-800">Gender:</span>{" "}
//               {selectedDoctor.gender}
//             </p>
//           </div>
//           <div className="space-y-3">
//             <p>
//               <span className="font-semibold text-gray-800">
//                 Father's Name:
//               </span>{" "}
//               {selectedDoctor.fathersName}
//             </p>
//             <p>
//               <span className="font-semibold text-gray-800">Date of Birth:</span>{" "}
//               {new Date(selectedDoctor.dob).toLocaleDateString()}
//             </p>
//             <p>
//               <span className="font-semibold text-gray-800">CNIC Number:</span>{" "}
//               {selectedDoctor.cnic}
//             </p>
//             <p>
//               <span className="font-semibold text-gray-800">
//                 Fellowship Number:
//               </span>{" "}
//               {selectedDoctor.fellowshipNumber}
//             </p>
//             <p>
//               <span className="font-semibold text-gray-800">City:</span>{" "}
//               {selectedDoctor.city}
//             </p>
//             <p>
//               <span className="font-semibold text-gray-800">
//                 Zip/Postal Code:
//               </span>{" "}
//               {selectedDoctor.zip}
//             </p>
//             <p>
//               <span className="font-semibold text-gray-800">Phone:</span>{" "}
//               {selectedDoctor.phone}
//             </p>
//           </div>
//         </div>

//         {/* Additional Training/Fellowship */}
//         <div className="mb-6">
//           <h3 className="text-xl font-semibold text-blue-500 mb-3">
//             Additional Training or Fellowship
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <p>
//                 <span className="font-semibold text-gray-800">Name:</span>{" "}
//                 {selectedDoctor.additionalTrainingInfo?.name || "N/A"}
//               </p>
//             </div>
//             <div>
//               <p>
//                 <span className="font-semibold text-gray-800">
//                   Institution:
//                 </span>{" "}
//                 {selectedDoctor.additionalTrainingInfo?.institution || "N/A"}
//               </p>
//             </div>
//             <div>
//               <p>
//                 <span className="font-semibold text-gray-800">Duration:</span>{" "}
//                 {selectedDoctor.additionalTrainingInfo?.duration || "N/A"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Applicant Affiliation */}
//         <div className="mb-6">
//           <h3 className="text-xl font-semibold text-blue-500 mb-3">
//             Applicant Affiliation
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <p>
//                 <span className="font-semibold text-gray-800">Institution:</span>{" "}
//                 {selectedDoctor.applicantAffiliation?.institution || "N/A"}
//               </p>
//             </div>
//             <div>
//               <p>
//                 <span className="font-semibold text-gray-800">Duration:</span>{" "}
//                 {selectedDoctor.applicantAffiliation?.duration || "N/A"}
//               </p>
//             </div>
//             <div>
//               <p>
//                 <span className="font-semibold text-gray-800">
//                   Designation:
//                 </span>{" "}
//                 {selectedDoctor.applicantAffiliation?.designation || "N/A"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Bank Slip Picture */}
//         <div className="mb-6">
//           <h3 className="text-xl font-semibold text-blue-500 mb-3">
//             Bank Slip Picture
//           </h3>
//           <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
//             {selectedDoctor.bankSlipPic ? (
//               <img
//                 src={selectedDoctor.bankSlipPic}
//                 alt="Bank Slip"
//                 className="w-full md:w-80 h-auto object-cover border-2 border-blue-500 shadow-sm rounded-md"
//               />
//             ) : (
//               <p className="text-gray-700">
//                 No bank slip picture uploaded.
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   </Modal>
// )}

//       </div>
//     </ProtectedRoute>
//   );
// };

// export default AdminDashboard;














// "use client";
// import React, { useState, useEffect, useContext } from "react";
// import ProtectedRoute from "@/../components/ProtectedRoute"; // Adjusted path
// import { AuthContext } from "@/../context/AuthContext"; // Adjusted path
// import LogoutButton from "@/app/logout/LogoutButton"; // Adjusted path
// import {
//   FiUser,
//   FiCheckCircle,
//   FiXCircle,
//   FiDollarSign,
//   FiEye,
//   FiUpload,
//   FiSearch,
//   FiRefreshCw,
// } from "react-icons/fi";
// import Modal from "@/../components/Modal"; // Adjusted path
// import { ToastContainer, toast } from "react-toastify"; // For toast notifications
// import "react-toastify/dist/ReactToastify.css"; // Toast CSS
// import Pagination from "@/../components/Pagination"; // Custom Pagination Component

// const AdminDashboard = () => {
//   const { auth, loading } = useContext(AuthContext);
//   const [stats, setStats] = useState({
//     totalForms: 0,
//     finalized: 0,
//     approved: 0,
//     paymentApproved: 0,
//   });
//   const [doctors, setDoctors] = useState([]);
//   const [error, setError] = useState("");

//   // Pagination States
//   const [currentPage, setCurrentPage] = useState(1);
//   const doctorsPerPage = 10;

//   // Search State
//   const [searchTerm, setSearchTerm] = useState("");

//   // State for Modal
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [uploadError, setUploadError] = useState("");

//   // Fetch dashboard statistics
//   const fetchStats = async () => {
//     try {
//       const response = await fetch("/api/admin/dashboard", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${auth.token}`, // Correct syntax
//         },
//       });

//       const data = await response.json();
//       console.log("Stats Data:", data);

//       if (!response.ok) {
//         setError(data.error || "Failed to fetch statistics.");
//       } else {
//         setStats(data.stats);
//       }
//     } catch (err) {
//       console.error("Error fetching stats:", err);
//       setError("An unexpected error occurred while fetching statistics.");
//     }
//   };

//   // Fetch all doctor profiles
//   const fetchDoctors = async () => {
//     try {
//       const response = await fetch("/api/doctor/getdocprof", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${auth.token}`, // Correct syntax
//         },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.error || "Failed to fetch doctor profiles.");
//       } else {
//         setDoctors(data.doctors);
//       }
//     } catch (err) {
//       console.error("Error fetching doctors:", err);
//       setError("An unexpected error occurred while fetching doctor profiles.");
//     }
//   };

//   useEffect(() => {
//     if (!loading && auth.token) {
//       fetchStats();
//       fetchDoctors();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [auth, loading]);

//   // Handle approval actions
//   const handleApproval = async (doctorId, type, action) => {
//     try {
//       const endpoint =
//         type === "approve"
//           ? `/api/doctor/${doctorId}/approve`
//           : `/api/doctor/${doctorId}/payment-approve`;
//       const response = await fetch(endpoint, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${auth.token}`, // Correct syntax
//         },
//         body: JSON.stringify({ action }), // action: 'approve' or 'reject'
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         toast.error(data.error || `Failed to ${action} ${type}.`);
//       } else {
//         toast.success(`Successfully ${action}ed ${type}.`);
//         // Refresh stats and doctors list
//         fetchStats();
//         fetchDoctors();
//       }
//     } catch (err) {
//       console.error(`Error during ${action}ing ${type}:`, err);
//       toast.error("An unexpected error occurred. Please try again.");
//     }
//   };

//   // Handle opening the modal
//   const openModal = (doctor) => {
//     setSelectedDoctor(doctor);
//     setIsModalOpen(true);
//     setUploadError("");
//   };

//   // Handle closing the modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedDoctor(null);
//     setUploadError("");
//   };

//   // Handle image upload
//   const handleImageUpload = async (e, type) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploading(true);
//     setUploadError("");

//     const formData = new FormData();
//     formData.append("image", file);
//     formData.append("doctorId", selectedDoctor._id);
//     formData.append("type", type); // 'profilePic' or 'bankSlipPic'

//     try {
//       const response = await fetch(
//         `/api/admin/doctors/${selectedDoctor._id}/upload-image`, // Corrected endpoint
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${auth.token}`,
//           },
//           body: formData,
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         setUploadError(data.error || `Failed to upload ${type}.`);
//       } else {
//         toast.success(`Successfully uploaded ${type}.`);
//         // Refresh doctors list
//         fetchDoctors();
//       }
//     } catch (err) {
//       console.error(`Error uploading ${type}:`, err);
//       setUploadError("An unexpected error occurred during upload.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Pagination Logic
//   const indexOfLastDoctor = currentPage * doctorsPerPage;
//   const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
//   const filteredDoctors = doctors.filter(
//     (doctor) =>
//       doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       doctor.pmdcNumber.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   const currentDoctors = filteredDoctors.slice(
//     indexOfFirstDoctor,
//     indexOfLastDoctor
//   );

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   return (
//     <ProtectedRoute allowedRoles={["admin"]}>
//       <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 relative">
//         <ToastContainer position="top-right" autoClose={3000} />

//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
//           <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-0">
//             Admin Dashboard
//           </h1>
//           <div className="flex space-x-3">
//             <button
//               onClick={() => {
//                 fetchStats();
//                 fetchDoctors();
//                 toast.info("Data refreshed.");
//               }}
//               className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition duration-300"
//               aria-label="Refresh Data"
//             >
//               <FiRefreshCw className="mr-2" />
//               Refresh
//             </button>
//             <LogoutButton />
//           </div>
//         </div>

//         {/* Display Errors */}
//         {error && (
//           <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
//             {error}
//           </div>
//         )}

//         {/* Statistics Section */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {/* Total Forms */}
//           <div className="flex items-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
//             <FiUser className="text-5xl text-blue-500 mr-4" />
//             <div>
//               <p className="text-sm text-gray-500">Total Forms Submitted</p>
//               <p className="text-3xl font-semibold text-gray-800">
//                 {stats.totalForms}
//               </p>
//             </div>
//           </div>

//           {/* Finalized Forms */}
//           <div className="flex items-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
//             <FiCheckCircle className="text-5xl text-yellow-500 mr-4" />
//             <div>
//               <p className="text-sm text-gray-500">Finalized Forms</p>
//               <p className="text-3xl font-semibold text-gray-800">
//                 {stats.finalized}
//               </p>
//             </div>
//           </div>

//           {/* Approved Profiles */}
//           <div className="flex items-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
//             <FiCheckCircle className="text-5xl text-green-500 mr-4" />
//             <div>
//               <p className="text-sm text-gray-500">Approved Profiles</p>
//               <p className="text-3xl font-semibold text-gray-800">
//                 {stats.approved}
//               </p>
//             </div>
//           </div>

//           {/* Payment Approved */}
//           <div className="flex items-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
//             <FiDollarSign className="text-5xl text-purple-500 mr-4" />
//             <div>
//               <p className="text-sm text-gray-500">Payment Approved</p>
//               <p className="text-3xl font-semibold text-gray-800">
//                 {stats.paymentApproved}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Doctor Profiles Section */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <div className="flex flex-col md:flex-row justify-between items-center mb-4">
//             <h2 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">
//               Doctor Profiles
//             </h2>
//             <div className="flex items-center w-full md:w-auto">
//               <div className="relative w-full md:w-64">
//                 <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="search"
//                   name="search"
//                   placeholder="Search by name, email, or PMDC"
//                   className="w-full bg-gray-100 h-10 pl-10 pr-4 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   aria-label="Search Doctor Profiles"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Profiles Table */}
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white">
//               <thead>
//                 <tr>
//                   <th className="py-3 px-6 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th className="py-3 px-6 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Email
//                   </th>
//                   <th className="py-3 px-6 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     PMDC Number
//                   </th>
//                   <th className="py-3 px-6 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Approval Status
//                   </th>
//                   <th className="py-3 px-6 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Payment Status
//                   </th>
//                   <th className="py-3 px-6 bg-gray-200 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentDoctors.length === 0 ? (
//                   <tr>
//                     <td colSpan="6" className="text-center py-6 text-gray-500">
//                       No doctor profiles found.
//                     </td>
//                   </tr>
//                 ) : (
//                   currentDoctors.map((doctor) => (
//                     <tr key={doctor._id} className="hover:bg-gray-50">
//                       <td className="py-4 px-6 border-b text-sm text-gray-700">
//                         {doctor.name}
//                       </td>
//                       <td className="py-4 px-6 border-b text-sm text-gray-700">
//                         {doctor.email}
//                       </td>
//                       <td className="py-4 px-6 border-b text-sm text-gray-700">
//                         {doctor.pmdcNumber}
//                       </td>
//                       <td className="py-4 px-6 border-b text-sm">
//                         {doctor.approvalStatus === "Approved" ? (
//                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                             Approved
//                           </span>
//                         ) : doctor.approvalStatus === "Rejected" ? (
//                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
//                             Rejected
//                           </span>
//                         ) : (
//                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
//                             Pending
//                           </span>
//                         )}
//                       </td>
//                       <td className="py-4 px-6 border-b text-sm">
//                         {doctor.paymentApprovalStatus === "Approved" ? (
//                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                             Approved
//                           </span>
//                         ) : doctor.paymentApprovalStatus === "Rejected" ? (
//                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
//                             Rejected
//                           </span>
//                         ) : (
//                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
//                             Pending
//                           </span>
//                         )}
//                       </td>
//                       <td className="py-4 px-6 border-b text-sm text-center">
//                         {/* Approval Actions */}
//                         <div className="flex flex-wrap justify-center space-x-2 mb-2">
//                           {/* Approve/Reject Profile */}
//                           {doctor.approvalStatus === "Pending" && (
//                             <>
//                               <button
//                                 onClick={() =>
//                                   handleApproval(doctor._id, "approve", "approve")
//                                 }
//                                 className="flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors duration-300"
//                                 title="Approve Profile"
//                                 aria-label={`Approve profile of ${doctor.name}`}
//                               >
//                                 <FiCheckCircle className="mr-1" />
//                                 Approve
//                               </button>
//                               <button
//                                 onClick={() =>
//                                   handleApproval(doctor._id, "approve", "reject")
//                                 }
//                                 className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors duration-300"
//                                 title="Reject Profile"
//                                 aria-label={`Reject profile of ${doctor.name}`}
//                               >
//                                 <FiXCircle className="mr-1" />
//                                 Reject
//                               </button>
//                             </>
//                           )}

//                           {/* Approve/Reject Payment */}
//                           {doctor.approvalStatus === "Approved" &&
//                             doctor.paymentApprovalStatus === "Pending" && (
//                               <>
//                                 <button
//                                   onClick={() =>
//                                     handleApproval(
//                                       doctor._id,
//                                       "payment-approve",
//                                       "approve"
//                                     )
//                                   }
//                                   className="flex items-center bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded transition-colors duration-300"
//                                   title="Approve Payment"
//                                   aria-label={`Approve payment of ${doctor.name}`}
//                                 >
//                                   <FiDollarSign className="mr-1" />
//                                   Approve Payment
//                                 </button>
//                                 <button
//                                   onClick={() =>
//                                     handleApproval(
//                                       doctor._id,
//                                       "payment-approve",
//                                       "reject"
//                                     )
//                                   }
//                                   className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors duration-300"
//                                   title="Reject Payment"
//                                   aria-label={`Reject payment of ${doctor.name}`}
//                                 >
//                                   <FiXCircle className="mr-1" />
//                                   Reject Payment
//                                 </button>
//                               </>
//                             )}
//                         </div>

//                         {/* View Details Button */}
//                         <button
//                           onClick={() => openModal(doctor)}
//                           className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-10 py-1 lg:ml-28 rounded transition-colors duration-300 mt-2 w-full sm:w-auto"
//                           title="View Details"
//                           aria-label={`View details of ${doctor.name}`}
//                         >
//                           <FiEye className="mr-1" />
//                           View Details
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {filteredDoctors.length > doctorsPerPage && (
//             <Pagination
//               doctorsPerPage={doctorsPerPage}
//               totalDoctors={filteredDoctors.length}
//               paginate={paginate}
//               currentPage={currentPage}
//             />
//           )}
//         </div>

//         {/* Modal for Doctor Details */}
//         {isModalOpen && selectedDoctor && (
//           <Modal onClose={closeModal}>
//             <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-xl overflow-y-auto max-h-screen relative">
//               {/* Header with Profile Picture */}
//               <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
//                 <h2 className="text-2xl font-semibold text-blue-500 mb-4 sm:mb-0">
//                   Doctor Details
//                 </h2>
//                 {selectedDoctor.profilePic ? (
//                   <img
//                     src={selectedDoctor.profilePic}
//                     alt="Profile Picture"
//                     className="w-24 h-24 object-cover rounded-full border-4 border-blue-500 shadow-lg"
//                   />
//                 ) : (
//                   <div className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded-full border-4 border-blue-500 shadow-lg">
//                     <span className="text-gray-500">No Image</span>
//                   </div>
//                 )}
//                 <button
//                   onClick={closeModal}
//                   className="absolute top-4 right-4 text-gray-700 hover:text-blue-500 text-2xl font-bold"
//                   aria-label="Close Modal"
//                 >
//                   &times;
//                 </button>
//               </div>

//               {/* Doctor Information */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                 <div className="space-y-3">
//                   <p>
//                     <span className="font-semibold text-gray-800">Name:</span>{" "}
//                     {selectedDoctor.name}
//                   </p>
//                   <p>
//                     <span className="font-semibold text-gray-800">Email:</span>{" "}
//                     {selectedDoctor.email}
//                   </p>
//                   <p>
//                     <span className="font-semibold text-gray-800">PMDC Number:</span>{" "}
//                     {selectedDoctor.pmdcNumber}
//                   </p>
//                   <p>
//                     <span className="font-semibold text-gray-800">Residence:</span>{" "}
//                     {selectedDoctor.residence}
//                   </p>
//                   <p>
//                     <span className="font-semibold text-gray-800">Gender:</span>{" "}
//                     {selectedDoctor.gender}
//                   </p>
//                 </div>
//                 <div className="space-y-3">
//                   <p>
//                     <span className="font-semibold text-gray-800">Father's Name:</span>{" "}
//                     {selectedDoctor.fathersName}
//                   </p>
//                   <p>
//                     <span className="font-semibold text-gray-800">Date of Birth:</span>{" "}
//                     {new Date(selectedDoctor.dob).toLocaleDateString()}
//                   </p>
//                   <p>
//                     <span className="font-semibold text-gray-800">CNIC Number:</span>{" "}
//                     {selectedDoctor.cnic}
//                   </p>
//                   <p>
//                     <span className="font-semibold text-gray-800">Fellowship Number:</span>{" "}
//                     {selectedDoctor.fellowshipNumber}
//                   </p>
//                   <p>
//                     <span className="font-semibold text-gray-800">City:</span>{" "}
//                     {selectedDoctor.city}
//                   </p>
//                   <p>
//                     <span className="font-semibold text-gray-800">Zip/Postal Code:</span>{" "}
//                     {selectedDoctor.zip}
//                   </p>
//                   <p>
//                     <span className="font-semibold text-gray-800">Phone:</span>{" "}
//                     {selectedDoctor.phone}
//                   </p>
//                 </div>
//               </div>

//               {/* Additional Training or Fellowship */}
//               <div className="mb-6">
//                 <h3 className="text-xl font-semibold text-blue-500 mb-3">
//                   Additional Training or Fellowship
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <p>
//                       <span className="font-semibold text-gray-800">Name:</span>{" "}
//                       {selectedDoctor.additionalTrainingInfo.name}
//                     </p>
//                   </div>
//                   <div>
//                     <p>
//                       <span className="font-semibold text-gray-800">Institution:</span>{" "}
//                       {selectedDoctor.additionalTrainingInfo.institution}
//                     </p>
//                   </div>
//                   <div>
//                     <p>
//                       <span className="font-semibold text-gray-800">Duration:</span>{" "}
//                       {selectedDoctor.additionalTrainingInfo.duration}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Applicant Affiliation */}
//               <div className="mb-6">
//                 <h3 className="text-xl font-semibold text-blue-500 mb-3">
//                   Applicant Affiliation
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <p>
//                       <span className="font-semibold text-gray-800">Institution:</span>{" "}
//                       {selectedDoctor.applicantAffiliation.institution}
//                     </p>
//                   </div>
//                   <div>
//                     <p>
//                       <span className="font-semibold text-gray-800">Duration:</span>{" "}
//                       {selectedDoctor.applicantAffiliation.duration}
//                     </p>
//                   </div>
//                   <div>
//                     <p>
//                       <span className="font-semibold text-gray-800">Designation:</span>{" "}
//                       {selectedDoctor.applicantAffiliation.designation}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Bank Slip Picture */}
//               <div className="mb-6">
//                 <h3 className="text-xl font-semibold text-blue-500 mb-3">
//                   Bank Slip Picture
//                 </h3>
//                 <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
//                   {selectedDoctor.bankSlipPic ? (
//                     <img
//                       src={selectedDoctor.bankSlipPic}
//                       alt="Bank Slip"
//                       className="w-full md:w-64 h-32 object-cover border-2 border-blue-500 shadow-sm rounded-md"
//                     />
//                   ) : (
//                     <p className="text-gray-700">No bank slip picture uploaded.</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </Modal>
//         )}
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default AdminDashboard;















// // /app/admin/dashboard/page.js

// "use client";
// import React, { useState, useEffect, useContext } from "react";
// import ProtectedRoute from "@/../components/ProtectedRoute"; // Adjusted path
// import { AuthContext } from "@/../context/AuthContext"; // Adjusted path
// import LogoutButton from "@/app/logout/LogoutButton"; // Adjusted path
// import {
//   FiUser,
//   FiCheckCircle,
//   FiXCircle,
//   FiDollarSign,
//   FiEye,
//   FiUpload,
//   FiSearch,
//   FiRefreshCw,
// } from "react-icons/fi";
// import Modal from "@/../components/Modal"; // Adjusted path
// import { ToastContainer, toast } from "react-toastify"; // For toast notifications
// import "react-toastify/dist/ReactToastify.css"; // Toast CSS
// import Pagination from "@/../components/Pagination"; // Custom Pagination Component

// const AdminDashboard = () => {
//   const { auth, loading } = useContext(AuthContext);
//   const [stats, setStats] = useState({
//     totalForms: 0,
//     finalized: 0,
//     approved: 0,
//     paymentApproved: 0,
//   });
//   const [doctors, setDoctors] = useState([]);
//   const [error, setError] = useState("");

//   // Pagination States
//   const [currentPage, setCurrentPage] = useState(1);
//   const doctorsPerPage = 10;

//   // Search State
//   const [searchTerm, setSearchTerm] = useState("");

//   // State for Modal
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [uploadError, setUploadError] = useState("");

//   // Fetch dashboard statistics
//   const fetchStats = async () => {
//     try {
//       const response = await fetch("/api/admin/dashboard", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${auth.token}`, // Correct syntax
//         },
//       });

//       const data = await response.json();
//       console.log("Stats Data:", data);

//       if (!response.ok) {
//         setError(data.error || "Failed to fetch statistics.");
//       } else {
//         setStats(data.stats);
//       }
//     } catch (err) {
//       console.error("Error fetching stats:", err);
//       setError("An unexpected error occurred while fetching statistics.");
//     }
//   };

//   // Fetch all doctor profiles
//   const fetchDoctors = async () => {
//     try {
//       const response = await fetch("/api/doctor/getdocprof", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${auth.token}`, // Correct syntax
//         },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.error || "Failed to fetch doctor profiles.");
//       } else {
//         setDoctors(data.doctors);
//       }
//     } catch (err) {
//       console.error("Error fetching doctors:", err);
//       setError("An unexpected error occurred while fetching doctor profiles.");
//     }
//   };

//   useEffect(() => {
//     if (!loading && auth.token) {
//       fetchStats();
//       fetchDoctors();
//     }
//   }, [auth, loading]);

//   // Handle approval actions
//   const handleApproval = async (doctorId, type, action) => {
//     try {
//       const endpoint =
//         type === "approve"
//           ? `/api/doctor/${doctorId}/approve`
//           : `/api/doctor/${doctorId}/payment-approve`;
//       const response = await fetch(endpoint, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${auth.token}`, // Correct syntax
//         },
//         body: JSON.stringify({ action }), // action: 'approve' or 'reject'
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         toast.error(data.error || `Failed to ${action} ${type}.`);
//       } else {
//         toast.success(`Successfully ${action}ed ${type}.`);
//         // Refresh stats and doctors list
//         fetchStats();
//         fetchDoctors();
//       }
//     } catch (err) {
//       console.error(`Error during ${action}ing ${type}:`, err);
//       toast.error("An unexpected error occurred. Please try again.");
//     }
//   };

//   // Handle opening the modal
//   const openModal = (doctor) => {
//     setSelectedDoctor(doctor);
//     setIsModalOpen(true);
//     setUploadError("");
//   };

//   // Handle closing the modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedDoctor(null);
//     setUploadError("");
//   };

//   // Handle image upload
//   const handleImageUpload = async (e, type) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploading(true);
//     setUploadError("");

//     const formData = new FormData();
//     formData.append("image", file);
//     formData.append("doctorId", selectedDoctor._id);
//     formData.append("type", type); // 'profilePic' or 'bankSlipPic'

//     try {
//       const response = await fetch(
//         `/api/admin/doctors/${selectedDoctor._id}/upload-image`, // Corrected endpoint
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${auth.token}`,
//           },
//           body: formData,
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         setUploadError(data.error || `Failed to upload ${type}.`);
//       } else {
//         toast.success(`Successfully uploaded ${type}.`);
//         // Refresh doctors list
//         fetchDoctors();
//       }
//     } catch (err) {
//       console.error(`Error uploading ${type}:`, err);
//       setUploadError("An unexpected error occurred during upload.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Pagination Logic
//   const indexOfLastDoctor = currentPage * doctorsPerPage;
//   const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
//   const currentDoctors = doctors
//     .filter(
//       (doctor) =>
//         doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         doctor.pmdcNumber.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//     .slice(indexOfFirstDoctor, indexOfLastDoctor);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   return (
//     <ProtectedRoute allowedRoles={["admin"]}>
//       <div className="min-h-screen bg-gray-100 p-6 relative">
//         <ToastContainer position="top-right" autoClose={3000} />
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-6">
//           <h1 className="text-4xl font-bold text-gray-800 mb-4 md:mb-0">
//             Admin Dashboard
//           </h1>
//           <div className="flex space-x-4">
//             <button
//               onClick={() => {
//                 fetchStats();
//                 fetchDoctors();
//                 toast.info("Data refreshed.");
//               }}
//               className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition duration-300"
//               aria-label="Refresh Data"
//             >
//               <FiRefreshCw className="mr-2" />
//               Refresh
//             </button>
//             <LogoutButton />
//           </div>
//         </div>

//         {/* Display Errors */}
//         {error && (
//           <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
//             {error}
//           </div>
//         )}

//         {/* Statistics Section */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {/* Total Forms */}
//           <div className="flex items-center p-4 bg-white rounded shadow hover:shadow-lg transition-shadow duration-300">
//             <FiUser className="text-4xl text-blue-500 mr-4" />
//             <div>
//               <p className="text-sm text-gray-500">Total Forms Submitted</p>
//               <p className="text-2xl font-semibold">{stats.totalForms}</p>
//             </div>
//           </div>

//           {/* Finalized Forms */}
//           <div className="flex items-center p-4 bg-white rounded shadow hover:shadow-lg transition-shadow duration-300">
//             <FiCheckCircle className="text-4xl text-yellow-500 mr-4" />
//             <div>
//               <p className="text-sm text-gray-500">Finalized Forms</p>
//               <p className="text-2xl font-semibold">{stats.finalized}</p>
//             </div>
//           </div>

//           {/* Approved Profiles */}
//           <div className="flex items-center p-4 bg-white rounded shadow hover:shadow-lg transition-shadow duration-300">
//             <FiCheckCircle className="text-4xl text-green-500 mr-4" />
//             <div>
//               <p className="text-sm text-gray-500">Approved Profiles</p>
//               <p className="text-2xl font-semibold">{stats.approved}</p>
//             </div>
//           </div>

//           {/* Payment Approved */}
//           <div className="flex items-center p-4 bg-white rounded shadow hover:shadow-lg transition-shadow duration-300">
//             <FiDollarSign className="text-4xl text-purple-500 mr-4" />
//             <div>
//               <p className="text-sm text-gray-500">Payment Approved</p>
//               <p className="text-2xl font-semibold">{stats.paymentApproved}</p>
//             </div>
//           </div>
//         </div>

//         {/* Doctor Profiles Section */}
//         <div className="bg-white p-6 rounded shadow">
//           <div className="flex flex-col md:flex-row justify-between items-center mb-4">
//             <h2 className="text-2xl font-semibold text-gray-800">
//               Doctor Profiles
//             </h2>
//             <div className="flex items-center mt-4 md:mt-0">
//               <div className="relative text-gray-600">
//                 <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2" />
//                 <input
//                   type="search"
//                   name="search"
//                   placeholder="Search by name, email, or PMDC"
//                   className="bg-gray-100 h-10 pl-10 pr-4 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   aria-label="Search Doctor Profiles"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Profiles Table */}
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white">
//               <thead>
//                 <tr>
//                   <th
//                     className="py-2 px-4 border-b text-left cursor-pointer"
//                     onClick={() => {
//                       // Implement sorting logic here
//                       // For example, toggle sort order based on column
//                     }}
//                   >
//                     Name
//                   </th>
//                   <th className="py-2 px-4 border-b text-left">Email</th>
//                   <th className="py-2 px-4 border-b text-left">PMDC Number</th>
//                   <th className="py-2 px-4 border-b text-left">Approval Status</th>
//                   <th className="py-2 px-4 border-b text-left">Payment Status</th>
//                   <th className="py-2 px-4 border-b text-left">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentDoctors.length === 0 ? (
//                   <tr>
//                     <td colSpan="6" className="text-center py-4">
//                       No doctor profiles found.
//                     </td>
//                   </tr>
//                 ) : (
//                   currentDoctors.map((doctor) => (
//                     <tr key={doctor._id} className="hover:bg-gray-50">
//                       <td className="py-2 px-4 border-b">{doctor.name}</td>
//                       <td className="py-2 px-4 border-b">{doctor.email}</td>
//                       <td className="py-2 px-4 border-b">{doctor.pmdcNumber}</td>
//                       <td className="py-2 px-4 border-b">
//                         {doctor.approvalStatus === "Approved" ? (
//                           <span className="text-green-600 font-semibold">
//                             Approved
//                           </span>
//                         ) : doctor.approvalStatus === "Rejected" ? (
//                           <span className="text-red-600 font-semibold">
//                             Rejected
//                           </span>
//                         ) : (
//                           <span className="text-yellow-600 font-semibold">
//                             Pending
//                           </span>
//                         )}
//                       </td>
//                       <td className="py-2 px-4 border-b">
//                         {doctor.paymentApprovalStatus === "Approved" ? (
//                           <span className="text-green-600 font-semibold">
//                             Approved
//                           </span>
//                         ) : doctor.paymentApprovalStatus === "Rejected" ? (
//                           <span className="text-red-600 font-semibold">
//                             Rejected
//                           </span>
//                         ) : (
//                           <span className="text-yellow-600 font-semibold">
//                             Pending
//                           </span>
//                         )}
//                       </td>
//                       <td className="py-2 px-4 border-b">
//                         {/* Approval Actions */}
//                         <div className="flex flex-wrap justify-center space-x-2 mb-2">
//                           {/* Approve/Reject Profile */}
//                           {doctor.approvalStatus === "Pending" && (
//                             <>
//                               <button
//                                 onClick={() =>
//                                   handleApproval(
//                                     doctor._id,
//                                     "approve",
//                                     "approve"
//                                   )
//                                 }
//                                 className="flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors duration-300"
//                                 title="Approve Profile"
//                                 aria-label={`Approve profile of ${doctor.name}`}
//                               >
//                                 <FiCheckCircle className="mr-1" />
//                                 Approve
//                               </button>
//                               <button
//                                 onClick={() =>
//                                   handleApproval(
//                                     doctor._id,
//                                     "approve",
//                                     "reject"
//                                   )
//                                 }
//                                 className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors duration-300"
//                                 title="Reject Profile"
//                                 aria-label={`Reject profile of ${doctor.name}`}
//                               >
//                                 <FiXCircle className="mr-1" />
//                                 Reject
//                               </button>
//                             </>
//                           )}

//                           {/* Approve/Reject Payment */}
//                           {doctor.approvalStatus === "Approved" &&
//                             doctor.paymentApprovalStatus === "Pending" && (
//                               <>
//                                 <button
//                                   onClick={() =>
//                                     handleApproval(
//                                       doctor._id,
//                                       "payment-approve",
//                                       "approve"
//                                     )
//                                   }
//                                   className="flex items-center bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded transition-colors duration-300"
//                                   title="Approve Payment"
//                                   aria-label={`Approve payment of ${doctor.name}`}
//                                 >
//                                   <FiDollarSign className="mr-1" />
//                                   Approve Payment
//                                 </button>
//                                 <button
//                                   onClick={() =>
//                                     handleApproval(
//                                       doctor._id,
//                                       "payment-approve",
//                                       "reject"
//                                     )
//                                   }
//                                   className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors duration-300"
//                                   title="Reject Payment"
//                                   aria-label={`Reject payment of ${doctor.name}`}
//                                 >
//                                   <FiXCircle className="mr-1" />
//                                   Reject Payment
//                                 </button>
//                               </>
//                             )}
//                         </div>

//                         {/* View Details Button */}
//                         <button
//                           onClick={() => openModal(doctor)}
//                           className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors duration-300"
//                           title="View Details"
//                           aria-label={`View details of ${doctor.name}`}
//                         >
//                           <FiEye className="mr-1" />
//                           View Details
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {doctors.length > doctorsPerPage && (
//             <Pagination
//               doctorsPerPage={doctorsPerPage}
//               totalDoctors={doctors.length}
//               paginate={paginate}
//               currentPage={currentPage}
//             />
//           )}
//         </div>

//         {/* Modal for Doctor Details */}
//         {isModalOpen && selectedDoctor && (
//         <Modal onClose={closeModal}>
//           <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl overflow-y-auto max-h-screen relative">
//             {/* Header with Profile Picture */}
//             <div className="flex justify-between items-center mb-8">
//               <h2 className="text-2xl font-semibold text-[#45C0C9]">Doctor Details</h2>
//               {selectedDoctor.profilePic ? (
//                 <img
//                   src={selectedDoctor.profilePic}
//                   alt="Profile Picture"
//                   className="w-20 h-20 object-cover rounded-full border-2 border-[#45C0C9] shadow-lg"
//                 />
//               ) : (
//                 <div className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded-full border-2 border-[#45C0C9] shadow-lg">
//                   <span className="text-gray-500">No Image</span>
//                 </div>
//               )}
//               <button
//                 onClick={closeModal}
//                 className="absolute top-4 right-4 text-[#1D3851] hover:text-[#45C0C9] text-3xl font-bold"
//                 aria-label="Close Modal"
//               >
//                 &times;
//               </button>
//             </div>

//             {/* Doctor Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//               <div className="space-y-4">
//                 <p className="text-[#1D3851]">
//                   <span className="font-semibold text-black">Name:</span> {selectedDoctor.name}
//                 </p>
//                 <p className="text-[#1D3851]">
//                   <span className="font-semibold text-black">Email:</span> {selectedDoctor.email}
//                 </p>
//                 <p className="text-[#1D3851]">
//                   <span className="font-semibold text-black">PMDC Number:</span> {selectedDoctor.pmdcNumber}
//                 </p>
//                 <p className="text-[#1D3851]">
//                   <span className="font-semibold text-black">Residence:</span> {selectedDoctor.residence}
//                 </p>
//                 <p className="text-[#1D3851]">
//                   <span className="font-semibold text-black">Gender:</span> {selectedDoctor.gender}
//                 </p>
//               </div>
//               <div className="space-y-4">
//                 <p className="text-[#1D3851]">
//                   <span className="font-semibold text-black">Father's Name:</span> {selectedDoctor.fathersName}
//                 </p>
//                 <p className="text-[#1D3851]">
//                   <span className="font-semibold text-black">Date of Birth:</span>{" "}
//                   {new Date(selectedDoctor.dob).toLocaleDateString()}
//                 </p>
//                 <p className="text-[#1D3851]">
//                   <span className="font-semibold text-black">CNIC Number:</span> {selectedDoctor.cnic}
//                 </p>
//                 <p className="text-[#1D3851]">
//                   <span className="font-semibold text-black">Fellowship Number:</span>{" "}
//                   {selectedDoctor.fellowshipNumber}
//                 </p>
//                 <p className="text-[#1D3851]">
//                   <span className="font-semibold text-black">City:</span> {selectedDoctor.city}
//                 </p>
//                 <p className="text-[#1D3851]">
//                   <span className="font-semibold text-black">Zip/Postal Code:</span> {selectedDoctor.zip}
//                 </p>
//                 <p className="text-[#1D3851]">
//                   <span className="font-semibold text-black">Phone:</span> {selectedDoctor.phone}
//                 </p>
//               </div>
//             </div>

//             {/* Additional Training or Fellowship */}
//             <div className="mb-8">
//               <h3 className="text-xl font-semibold text-[#45C0C9] mb-4">
//                 Additional Training or Fellowship
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div>
//                   <p className="text-[#1D3851]">
//                     <span className="font-semibold text-black">Name:</span>{" "}
//                     {selectedDoctor.additionalTrainingInfo.name}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-[#1D3851]">
//                     <span className="font-semibold text-black">Institution:</span>{" "}
//                     {selectedDoctor.additionalTrainingInfo.institution}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-[#1D3851]">
//                     <span className="font-semibold text-black">Duration:</span>{" "}
//                     {selectedDoctor.additionalTrainingInfo.duration}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Applicant Affiliation */}
//             <div className="mb-8">
//               <h3 className="text-xl font-semibold text-[#45C0C9] mb-4">
//                 Applicant Affiliation
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div>
//                   <p className="text-[#1D3851]">
//                     <span className="font-semibold text-black">Institution:</span>{" "}
//                     {selectedDoctor.applicantAffiliation.institution}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-[#1D3851]">
//                     <span className="font-semibold text-black">Duration:</span>{" "}
//                     {selectedDoctor.applicantAffiliation.duration}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-[#1D3851]">
//                     <span className="font-semibold text-black">Designation:</span>{" "}
//                     {selectedDoctor.applicantAffiliation.designation}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Bank Slip Picture */}
//             <div className="mb-8">
//               <h3 className="text-xl font-semibold text-[#45C0C9] mb-4">
//                 Bank Slip Picture
//               </h3>
//               <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
//                 {selectedDoctor.bankSlipPic ? (
//                   <img
//                     src={selectedDoctor.bankSlipPic}
//                     alt="Bank Slip"
//                     className="w-64 h-32 object-cover border-2 border-[#1D3851] shadow-sm rounded-md"
//                   />
//                 ) : (
//                   <p className="text-[#1D3851]">No bank slip picture uploaded.</p>
//                 )}
//               </div>
//             </div>

//             {/* Feedback Messages */}
//             {/* Upload Error */}
//             {uploadError && (
//               <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
//                 {uploadError}
//               </div>
//             )}

//             {/* Uploading Indicator */}
//             {uploading && (
//               <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded flex items-center">
//                 <svg
//                   className="animate-spin h-5 w-5 mr-3 text-blue-700"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8v8H4z"
//                   ></path>
//                 </svg>
//                 <span>Uploading...</span>
//               </div>
//             )}
//           </div>
//         </Modal>
//       )}

//       </div>
//     </ProtectedRoute>
//   );
// };

// export default AdminDashboard;












// // /app/admin/dashboard/page.js

// "use client";
// import React, { useState, useEffect, useContext } from "react";
// import ProtectedRoute from "@/../components/ProtectedRoute"; // Adjust the path as needed
// import { AuthContext } from "@/../context/AuthContext"; // Ensure AuthContext provides user roles
// import LogoutButton from "@/app/logout/LogoutButton"; // Ensure LogoutButton is correctly imported
// import { FiUser, FiCheckCircle, FiXCircle, FiDollarSign } from "react-icons/fi";

// const AdminDashboard = () => {
//   const { auth, loading } = useContext(AuthContext);
//   const [stats, setStats] = useState({
//     totalForms: 0,
//     finalized: 0,
//     approved: 0,
//     paymentApproved: 0,
//   });
//   const [doctors, setDoctors] = useState([]);
//   const [error, setError] = useState("");

//   // Fetch dashboard statistics
//   const fetchStats = async () => {
//     try {
//       const response = await fetch("/api/admin/dashboard", {
//         method: "GET",
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${auth.token}`, // Fixed syntax
//         },
//       });

//       const data = await response.json();
//       console.log("data", data);
      

//       if (!response.ok) {
//         setError(data.error || "Failed to fetch statistics.");
//       } else {
//         setStats(data.stats);
//       }
//     } catch (err) {
//       console.error("Error fetching stats:", err);
//       setError("An unexpected error occurred while fetching statistics.");
//     }
//   };

//   // Fetch all doctor profiles
//   const fetchDoctors = async () => {
//     try {
//       const response = await fetch("/api/doctor/getdocprof", {
//         method: "GET",
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${auth.token}`, // Fixed syntax
//         },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.error || "Failed to fetch doctor profiles.");
//       } else {
//         setDoctors(data.doctors);
//       }
//     } catch (err) {
//       console.error("Error fetching doctors:", err);
//       setError("An unexpected error occurred while fetching doctor profiles.");
//     }
//   };

//   useEffect(() => {
//     if (!loading && auth.token) {
//       fetchStats();
//       fetchDoctors();
//     }
//   }, [auth, loading]);

//   // Handle approval actions
//   const handleApproval = async (doctorId, type, action) => {
//     try {
//       const response = await fetch(`/api/doctor/${doctorId}/${type}`, {
//         method: "PUT",
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${auth.token}`, // Fixed syntax
//         },
//         body: JSON.stringify({ action }), // action: 'approve' or 'reject'
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         alert(data.error || `Failed to ${action} ${type}.`);
//       } else {
//         alert(`Successfully ${action}ed ${type}.`);
//         // Refresh stats and doctors list
//         fetchStats();
//         fetchDoctors();
//       }
//     } catch (err) {
//       console.error(`Error during ${action}ing ${type}:`, err);
//       alert("An unexpected error occurred. Please try again.");
//     }
//   };

//   return (
//     <ProtectedRoute allowedRoles={["admin"]}>
//       <div className="min-h-screen bg-gray-100 p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
//           <LogoutButton />
//         </div>

//         {/* Display Errors */}
//         {error && (
//           <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
//             {error}
//           </div>
//         )}

//         {/* Statistics Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {/* Total Forms */}
//           <div className="flex items-center p-4 bg-white rounded shadow">
//             <FiUser className="text-4xl text-blue-500 mr-4" />
//             <div>
//               <p className="text-sm text-gray-500">Total Forms Submitted</p>
//               <p className="text-2xl font-semibold">{stats.totalForms}</p>
//             </div>
//           </div>

//           {/* Finalized Forms */}
//           <div className="flex items-center p-4 bg-white rounded shadow">
//             <FiCheckCircle className="text-4xl text-yellow-500 mr-4" />
//             <div>
//               <p className="text-sm text-gray-500">Finalized Forms</p>
//               <p className="text-2xl font-semibold">{stats.finalized}</p>
//             </div>
//           </div>

//           {/* Approved Profiles */}
//           <div className="flex items-center p-4 bg-white rounded shadow">
//             <FiCheckCircle className="text-4xl text-green-500 mr-4" />
//             <div>
//               <p className="text-sm text-gray-500">Approved Profiles</p>
//               <p className="text-2xl font-semibold">{stats.approved}</p>
//             </div>
//           </div>

//           {/* Payment Approved */}
//           <div className="flex items-center p-4 bg-white rounded shadow">
//             <FiDollarSign className="text-4xl text-purple-500 mr-4" />
//             <div>
//               <p className="text-sm text-gray-500">Payment Approved</p>
//               <p className="text-2xl font-semibold">{stats.paymentApproved}</p>
//             </div>
//           </div>
//         </div>

//         {/* Doctor Profiles Section */}
//         <div className="bg-white p-6 rounded shadow">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Doctor Profiles</h2>

//           {/* Profiles Table */}
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white">
//               <thead>
//                 <tr>
//                   <th className="py-2 px-4 border-b">Name</th>
//                   <th className="py-2 px-4 border-b">Email</th>
//                   <th className="py-2 px-4 border-b">PMDC Number</th>
//                   <th className="py-2 px-4 border-b">Approval Status</th>
//                   <th className="py-2 px-4 border-b">Payment Status</th>
//                   <th className="py-2 px-4 border-b">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {doctors.length === 0 ? (
//                   <tr>
//                     <td colSpan="6" className="text-center py-4">
//                       No doctor profiles found.
//                     </td>
//                   </tr>
//                 ) : (
//                   doctors.map((doctor) => (
//                     <tr key={doctor._id} className="text-center">
//                       <td className="py-2 px-4 border-b">{doctor.name}</td>
//                       <td className="py-2 px-4 border-b">{doctor.email}</td>
//                       <td className="py-2 px-4 border-b">{doctor.pmdcNumber}</td>
//                       <td className="py-2 px-4 border-b">
//                         {doctor.approvalStatus === "Approved" ? (
//                           <span className="text-green-600 font-semibold">Approved</span>
//                         ) : doctor.approvalStatus === "Rejected" ? (
//                           <span className="text-red-600 font-semibold">Rejected</span>
//                         ) : (
//                           <span className="text-yellow-600 font-semibold">Pending</span>
//                         )}
//                       </td>
//                       <td className="py-2 px-4 border-b">
//                         {doctor.paymentApprovalStatus === "Approved" ? (
//                           <span className="text-green-600 font-semibold">Approved</span>
//                         ) : doctor.paymentApprovalStatus === "Rejected" ? (
//                           <span className="text-red-600 font-semibold">Rejected</span>
//                         ) : (
//                           <span className="text-yellow-600 font-semibold">Pending</span>
//                         )}
//                       </td>
//                       <td className="py-2 px-4 border-b">
//                         {/* Approval Actions */}
//                         <div className="flex justify-center space-x-2">
//                           {/* Approve/Reject Profile */}
//                           {doctor.approvalStatus === "Pending" && (
//                             <>
//                               <button
//                                 onClick={() => handleApproval(doctor._id, "approve", "approve")}
//                                 className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
//                                 title="Approve Profile"
//                               >
//                                 Approve
//                               </button>
//                               <button
//                                 onClick={() => handleApproval(doctor._id, "approve", "reject")}
//                                 className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
//                                 title="Reject Profile"
//                               >
//                                 Reject
//                               </button>
//                             </>
//                           )}

//                           {/* Approve/Reject Payment */}
//                           {doctor.approvalStatus === "Approved" && doctor.paymentApprovalStatus === "Pending" && (
//                             <>
//                               <button
//                                 onClick={() => handleApproval(doctor._id, "payment-approve", "approve")}
//                                 className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded"
//                                 title="Approve Payment"
//                               >
//                                 Approve Payment
//                               </button>
//                               <button
//                                 onClick={() => handleApproval(doctor._id, "payment-approve", "reject")}
//                                 className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
//                                 title="Reject Payment"
//                               >
//                                 Reject Payment
//                               </button>
//                             </>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default AdminDashboard;
