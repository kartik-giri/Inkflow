"use client"
import React, { useState, useEffect } from "react";
import { PenLine } from "lucide-react";

import { Logo } from "../logo";
import { Button } from "../button";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0px_2px_0px_0px_#1e1e1e]"
          : "bg-white/80 backdrop-blur-md border-b-2 border-[#1e1e1e]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

       <div>
         <Logo/>
       </div>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-8">
          {[
            { label: "Features", href: "#features" },
            { label: "Plus", href: "#plus" },
            // { label: "Community", href: "#community" },
            { label: "Blog", href: "#blog" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="font-medium text-[#1e1e1e] hover:text-[#E35336] transition-colors relative group"
            >
              {label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#E35336] group-hover:w-full transition-all duration-200 rounded-full" />
            </a>
          ))}
        </div>

        {/* CTA Buttons*/}
        <div className="hidden sm:flex items-center gap-3">
            {/* Login link */}
          <a
            href="/signin"
            className="px-5 py-2 font-bold text-[#1e1e1e] hover:text-[#E35336] transition-colors"
          >
            Log in
          </a>
          {/* sign up button */}
          <Button onclick={()=>router.push("/signup")}>Sign Up Free</Button>
        </div>

        {/* ── Mobile Hamburger ── */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden flex flex-col gap-1.5 p-2 rounded-lg border-2 border-[#1e1e1e] bg-white"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-[#1e1e1e] transition-all duration-200 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-[#1e1e1e] transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-[#1e1e1e] transition-all duration-200 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* ── Mobile Dropdown Menu ── */}
      {mobileOpen && (
        <div className="sm:hidden border-t-2 border-[#1e1e1e] bg-white px-4 pb-6 flex flex-col gap-1">
          {[
            { label: "Features", href: "#features" },
            { label: "Plus", href: "#plus" },
            { label: "Community", href: "#community" },
            { label: "Blog", href: "#blog" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="py-3 font-medium text-[#1e1e1e] hover:text-[#6965db] border-b border-gray-100 transition-colors"
            >
              {label}
            </a>
          ))}
          <div className="flex flex-col gap-3 mt-4">
            <a
              href="/account/signin"
              className="w-full py-3 text-center font-bold border-2 border-[#1e1e1e] rounded-xl hover:bg-gray-50 transition-colors"
            >
              Log in
            </a>
            <a
              href="/account/signup"
              className="w-full py-3 text-center  text-white font-bold rounded-xl border-2 bg-[#E35336] border-[#1e1e1e] shadow-[3px_3px_0px_0px_#1e1e1e]"
            >
              Sign Up Free
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}



