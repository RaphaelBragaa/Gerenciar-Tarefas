
import { apiService } from './apiService';

export interface Task {
  id: number;
  name: string;
  description: string;
  status: TaskStatus;
  email: string;
  userId?: number;
  user?: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  tasks?: Task[];
}

export enum TaskStatus {
  Pending = 0,
  InProgress = 1,
  Completed = 2
}

export const taskService = {
  async getAllTasks(): Promise<Task[]> {
    return apiService.get<Task[]>('/api/Task');
  },

  async getTaskById(id: number): Promise<Task> {
    return apiService.get<Task>(`/api/Task/${id}`);
  },

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    return apiService.post<Task, Omit<Task, 'id'>>('/api/Task', task);
  },

  async updateTask(id: number, task: Partial<Task>): Promise<Task> {
    return apiService.put<Task, Partial<Task>>(`/api/Task/${id}`, task);
  },

  async deleteTask(id: number): Promise<void> {
    return apiService.delete<void>(`/api/Task/${id}`);
  }
};
