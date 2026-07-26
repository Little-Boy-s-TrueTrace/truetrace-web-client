'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/api/auth';
import { tokenStorage } from '@/api/tokenStorage';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (tokenStorage.getItem('token')) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await login({ username, password });
      tokenStorage.setItem('token', response.token);
      tokenStorage.setItem('user', JSON.stringify(response.user));
      
      setSuccess('Sign in successful. Redirecting...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 429) {
          setError('Too many invalid login attempts. Your IP has been temporarily rate limited.');
        } else {
          setError(err.response.data.error || 'Invalid username or password. Please try again.');
        }
      } else {
        setError('Unable to connect to the banking server. Please check your network connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAF5] overflow-hidden text-[#000000] font-sans">
      
      {/* LEFT COLUMN: Visual Brand Panel (Forest Green) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1B4332] p-12 flex-col justify-between relative border-r border-[#D8E2DC]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(132,169,140,0.1),transparent_60%)] pointer-events-none"></div>
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ 
            backgroundImage: `radial-gradient(circle, #84A98C 1px, transparent 1px)`, 
            backgroundSize: '32px 32px' 
          }}
        ></div>
        
        {/* Top Header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0F2818] to-[#84A98C] flex items-center justify-center font-black text-white text-xl shadow-lg shadow-[#0F2818]/25">
            A
          </div>
          <div>
            <h1 className="font-extrabold text-white tracking-wide text-base">TrueTrace Bank</h1>
            <span className="text-[9px] text-[#FAFAF5]/70 font-mono tracking-widest block uppercase font-bold">Secure Digital Banking</span>
          </div>
        </div>

        {/* Center graphics/slogan */}
        <div className="my-auto space-y-6 relative z-10 max-w-lg">
          <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight font-heading">
            Environmental <br />
            <span className="text-[#FFB300]">Sustainability Finance</span>
          </h2>
          <p className="text-[#FAFAF5]/85 text-sm leading-relaxed">
            Co-creating a greener future through eco-friendly asset management, climate-positive carbon offsets, and organic, sustainable financial choices.
          </p>
        </div>

        {/* Footer */}
        <div className="text-[10px] text-[#FAFAF5]/50 font-mono relative z-10">
          <span>© 2026 TRUETRACE BANK - SUSTAINABLE CO-OP</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 bg-[#FAFAF5] relative">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#84A98C]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-[#FAFAF5]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md space-y-8 relative z-10">
          
          {/* Header */}
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-extrabold text-[#1B4332] tracking-tight font-heading">Sign In</h2>
            <p className="text-[#52796F] text-xs font-medium">Access your TrueTrace banking account dashboard.</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs">
              <span className="font-semibold block mb-1">Sign In Failed</span>
              <span className="text-[11px] opacity-90">{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs">
              <span className="text-[11px] opacity-90">{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-3xl border border-[#E5E7EB] shadow-sm">
            <div>
              <label className="block text-[10px] font-bold text-[#52796F] uppercase tracking-wider mb-2">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#FAFAF5] border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-black placeholder-slate-400 focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332]/35 transition-all font-mono"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#52796F] uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAFAF5] border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-black placeholder-slate-400 focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332]/35 transition-all font-mono"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#228B22] hover:bg-[#1B7E1B] text-white font-bold py-3.5 rounded-full shadow-sm transition-all text-xs tracking-wider uppercase active:scale-[0.98] disabled:opacity-50 hover:scale-[1.01]"
            >
              {loading ? 'Authenticating...' : 'Sign In To TrueTrace Bank'}
            </button>
          </form>

          {/* Bottom links */}
          <div className="pt-2 text-center lg:text-left">
            <p className="text-xs text-[#52796F]">
              New customer?{' '}
              <Link href="/register" className="text-[#228B22] hover:underline font-semibold">
                Open banking account
              </Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
