"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from 'react-i18next';

interface NavbarMobileProps {
  children: React.ReactNode;
}

export default function NavbarMobile({ children }: NavbarMobileProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger Button */}
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

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4">
          <div className="bg-white dark:bg-dark-500 rounded-lg shadow-lg border border-light-500 dark:border-dark-300 p-4 space-y-3">
            <Link
              href="/roadmap"
              onClick={() => setOpen(false)}
              className="block text-light-900 dark:text-light-300 hover:text-primary-500 dark:hover:text-primary-400 py-2"
            >
              Roadmap
            </Link>
            <div className="pt-2 border-t border-light-500 dark:border-dark-300">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 