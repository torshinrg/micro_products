// File: src/app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bodyweight Mastery - Ultimate Flexible Training",
  description:
    "Discover a versatile bodyweight training app that adapts to your fitness level. Mix strength, flexibility, and endurance workouts to create your perfect exercise plan.",
  verification: {
    google: "6vkSXUsyE4N-ALNspKuqABtItBlzPtjsGmdwL18q6n4",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
