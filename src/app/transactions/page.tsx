'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { getTransactionHistory, TransactionItem } from '@/api/transactions';

import { tokenStorage } from '@/api/tokenStorage';

export default function TransactionsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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

  // Fetch transaction history using SWR
  const { data: transactions } = useSWR(
    user ? `transactions-${user.accountNumber}-${query}` : null,
    async () => {
      setErrorMsg('');
      try {
        return await getTransactionHistory(user.accountNumber, query);
      } catch (err: any) {
        if (err.response && err.response.data) {
          setErrorMsg(err.response.data.error || 'Failed to query database.');
        } else {
          setErrorMsg('Gateway error.');
        }
        return [] as TransactionItem[];
      }
    }
  );

  if (!user) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(search);
  };

  const handleClear = () => {
    setSearch('');
    setQuery('');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAF5] text-black font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Navbar title="Transaction Ledger" />

        <main className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Ledger Console Header */}
          <div className="glass-panel rounded-3xl p-6 border border-[#E5E7EB] bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-[9px] text-[#228B22] font-mono font-bold tracking-widest uppercase bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded">
                Ledger Monitor
              </span>
              <h3 className="text-xl font-extrabold text-[#1B4332] tracking-wide mt-3 font-heading">Filter Ledger Items</h3>
              <p className="text-xs text-[#52796F] mt-1 font-medium">Filter account transactions by keywords inside descriptions.</p>
            </div>

            <form onSubmit={handleSearch} className="flex flex-1 md:max-w-md gap-2 w-full">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-[#FAFAF5] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-black placeholder-slate-400 focus:outline-none focus:border-[#1B4332] font-mono"
                placeholder="Filter description (e.g. dinner, electricity)..."
              />
              <button 
                type="submit" 
                className="px-5 py-2.5 bg-[#228B22] hover:bg-[#1B7E1B] text-xs font-bold text-white rounded-xl shadow-sm transition-all active:scale-95"
              >
                Filter
              </button>
              {query && (
                <button 
                  type="button" 
                  onClick={handleClear}
                  className="px-3 py-2.5 bg-[#FAFAF5] hover:bg-[#F5F5E8] border border-[#E5E7EB] text-xs font-semibold text-slate-700 rounded-xl transition-all"
                >
                  Clear
                </button>
              )}
            </form>
          </div>

          {/* Database Verbose Error Panel */}
          {errorMsg && (
            <div className="p-6 rounded-3xl bg-rose-50 border border-rose-100">
              <div className="text-xs text-rose-600 font-medium">{errorMsg}</div>
            </div>
          )}

          {/* Table Container */}
          <div className="glass-panel rounded-3xl p-6 overflow-hidden border border-[#E5E7EB] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] text-[9px] text-[#52796F] font-mono uppercase tracking-wider">
                    <th className="py-4 px-4">Ledger ID</th>
                    <th className="py-4 px-4">Date & Time</th>
                    <th className="py-4 px-4">Ledger Type</th>
                    <th className="py-4 px-4">Transactor Details</th>
                    <th className="py-4 px-4">Description</th>
                    <th className="py-4 px-4 text-right">Ledger Amount</th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-[#E5E7EB] text-xs text-slate-800 bg-white">
                  {transactions && transactions.length > 0 ? (
                    transactions.map((tx) => {
                      const isSender = tx.sourceAccountNumber === user.accountNumber;
                      return (
                        <tr key={tx.id} className="hover:bg-[#FAFAF5]/80 transition-colors">
                          <td className="py-4 px-4 font-mono text-[#52796F]">#{tx.id}</td>
                          <td className="py-4 px-4 text-slate-500">{new Date(tx.timestamp).toLocaleString()}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-0.5 rounded font-mono text-[8px] font-bold ${
                              isSender 
                                ? 'bg-rose-500/10 text-rose-600 border border-rose-500/25' 
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-500/25'
                            }`}>
                              {isSender ? 'PAYMENT' : 'RECEIVE'}
                            </span>
                          </td>
                          
                          <td className="py-4 px-4 font-mono text-slate-500">
                            {isSender ? (
                              <span>TO: {tx.targetAccountNumber}</span>
                            ) : (
                              <span>FROM: {tx.sourceAccountNumber}</span>
                            )}
                          </td>
                          
                          <td className="py-4 px-4 text-black">
                            <div className="font-normal">{tx.description}</div>
                          </td>
                          
                          <td className={`py-4 px-4 text-right font-bold font-mono ${isSender ? 'text-rose-600' : 'text-emerald-700'}`}>
                            {isSender ? '-' : '+'}{formatCurrency(tx.amount)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-xs text-[#52796F] font-mono">
                        No transactions registered in this ledger folder.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
