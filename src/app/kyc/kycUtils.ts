import type { KycSession } from '@/api/kyc';

const timestamp = (session: KycSession) => {
  const value = new Date(session.updatedAt || session.createdAt).getTime();
  return Number.isFinite(value) ? value : 0;
};

export const newestKycSession = (sessions: KycSession[]): KycSession | null => {
  if (!Array.isArray(sessions) || sessions.length === 0) return null;
  return [...sessions].sort((a, b) => timestamp(b) - timestamp(a))[0];
};

export const isTerminalKycStatus = (status?: string) =>
  status === 'APPROVED' || status === 'REJECTED' || status === 'MANUAL_REVIEW';
