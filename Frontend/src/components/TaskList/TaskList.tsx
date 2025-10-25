import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import TaskCard from '../TaskCard/TaskCard';
import type { Task } from '../../types/Task';

/**
 * TaskList Component
 * Following Single Responsibility Principle - handles only task list display
 */
interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onMarkDone: (taskId: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, loading, onMarkDone }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (tasks.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          No tasks yet. Add your first task to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {tasks.map((task) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onMarkDone={onMarkDone}
        />
      ))}
    </Box>
  );
};

export default TaskList;