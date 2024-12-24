import React from 'react';
import { useRouter } from 'next/navigation';

const PresidentsMessage = () => {
    const router = useRouter();
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl font-bold text-[#1D3851] mb-6">
          President’s <span className="text-[#45C0C9]">Message</span>
        </h2>
        
        {/* Intro Text */}
        <p className="text-gray-700 text-lg mb-6">
          Dear Colleagues, Assalamoalaikum.
        </p>
        
        {/* Main Body Text with highlights */}
        <p className="text-gray-700 text-base mb-6 leading-relaxed">
          The <span className="text-[#45C0C9] font-semibold">Pakistan Society of Neurology (PSN)</span> has been the official representative body for Pakistani neurologists for nearly three decades, committed to fostering connections, promoting excellence, and advancing the field of neurology in our country. The <span className="text-[#45C0C9] font-semibold">Pakistan Society of Neurology (PSN)</span> proudly invites all eligible neurologists with postgraduate qualification in Neurology to register for <span className="text-[#45C0C9] font-semibold">PSN Membership</span> and inclusion in the <span className="text-[#45C0C9] font-semibold">PSN Digital Directory</span>. This initiative aims to further strengthen our professional network and enhance advocacy for the field of neurology in Pakistan. In this context Helix Pharma has promised unconditional support to accomplish this goal. Their representatives will visit you to facilitate the process of registration. Profound regards,
        </p>
        
        <p className="text-gray-700 text-base mb-8">
          Professor Naila N. Shahbaz
        </p>
        
        {/* Button */}
        <div className="mb-8">
          <button className="bg-[#45C0C9] hover:bg-[#3dadb7] text-white font-semibold py-3 px-6 rounded text-base"
            onClick={() => router.push("/membershipForm/step1")}>
            Click to Open Membership Form
          </button>
        </div>
        
        {/* Footer Note */}
        <p className="text-gray-500 text-sm">
          This is collaborative efforts of Helix Pharma (Pvt) Limited and Pakistan Society of Neurology
        </p>
      </div>
    </section>
  );
};

export default PresidentsMessage;
