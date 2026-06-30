import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Coming_Soon } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"]
});

export const comingSoon = Coming_Soon({
  variable: "--font-coming-soon",
  weight:["400"],
  subsets:["latin"]
})


export const metadata: Metadata = {
  title: "InkFlow",
  description: "Collaborative whiteboard app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${comingSoon.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
