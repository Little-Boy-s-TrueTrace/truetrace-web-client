import type { KycSession } from '@/api/kyc';
import { isTerminalKycStatus, newestKycSession } from './kycUtils';

const session = (sessionId: string, createdAt: string, updatedAt?: string): KycSession => ({
  id: Number(sessionId.replace(/\D/g, '')) || 1,
  sessionId,
  customerName: 'Demo User',
  cccdNumber: '001234567890',
  status: 'PENDING',
  createdAt,
  updatedAt,
});

describe('customer KYC demo helpers', () => {
  test('selects the newest owned session even when the API array is not sorted', () => {
    const selected = newestKycSession([
      session('session-1', '2026-07-28T10:00:00Z'),
      session('session-3', '2026-07-30T10:00:00Z'),
      session('session-2', '2026-07-29T10:00:00Z'),
    ]);

    expect(selected?.sessionId).toBe('session-3');
  });

  test('uses updatedAt when an existing session receives a newer agent result', () => {
    const selected = newestKycSession([
      session('session-1', '2026-07-30T10:00:00Z'),
      session('session-2', '2026-07-29T10:00:00Z', '2026-07-30T11:00:00Z'),
    ]);

    expect(selected?.sessionId).toBe('session-2');
  });

  test('keeps the newest database row above a legacy row with a future timestamp', () => {
    const selected = newestKycSession([
      session('session-1', '2026-07-30T07:07:28Z'),
      session('session-2', '2026-07-30T00:29:30Z'),
    ]);

    expect(selected?.sessionId).toBe('session-2');
  });

  test('recognizes statuses where automated polling has reached a review outcome', () => {
    expect(isTerminalKycStatus('APPROVED')).toBe(true);
    expect(isTerminalKycStatus('REJECTED')).toBe(true);
    expect(isTerminalKycStatus('MANUAL_REVIEW')).toBe(true);
    expect(isTerminalKycStatus('ANALYZING')).toBe(false);
  });
});
