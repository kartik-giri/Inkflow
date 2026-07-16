"use client"
import React, { useState, useEffect } from "react";
import { PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Logo } from "../ui/logo";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10); //setting scrolled true if user has scrolled more than 10 px
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0px_2px_0px_0px_#1e1e1e]"
          : "bg-white/80 backdrop-blur-md border-b-2 border-[#1e1e1e]"
      }`)}
    >
      <div className={cn("max-w-7xl mx-auto px-4 h-16 flex items-center justify-between")}>

       <div>
         <Logo/>
       </div>

        {/* Nav links */}
        <div className={cn("hidden sm:flex items-center gap-8")}>
          {[
            { label: "Demo Video", href: "#Demo Video" },
            { label: "Features", href: "#Features" },
            { label: "Connect", href: "#Connect" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={cn("font-medium text-[#1e1e1e] hover:text-[#E35336] transition-colors relative group")}
            >
              {label}
              <span className={cn("absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#E35336] group-hover:w-full transition-all duration-200 rounded-full")} />
            </Link>
          ))}
        </div>

        {/* CTA Buttons*/}
        <div className={cn("hidden sm:flex items-center gap-3")}>
            {/* Login link */}
          <Link
            href="/signin"
            className={cn("px-5 py-2 font-bold text-[#1e1e1e] hover:text-[#E35336] transition-colors")}
          >
            Log in
          </Link>
          {/* sign up button */}
          <Link href="/signup">
          <Button>Sign Up Free</Button>
          </Link>
        </div>

        {/* ── Mobile Hamburger ── */}
        <button
          onClick={() =>setMobileOpen(!mobileOpen)}
          className={cn("sm:hidden flex flex-col gap-1.5 p-2 rounded-lg border-2 border-[#1e1e1e] bg-white cursor-pointer touch-manipulation")}
          aria-label="Toggle menu"
        >
          <span
            className={cn(`block w-5 h-0.5 bg-[#1e1e1e] transition-all duration-200 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`)}
          />
          <span
            className={cn(`block w-5 h-0.5 bg-[#1e1e1e] transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`)}
          />
          <span
            className={cn(`block w-5 h-0.5 bg-[#1e1e1e] transition-all duration-200 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`)}
          />
        </button>
      </div>

      {/* ── Mobile Dropdown Menu ── */}
      {mobileOpen && (
        <div className={cn("sm:hidden border-t-2 border-[#1e1e1e] bg-white px-4 pb-6 flex flex-col gap-1")}>
          {[
            { label: "Demo Video", href: "#Demo Video" },
            { label: "Features", href: "#Features" },
            { label: "Connect", href: "#Connect" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn("py-3 font-medium text-[#1e1e1e] hover:text-[#E35336] border-b border-gray-100 transition-colors")}
            >
              {label}
            </Link>
          ))}
          <div className={cn("flex flex-col gap-3 mt-4")}>
            <Link href="/signin">
            <Button className="bg-white text-black">Log in</Button>
            </Link>
            <Link href="signup">
            <Button>Sign Up Free</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}



