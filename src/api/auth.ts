import apiClient from './apiClient';

export interface LoginRequest {
  username?: string;
  password?: string;
}

export interface RegisterRequest {
  username?: string;
  password?: string;
  fullName?: string;
  email?: string;
}

export interface UserDetails {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  accountNumber: string;
}

export interface LoginResponse {
  token: string;
  user: UserDetails;
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/api/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<{ message: string; accountNumber: string }> => {
  const response = await apiClient.post('/api/auth/register', data);
  return response.data;
};
