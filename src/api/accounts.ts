import apiClient from './apiClient';

export interface AccountDetails {
  accountNumber: string;
  fullName: string;
  balance: number;
  currency: string;
  email: string;
  status?: string;
}

export interface AccountRecipient {
  accountNumber: string;
  fullName: string;
}

export const getAccountDetails = async (accountNumber: string): Promise<AccountDetails> => {
  const response = await apiClient.get<AccountDetails>(`/api/accounts/${accountNumber}/details`);
  return response.data;
};

export const getAccountRecipients = async (): Promise<AccountRecipient[]> => {
  const response = await apiClient.get<AccountRecipient[]>('/api/accounts/recipients');
  return Array.isArray(response.data) ? response.data : [];
};
