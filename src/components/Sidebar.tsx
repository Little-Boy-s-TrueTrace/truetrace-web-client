'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { tokenStorage } from '@/api/tokenStorage';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = tokenStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  const handleLogout = () => {
    tokenStorage.removeItem('token');
    tokenStorage.removeItem('user');
    router.replace('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Internal Transfer', path: '/transfer', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
    { name: 'Transaction History', path: '/transactions', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { name: 'KYC Verification', path: '/kyc', icon: 'M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z' }
  ];

  return (
    <aside className="w-64 glass-panel border-r border-[var(--glass-border)] flex flex-col min-h-screen text-[#52796F] bg-white">
      {/* Brand logo */}
      <div className="p-6 border-b border-[var(--glass-border)] flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#1B4332] to-[#84A98C] flex items-center justify-center font-bold text-white text-lg shadow-md shadow-[#1B4332]/10">
          T
        </div>
        <div>
          <h1 className="font-extrabold text-[#1B4332] tracking-wide text-base">TrueTrace Bank</h1>
          <span className="text-[9px] text-[#52796F] font-mono tracking-wider block font-semibold">SECURE BANKING</span>
        </div>
      </div>

      {/* Nav list */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-[#FAFAF5] border border-[#E5E7EB] text-[#1B4332] font-semibold shadow-sm' 
                  : 'hover:bg-[#FAFAF5]/80 hover:text-[#1B4332] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-[#228B22]' : 'text-[#52796F]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile Details */}
      <div className="p-4 border-t border-[var(--glass-border)] bg-[#FAFAF5]">
        {user ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] text-[#1B4332] flex items-center justify-center font-bold text-sm">
                  {user.fullName.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-sm font-bold text-[#1B4332] truncate max-w-[110px]">{user.fullName}</h4>
                  <p className="text-[10px] text-[#228B22] font-mono tracking-wider font-semibold">{user.role}</p>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-rose-50 border border-transparent hover:border-rose-100 hover:text-rose-600 rounded-lg transition-all"
                title="Logout"
              >
                <svg className="w-5 h-5 text-slate-450" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>

            {/* TrueTrace Dashboard Quick Link */}
            <a 
              href="/monitor" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full text-center py-2 bg-emerald-50 hover:bg-emerald-100/50 border border-emerald-100 text-[10px] text-[#228B22] font-bold rounded-lg block transition-all uppercase tracking-wider"
            >
              TrueTrace Dashboard
            </a>
          </div>
        ) : (
          <div className="h-10 animate-pulse bg-slate-100 rounded-lg"></div>
        )}
      </div>
    </aside>
  );
}
