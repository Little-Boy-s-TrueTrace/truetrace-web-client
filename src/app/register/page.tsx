'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login, register } from '@/api/auth';
import { tokenStorage } from '@/api/tokenStorage';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await register({ username, password, fullName, email });
      setSuccess(`Account ${response.accountNumber} was created. Signing you in for KYC…`);
      try {
        const auth = await login({ username, password });
        tokenStorage.setItem('token', auth.token);
        tokenStorage.setItem('user', JSON.stringify(auth.user));
        setSuccess(`Account ${response.accountNumber} is ready. Opening identity verification…`);
        setTimeout(() => router.push('/kyc'), 800);
      } catch {
        setSuccess(`Account ${response.accountNumber} was created. Please sign in to continue KYC.`);
        setTimeout(() => router.push('/login'), 1600);
      }
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.error || 'Registration failed. Please try again.');
      } else {
        setError('Connection to the server failed. Please check your network connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAF5] relative items-center justify-center p-4 text-black">
      {/* Background decoration glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#84A98C]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#E5E7EB]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-[#E5E7EB] shadow-sm relative z-10 hover:border-[#1B4332]/20 bg-white">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1B4332] to-[#84A98C] flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-[#1B4332]/10 mx-auto mb-4">
            T
          </div>
          <h2 className="text-2xl font-extrabold text-[#1B4332] tracking-tight font-heading">Open Account</h2>
          <p className="text-xs text-[#52796F] font-mono tracking-widest mt-1 uppercase font-semibold">TrueTrace Bank Registration</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-[#52796F] uppercase tracking-wider mb-1.5">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#FAFAF5] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-black placeholder-slate-400 focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332]/35 transition-all"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#52796F] uppercase tracking-wider mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#FAFAF5] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-black placeholder-slate-400 focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332]/35 transition-all"
              placeholder="Enter your email address"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#52796F] uppercase tracking-wider mb-1.5">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#FAFAF5] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-black placeholder-slate-400 focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332]/35 transition-all font-mono"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#52796F] uppercase tracking-wider mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#FAFAF5] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-black placeholder-slate-400 focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332]/35 transition-all font-mono"
              placeholder="Choose a password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#228B22] hover:bg-[#1B7E1B] text-white font-bold py-3.5 rounded-full shadow-sm transition-all text-xs tracking-wider uppercase active:scale-[0.98] disabled:opacity-50 mt-2"
          >
            {loading ? 'Processing...' : 'Register TrueTrace Bank Account'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#E5E7EB] text-center">
          <p className="text-xs text-[#52796F]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#228B22] hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
