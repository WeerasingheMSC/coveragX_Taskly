import type { Task, TaskFormData } from '../types/Task';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * API Service for backend communication
 * Following Dependency Inversion Principle - abstract API implementation
 */

export const taskApi = {
  /**
   * Fetch all tasks (max 5 recent non-completed)
   */
  async getTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return response.json();
  },

  /**
   * Create a new task
   */
  async createTask(taskData: TaskFormData): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create task');
    }
    
    return response.json();
  },

  /**
   * Mark a task as done
   */
  async markTaskAsDone(taskId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/done`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to mark task as done');
    }
  },
};