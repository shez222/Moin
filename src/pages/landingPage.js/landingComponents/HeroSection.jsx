import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const [imageVisible, setImageVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Trigger the animation after a brief delay
    const timer = setTimeout(() => {
      setImageVisible(true);
    }, 100); // Delay in milliseconds (optional)

    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="w-full bg-[#F4FBFF] py-12 sm:py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 flex flex-col-reverse lg:flex-row items-center">
        
        {/* Left Side: Heading and Text */}
        <div className="w-full lg:w-2/3 lg:pr-10 mt-8 lg:mt-0">
          <h1 className="font-bold text-[#1D3851] mb-4 text-4xl sm:text-5xl md:text-6xl leading-tight">
            Pakistan<br />
            <span className="text-[#45C0C9]">Neurology Network!</span>
          </h1>
          <div className="relative bg-[#E6F2F9] rounded-md p-6 mb-6 max-w-lg mx-auto lg:mx-0">
            {/* Stylized Quote Mark */}
            <div className="absolute top-4 left-4 text-5xl text-[#45C0C9] opacity-10 font-serif select-none">
              “
            </div>
            <p className="text-[#1D3851] font-mono text-base sm:text-lg relative z-10">
              The Pakistan Neurologist Hub is a platform designed to connect neurologists, healthcare professionals, and patients across Pakistan. It aims to foster collaboration, knowledge-sharing, and continuous learning within the field of neurology.
            </p>
          </div>

          <div>
            <button className="bg-[#45C0C9] hover:bg-[#3dadb7] text-white font-semibold py-3 px-8 rounded transition-colors duration-300"
              onClick={() => router.push("/membershipForm/step1")}>
              Click to Open Membership Form
            </button>
          </div>
        </div>

        {/* Right Side: Doctor Image with Enhanced Animation */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative mb-8 lg:mb-0">
          <div 
            className={`
              relative z-10 transform transition-all duration-700 ease-out
              ${imageVisible 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-10 scale-90'
              }`
            }
          >
            <img
              src="/doctor.png"
              alt="Doctor"
              className="max-w-full h-auto"
            />
          </div>
          {/* Circular Background Shape */}
          <div className="absolute -right-20 top-1/2 transform -translate-y-1/2 w-96 h-96 bg-white rounded-full opacity-20 pointer-events-none hidden lg:block"></div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
