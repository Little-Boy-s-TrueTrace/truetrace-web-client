'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { createKycSession, listKycSessions } from '@/api/kyc';

export default function KycPage() {
  const [cccdNumber, setCccdNumber] = useState('');
  const [selfie, setSelfie] = useState<File | null>(null);
  const [cccdFront, setCccdFront] = useState<File | null>(null);
  const [cccdBack, setCccdBack] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLatestSession = async () => {
    try {
      const sessions = await listKycSessions();
      if (sessions && sessions.length > 0) {
        // Assuming the API returns them sorted or we just grab the first one
        setStatus(sessions[0].status);
      }
    } catch (error) {
      console.error('Failed to fetch KYC sessions', error);
    }
  };

  useEffect(() => {
    fetchLatestSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selfie || !cccdFront || !cccdBack || !cccdNumber) {
      alert('Please fill all fields and upload all images.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('cccdNumber', cccdNumber);
    formData.append('selfie', selfie);
    formData.append('cccdFront', cccdFront);
    formData.append('cccdBack', cccdBack);

    try {
      await createKycSession(formData);
      alert('KYC submitted successfully');
      fetchLatestSession();
    } catch (error) {
      console.error('KYC submission failed', error);
      alert('Failed to submit KYC.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F0F2F5]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="KYC Verification" />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-[#1B4332] mb-6">Identity Verification</h2>
            
            {status && (
              <div className={`mb-6 p-4 rounded-lg border font-medium ${
                status === 'APPROVED' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                status === 'REJECTED' ? 'bg-red-50 border-red-200 text-red-800' :
                'bg-blue-50 border-blue-200 text-blue-800'
              }`}>
                Current Status: <span className="font-bold">{status}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CCCD Number</label>
                <input
                  type="text"
                  value={cccdNumber}
                  onChange={(e) => setCccdNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#228B22] focus:border-transparent outline-none"
                  placeholder="Enter your 12-digit CCCD number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Selfie Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelfie(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CCCD Front Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCccdFront(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CCCD Back Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCccdBack(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#1B4332] text-white rounded-lg font-bold hover:bg-[#228B22] transition-colors disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit for Verification'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
