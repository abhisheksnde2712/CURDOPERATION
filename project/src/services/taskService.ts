import { Task, ApiResponse } from '../types/Task';

const API_BASE_URL = 'http://localhost:3001/api';

export class TaskService {
  static async getAllTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      const result: ApiResponse<Task[]> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch tasks');
      }
      
      return result.data || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  static async createTask(name: string, description: string): Promise<Task> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });

      const result: ApiResponse<Task> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to create task');
      }
      
      return result.data!;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  static async updateTask(id: number, updates: Partial<Pick<Task, 'name' | 'description' | 'completed'>>): Promise<Task> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const result: ApiResponse<Task> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to update task');
      }
      
      return result.data!;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  static async deleteTask(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
      });

      const result: ApiResponse<Task> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
}