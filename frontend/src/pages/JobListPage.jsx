import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  Pagination,
  Divider,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { useUsers } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/jobs/JobCard';
import JobFilter from '../components/jobs/JobFilter';
import Loading from '../components/ui/Loading';
import AlertMessage from '../components/ui/AlertMessage';

const JobListPage = () => {
  const [filters, setFilters] = useState({
    search: '',
    skillsRequired: [],
    budget: [0, 10000],
    status: ['open'],
    page: 1,
    limit: 8
  });
  
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  
  const { 
    jobs, 
    loading, 
    error, 
    pagination,
    getJobs, 
    isJobBookmarked, 
    toggleBookmark, 
    getBookmarkedJobs 
  } = useJobs();
  
  const { skills, getAllSkills } = useUsers();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Fetch jobs on initial load and when filters change
  useEffect(() => {
    loadJobs();
  }, [filters]);
  
  // Fetch all skills for filter dropdown
  useEffect(() => {
    loadSkills();
    
    // Load user's bookmarked jobs if authenticated
    if (isAuthenticated) {
      loadBookmarkedJobs();
    }
  }, [isAuthenticated]);
  
  const loadJobs = async () => {
    try {
      await getJobs(filters);
    } catch (error) {
      setAlertMessage('Failed to load jobs. Please try again.');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };
  
  const loadSkills = async () => {
    try {
      await getAllSkills();
    } catch (error) {
      console.error('Failed to load skills', error);
    }
  };
  
  const loadBookmarkedJobs = async () => {
    try {
      await getBookmarkedJobs();
    } catch (error) {
      console.error('Failed to load bookmarked jobs', error);
    }
  };
  
  const handleFilterChange = (newFilters) => {
    setFilters({
      ...newFilters,
      page: 1, // Reset to first page on filter change
    });
  };
  
  const handlePageChange = (event, value) => {
    setFilters({
      ...filters,
      page: value,
    });
  };
  
  const handleBookmarkToggle = async (jobId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/jobs' } });
      return;
    }
    
    try {
      const result = await toggleBookmark(jobId);
      
      setAlertMessage(
        result.isBookmarked 
          ? 'Job added to bookmarks' 
          : 'Job removed from bookmarks'
      );
      setAlertSeverity('success');
      setAlertOpen(true);
    } catch (error) {
      setAlertMessage('Failed to update bookmark. Please try again.');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };
  
  const handlePostJob = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/create-job' } });
    } else {
      navigate('/create-job');
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 2 
            }}
          >
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Browse Jobs
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Find the perfect project that matches your skills and interests
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handlePostJob}
            >
              Post a Job
            </Button>
          </Box>
          <Divider sx={{ mb: 3 }} />
        </Grid>
        
        {/* Sidebar with filters */}
        <Grid item xs={12} md={3}>
          <JobFilter onFilterChange={handleFilterChange} skills={skills} />
        </Grid>
        
        {/* Main content */}
        <Grid item xs={12} md={9}>
          {loading ? (
            <Loading message="Loading jobs..." />
          ) : error ? (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography color="error" align="center">
                  {error}
                </Typography>
              </CardContent>
            </Card>
          ) : jobs.length === 0 ? (
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <WorkOutlineIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No jobs found
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Try adjusting your filters or search criteria
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={() => handleFilterChange({
                    search: '',
                    skillsRequired: [],
                    budget: [0, 10000],
                    status: ['open'],
                    page: 1,
                    limit: 8
                  })}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Results summary */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {jobs.length} of {pagination.total} jobs
                </Typography>
                <Chip
                  label={`Page ${pagination.page} of ${pagination.pages}`}
                  size="small"
                  variant="outlined"
                />
              </Box>
              
              {/* Job list */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {jobs.map((job) => (
                  <Grid item xs={12} sm={6} key={job._id}>
                    <JobCard
                      job={job}
                      isBookmarked={isJobBookmarked(job._id)}
                      onBookmark={handleBookmarkToggle}
                    />
                  </Grid>
                ))}
              </Grid>
              
              {/* Pagination */}
              {pagination.pages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={pagination.pages}
                    page={pagination.page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
      
      <AlertMessage
        open={alertOpen}
        setOpen={setAlertOpen}
        message={alertMessage}
        severity={alertSeverity}
      />
    </Container>
  );
};

export default JobListPage; 