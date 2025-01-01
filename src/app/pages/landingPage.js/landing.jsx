import React from 'react';
import HeroSection from './landingComponents/HeroSection';
import PresidentsMessage from './landingComponents/PresidentsMessage';
import EligibilityCriteria from './landingComponents/EligibilityCriteria';
import PrivacyPolicy from './landingComponents/PrivacyPolicy';
import MembershipInfo from './landingComponents/MembershipInfo';
import LogoutButton from '@/app/logout/LogoutButton';

const LandingPage = () => {
  return (
    <>
      <div className="font-sans text-gray-700">
        <HeroSection />
        <PresidentsMessage />
        <EligibilityCriteria />
        <MembershipInfo />
        <PrivacyPolicy />
      </div>

      {/* Centering the LogoutButton */}
      <div className="flex items-center justify-center">
        <LogoutButton />
      </div>
    </>
  );
};

export default LandingPage;
