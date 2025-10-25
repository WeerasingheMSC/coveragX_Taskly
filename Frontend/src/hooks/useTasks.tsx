import { useState, useEffect } from 'react';
import type { Task, TaskFormData } from '../types/Task';
import { taskApi } from '../services/api';

/**
 * Custom hook for managing tasks state
 * Following Single Responsibility Principle - handles only task state management
 */
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await taskApi.getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData: TaskFormData) => {
    try {
      setError(null);
      const newTask = await taskApi.createTask(taskData);
      setTasks(prevTasks => [newTask, ...prevTasks].slice(0, 5)); // Keep only 5 most recent
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      console.error('Error creating task:', err);
      throw err; // Re-throw to allow form to handle error
    }
  };

  const markTaskAsDone = async (taskId: number) => {
    try {
      setError(null);
      await taskApi.markTaskAsDone(taskId);
      // Remove task from list after marking as done
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark task as done');
      console.error('Error marking task as done:', err);
      throw err; // Re-throw to allow UI to handle error
    }
  };

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    addTask,
    markTaskAsDone,
    fetchTasks
  };
};