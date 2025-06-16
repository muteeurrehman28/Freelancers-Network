import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Grid,
} from '@mui/material';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';

const NotFoundPage = () => {
  return (
    <Container maxWidth="md">
      <Paper elevation={2} sx={{ p: 4, textAlign: 'center', mt: 4 }}>
        <SentimentDissatisfiedIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
        
        <Typography variant="h2" component="h1" gutterBottom>
          404
        </Typography>
        
        <Typography variant="h5" color="text.secondary" paragraph>
          Oops! Page Not Found
        </Typography>
        
        <Typography variant="body1" paragraph>
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                startIcon={<HomeIcon />}
                component={RouterLink}
                to="/"
              >
                Go to Home
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<WorkIcon />}
                component={RouterLink}
                to="/jobs"
              >
                Browse Jobs
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFoundPage; 