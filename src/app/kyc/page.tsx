'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import {
  createKycSession,
  getKycSession,
  KycSession,
  listMyKycSessions,
} from '@/api/kyc';
import { tokenStorage } from '@/api/tokenStorage';
import type { UserDetails } from '@/api/auth';
import { isTerminalKycStatus, newestKycSession } from './kycUtils';

const POLL_INTERVAL_MS = 3000;

export default function KycPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [cccdNumber, setCccdNumber] = useState('');
  const [selfie, setSelfie] = useState<File | null>(null);
  const [cccdFront, setCccdFront] = useState<File | null>(null);
  const [cccdBack, setCccdBack] = useState<File | null>(null);
  const [session, setSession] = useState<KycSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const activeSessionId = session?.sessionId;

  useEffect(() => {
    const token = tokenStorage.getItem('token');
    const rawUser = tokenStorage.getItem('user');
    if (!token || !rawUser) {
      router.replace('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(rawUser) as UserDetails;
      setUser(parsedUser);
      setCustomerName(parsedUser.fullName || '');
    } catch {
      router.replace('/login');
    }
  }, [router]);

  const refreshSession = useCallback(async () => {
    if (!user) return;

    try {
      const latest = activeSessionId
        ? await getKycSession(activeSessionId)
        : newestKycSession(await listMyKycSessions());
      setSession(latest);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Unable to refresh your KYC verification status.');
    } finally {
      setLoadingSession(false);
    }
  }, [activeSessionId, user]);

  useEffect(() => {
    if (!user) return;
    void refreshSession();
    const timer = window.setInterval(() => void refreshSession(), POLL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [refreshSession, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selfie || !cccdFront || !cccdBack) {
      setError('Please upload the selfie and both sides of your CCCD.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('customerName', customerName.trim());
    formData.append('cccdNumber', cccdNumber.trim());
    formData.append('selfie', selfie);
    formData.append('idFront', cccdFront);
    formData.append('idBack', cccdBack);

    try {
      const created = await createKycSession(formData);
      setSession(created);
      setSuccess(`KYC session ${created.sessionId} was saved and queued for Agent 1.`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit KYC evidence.');
    } finally {
      setLoading(false);
    }
  };

  const statusStyle = session?.status === 'APPROVED'
    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
    : session?.status === 'REJECTED'
      ? 'bg-red-50 border-red-200 text-red-800'
      : session?.status === 'MANUAL_REVIEW'
        ? 'bg-amber-50 border-amber-200 text-amber-800'
        : 'bg-blue-50 border-blue-200 text-blue-800';

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#F0F2F5]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="KYC Verification" />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1B4332]">Identity Verification</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Evidence is linked to {user.fullName} ({user.accountNumber}).
                </p>
              </div>
              {loadingSession && <span className="text-xs text-gray-500">Refreshing status…</span>}
            </div>

            {session && (
              <div className={`mb-6 p-4 rounded-lg border ${statusStyle}`}>
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="font-medium">
                    Current status: <strong>{session.status}</strong>
                  </span>
                  <span className="font-mono text-xs break-all">Session: {session.sessionId}</span>
                </div>
                {!isTerminalKycStatus(session.status) && (
                  <p className="text-xs mt-2 opacity-80">
                    Agent 1 is processing this session. This page refreshes every 3 seconds.
                  </p>
                )}
                {(session.deepfakeScore !== undefined || session.faceMatchScore !== undefined) && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-xs">
                    <span>Deepfake: <strong>{session.deepfakeScore ?? 0}%</strong></span>
                    <span>Face match: <strong>{session.faceMatchScore ?? 0}%</strong></span>
                    <span>Liveness: <strong>{session.livenessScore ?? 0}%</strong></span>
                    <span>Document: <strong>{session.documentIntegrityScore ?? 0}%</strong></span>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div role="alert" className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm">
                {success}
              </div>
            )}

            {session && isTerminalKycStatus(session.status) ? (
              <div className="text-center py-8">
                {session.status === 'APPROVED' ? (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                      <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-emerald-800 mb-2">Identity Verified</h3>
                    <p className="text-sm text-gray-600">Your KYC verification has been approved. No further action is required.</p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                      <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-red-800 mb-2">Verification Rejected</h3>
                    <p className="text-sm text-gray-600 mb-4">Your identity verification was not approved. Please re-submit with valid documents.</p>
                    <button
                      onClick={() => { setSession(null); setError(''); setSuccess(''); }}
                      className="px-6 py-2 bg-[#1B4332] text-white rounded-lg font-bold hover:bg-[#228B22] transition-colors"
                    >
                      Re-submit Verification
                    </button>
                  </>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
                <input
                  type="text"
                  value={customerName}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                />
                <p className="text-xs text-gray-500 mt-1">Loaded from your authenticated banking profile.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CCCD Number</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="\d{12}"
                  maxLength={12}
                  value={cccdNumber}
                  onChange={(e) => setCccdNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#228B22] focus:border-transparent outline-none"
                  placeholder="Enter your 12-digit CCCD number"
                  required
                />
              </div>

              <EvidenceUpload label="Selfie Photo" onChange={setSelfie} />
              <EvidenceUpload label="CCCD Front Image" onChange={setCccdFront} />
              <EvidenceUpload label="CCCD Back Image" onChange={setCccdBack} />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#1B4332] text-white rounded-lg font-bold hover:bg-[#228B22] transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving and publishing event...' : 'Submit for Verification'}
              </button>
            </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function EvidenceUpload({
  label,
  onChange,
}: {
  label: string;
  onChange: (file: File | null) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
        required
      />
    </div>
  );
}
