import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loading = ({ size = 'medium', message = 'Loading...' }) => {
  const circleSizes = {
    small: 24,
    medium: 40,
    large: 60,
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center',
      py: 4
    }}>
      <CircularProgress size={circleSizes[size]} />
      {message && (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mt: 2 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Loading; 