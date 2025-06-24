import Link from "next/link";
import LangToggle from "./LangToggle";
import ThemeToggle from "./ThemeToggle";
import NavbarMobile from "@/components/navbar/NavbarMobile";

export default function Navbar() {
  return (
    <nav className="w-full py-4 px-6 sticky top-0 z-40 backdrop-blur-md bg-light-200/90 dark:bg-dark-500/90 border-b border-light-500 dark:border-dark-300 shadow-soft">
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        {/* Logo - Server Component */}
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

        {/* Desktop Links - Server Component */}
        <div className="hidden md:flex items-center gap-5">
          <Link 
            href="/roadmap" 
            className="text-light-900 dark:text-light-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium"
          >
            Roadmap
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LangToggle />
          </div>
        </div>

        {/* Mobile Menu - Client Component */}
        <NavbarMobile>
          <div className="flex items-center gap-2 justify-center">
            <ThemeToggle />
            <LangToggle />
          </div>
        </NavbarMobile>
      </div>
    </nav>
  );
} 