import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  Chip,
  Divider,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import { useUsers } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';
import JobCard from '../components/jobs/JobCard';
import Loading from '../components/ui/Loading';

const ProfilePage = () => {
  const { id } = useParams();
  const { getUserProfile, userProfile, loading, error } = useUsers();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadUserProfile();
  }, [id]);

  const loadUserProfile = async () => {
    try {
      await getUserProfile(id);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return <Loading message="Loading profile..." />;
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!userProfile) {
    return (
      <Container maxWidth="md">
        <Alert severity="info" sx={{ mt: 2 }}>
          User profile not found.
        </Alert>
      </Container>
    );
  }

  const isOwnProfile = user && user._id === userProfile._id;

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Paper
            elevation={2}
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 2,
              background: 'linear-gradient(to right, #2196f3, #21cbf3)',
              color: 'white',
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Avatar
                  src={userProfile.profilePicture}
                  alt={userProfile.name}
                  sx={{
                    width: 150,
                    height: 150,
                    mb: 2,
                    mx: { xs: 'auto', md: 0 },
                    border: '4px solid white',
                  }}
                />
              </Grid>
              <Grid item xs={12} md={9}>
                <Typography variant="h4" gutterBottom>
                  {userProfile.name}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {userProfile.role === 'freelancer' ? 'Freelancer' : 'Client'}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  {userProfile.skills && userProfile.skills.map((skill, index) => (
                    <Chip key={index} label={skill} color="secondary" sx={{ color: 'white', borderColor: 'white' }} />
                  ))}
                </Box>
                {isOwnProfile && (
                  <Button
                    variant="contained"
                    color="secondary"
                    component={RouterLink}
                    to="/dashboard"
                    sx={{ mt: 2 }}
                  >
                    Edit Profile
                  </Button>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Profile Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              About
            </Typography>
            <Typography variant="body1" paragraph>
              {userProfile.bio || 'No bio provided.'}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <List disablePadding>
              <ListItem disableGutters>
                <PersonIcon color="primary" sx={{ mr: 2 }} />
                <ListItemText primary="Name" secondary={userProfile.name} />
              </ListItem>
              
              <ListItem disableGutters>
                <MailOutlineIcon color="primary" sx={{ mr: 2 }} />
                <ListItemText primary="Email" secondary={userProfile.email} />
              </ListItem>
              
              <ListItem disableGutters>
                <WorkIcon color="primary" sx={{ mr: 2 }} />
                <ListItemText 
                  primary="Role" 
                  secondary={userProfile.role === 'freelancer' ? 'Freelancer' : 'Client'} 
                />
              </ListItem>
              
              <ListItem disableGutters>
                <CalendarTodayIcon color="primary" sx={{ mr: 2 }} />
                <ListItemText 
                  primary="Member Since" 
                  secondary={userProfile.createdAt ? formatDate(userProfile.createdAt) : 'Unknown'} 
                />
              </ListItem>
            </List>
          </Paper>

          {userProfile.role === 'freelancer' && (
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Skills
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {userProfile.skills && userProfile.skills.length > 0 ? (
                  userProfile.skills.map((skill, index) => (
                    <Chip key={index} label={skill} variant="outlined" color="primary" />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No skills listed.
                  </Typography>
                )}
              </Box>
            </Paper>
          )}
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper elevation={1} sx={{ mb: 4 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Job Posts" />
              {userProfile.role === 'freelancer' && <Tab label="Portfolio" />}
            </Tabs>
            
            <Box sx={{ p: 3 }}>
              {tabValue === 0 ? (
                userProfile.jobPosts && userProfile.jobPosts.length > 0 ? (
                  <Grid container spacing={3}>
                    {userProfile.jobPosts.map((job) => (
                      <Grid item xs={12} sm={6} key={job._id}>
                        <JobCard job={job} />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      {userProfile.role === 'client' 
                        ? 'No jobs posted yet.' 
                        : 'No job posts available.'}
                    </Typography>
                  </Box>
                )
              ) : (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Portfolio section is coming soon.
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage; 