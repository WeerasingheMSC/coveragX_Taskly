import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { Task } from '../../types/Task';

/**
 * TaskCard Component
 * Following Single Responsibility Principle - handles only single task display
 */
interface TaskCardProps {
  task: Task;
  onMarkDone: (taskId: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onMarkDone }) => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <>
      <Card 
        sx={{ 
          mb: 2,
          backgroundColor: '#f5f5f5',
          boxShadow: 1,
          '&:hover': {
            boxShadow: 3,
            cursor: 'pointer'
          }
        }}
        onClick={handleOpenDialog}
      >
        <CardContent sx={{ py: 2, px: 3 }}>
          {/* Date/Time at top right */}
          {task.created_at && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: '0.75rem'
                }}
              >
                {formatDate(task.created_at)}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  mb: 0.5,
                  color: 'text.primary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {task.title}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  wordBreak: 'break-word'
                }}
              >
                {task.description}
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onMarkDone(task.id);
              }}
              sx={{
                backgroundColor: '#2196F3',
                color: 'white',
                textTransform: 'none',
                minWidth: 80,
                flexShrink: 0,
                '&:hover': {
                  backgroundColor: '#1976D2'
                }
              }}
            >
              Done
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Task Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Title
            </Typography>
            <IconButton
              onClick={handleCloseDialog}
              size="small"
              sx={{ color: 'text.secondary' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
            {task.title}
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Description
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            {task.description || 'No description provided'}
          </Typography>
          {task.created_at && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {formatDate(task.created_at)}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseDialog}
            variant="contained"
            sx={{
              backgroundColor: '#2196F3',
              color: 'white',
              textTransform: 'none',
              px: 3,
              '&:hover': {
                backgroundColor: '#1976D2'
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskCard;
