"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import * as htmlToImage from 'html-to-image';

export default function IdCard({ doctor }) {
  const [qrCode, setQrCode] = useState("");

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrData = JSON.stringify({
          id: doctor._id,
          name: doctor.name,
          cnic: doctor.cnic,
          phone: doctor.phone,
          institution: doctor.applicantAffiliation?.institution,
        });

        const qrCodeUrl = await QRCode.toDataURL(qrData, {
          width: 150,
          margin: 1,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });

        setQrCode(qrCodeUrl);
      } catch (err) {
        console.error("Error generating QR code:", err);
      }
    };

    generateQRCode();
  }, [doctor]);

  const downloadCard = async () => {
    try {
      const element = document.getElementById('id-card-container');
      if (element) {
        const dataUrl = await htmlToImage.toPng(element, {
          quality: 1,
          pixelRatio: 3,
          width: element.offsetWidth * 2,
          height: element.offsetHeight * 2,
          style: {
            transform: 'scale(2)',
            transformOrigin: 'top left'
          }
        });
        const link = document.createElement('a');
        link.download = 'id-card-both-sides.png';
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error('Error while generating image:', error);
    }
  };

  if (!doctor) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold">No Doctor Data Provided</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div id="id-card-container" className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-lg">
          {/* Front Side */}
          <div className="aspect-[1/1.57] bg-[#40C5C5] rounded-xl overflow-hidden relative p-6 border-2 border-black">
            <div className="relative z-10 h-full flex flex-col items-center">
              {/* Profile Photo */}
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white mt-8 mb-6">
                <img
                  src={doctor.profilePic || "/placeholder.svg"}
                  alt="Doctor Photo"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Doctor Name */}
              <h2 className="text-white text-xl font-semibold mb-1">
                Dr. {doctor.name || "N/A"}
              </h2>

              {/* Membership ID */}
              <p className="text-white/90 text-sm mb-auto">
                Membership ID: {doctor.membershipNumber || "00000"}
              </p>

              {/* PSN Logo */}
              <div className="mt-auto">
                <div className="p-2 w-40 h-40 flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt="PSN Logo"
                    className=""
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div className="aspect-[1/1.57] bg-[#40C5C5] rounded-xl overflow-hidden relative p-6 border-2 border-black">
            <div className="h-full flex flex-col text-white">
              {/* Personal Information */}
              <div className="space-y-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-white/70">Institution/ Clinic Name: <span>{doctor.applicantAffiliation?.institution || "N/A"}</span> </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white/70">Address/ City: <span>{doctor.address || "N/A"}</span></span>
                  
                </div>
                <div className="flex flex-col">
                  <span className="text-white/70">PMDC Registration No.: <span>{doctor.pmdcNumber || "N/A"}</span> </span>
                  
                </div>
                <div className="flex flex-col">
                  <span className="text-white/70">Fellowship No.: <span>{doctor.fellowshipNumber || "N/A"}</span></span>
                  
                </div>
                <div className="flex flex-col">
                  <span className="text-white/70">Contact Number:<span>{doctor.phone || "N/A"}</span></span>
                  
                </div>
                <div className="flex flex-col">
                  <span className="text-white/70">Email address: <span>{doctor.email || "N/A"}</span></span>
                  
                </div>
                <div className="flex flex-col">
                  <span className="text-white/70">Date of Birth: <span>{doctor.dateOfBirth || "N/A"}</span></span>
                  
                </div>
              </div>

              {/* Bottom section with QR Code, Logo, and Web Address */}
              <div className="mt-auto flex flex-col items-center space-y-2">
                {/* QR Code */}
                {qrCode && (
                  <img
                    src={qrCode}
                    alt="QR Code"
                    width={70}
                    height={70}
                    className="bg-white p-1 rounded"
                  />
                )}
                
                {/* Neurology Network Logo */}
                <div className=" w-24 h-24 flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt="Neurology Network Logo"
                    className=""
                  />
                </div>
                
                {/* Web Address */}
                <span className="text-white text-xs">
                  www.neurologynetwork.org
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={downloadCard}
            className="bg-[#40C5C5] hover:bg-[#3BB1B1] rounded-full px-8 py-3 text-white font-semibold transition-colors"
          >
            Download ID Card
          </button>
        </div>
      </div>
    </div>
  );
}























// "use client";

// import { useEffect, useState } from "react";
// import QRCode from "qrcode";
// import * as htmlToImage from 'html-to-image';

// export default function IdCard({ doctor }) {
//   const [qrCode, setQrCode] = useState("");

//   useEffect(() => {
//     const generateQRCode = async () => {
//       try {
//         const qrData = JSON.stringify({
//           id: doctor._id,
//           name: doctor.name,
//           cnic: doctor.cnic,
//           phone: doctor.phone,
//           institution: doctor.applicantAffiliation?.institution,
//         });

