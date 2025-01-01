import React from 'react';

const ContactUs = () => {
  return (
    <section className="bg-[#F4FBFF] py-12">
      <div className="container mx-auto px-4">
        {/* Heading and subtext responsive alignment */}
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1D3851] mb-4">
            Contact Us
          </h2>
          <p className="text-[#1D3851] text-base">
            {/* Feel Free To Contact Us At Anytime, We Will Get Back As Soon As Possible */}
          </p>
        </div>

        {/* Responsive grid: 1 column on small, 2 columns on md+ (each half width) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Side (Form Section) */}
          <div>
            <form className="space-y-6 w-full max-w-xl">
              {/* Name Field */}
              <div>
                <label className="block text-[#1D3851] font-semibold mb-2">Name</label>
                <input
                  type="text"
                  className="w-full bg-[#E6F2F9] border border-transparent rounded py-3 px-4 text-[#1D3851] outline-none focus:ring-2 focus:ring-teal-500 placeholder-[#1D3851]"
                  placeholder="Enter Name"
                />
              </div>
              {/* Email Field */}
              <div>
                <label className="block text-[#1D3851] font-semibold mb-2">Email</label>
                <input
                  type="email"
                  className="w-full bg-[#E6F2F9] border border-transparent rounded py-3 px-4 text-[#1D3851] outline-none focus:ring-2 focus:ring-teal-500 placeholder-[#1D3851]"
                  placeholder="Enter Email"
                />
              </div>
              {/* Message Field */}
              <div>
                <label className="block text-[#1D3851] font-semibold mb-2">Message</label>
                <textarea
                  className="w-full bg-[#E6F2F9] border border-transparent rounded py-3 px-4 text-[#1D3851] outline-none focus:ring-2 focus:ring-teal-500 placeholder-[#1D3851]"
                  placeholder="Enter Your Message"
                  rows={4}
                ></textarea>
              </div>
            </form>
          </div>

          {/* Right Side (Image Section) */}
          <div className="flex justify-center items-center">
            <img
              src="/PSNHub11.png"
              alt="Pakistan Society of Neurology"
              className="rounded-md shadow-md w-full max-w-2xl"
            />
          </div>
        </div>

        {/* Button at the bottom center for all screens */}
        <div className="flex justify-center mt-8">
          <button
            type="button"
            className="bg-[#45C0C9] hover:bg-[#3dadb7] text-white font-semibold py-5 px-40 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
