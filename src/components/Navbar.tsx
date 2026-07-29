'use client';

import React from 'react';

interface NavbarProps {
  title: string;
}

export default function Navbar({ title }: NavbarProps) {
  return (
    <header className="h-16 border-b border-[var(--glass-border)] bg-white/70 backdrop-blur-md px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-extrabold text-[#1B4332] tracking-wide">{title}</h2>
      </div>

      <div className="flex items-center gap-6">
        {/* External Security SOC Dashboard Link */}
        <a 
          href="/soc" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-xs text-[#228B22] hover:underline font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 transition-all hover:bg-emerald-100/50"
        >
          TrueTrace Dashboard
        </a>

      </div>
    </header>
  );
}
