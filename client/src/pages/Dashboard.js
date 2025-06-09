import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Work as WorkIcon,
  Bookmark as BookmarkIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { fetchJobs, fetchBookmarkedJobs } from '../redux/slices/jobSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { jobs, bookmarkedJobs, loading, error } = useSelector((state) => state.jobs);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchBookmarkedJobs());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderJobCard = (job) => (
    <Card key={job._id} sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {job.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {job.description.substring(0, 150)}...
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {job.skillsRequired.map((skill) => (
            <Chip key={skill} label={skill} size="small" />
          ))}
        </Box>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="primary">
            Budget: ${job.budget}
          </Typography>
          <Chip
            label={job.experienceLevel}
            size="small"
            color="secondary"
          />
        </Box>
      </CardContent>
      <CardActions>
        <Button
          component={Link}
          to={`/jobs/${job._id}`}
          size="small"
          color="primary"
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );

  const renderStats = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <WorkIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h6">{jobs.length}</Typography>
          <Typography variant="body2" color="text.secondary">
            Total Jobs
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <BookmarkIcon color="secondary" sx={{ fontSize: 40 }} />
          <Typography variant="h6">{bookmarkedJobs.length}</Typography>
          <Typography variant="body2" color="text.secondary">
            Bookmarked Jobs
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <PersonIcon color="success" sx={{ fontSize: 40 }} />
          <Typography variant="h6">
            {user?.role === 'client' ? 'Posted Jobs' : 'Applied Jobs'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.role === 'client' ? jobs.length : '0'}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        {user?.role === 'client' && (
          <Button
            component={Link}
            to="/post-job"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Post New Job
          </Button>
        )}
      </Box>

      {renderStats()}

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="All Jobs" />
          <Tab label="Bookmarked" />
          {user?.role === 'client' && <Tab label="My Posted Jobs" />}
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && jobs.map(renderJobCard)}
          {tabValue === 1 && bookmarkedJobs.map(renderJobCard)}
          {tabValue === 2 && user?.role === 'client' && 
            jobs.filter(job => job.client === user._id).map(renderJobCard)
          }
        </Box>
      </Paper>
    </Container>
  );
};

export default Dashboard; 