import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Alert,
  Snackbar
} from '@mui/material';
import type { TaskFormData } from '../../types/Task';

/**
 * TaskForm Component
 * Following Single Responsibility Principle - handles only task form UI and validation
 */
interface TaskFormProps {
  onSubmit: (task: TaskFormData) => Promise<void>;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim()
      });

      // Clear form on success
      setTitle('');
      setDescription('');
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Paper 
        elevation={0}
        sx={{ 
          p: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 2,
          width: '100%',
          maxWidth: 500,
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

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            placeholder="Add title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
            sx={{ 
              mb: 2,
              mt: 2,
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
            disabled={submitting}
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
          <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Task added successfully!
        </Alert>
      </Snackbar>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={!title.trim() || submitting}
            sx={{
              backgroundColor: '#2196F3',
              color: 'white',
              py: 1.5,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              mt: 5,
              '&:hover': {
                backgroundColor: '#1976D2',
              },
              '&:disabled': {
                backgroundColor: '#90caf9',
                color: 'white'
              }
            }}
          >
            {submitting ? 'Adding...' : 'Add'}
          </Button>
        </Box>
      </Paper>

      
    </>
  );
};

export default TaskForm;