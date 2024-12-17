import React from 'react';

const PresidentsMessage = () => {
  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
          President’s Message
        </h2>
        <p className="text-gray-600 mb-6">
          Dear Stakeholders, Administrators &nbsp;
          <br />
          The Pakistan Neurology Network (PNN) does not endorse, guarantee or lobby for whatsoever company. It aims to connect neurologists, professionals & students under one platform for collaborative growth and knowledge sharing. We believe in the empowerment of neurology professionals who will shape the future of healthcare in Pakistan.
        </p>
        <button className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded">
          Read More Statements
        </button>
      </div>
    </section>
  );
};

export default PresidentsMessage;
