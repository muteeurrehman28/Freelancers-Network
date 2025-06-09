import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Work as WorkIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
} from '@mui/icons-material';
import { fetchJobById, bookmarkJob, unbookmarkJob } from '../redux/slices/jobSlice';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentJob: job, loading, error } = useSelector((state) => state.jobs);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [proposal, setProposal] = useState('');

  useEffect(() => {
    dispatch(fetchJobById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (job && user) {
      setIsBookmarked(job.bookmarkedBy?.includes(user._id));
    }
  }, [job, user]);

  const handleBookmark = () => {
    if (isBookmarked) {
      dispatch(unbookmarkJob(job._id));
    } else {
      dispatch(bookmarkJob(job._id));
    }
    setIsBookmarked(!isBookmarked);
  };

  const handleApply = () => {
    // TODO: Implement job application logic
    setApplyDialogOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">Job not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {job.title}
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              onClick={handleBookmark}
              sx={{ mr: 2 }}
            >
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </Button>
            {user?.role === 'freelancer' && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setApplyDialogOpen(true)}
              >
                Apply Now
              </Button>
            )}
          </Box>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MoneyIcon sx={{ mr: 1 }} />
              <Typography variant="body1">
                Budget: ${job.budget}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WorkIcon sx={{ mr: 1 }} />
              <Typography variant="body1">
                Experience: {job.experienceLevel}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationIcon sx={{ mr: 1 }} />
              <Typography variant="body1">
                {job.isRemote ? 'Remote' : job.location}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Description
        </Typography>
        <Typography variant="body1" paragraph>
          {job.description}
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Required Skills
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 4 }}>
          {job.skillsRequired.map((skill) => (
            <Chip key={skill} label={skill} color="primary" />
          ))}
        </Box>

        <Typography variant="h6" gutterBottom>
          Posted by
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="body1">
            {job.client?.username || 'Anonymous'}
          </Typography>
        </Box>
      </Paper>

      <Dialog open={applyDialogOpen} onClose={() => setApplyDialogOpen(false)}>
        <DialogTitle>Apply for {job.title}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Your Proposal"
            fullWidth
            multiline
            rows={4}
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplyDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleApply} variant="contained" color="primary">
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default JobDetails; 