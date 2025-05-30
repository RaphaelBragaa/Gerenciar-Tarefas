
import { apiService } from './apiService';
import { User } from './taskService';

export const userService = {
  async getAllUsers(): Promise<User[]> {
    return apiService.get<User[]>('/api/User');
  },

  async getUserById(id: number): Promise<User> {
    return apiService.get<User>(`/api/User/${id}`);
  },

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    return apiService.post<User>('/api/User', user);
  },

  async updateUser(id: number, user: Partial<User>): Promise<User> {
    return apiService.put<User>(`/api/User/${id}`, user);
  },

  async deleteUser(id: number): Promise<void> {
    return apiService.delete<void>(`/api/User/${id}`);
  }
};
