import { useState } from 'react';
import type { Task, TaskFormData } from '../types/Task';

/**
 * Custom hook for managing tasks state
 * Following Single Responsibility Principle - handles only task state management
 */
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const addTask = (taskData: TaskFormData) => {
    // Mock implementation - will be replaced with API call later
    const newTask: Task = {
      id: Date.now(),
      title: taskData.title,
      description: taskData.description,
      completed: false,
      created_at: new Date().toISOString()
    };
    setTasks(prevTasks => [newTask, ...prevTasks].slice(0, 5)); // Keep only 5 most recent
  };

  const markTaskAsDone = (taskId: number) => {
    // Mock implementation - will be replaced with API call later
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const fetchTasks = async () => {
    // Mock implementation - will be replaced with API call later
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return {
    tasks,
    loading,
    addTask,
    markTaskAsDone,
    fetchTasks
  };
};
