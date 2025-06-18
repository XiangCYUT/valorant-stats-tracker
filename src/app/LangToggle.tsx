"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/context/LanguageContext";

export default function LangToggle() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const options: { code: Lang; label: string; flag: string }[] = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "zh-tw", label: "繁體中文", flag: "🇹🇼" },
  ];

  const handleClickOutside = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = options.find((o) => o.code === lang) ?? options[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-light-300 hover:bg-light-400 dark:bg-dark-400 dark:hover:bg-dark-300 p-2 rounded-lg text-light-900 dark:text-light-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="text-base">{current.flag}</span>
        <span className="text-sm font-medium hidden sm:inline-block">{current.label}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor" 
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-md shadow-soft bg-light-100 dark:bg-dark-500 ring-1 ring-light-500 dark:ring-dark-300 ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {options.map((option) => (
              <button
                key={option.code}
                onClick={() => {
                  setLang(option.code);
                  setOpen(false);
                }}
                className={`${
                  lang === option.code 
                    ? 'bg-light-200 dark:bg-dark-400 text-light-900 dark:text-light-100' 
                    : 'text-light-800 dark:text-light-200 hover:bg-light-200 dark:hover:bg-dark-400'
                } w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors`}
                role="menuitem"
              >
                <span>{option.flag}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 