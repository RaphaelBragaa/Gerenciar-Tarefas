
import { apiService } from './apiService';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse, LoginRequest>('/api/Conta/login', {
      email,
      password
    });
    return response;
  }
};
