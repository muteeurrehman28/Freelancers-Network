import React from 'react';
import { Alert, AlertTitle, Snackbar, Slide } from '@mui/material';

const AlertMessage = ({ 
  open, 
  setOpen, 
  message, 
  severity = 'info', 
  title,
  duration = 5000,
  vertical = 'top',
  horizontal = 'center'
}) => {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical, horizontal }}
      TransitionComponent={Slide}
    >
      <Alert 
        onClose={handleClose} 
        severity={severity} 
        variant="filled" 
        sx={{ width: '100%' }}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertMessage; 