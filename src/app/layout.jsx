// /app/layout.jsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
 // Optional: If you have a Footer

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pakistan Society Of Neurology Membership",
  description: "Join the Pakistan Society of Neurology to advance the field of neurology in Pakistan.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-r from-[#F4FBFF] to-[#E0F7FA]`}
      >
        {/* Optional Navbar */}
        {/* <Navbar /> */}

        <main className="min-h-screen">{children}</main>

        {/* Optional Footer */}
        {/* <Footer /> */}
      </body>
    </html>
  );
}
