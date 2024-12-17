import React from 'react';

const ContactUs = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Contact Us</h2>
        <p className="text-gray-600 mb-6">
          Get In Touch &amp; Connect Us Anytime We Are With Back
        </p>
        <form className="max-w-xl space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded py-2 px-3 text-gray-700 outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded py-2 px-3 text-gray-700 outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Your Email"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Message</label>
            <textarea
              className="w-full border border-gray-300 rounded py-2 px-3 text-gray-700 outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Your Message"
              rows={4}
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactUs;
