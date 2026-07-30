import type { KycSession } from '@/api/kyc';
import { apiDate } from '@/utils/dateTime';

const timestamp = (session: KycSession) => {
  const value = apiDate(session.updatedAt || session.createdAt).getTime();
  return Number.isFinite(value) ? value : 0;
};

export const newestKycSession = (sessions: KycSession[]): KycSession | null => {
  if (!Array.isArray(sessions) || sessions.length === 0) return null;
  return [...sessions].sort((a, b) => {
    if (a.id !== b.id) return b.id - a.id;
    return timestamp(b) - timestamp(a);
  })[0];
};

export const isTerminalKycStatus = (status?: string) =>
  status === 'APPROVED' || status === 'REJECTED' || status === 'MANUAL_REVIEW';
