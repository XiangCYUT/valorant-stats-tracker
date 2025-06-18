"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";

export default function RiotLoginButton() {
  const { t } = useLanguage();
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative inline-block"
    >
      <button
        disabled
        className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-200 transform active:scale-95 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M3.75 5.25A2.25 2.25 0 0 1 6 3h6.75a.75.75 0 0 1 0 1.5H6a.75.75 0 0 0-.75.75v10.5c0 .414.336.75.75.75h6.75a.75.75 0 0 1 0 1.5H6A2.25 2.25 0 0 1 3.75 16.5V5.25zm12.53 2.22a.75.75 0 0 1 1.06 0l3.72 3.72a.75.75 0 0 1 0 1.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06L18.44 13H9.75a.75.75 0 0 1 0-1.5h8.69l-2.16-2.16a.75.75 0 0 1 0-1.06z"
            clipRule="evenodd"
          />
        </svg>
        {t("login")}
      </button>
      {hover && (
        <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-dark-500 dark:bg-dark-400 text-xs text-white px-3 py-1.5 rounded-md whitespace-nowrap z-10 shadow-lg">
          {t("loginTip")}
        </span>
      )}
    </div>
  );
} 