import apiClient from './apiClient';

export interface AccountDetails {
  accountNumber: string;
  fullName: string;
  balance: number;
  currency: string;
  email: string;
}

export const getAccountDetails = async (accountNumber: string): Promise<AccountDetails> => {
  const response = await apiClient.get<AccountDetails>(`/api/accounts/${accountNumber}/details`);
  return response.data;
};
