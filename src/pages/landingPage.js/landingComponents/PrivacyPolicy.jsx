import React from 'react';

const cardsData = [
  {
    title: 'Information We Collect',
    intro: 'We collect personal information in the following ways:',
    bullets: [
      'Personal Identification Information: When you visit our website, contact us, or make use of our services, we may collect personal information such as your name, email address, phone number, and other relevant details.',
      'Medical Information: If you request a consultation or use any of our health services, you may be asked to provide medical history, symptoms, and other health-related information. This data is collected for the purpose of offering medical advice and treatment.',
      'Usage Data: We may collect information about your use of our website, such as your IP address, browser type, device information, and browsing patterns through cookies and other tracking technologies.'
    ]
  },
  {
    title: 'How We Use Your Information',
    intro: 'We may use the information we collect for the following purposes:',
    bullets: [
      'Provide Medical Services: To offer consultation, treatment, and medical advice based on the information you provide.',
      'Communicate with You: To send updates, reminders, appointment confirmations, and other important information related to your consultations or treatments.',
      'Improve Our Website: To enhance the user experience and functionality of our website, including troubleshooting issues and improving services.',
      'Marketing and Promotions: With your consent, we may send promotional materials related to our services or events. You can opt-out of receiving such communications at any time.'
    ]
  }
];

const PrivacyPolicy = () => {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Heading and Arrows */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1D3851] mb-4 md:mb-0">
            Privacy and Policy
          </h2>
          <div className="flex space-x-2">
            {/* Left Arrow */}
            <button 
              type="button" 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#45C0C9] hover:bg-[#3dadb7] text-white"
              aria-label="Previous"
            >
              <svg
                className="w-5 h-5 transform rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {/* Right Arrow */}
            <button 
              type="button" 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#45C0C9] hover:bg-[#3dadb7] text-white"
              aria-label="Next"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Cards Generated from Array */}
        {cardsData.map((card, index) => (
          <div key={index} className="relative bg-[#F4FBFF] rounded-xl p-6 mb-8">
            {/* Quote Icon in Background */}
            <div className="absolute top-4 left-4 text-6xl text-[#110404] opacity-65 font-serif select-none">
              “
            </div>
            <h3 className="text-xl font-bold text-[#45C0C9] mb-4 pl-10 relative">
              {card.title}
            </h3>
            {card.intro && (
              <p className="text-[#1D3851] mb-4">
                {card.intro}
              </p>
            )}
            {card.bullets && card.bullets.length > 0 && (
              <ul className="list-disc list-inside text-[#1D3851] space-y-2">
                {card.bullets.map((bullet, bIndex) => (
                  <li key={bIndex}>
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default PrivacyPolicy;
