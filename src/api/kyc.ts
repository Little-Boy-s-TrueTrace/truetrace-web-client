import apiClient from './apiClient';

export interface KycSession {
  id: number;
  sessionId: string;
  customerId?: string;
  accountId?: string;
  customerName: string;
  cccdNumber: string;
  status: 'PENDING' | 'ANALYZING' | 'APPROVED' | 'REJECTED' | 'MANUAL_REVIEW';
  deepfakeScore?: number;
  faceMatchScore?: number;
  documentIntegrityScore?: number;
  livenessScore?: number;
  riskLevel?: string;
  recommendedAction?: string;
  createdAt: string;
  updatedAt?: string;
}

export const createKycSession = async (formData: FormData): Promise<KycSession> => {
  const response = await apiClient.post('/api/kyc/sessions', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getKycSession = async (sessionId: string): Promise<KycSession> => {
  const response = await apiClient.get<KycSession>(`/api/kyc/sessions/${sessionId}`);
  return response.data;
};

export const listMyKycSessions = async (): Promise<KycSession[]> => {
  const response = await apiClient.get<KycSession[]>('/api/kyc/sessions', {
    params: { mine: true },
  });
  return Array.isArray(response.data) ? response.data : [];
};
