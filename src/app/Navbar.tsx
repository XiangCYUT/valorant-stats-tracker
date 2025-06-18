"use client";

import Link from "next/link";
import LangToggle from "./LangToggle";
import ThemeToggle from "./ThemeToggle";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";

export default function Navbar() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  
  return (
    <nav className="w-full py-4 px-6 sticky top-0 z-40 backdrop-blur-md bg-light-200/90 dark:bg-dark-500/90 border-b border-light-500 dark:border-dark-300 shadow-soft">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link 
          href="/" 
          className="text-xl font-bold flex items-center gap-2 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
        >
          <svg 
            viewBox="0 0 120 120" 
            className="w-7 h-7 text-primary-600 dark:text-primary-500"
            fill="currentColor"
          >
            <path d="M103.06,32.13l-36-18a15,15,0,0,0-14.06,0l-36,18A15,15,0,0,0,8,45v28.86a63.05,63.05,0,0,0,32.65,55.13l16,8a7.5,7.5,0,0,0,6.74,0l16-8A63.05,63.05,0,0,0,112,73.91V45A15,15,0,0,0,103.06,32.13Z"/>
          </svg>
          Valorant Web Tool
        </Link>
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-5">
          <Link 
            href="/roadmap" 
            className="text-light-900 dark:text-light-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium"
          >
            Roadmap
          </Link>
          <Link 
            href="/" 
            className="text-light-900 dark:text-light-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium"
          >
            Demo
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LangToggle />
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded hover:bg-light-300/60 dark:hover:bg-dark-400/60 focus:outline-none"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden mt-2 space-y-2 px-4 pb-4">
          <Link
            href="/roadmap"
            onClick={() => setOpen(false)}
            className="block text-light-900 dark:text-light-300 hover:text-primary-500 dark:hover:text-primary-400"
          >
            Roadmap
          </Link>
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="block text-light-900 dark:text-light-300 hover:text-primary-500 dark:hover:text-primary-400"
          >
            Demo
          </Link>
          <div className="flex items-center gap-2 pt-2">
            <ThemeToggle />
            <LangToggle />
          </div>
        </div>
      )}
    </nav>
  );
} 