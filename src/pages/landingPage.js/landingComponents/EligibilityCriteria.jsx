import React from 'react';

const criteriaData = [
  { title: 'Fill Out the Form', desc: 'Basic application process' },
  { title: 'Upload Photo', desc: 'Passport size photograph' },
  { title: 'Verify ID#', desc: 'National ID verification' },
  { title: 'Submit Form', desc: 'Submit your application' },
  { title: 'Credentials Review', desc: 'We will review qualifications' },
  { title: 'Deposit Fee', desc: 'Complete the payment process' },
  { title: 'Upload Payment Proof', desc: 'Receipt or transaction screenshot' },
  { title: 'Obtain Card', desc: 'Membership card issued' },
  { title: 'Facilitation by PNN Partners', desc: 'Get access to partner benefits' }
];

const EligibilityCriteria = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Eligibility Criteria</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {criteriaData.map((item, index) => (
            <div key={index} className="bg-white rounded shadow p-6">
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EligibilityCriteria;
