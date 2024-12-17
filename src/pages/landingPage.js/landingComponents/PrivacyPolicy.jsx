import React, { useState } from 'react';

const faqItems = [
  {
    title: 'Information Collection',
    content: 'We collect information you provide directly to us. For example, we collect information when you participate in any interactive features of our services.'
  },
  {
    title: 'How We Use Information',
    content: 'We use the information we collect to maintain and improve our services, provide customer service, and send you technical notices, updates, and other support.'
  }
];

const PrivacyPolicy = () => {
  const [openItem, setOpenItem] = useState(null);

  const toggleAccordion = (index) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Privacy and Policy</h2>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded">
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between items-center p-4 text-left"
              >
                <span className="font-semibold">{item.title}</span>
                <svg
                  className={`h-5 w-5 transform transition-transform ${openItem === index ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openItem === index && (
                <div className="p-4 border-t border-gray-200 text-gray-600">
                  {item.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
