import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  Button,
  Avatar,
  Paper,
  TextField,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Tooltip,
} from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';

import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/ui/Loading';
import AlertMessage from '../components/ui/AlertMessage';
import EmojiPicker from '../components/ui/EmojiPicker';
import { formatDate, formatCurrency } from '../utils/formatters';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getJob, job, loading, error, isJobBookmarked, toggleBookmark, applyToJob, addComment } = useJobs();
  const { user, isAuthenticated } = useAuth();
  
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    proposedBudget: '',
  });
  const [applyErrors, setApplyErrors] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  
  useEffect(() => {
    loadJobDetails();
  }, [id]);
  
  const loadJobDetails = async () => {
    try {
      await getJob(id);
    } catch (error) {
      setAlertMessage('Failed to load job details');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };
  
  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }
    
    try {
      const result = await toggleBookmark(id);
      setAlertMessage(
        result.isBookmarked 
          ? 'Job added to bookmarks' 
          : 'Job removed from bookmarks'
      );
      setAlertSeverity('success');
      setAlertOpen(true);
    } catch (error) {
      setAlertMessage('Failed to update bookmark');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };
  
  const handleApplyDialogOpen = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }
    
    // Check if user is the job poster
    if (user?._id === job?.postedBy?._id) {
      setAlertMessage("You can't apply to your own job posting");
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }
    
    // Check if job is still open
    if (job?.status !== 'open') {
      setAlertMessage('This job is no longer accepting applications');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }
    
    // Check if user already applied
    const alreadyApplied = job?.applicants?.some(
      (applicant) => applicant.user._id === user?._id
    );
    
    if (alreadyApplied) {
      setAlertMessage('You have already applied to this job');
      setAlertSeverity('info');
      setAlertOpen(true);
      return;
    }
    
    setApplyDialogOpen(true);
  };
  
  const handleApplyDialogClose = () => {
    setApplyDialogOpen(false);
    setApplicationData({
      coverLetter: '',
      proposedBudget: '',
    });
    setApplyErrors({});
  };
  
  const handleApplicationChange = (e) => {
    const { name, value } = e.target;
    setApplicationData({
      ...applicationData,
      [name]: value,
    });
    
    // Clear error when user types
    if (applyErrors[name]) {
      setApplyErrors({
        ...applyErrors,
        [name]: '',
      });
    }
  };
  
  const handleSubmitApplication = async () => {
    // Validate inputs
    const errors = {};
    
    if (!applicationData.coverLetter.trim()) {
      errors.coverLetter = 'Cover letter is required';
    } else if (applicationData.coverLetter.trim().length < 50) {
      errors.coverLetter = 'Cover letter should be at least 50 characters';
    }
    
    if (!applicationData.proposedBudget) {
      errors.proposedBudget = 'Proposed budget is required';
    } else if (isNaN(applicationData.proposedBudget) || Number(applicationData.proposedBudget) <= 0) {
      errors.proposedBudget = 'Proposed budget must be a positive number';
    }
    
    if (Object.keys(errors).length > 0) {
      setApplyErrors(errors);
      return;
    }
    
    try {
      await applyToJob(id, {
        ...applicationData,
        proposedBudget: Number(applicationData.proposedBudget),
      });
      
      handleApplyDialogClose();
      setAlertMessage('Application submitted successfully');
      setAlertSeverity('success');
      setAlertOpen(true);
      loadJobDetails(); // Reload job details to update applicants
    } catch (error) {
      setAlertMessage(error.response?.data?.message || 'Failed to submit application');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };
  
  const handleCommentChange = (value) => {
    setCommentText(value);
  };
  
  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }
    
    if (!commentText.trim()) {
      return;
    }
    
    try {
      await addComment(id, commentText.trim());
      setCommentText('');
      setAlertMessage('Comment added successfully');
      setAlertSeverity('success');
      setAlertOpen(true);
    } catch (error) {
      setAlertMessage('Failed to add comment');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };
  
  if (loading) {
    return <Loading message="Loading job details..." />;
  }
  
  if (error) {
    return (
      <Container maxWidth="md">
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            component={RouterLink}
            to="/jobs"
            sx={{ mt: 2 }}
          >
            Back to Jobs
          </Button>
        </Paper>
      </Container>
    );
  }
  
  if (!job) {
    return (
      <Container maxWidth="md">
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">
            Job not found
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            component={RouterLink}
            to="/jobs"
            sx={{ mt: 2 }}
          >
            Back to Jobs
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        {/* Back button and actions */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              component={RouterLink}
              to="/jobs"
            >
              Back to Jobs
            </Button>
            
            {isAuthenticated && (
              <Button
                startIcon={isJobBookmarked(job._id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                onClick={handleBookmarkToggle}
                color={isJobBookmarked(job._id) ? 'primary' : 'inherit'}
              >
                {isJobBookmarked(job._id) ? 'Bookmarked' : 'Bookmark'}
              </Button>
            )}
          </Box>
        </Grid>
        
        {/* Job details */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h4" component="h1" gutterBottom>
                    {job.title}
                  </Typography>
                  
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip 
                      label={job.status} 
                      color={
                        job.status === 'open' ? 'success' : 
                        job.status === 'in-progress' ? 'warning' : 
                        job.status === 'completed' ? 'info' : 
                        'default'
                      }
                    />
                    
                    <Chip 
                      icon={<CalendarTodayIcon />} 
                      label={`Posted ${formatDate(job.createdAt)}`} 
                      variant="outlined" 
                    />
                  </Stack>
                </Box>
                
                {job.status === 'open' && isAuthenticated && user?._id !== job.postedBy?._id && (
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleApplyDialogOpen}
                  >
                    Apply Now
                  </Button>
                )}
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              {/* Key details */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AttachMoneyIcon color="action" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Budget
                      </Typography>
                      <Typography variant="subtitle1">
                        {formatCurrency(job.budget)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Duration
                      </Typography>
                      <Typography variant="subtitle1">
                        {job.duration}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon color="action" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Location
                      </Typography>
                      <Typography variant="subtitle1">
                        {job.location || 'Remote'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon color="action" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Applicants
                      </Typography>
                      <Typography variant="subtitle1">
                        {job.applicants?.length || 0}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              
              {/* Description */}
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
                {job.description}
              </Typography>
              
              {/* Skills */}
              <Typography variant="h6" gutterBottom>
                Required Skills
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {job.skillsRequired?.map((skill, index) => (
                  <Chip key={index} label={skill} color="primary" variant="outlined" />
                ))}
              </Box>
              
              {/* Tags */}
              {job.tags && job.tags.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Tags
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {job.tags.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" />
                    ))}
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
          
          {/* Comments section */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Comments ({job.comments?.length || 0})
              </Typography>
              
              {isAuthenticated && (
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Avatar 
                    src={user?.profilePicture} 
                    alt={user?.name}
                    sx={{ mr: 2 }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <EmojiPicker
                      value={commentText}
                      onChange={handleCommentChange}
                      placeholder="Add a comment..."
                      multiline
                      rows={2}
                      fullWidth
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<SendIcon />}
                        onClick={handleSubmitComment}
                        disabled={!commentText.trim()}
                      >
                        Post
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              {job.comments && job.comments.length > 0 ? (
                <List>
                  {job.comments.map((comment, index) => (
                    <React.Fragment key={index}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar 
                            src={comment.user?.profilePicture} 
                            alt={comment.user?.name}
                            component={RouterLink}
                            to={`/profile/${comment.user?._id}`}
                            sx={{ cursor: 'pointer' }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography 
                                component={RouterLink}
                                to={`/profile/${comment.user?._id}`}
                                color="inherit"
                                sx={{ textDecoration: 'none', fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}
                              >
                                {comment.user?.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(comment.createdAt)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                              sx={{ display: 'inline', whiteSpace: 'pre-wrap' }}
                            >
                              {comment.text}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < job.comments.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                  No comments yet. Be the first to comment!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Client info */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Posted by
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={job.postedBy?.profilePicture}
                  alt={job.postedBy?.name}
                  component={RouterLink}
                  to={`/profile/${job.postedBy?._id}`}
                  sx={{ width: 56, height: 56, mr: 2, cursor: 'pointer' }}
                />
                <Box>
                  <Typography 
                    variant="subtitle1" 
                    component={RouterLink}
                    to={`/profile/${job.postedBy?._id}`}
                    sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { textDecoration: 'underline' } }}
                  >
                    {job.postedBy?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {job.postedBy?.role === 'client' ? 'Client' : 'Freelancer'}
                  </Typography>
                </Box>
              </Box>
              
              {job.postedBy?.bio && (
                <Typography variant="body2" color="text.secondary" paragraph>
                  {job.postedBy.bio}
                </Typography>
              )}
              
              <Button
                variant="outlined"
                fullWidth
                component={RouterLink}
                to={`/profile/${job.postedBy?._id}`}
              >
                View Profile
              </Button>
            </CardContent>
          </Card>
          
          {/* Similar jobs or other info */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                How to Apply
              </Typography>
              <Typography variant="body2" paragraph>
                1. Review the job requirements carefully
              </Typography>
              <Typography variant="body2" paragraph>
                2. Click the "Apply Now" button above
              </Typography>
              <Typography variant="body2" paragraph>
                3. Write a personalized cover letter
              </Typography>
              <Typography variant="body2" paragraph>
                4. Propose your budget for the project
              </Typography>
              <Typography variant="body2" paragraph>
                5. Submit your application and wait for the client's response
              </Typography>
              
              {job.status === 'open' && (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleApplyDialogOpen}
                  sx={{ mt: 2 }}
                >
                  Apply Now
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Apply dialog */}
      <Dialog
        open={applyDialogOpen}
        onClose={handleApplyDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Apply for: {job.title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                name="coverLetter"
                label="Cover Letter"
                multiline
                rows={6}
                fullWidth
                value={applicationData.coverLetter}
                onChange={handleApplicationChange}
                error={!!applyErrors.coverLetter}
                helperText={applyErrors.coverLetter || "Explain why you're a good fit for this job and your relevant experience"}
                placeholder="Dear hiring manager,

I am writing to express my interest in this job. I have experience in..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="proposedBudget"
                label="Proposed Budget ($)"
                type="number"
                fullWidth
                value={applicationData.proposedBudget}
                onChange={handleApplicationChange}
                error={!!applyErrors.proposedBudget}
                helperText={applyErrors.proposedBudget || `Client's budget: ${formatCurrency(job.budget)}`}
                InputProps={{
                  startAdornment: <AttachMoneyIcon color="action" />,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleApplyDialogClose}>Cancel</Button>
          <Button 
            onClick={handleSubmitApplication} 
            variant="contained" 
            color="primary"
          >
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>
      
      <AlertMessage
        open={alertOpen}
        setOpen={setAlertOpen}
        message={alertMessage}
        severity={alertSeverity}
      />
    </Container>
  );
};

export default JobDetailPage;