import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper 
} from '@mui/material';
import type { TaskFormData } from '../../types/Task';

/**
 * TaskForm Component
 * Following Single Responsibility Principle - handles only task form UI and validation
 */
interface TaskFormProps {
  onSubmit: (task: TaskFormData) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim()
    });

    // Clear form
    setTitle('');
    setDescription('');
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 2,
        width: '100%',
        maxWidth: 400
      }}
    >
      <Typography 
        variant="body1" 
        sx={{ 
          mb: 3, 
          textAlign: 'center',
          color: 'text.primary',
          fontWeight: 900
        }}
      >
        Stay organized and track your daily tasks
      </Typography>

      <Typography 
        variant="h5" 
        sx={{ 
          mb: 3, 
          fontWeight: 'bold',
          color: 'text.primary'
        }}
      >
        Add Task
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          placeholder="Add title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ 
            mb: 2,
            backgroundColor: 'white',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#000000',
              },
            }
          }}
        />

        <TextField
          fullWidth
          placeholder="Description"
          variant="outlined"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ 
            mb: 3,
            backgroundColor: 'white',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#000000'
              },
            }
          }}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          disabled={!title.trim()}
          sx={{
            backgroundColor: '#2196F3',
            color: 'white',
            py: 1.5,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#1976D2',
            },
            '&:disabled': {
              backgroundColor: '#90caf9',
              color: 'white'
            }
          }}
        >
          Add Task
        </Button>
      </Box>
    </Paper>
  );
};

export default TaskForm;
