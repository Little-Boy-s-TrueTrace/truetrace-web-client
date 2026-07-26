import apiClient from './apiClient';

export const createKycSession = async (formData: FormData) => {
  const response = await apiClient.post('/api/kyc/sessions', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getKycSession = async (sessionId: string) => {
  const response = await apiClient.get(`/api/kyc/sessions/${sessionId}`);
  return response.data;
};

export const listKycSessions = async () => {
  const response = await apiClient.get('/api/kyc/sessions');
  return response.data;
};
