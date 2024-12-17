import React from 'react';

const HeroSection = () => {
  return (
    <header className="bg-white w-full">
      <div className="container mx-auto flex flex-col lg:flex-row items-center px-4 py-12 lg:py-20">
        <div className="w-full lg:w-1/2 pr-0 lg:pr-10">
          <h1 className="text-3xl lg:text-5xl font-bold text-gray-800 mb-4">
            Pakistan Neurology Network!
          </h1>
          <p className="text-gray-600 mb-6">
            Connect with the best neurological professionals and resources across Pakistan.
          </p>
          <button className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded">
            Learn More
          </button>
        </div>
        <div className="w-full lg:w-1/2 mt-8 lg:mt-0 flex justify-center">
          <img
            src="https://via.placeholder.com/300x400?text=Doctor+Image"
            alt="Doctor"
            className="max-w-full h-auto rounded shadow"
          />
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
