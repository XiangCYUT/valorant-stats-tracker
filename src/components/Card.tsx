//"use client";
import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "", ...rest }: CardProps) {
  return (
    <section
      {...rest}
      className={`w-full max-w-2xl mx-auto mb-8 p-6 bg-white dark:bg-dark-500 rounded-lg border border-light-500 dark:border-dark-300 shadow-sm ${className}`.trim()}
    >
      {children}
    </section>
  );
}
