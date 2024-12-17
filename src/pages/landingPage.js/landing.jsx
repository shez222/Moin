import React from 'react';
import HeroSection from './landingComponents/HeroSection';
import PresidentsMessage from './landingComponents/PresidentsMessage';
import EligibilityCriteria from './landingComponents/EligibilityCriteria';
import PrivacyPolicy from './landingComponents/PrivacyPolicy';
import ContactUs from './landingComponents/ContactUs';

const LandingPage = () => {
  return (
    <div className="font-sans text-gray-700">
      <HeroSection />
      <PresidentsMessage />
      <EligibilityCriteria />
      <PrivacyPolicy />
      <ContactUs />
    </div>
  );
};

export default LandingPage;
