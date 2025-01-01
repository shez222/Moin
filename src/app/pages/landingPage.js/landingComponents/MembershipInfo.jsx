import React from 'react';

const membershipData = [
    {
        title: 'Membership Eligibility Criteria',
        intro: 'Applicants must hold any postgraduate degree or diploma in Neurology following their graduation.',
    },
    {
        title: 'Membership Registration Process',
        bullets: [
            'Fill out the PSN Membership Registration Form: Complete the attached registration form with accurate details.',
            'Upload Your Passport-Sized Photograph: Ensure the photo meets standard requirements and upload it to the portal.',
            'Verify Your Information: Carefully review all the details entered before proceeding.',
            'Submit the Form: Submit your completed registration form via the portal.',
            'Membership Verification Email: After your application has been reviewed and verified by the Pakistan Society of Neurology, you will receive a confirmation email. This email will include your Login ID and Password, which you can use to access your membership account.',
            'Deposit the Membership Fee: Deposit Membership fee of Rs. 5,000/- to the following bank account:',
            '• Account Title: Pakistan Society of Neurology',
            '• Bank Name: Al Baraka Bank (Pakistan) Limited',
            '• Account Number: 0102216000016',
            '• Branch Code: 0112',
            '• IBAN: PK75AIIN0000102216000016',
            'Upload Payment Confirmation: Log in to your account and upload the bank-verified deposit slip or transfer confirmation as proof of payment.',
            'Generate Membership Card: Once your payment has been verified, you will receive an email to generate your card.',
        ],
    },
    {
        title: 'Facilitation by Helix Pharma',
        intro: 'Alternatively, a representative from Helix Pharma will reach out to assist you with the registration process. This support will include providing access to the portal, assisting with entering the required details (if needed), and facilitating the verification and issuance of your membership card.',
    },
    {
        title: 'Deadline for Registration',
        intro: 'Please finalize your registration by January 31, 2025, to secure your inclusion in the PSN Digital Directory and to participate in society activities.',
    },
    {
        title: 'Important Notice',
        bullets: [
            'The Pakistan Society of Neurology reserves the right to accept or reject any application if eligibility criteria are not met or valid objections arise.',
            'Incomplete applications or those missing required documents will not be processed.',
        ],
    },
    {
        title: 'Contact Us',
        intro: 'For further assistance or inquiries, please contact us at info@pakneurologisthub.com. We look forward to welcoming you to the Pakistan Society of Neurology!',
    },
];

const MembershipInfo = () => {
    return (
        <section className="bg-white py-12">
            <div className="container mx-auto px-4">
                {/* Heading */}
                <h2 className="text-4xl sm:text-5xl font-bold text-[#1D3851] mb-8">
                    Membership Information
                </h2>

                {/* Cards Generated from Array */}
                {membershipData.map((card, index) => (
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
                                    <li key={bIndex}>{bullet}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default MembershipInfo;
