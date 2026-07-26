import apiClient from './apiClient';

export interface TransferRequest {
  sourceAccountNumber: string;
  targetAccountNumber: string;
  amount: number | string;
  description: string;
}

export interface TransferResponse {
  message: string;
  transactionId: number;
  sourceBalance: number;
}

export interface TransactionItem {
  id: number;
  sourceAccountNumber: string;
  targetAccountNumber: string;
  amount: number;
  description: string;
  timestamp: string;
  status: string;
}

export const transferMoney = async (data: TransferRequest): Promise<TransferResponse> => {
  const response = await apiClient.post<TransferResponse>('/api/transactions/transfer', data);
  return response.data;
};

export const getTransactionHistory = async (accountNumber: string, search?: string): Promise<TransactionItem[]> => {
  const params: Record<string, string> = { accountNumber };
  if (search !== undefined && search !== '') {
    params.search = search;
  }
  const response = await apiClient.get<TransactionItem[]>('/api/transactions/history', { params });
  return response.data;
};