//         const qrCodeUrl = await QRCode.toDataURL(qrData, {
//           width: 150,
//           margin: 1,
//           color: {
//             dark: "#000000",
//             light: "#ffffff",
//           },
//         });

//         setQrCode(qrCodeUrl);
//       } catch (err) {
//         console.error("Error generating QR code:", err);
//       }
//     };

//     generateQRCode();
//   }, [doctor]);

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
//   };

//   const downloadCard = async () => {
//     try {
//       const element = document.getElementById('id-card-container');
//       if (element) {
//         const dataUrl = await htmlToImage.toPng(element, {
//           quality: 1,
//           pixelRatio: 3,
//           width: element.offsetWidth * 2,
//           height: element.offsetHeight * 2,
//           style: {
//             transform: 'scale(2)',
//             transformOrigin: 'top left'
//           }
//         });
//         const link = document.createElement('a');
//         link.download = 'id-card-both-sides.png';
//         link.href = dataUrl;
//         link.click();
//       }
//     } catch (error) {
//       console.error('Error while generating image:', error);
//     }
//   };

//   if (!doctor) {
//     return (
//       <div className="p-6">
//         <h2 className="text-xl font-bold">No Doctor Data Provided</h2>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4 md:p-6">
//       <div className="max-w-4xl mx-auto space-y-6">
//         <div id="id-card-container" className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-lg">
//           {/* Front Side */}
//           <div className="aspect-[1/1.57] bg-slate-50 rounded-lg overflow-hidden relative p-4">
//             {/* Decorative Corners */}
//             <div className="absolute top-0 left-0 w-20 h-24 bg-blue-900 rounded-br-[100%]" />
//             <svg className="absolute top-[75px] left-0" width="50" height="50" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
//               <polygon points="0,40 40,0 0,0,0" fill="#1E3A8A" />
//             </svg>
//             <div className="absolute bottom-0 right-0 w-20 h-24 bg-blue-900 rounded-tl-[100%]" />
//             <svg className="absolute bottom-[75px] right-0" width="50" height="50" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
//               <polygon points="0,40 40,40 40,0,0" fill="#1E3A8A" />
//             </svg>

//             {/* Front Side Content */}
//             <div className="relative z-10 h-full flex flex-col p-4">
//               {/* Logo */}
//               <div className="absolute top-4 right-4">
//                 <img
//                   src="/logo.png"
//                   alt="PSN Logo"
//                   className="rounded-full h-16 w-32 object-cover"
//                 />
//               </div>

//               {/* Photo */}
//               <div className="mt-16 flex-1">
//                 <div className="relative z-10 w-32 h-32 mx-auto mt-4">
//                   <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
//                     <img
//                       src={doctor.profilePic || "/placeholder.svg"}
//                       alt="Member Photo"
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Doctor Details */}
//               <div className="mt-4 text-center">
//                 <h2 className="text-base font-bold text-gray-800 mb-1">
//                   Dr. {doctor.name || "N/A"}
//                 </h2>
//                 <p className="text-sm text-gray-600 mb-2">
//                   {doctor.applicantAffiliation?.designation || "N/A"}
//                 </p>
//                 <div className="text-xs text-gray-500 space-y-0.5">
//                   <p>Membership No: {doctor.membershipNumber || "0001"}</p>
//                   <p>Member Since: {formatDate(doctor.createdAt)}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Back Side */}
//           <div className="aspect-[1/1.57] bg-slate-50 rounded-lg overflow-hidden relative p-4">
//             <div className="h-full flex flex-col justify-between py-2">
//               {/* Additional Info */}
//               <div className="space-y-2 text-sm text-gray-600">
//                 <p>Institute: {doctor.applicantAffiliation?.institution || "N/A"}</p>
//                 <p>Address: {doctor.address || "N/A"}</p>
//                 <p>Phone: {doctor.phone || "N/A"}</p>
//                 <p>CNIC No: {doctor.cnic || "N/A"}</p>
//               </div>

//               {/* QR Code */}
//               <div className="my-4 flex justify-center">
//                 {qrCode && (
//                   <img
//                     src={qrCode}
//                     alt="QR Code"
//                     width={100}
//                     height={100}
//                     className="rounded"
//                   />
//                 )}
//               </div>

//               {/* Return Text */}
//               <div className="text-center text-sm text-gray-600">
//                 <p className="font-bold mb-2">
//                   If this card is found please return to:
//                 </p>
//                 <div className="mt-2">
//                   <div className="w-40 mx-auto border-b border-gray-300"></div>
//                 </div>
//                 <div className="mt-2">
//                   <div className="w-40 mx-auto border-b border-gray-300"></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Download Button */}
//         <div className="flex justify-center mt-4">
//           <button
//             onClick={downloadCard}
//             className="bg-orange-400 hover:bg-orange-500 rounded-3xl px-6 py-2 text-white font-semibold"
//           >
//             Download ID Card
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }




