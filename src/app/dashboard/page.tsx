'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { getAccountDetails } from '@/api/accounts';
import { getTransactionHistory } from '@/api/transactions';
import Link from 'next/link';

import { tokenStorage } from '@/api/tokenStorage';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = tokenStorage.getItem('token');
      const userData = tokenStorage.getItem('user');
      if (!token || !userData) {
        router.replace('/login');
      } else {
        setUser(JSON.parse(userData));
      }
    }
  }, [router]);

  // Fetch account details dynamically using SWR
  const { data: account } = useSWR(
    user ? `account-${user.accountNumber}` : null,
    () => getAccountDetails(user.accountNumber)
  );

  // Fetch transaction history
  const { data: txHistory } = useSWR(
    user ? `transactions-${user.accountNumber}` : null,
    () => getTransactionHistory(user.accountNumber)
  );

  if (!user) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Spending SVG chart points
  const points = "20,90 80,60 140,80 200,40 260,70 320,30 380,50";
  const gradientPoints = "20,90 80,60 140,80 200,40 260,70 320,30 380,50 380,120 20,120";

  return (
    <div className="flex min-h-screen bg-[#FAFAF5] text-black font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Navbar title="Dashboard Overview" />

        <main className="flex-1 p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-6">
            <div>
              <h3 className="text-3xl font-extrabold text-[#1B4332] tracking-tight font-heading">
                Welcome back, <span>{user.fullName}</span>
              </h3>
              <p className="text-[#52796F] text-xs mt-1">Manage your multi-currency accounts and transfer assets online.</p>
            </div>
          </div>

          {/* Cards & Analytics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Account Card */}
            <div className="lg:col-span-8 space-y-6">
              <h4 className="text-xs font-bold text-[#52796F] uppercase tracking-wider">My Accounts</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Card 1: Primary Account */}
                <div className="bank-card rounded-3xl p-6 flex flex-col justify-between min-h-[200px] border border-transparent hover:shadow-emerald-500/10 hover-scale">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[9px] text-[#FAFAF5]/70 font-mono tracking-widest uppercase font-bold">Primary Card</p>
                      <h4 className="text-sm font-bold text-white tracking-wide mt-0.5">{user.fullName}</h4>
                    </div>
                    <div className="text-sm font-extrabold text-white/50 italic font-mono tracking-wider">VISA</div>
                  </div>

                  <div className="my-4">
                    <span className="text-[9px] text-[#FAFAF5]/60 font-mono tracking-wider">CURRENT BALANCE</span>
                    <h3 className="text-3xl font-extrabold text-white tracking-tight mt-0.5">
                      {account ? formatCurrency(account.balance) : 'Querying balance...'}
                    </h3>
                  </div>

                  <div className="flex justify-between items-end border-t border-white/5 pt-3">
                    <div>
                      <span className="text-[8px] text-[#FAFAF5]/60 font-mono">ACCOUNT CODE</span>
                      <p className="text-xs text-white font-mono tracking-wider mt-0.5">{user.accountNumber}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] text-[#FAFAF5]/60 font-mono">CURRENCY</span>
                      <p className="text-xs text-white font-semibold mt-0.5">VND</p>
                    </div>
                  </div>
                </div>

                {/* Card 2: Savings Account */}
                <div className="rounded-3xl p-6 flex flex-col justify-between min-h-[200px] bg-white border border-[#E5E7EB] hover-scale shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[9px] text-[#52796F] font-mono tracking-widest uppercase font-bold">Savings Accumulation</p>
                      <h4 className="text-sm font-bold text-[#1B4332] tracking-wide mt-0.5">{user.fullName}</h4>
                    </div>
                    <div className="text-xs font-bold text-[#52796F] font-mono">SAVINGS</div>
                  </div>

                  <div className="my-4">
                    <span className="text-[9px] text-[#52796F] font-mono tracking-wider">ACCUMULATED CAPITAL</span>
                    <h3 className="text-3xl font-extrabold text-[#1B4332] tracking-tight mt-0.5">
                      {account ? formatCurrency(account.balance * 1.5) : '---'}
                    </h3>
                  </div>

                  <div className="flex justify-between items-end border-t border-[#E5E7EB] pt-3">
                    <div>
                      <span className="text-[8px] text-[#52796F] font-mono">ACCOUNT CODE</span>
                      <p className="text-xs text-[#0F2818] font-mono tracking-wider mt-0.5">{user.accountNumber.replace('ACC', 'SAV')}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] text-[#52796F] font-mono">INTEREST RATE</span>
                      <p className="text-xs text-[#228B22] font-semibold mt-0.5">6.8% p.a.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="lg:col-span-4 space-y-6">
              <h4 className="text-xs font-bold text-[#52796F] uppercase tracking-wider">Fast Services</h4>
              
              <div className="glass-panel rounded-3xl p-6 flex flex-col justify-center h-[200px] hover:shadow-emerald-500/5 bg-white border border-[#E5E7EB] shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    href="/transfer"
                    className="p-4 rounded-2xl bg-emerald-50/20 hover:bg-emerald-50/50 border border-emerald-100 text-center transition-all group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#228B22] flex items-center justify-center text-white mx-auto mb-2 shadow-sm group-hover:scale-110 transition-transform font-bold">
                      ➔
                    </div>
                    <span className="text-xs font-bold text-[#1B4332] tracking-wide">Transfer</span>
                  </Link>

                  <Link 
                    href="/transactions"
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-[#E5E7EB] text-center transition-all group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#52796F] flex items-center justify-center text-white mx-auto mb-2 group-hover:scale-110 transition-transform font-bold">
                      ☰
                    </div>
                    <span className="text-xs font-bold text-[#1B4332] tracking-wide">History</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* SVG Analytics Chart and Transaction Feed Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* SVG Spending Curve Chart */}
            <div className="lg:col-span-7 space-y-4">
              <h4 className="text-xs font-bold text-[#52796F] uppercase tracking-wider">Financial Spending Trend</h4>
              
              <div className="glass-panel rounded-3xl p-6 border border-[#E5E7EB] bg-white shadow-sm relative">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="text-2xl font-extrabold text-[#1B4332]">4,850,000đ</span>
                    <span className="text-[10px] text-[#228B22] font-mono ml-2 font-bold">+12% vs last month</span>
                  </div>
                  <div className="flex gap-1.5 bg-[#FAFAF5] p-1 border border-[#E5E7EB] rounded-lg text-[9px] font-bold text-[#52796F]">
                    <span className="px-2 py-0.5 bg-white text-[#1B4332] border border-[#E5E7EB] rounded">Weekly</span>
                    <span className="px-2 py-0.5 rounded hover:text-[#1B4332] cursor-pointer">Monthly</span>
                  </div>
                </div>

                {/* SVG Curve Design */}
                <div className="w-full h-32">
                  <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#228B22" stopOpacity="0.12"/>
                        <stop offset="100%" stopColor="#228B22" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    
                    {/* Grid lines */}
                    <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(27,67,50,0.04)" strokeWidth="0.5"/>
                    <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(27,67,50,0.04)" strokeWidth="0.5"/>
                    <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(27,67,50,0.04)" strokeWidth="0.5"/>

                    {/* Gradient Area Fill */}
                    <polygon points={gradientPoints} fill="url(#chartGradient)"/>

                    {/* Curve Line */}
                    <polyline
                      fill="none"
                      stroke="#228B22"
                      strokeWidth="2"
                      points={points}
                      strokeLinecap="round"
                    />

                    {/* Glowing dots */}
                    <circle cx="20" cy="90" r="3" fill="#1B4332"/>
                    <circle cx="200" cy="40" r="3" fill="#1B4332"/>
                    <circle cx="380" cy="50" r="3" fill="#1B4332"/>
                  </svg>
                </div>

                <div className="flex justify-between items-center text-[9px] font-mono text-[#52796F] mt-2">
                  <span>MON</span>
                  <span>TUE</span>
                  <span>WED</span>
                  <span>THU</span>
                  <span>FRI</span>
                  <span>SAT</span>
                  <span>SUN</span>
                </div>
              </div>
            </div>

            {/* Transaction Feed */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-[#52796F] uppercase tracking-wider">Recent Activity</h4>
                <Link href="/transactions" className="text-xs text-[#228B22] hover:underline font-semibold">
                  View History
                </Link>
              </div>

              <div className="glass-panel rounded-3xl p-5 border border-[#E5E7EB] bg-white shadow-sm min-h-[190px]">
                {txHistory && txHistory.length > 0 ? (
                  <div className="divide-y divide-[#E5E7EB]/60">
                    {txHistory.slice(0, 3).map((tx) => {
                      const isSender = tx.sourceAccountNumber === user.accountNumber;
                      return (
                        <div key={tx.id} className="py-3.5 flex justify-between items-center hover:bg-[#FAFAF5] px-2 rounded-xl transition-all">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-[9px] ${
                              isSender 
                                ? 'bg-rose-500/10 text-rose-600 border border-rose-500/25' 
                                : 'bg-emerald-50/80 text-emerald-700 border border-emerald-500/25'
                            }`}>
                              {isSender ? 'OUT' : 'IN'}
                            </div>
                            <div className="overflow-hidden">
                              <div className="text-xs font-semibold text-[#1B4332] truncate max-w-[170px]">{tx.description}</div>
                              <span className="text-[9px] text-[#52796F] font-mono mt-0.5 block font-semibold">
                                {isSender ? `To: ${tx.targetAccountNumber}` : `From: ${tx.sourceAccountNumber}`}
                              </span>
                            </div>
                          </div>
                          
                          <div className={`text-xs font-bold font-mono ${isSender ? 'text-rose-600' : 'text-emerald-700'}`}>
                            {isSender ? '-' : '+'}{formatCurrency(tx.amount)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[140px] text-[#52796F] text-center">
                    <p className="text-[10px] font-mono">No recent transaction logs detected.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
