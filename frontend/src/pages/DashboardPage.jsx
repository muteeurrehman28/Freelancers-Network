import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tab,
  Tabs,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Chip,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Tooltip,
  IconButton,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import WorkIcon from '@mui/icons-material/Work';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';

import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';
import { useUsers } from '../context/UserContext';
import ProtectedRoute from '../components/ui/ProtectedRoute';
import Loading from '../components/ui/Loading';
import AlertMessage from '../components/ui/AlertMessage';
import JobCard from '../components/jobs/JobCard';
import { formatDate, formatCurrency, formatApplicationStatus } from '../utils/formatters';
import { validateProfileForm } from '../utils/validation';

const DashboardPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    skills: [],
    profilePicture: '',
    password: '',
    confirmPassword: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  const { user, updateProfile, isAuthenticated, loading: authLoading } = useAuth();
  const { 
    getUserApplications, 
    getUserPostedJobs, 
    updateApplicationStatus, 
    applications, 
    postedJobs, 
    loading: userLoading 
  } = useUsers();
  const { 
    getBookmarkedJobs, 
    bookmarkedJobs, 
    toggleBookmark, 
    isJobBookmarked,
    loading: jobLoading 
  } = useJobs();
  
  const navigate = useNavigate();
  
  const loading = authLoading || userLoading || jobLoading;

  useEffect(() => {
    if (isAuthenticated) {
      loadUserData();
      
      // Initialize profile data from user info
      if (user) {
        setProfileData({
          name: user.name || '',
          email: user.email || '',
          bio: user.bio || '',
          skills: user.skills || [],
          profilePicture: user.profilePicture || '',
          password: '',
          confirmPassword: '',
        });
      }
    }
  }, [isAuthenticated, user]);

  const loadUserData = async () => {
    try {
      // Load different data based on user role
      if (user.role === 'freelancer') {
        await getUserApplications();
      } else {
        await getUserPostedJobs();
      }
      
      // Load bookmarked jobs for both roles
      await getBookmarkedJobs();
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleToggleEditMode = () => {
    setEditMode(!editMode);
    if (editMode) {
      // Reset form when canceling edit
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        skills: user.skills || [],
        profilePicture: user.profilePicture || '',
        password: '',
        confirmPassword: '',
      });
      setErrors({});
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    
    if (!profileData.skills.includes(skillInput.trim())) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, skillInput.trim()],
      });
    }
    
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleSaveProfile = async () => {
    // Validate form data
    const validationErrors = validateProfileForm(profileData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      // Only include password if it was changed
      const dataToUpdate = { ...profileData };
      if (!dataToUpdate.password) {
        delete dataToUpdate.password;
      }
      delete dataToUpdate.confirmPassword;
      
      await updateProfile(dataToUpdate);
      
      setEditMode(false);
      setAlertMessage('Profile updated successfully');
      setAlertSeverity('success');
      setAlertOpen(true);
    } catch (error) {
      setAlertMessage(error.response?.data?.message || 'Failed to update profile');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleUpdateApplicationStatus = async (jobId, userId, status) => {
    try {
      await updateApplicationStatus(jobId, userId, status);
      
      // Reload posted jobs to reflect changes
      await getUserPostedJobs();
      
      setAlertMessage(`Application marked as ${status}`);
      setAlertSeverity('success');
      setAlertOpen(true);
    } catch (error) {
      setAlertMessage('Failed to update application status');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleBookmarkToggle = async (jobId) => {
    try {
      const result = await toggleBookmark(jobId);
      
      setAlertMessage(
        result.isBookmarked 
          ? 'Job added to bookmarks' 
          : 'Job removed from bookmarks'
      );
      setAlertSeverity('success');
      setAlertOpen(true);
      
      // Reload bookmarks
      await getBookmarkedJobs();
    } catch (error) {
      setAlertMessage('Failed to update bookmark');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  if (!isAuthenticated) {
    return null; // ProtectedRoute will handle redirect
  }

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  return (
    <ProtectedRoute>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                mb: 3,
                background: 'linear-gradient(to right, #2196f3, #21cbf3)',
                color: 'white',
              }}
            >
              <Typography variant="h4" gutterBottom>
                Dashboard
              </Typography>
              <Typography variant="body1">
                Welcome back, {user?.name}! Manage your {user?.role === 'freelancer' ? 'applications' : 'job postings'} and profile.
              </Typography>
            </Paper>
          </Grid>

          {/* Tabs Navigation */}
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ mb: 3 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                <Tab label="Profile" icon={<PersonIcon />} iconPosition="start" />
                {user?.role === 'freelancer' ? (
                  <Tab label="My Applications" icon={<SendIcon />} iconPosition="start" />
                ) : (
                  <Tab label="My Job Posts" icon={<WorkIcon />} iconPosition="start" />
                )}
                <Tab label="Bookmarks" icon={<BookmarkIcon />} iconPosition="start" />
              </Tabs>
            </Paper>
          </Grid>

          {/* Tab Content */}
          <Grid item xs={12}>
            {/* Profile Tab */}
            {tabValue === 0 && (
              <Paper elevation={1} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5">Profile Information</Typography>
                  <Button
                    variant={editMode ? "outlined" : "contained"}
                    color={editMode ? "secondary" : "primary"}
                    startIcon={editMode ? null : <EditIcon />}
                    onClick={handleToggleEditMode}
                  >
                    {editMode ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </Box>

                <Grid container spacing={3}>
                  {/* Avatar Section */}
                  <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
                    <Avatar
                      src={user?.profilePicture}
                      alt={user?.name}
                      sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                    />
                    
                    {editMode && (
                      <TextField
                        name="profilePicture"
                        label="Profile Picture URL"
                        value={profileData.profilePicture}
                        onChange={handleProfileChange}
                        fullWidth
                        margin="normal"
                        error={!!errors.profilePicture}
                        helperText={errors.profilePicture}
                      />
                    )}
                    
                    <Box sx={{ mt: 2 }}>
                      <Chip 
                        label={user?.role === 'freelancer' ? 'Freelancer' : 'Client'} 
                        color="primary" 
                      />
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Member since {user?.createdAt ? formatDate(user.createdAt) : 'Unknown'}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Profile Details */}
                  <Grid item xs={12} md={9}>
                    {editMode ? (
                      <Box component="form">
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              name="name"
                              label="Full Name"
                              value={profileData.name}
                              onChange={handleProfileChange}
                              fullWidth
                              required
                              error={!!errors.name}
                              helperText={errors.name}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <TextField
                              name="email"
                              label="Email Address"
                              value={profileData.email}
                              onChange={handleProfileChange}
                              fullWidth
                              required
                              error={!!errors.email}
                              helperText={errors.email}
                            />
                          </Grid>
                          
                          <Grid item xs={12}>
                            <TextField
                              name="bio"
                              label="Bio"
                              value={profileData.bio}
                              onChange={handleProfileChange}
                              fullWidth
                              multiline
                              rows={4}
                              placeholder="Tell clients about yourself and your expertise..."
                            />
                          </Grid>

                          {user?.role === 'freelancer' && (
                            <Grid item xs={12}>
                              <Typography variant="subtitle2" gutterBottom>
                                Skills
                              </Typography>
                              <Box sx={{ display: 'flex', mb: 1 }}>
                                <TextField
                                  value={skillInput}
                                  onChange={(e) => setSkillInput(e.target.value)}
                                  placeholder="Add a skill"
                                  fullWidth
                                  size="small"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleAddSkill();
                                    }
                                  }}
                                />
                                <Button
                                  variant="contained"
                                  onClick={handleAddSkill}
                                  sx={{ ml: 1 }}
                                >
                                  Add
                                </Button>
                              </Box>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {profileData.skills.map((skill) => (
                                  <Chip
                                    key={skill}
                                    label={skill}
                                    onDelete={() => handleRemoveSkill(skill)}
                                    color="primary"
                                    variant="outlined"
                                  />
                                ))}
                              </Box>
                            </Grid>
                          )}
                          
                          <Grid item xs={12} sm={6}>
                            <TextField
                              name="password"
                              label="New Password"
                              type="password"
                              value={profileData.password}
                              onChange={handleProfileChange}
                              fullWidth
                              error={!!errors.password}
                              helperText={errors.password || 'Leave blank to keep current password'}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <TextField
                              name="confirmPassword"
                              label="Confirm New Password"
                              type="password"
                              value={profileData.confirmPassword}
                              onChange={handleProfileChange}
                              fullWidth
                              error={!!errors.confirmPassword}
                              helperText={errors.confirmPassword}
                              disabled={!profileData.password}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sx={{ mt: 2, textAlign: 'right' }}>
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<SaveIcon />}
                              onClick={handleSaveProfile}
                            >
                              Save Changes
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>
                    ) : (
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {user?.name}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {user?.email}
                        </Typography>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Typography variant="subtitle1" gutterBottom>
                          Bio
                        </Typography>
                        <Typography variant="body1" paragraph>
                          {user?.bio || 'No bio provided. Edit your profile to add one.'}
                        </Typography>
                        
                        {user?.role === 'freelancer' && (
                          <>
                            <Typography variant="subtitle1" gutterBottom>
                              Skills
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {user?.skills && user.skills.length > 0 ? (
                                user.skills.map((skill, index) => (
                                  <Chip key={index} label={skill} color="primary" variant="outlined" />
                                ))
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  No skills added. Edit your profile to add skills.
                                </Typography>
                              )}
                            </Box>
                          </>
                        )}
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Applications Tab (Freelancer) */}
            {tabValue === 1 && user?.role === 'freelancer' && (
              <Paper elevation={1} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  My Applications
                </Typography>
                
                {applications.length === 0 ? (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    You haven't applied to any jobs yet. Browse available jobs to start applying.
                  </Alert>
                ) : (
                  <List>
                    {applications.map((item, index) => (
                      <React.Fragment key={index}>
                        <ListItem
                          alignItems="flex-start"
                          sx={{ 
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            mb: 2,
                            flexDirection: { xs: 'column', sm: 'row' }
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography
                                variant="h6"
                                component={RouterLink}
                                to={`/jobs/${item.job._id}`}
                                sx={{
                                  color: 'text.primary',
                                  textDecoration: 'none',
                                  '&:hover': { textDecoration: 'underline' },
                                }}
                              >
                                {item.job.title}
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1 }}>
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      Client:
                                    </Typography>
                                    <Typography variant="body2">
                                      {item.job.postedBy?.name || 'Unknown'}
                                    </Typography>
                                  </Box>
                                  
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      Job Budget:
                                    </Typography>
                                    <Typography variant="body2">
                                      {formatCurrency(item.job.budget)}
                                    </Typography>
                                  </Box>
                                  
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      Your Proposal:
                                    </Typography>
                                    <Typography variant="body2">
                                      {formatCurrency(item.application.proposedBudget)}
                                    </Typography>
                                  </Box>
                                  
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      Applied:
                                    </Typography>
                                    <Typography variant="body2">
                                      {formatDate(item.application.submittedAt)}
                                    </Typography>
                                  </Box>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                                  <Chip
                                    label={`Job: ${item.job.status}`}
                                    color={
                                      item.job.status === 'open' ? 'success' : 
                                      item.job.status === 'in-progress' ? 'warning' : 
                                      item.job.status === 'completed' ? 'info' : 
                                      'default'
                                    }
                                    size="small"
                                  />
                                  
                                  <Chip
                                    label={`Application: ${item.application.status}`}
                                    color={
                                      item.application.status === 'accepted' ? 'success' : 
                                      item.application.status === 'rejected' ? 'error' : 
                                      'warning'
                                    }
                                    size="small"
                                  />
                                </Box>
                              </Box>
                            }
                            sx={{ width: '100%' }}
                          />
                          
                          <Box sx={{ display: 'flex', mt: { xs: 2, sm: 0 }, alignSelf: { xs: 'flex-end', sm: 'center' } }}>
                            <Button
                              variant="outlined"
                              component={RouterLink}
                              to={`/jobs/${item.job._id}`}
                            >
                              View Job
                            </Button>
                          </Box>
                        </ListItem>
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Paper>
            )}

            {/* Job Posts Tab (Client) */}
            {tabValue === 1 && user?.role === 'client' && (
              <Paper elevation={1} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5">
                    My Job Posts
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to="/create-job"
                  >
                    Post New Job
                  </Button>
                </Box>
                
                {postedJobs.length === 0 ? (
                  <Alert severity="info">
                    You haven't posted any jobs yet. Create your first job to find freelancers.
                  </Alert>
                ) : (
                  <Grid container spacing={3}>
                    {postedJobs.map((job) => (
                      <Grid item xs={12} key={job._id}>
                        <Card elevation={1}>
                          <CardContent>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={8}>
                                <Typography 
                                  variant="h6" 
                                  component={RouterLink} 
                                  to={`/jobs/${job._id}`}
                                  sx={{ 
                                    textDecoration: 'none',
                                    color: 'text.primary',
                                    '&:hover': { textDecoration: 'underline' } 
                                  }}
                                >
                                  {job.title}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                  <Chip 
                                    label={job.status} 
                                    color={
                                      job.status === 'open' ? 'success' : 
                                      job.status === 'in-progress' ? 'warning' : 
                                      job.status === 'completed' ? 'info' : 
                                      'default'
                                    }
                                    size="small"
                                  />
                                  <Chip 
                                    label={`Budget: ${formatCurrency(job.budget)}`} 
                                    variant="outlined" 
                                    size="small"
                                  />
                                  <Chip 
                                    label={`${job.applicants.length} Applicant(s)`} 
                                    variant="outlined" 
                                    size="small"
                                  />
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Button
                                  variant="outlined"
                                  component={RouterLink}
                                  to={`/jobs/${job._id}`}
                                  sx={{ mr: 1 }}
                                >
                                  View
                                </Button>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => navigate(`/jobs/${job._id}`)}
                                >
                                  Manage
                                </Button>
                              </Grid>
                            </Grid>
                            
                            {job.applicants.length > 0 && (
                              <>
                                <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                                  Applicants:
                                </Typography>
                                <List>
                                  {job.applicants.map((applicant) => (
                                    <ListItem 
                                      key={applicant.user._id}
                                      sx={{ 
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 1,
                                        mb: 1
                                      }}
                                    >
                                      <ListItemAvatar>
                                        <Avatar 
                                          src={applicant.user.profilePicture} 
                                          alt={applicant.user.name} 
                                          component={RouterLink}
                                          to={`/profile/${applicant.user._id}`}
                                          sx={{ cursor: 'pointer' }}
                                        />
                                      </ListItemAvatar>
                                      <ListItemText
                                        primary={
                                          <Typography 
                                            component={RouterLink}
                                            to={`/profile/${applicant.user._id}`}
                                            sx={{ 
                                              textDecoration: 'none',
                                              color: 'text.primary',
                                              '&:hover': { textDecoration: 'underline' }
                                            }}
                                          >
                                            {applicant.user.name}
                                          </Typography>
                                        }
                                        secondary={
                                          <Box>
                                            <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                                              <Typography variant="body2">
                                                Proposed: {formatCurrency(applicant.proposedBudget)}
                                              </Typography>
                                              <Typography variant="body2">
                                                Applied: {formatDate(applicant.submittedAt)}
                                              </Typography>
                                            </Box>
                                            <Typography 
                                              variant="body2" 
                                              color="text.secondary"
                                              sx={{ 
                                                mt: 0.5,
                                                display: '-webkit-box',
                                                overflow: 'hidden',
                                                WebkitBoxOrient: 'vertical',
                                                WebkitLineClamp: 2
                                              }}
                                            >
                                              {applicant.coverLetter}
                                            </Typography>
                                          </Box>
                                        }
                                      />
                                      <Box>
                                        <Chip 
                                          label={applicant.status} 
                                          color={
                                            applicant.status === 'accepted' ? 'success' : 
                                            applicant.status === 'rejected' ? 'error' : 
                                            'warning'
                                          }
                                          size="small"
                                          sx={{ mr: 1 }}
                                        />
                                        
                                        {job.status === 'open' && (
                                          <Box sx={{ display: 'flex', mt: 1 }}>
                                            {applicant.status === 'pending' && (
                                              <>
                                                <Button
                                                  variant="outlined"
                                                  color="success"
                                                  size="small"
                                                  onClick={() => handleUpdateApplicationStatus(job._id, applicant.user._id, 'accepted')}
                                                  sx={{ mr: 1 }}
                                                >
                                                  Accept
                                                </Button>
                                                <Button
                                                  variant="outlined"
                                                  color="error"
                                                  size="small"
                                                  onClick={() => handleUpdateApplicationStatus(job._id, applicant.user._id, 'rejected')}
                                                >
                                                  Reject
                                                </Button>
                                              </>
                                            )}
                                          </Box>
                                        )}
                                      </Box>
                                    </ListItem>
                                  ))}
                                </List>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Paper>
            )}

            {/* Bookmarks Tab */}
            {tabValue === 2 && (
              <Paper elevation={1} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Bookmarked Jobs
                </Typography>
                
                {bookmarkedJobs.length === 0 ? (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    You haven't bookmarked any jobs yet. Browse jobs and bookmark those you're interested in.
                  </Alert>
                ) : (
                  <Grid container spacing={3}>
                    {bookmarkedJobs.map((job) => (
                      <Grid item xs={12} sm={6} md={4} key={job._id}>
                        <JobCard
                          job={job}
                          isBookmarked={isJobBookmarked(job._id)}
                          onBookmark={handleBookmarkToggle}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Paper>
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
    </ProtectedRoute>
  );
};

export default DashboardPage; 