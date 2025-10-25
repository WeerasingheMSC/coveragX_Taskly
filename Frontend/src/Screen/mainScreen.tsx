import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import TaskForm from '../components/TaskForm/TaskForm';
import TaskList from '../components/TaskList/TaskList';
import { useTasks } from '../hooks/useTasks';

/**
 * MainScreen Component
 * Following Open/Closed Principle - open for extension, closed for modification
 * Manages the main application layout and task flow
 */
const MainScreen: React.FC = () => {
  const { tasks, loading, addTask, markTaskAsDone } = useTasks();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url('/page.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        py: 6
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          mb: 4
        }}
      >
        <Box
          component="img"
          src="/logo.png"
          alt="Taskly Logo"
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            objectFit: 'cover'
          }}
        />
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            color: 'text.primary',
            fontSize: { xs: '3rem', md: '4rem' }
          }}
        >
          Taskly
        </Typography>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            flexDirection: { xs: 'column', md: 'row' },
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            borderRadius: 2,
            p: 3,
            mt: 5,
            minHeight: '70vh',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Left Side - Task Form */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              borderRight: { xs: 'none', md: '2px solid rgba(0, 0, 0, 0.1)' },
              pr: { xs: 0, md: 3 }
            }}
          >
            <TaskForm onSubmit={addTask} />
          </Box>

          {/* Right Side - Task List */}
          <Box
            sx={{
              flex: 1,
              pl: { xs: 0, md: 3 },
              pt: { xs: 3, md: 0 }
            }}
          >
            <TaskList 
              tasks={tasks} 
              loading={loading}
              onMarkDone={markTaskAsDone}
            />
          </Box>
        </Box>
        
      </Container>
    </Box>
  );
};

export default MainScreen;