import React from 'react';
import {
  FiUserCheck,
  FiCamera,
  FiCreditCard,
  FiFile,
  FiBookOpen,
  FiDollarSign,
  FiUpload,
  FiClipboard,
  FiShare2
} from 'react-icons/fi';

const criteriaData = [
  { title: 'Fill Out the Form', desc: 'Basic application process', icon: FiClipboard },
  { title: 'Upload Photo', desc: 'Passport size photograph', icon: FiCamera },
  { title: 'Verify ID#', desc: 'National ID verification', icon: FiUserCheck },
  { title: 'Submit Form', desc: 'Submit your application', icon: FiFile },
  { title: 'Credentials Review', desc: 'We will review qualifications', icon: FiBookOpen },
  { title: 'Deposit Fee', desc: 'Complete the payment process', icon: FiDollarSign },
  { title: 'Upload Payment Proof', desc: 'Receipt or transaction screenshot', icon: FiUpload },
  { title: 'Obtain Card', desc: 'Membership card issued', icon: FiCreditCard },
  { title: 'Facilitation by PNN Partners', desc: 'Get access to partner benefits', icon: FiShare2 }
];

const EligibilityCriteria = () => {
  return (
    <section className="py-12 bg-[#F4FBFF]">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-[#1D3851] mb-4">Eligibility Criteria</h2>
        <p className="text-[#1D3851] text-base max-w-md mx-auto mb-12">
          Follow these carefully explained steps to complete your membership process and benefit from our network.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {criteriaData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={index} 
                className="group bg-white rounded-lg shadow-md p-4 transition-colors duration-300 hover:bg-[#45C0C9] 
                          flex flex-col items-center justify-center h-48"
              >
                <div 
                  className="w-14 h-14 mb-4 flex items-center justify-center rounded-full 
                             bg-[#E6F2F9] text-[#1D3851] transition-colors duration-300 group-hover:bg-white group-hover:text-[#45C0C9]"
                >
                  <IconComponent size={24} />
                </div>
                <h3 
                  className="font-bold text-lg mb-2 text-[#1D3851] group-hover:text-white transition-colors duration-300"
                >
                  {item.title}
                </h3>
                <p className="text-gray-600 group-hover:text-white transition-colors duration-300">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-12">
          <button
            type="button"
            className="bg-[#45C0C9] hover:bg-[#3dadb7] text-white font-semibold py-3 px-8 rounded"
          >
            Helix
          </button>
        </div>
      </div>
    </section>
  );
};

export default EligibilityCriteria;
