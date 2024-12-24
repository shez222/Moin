// /app/page.js

"use client";
import React, { useEffect, useContext } from "react";
import LoginPage from "./pages/login"; // Adjust the path if necessary
import { useRouter } from "next/navigation";
import { AuthContext } from "@/../context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { auth, loading } = useContext(AuthContext);

  useEffect(() => {
    if (!loading) {
      if (auth.token) {
        // Redirect based on role
        switch (auth.role) {
          case "admin":
            router.push("/admin/dashboard");
            break;
          case "doctor":
            router.push("/doctor/dashboard");
            break;
          case "user":
          default:
            router.push("/landingPage");
            break;
        }
      }
      // If not authenticated, do nothing and render <LoginPage />
    }
  }, [auth, loading, router]);

  if (loading) {
    // Optional: Render a loading spinner or placeholder
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    );
  }

  return <LoginPage />;
}










// "use client";
// import LoginPage from "@/pages/login";
// // import LandingPage from "@/pages/landingPage.js/landing";
// // import MembershipFormStep1 from "@/pages/MembershipFormStep1";
// // import MembershipFormStep2 from "@/pages/MembershipFormStep2";
// // import MembershipFormStep3 from "@/pages/MembershipFormStep3";
// // import ThankYouPage from "@/pages/Thanks";
// import React from "react";
// // import LoginPage from "@/pages/login.jsx";
// // import LandingPage from "@/pages/landingPage.js/landing";
// export default function Home() {
//   return <div>
//     <LoginPage />
    
//     {/* <LandingPage />
//     <MembershipFormStep1 />
//     <MembershipFormStep2 />
//     <MembershipFormStep3 />
//     <ThankYouPage /> */}
//   </div>;
// }