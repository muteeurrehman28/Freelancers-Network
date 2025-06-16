import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Chip,
  Divider,
  Autocomplete,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useJobs } from '../context/JobContext';
import { useUsers } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/ui/Loading';
import AlertMessage from '../components/ui/AlertMessage';
import EmojiPicker from '../components/ui/EmojiPicker';
import ProtectedRoute from '../components/ui/ProtectedRoute';
import { validateJobForm } from '../utils/validation';

const CreateJobPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skillsRequired: [],
    budget: '',
    duration: '',
    location: 'Remote',
    tags: [],
  });
  
  const [errors, setErrors] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [skillInput, setSkillInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  
  const { createJob, loading, error } = useJobs();
  const { skills, getAllSkills } = useUsers();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Fetch all skills for dropdown
  useEffect(() => {
    loadSkills();
  }, []);
  
  const loadSkills = async () => {
    try {
      await getAllSkills();
    } catch (error) {
      console.error('Failed to load skills', error);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
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
  
  const handleDescriptionChange = (value) => {
    setFormData({
      ...formData,
      description: value,
    });
    
    // Clear error when user types
    if (errors.description) {
      setErrors({
        ...errors,
        description: '',
      });
    }
  };
  
  const handleSkillsChange = (event, newValue) => {
    setFormData({
      ...formData,
      skillsRequired: newValue,
    });
    
    // Clear error when user selects skills
    if (errors.skillsRequired) {
      setErrors({
        ...errors,
        skillsRequired: '',
      });
    }
  };
  
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    if (!formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
    }
    
    setTagInput('');
  };
  
  const handleDeleteTag = (tagToDelete) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToDelete),
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const validationErrors = validateJobForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      const jobData = {
        ...formData,
        budget: Number(formData.budget),
      };
      
      const result = await createJob(jobData);
      
      setAlertMessage('Job posted successfully!');
      setAlertSeverity('success');
      setAlertOpen(true);
      
      // Short timeout to show success message before redirect
      setTimeout(() => {
        navigate(`/jobs/${result._id}`);
      }, 1500);
    } catch (error) {
      setAlertMessage(error.response?.data?.message || 'Failed to create job. Please try again.');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };
  
  const durationOptions = [
    'Less than 1 week',
    '1-2 weeks',
    '2-4 weeks',
    '1-3 months',
    '3-6 months',
    '6+ months',
  ];
  
  const locationOptions = [
    'Remote',
    'On-site',
    'Hybrid',
  ];

  return (
    <ProtectedRoute>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Post a New Job
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Fill in the details below to post a new job and find talented freelancers.
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              {/* Job Title */}
              <Grid item xs={12}>
                <TextField
                  name="title"
                  label="Job Title"
                  value={formData.title}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.title}
                  helperText={errors.title || 'Enter a clear, specific title for your job'}
                  placeholder="e.g. React Developer for E-commerce Website"
                />
              </Grid>
              
              {/* Description */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Job Description
                </Typography>
                <EmojiPicker
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  placeholder="Describe the project, requirements, and expectations in detail..."
                  multiline
                  rows={8}
                  fullWidth
                  required
                  label="Job Description"
                />
                {errors.description && (
                  <Typography variant="caption" color="error" sx={{ pl: 1.5 }}>
                    {errors.description}
                  </Typography>
                )}
              </Grid>
              
              {/* Required Skills */}
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  id="skillsRequired"
                  options={skills || []}
                  value={formData.skillsRequired}
                  onChange={handleSkillsChange}
                  inputValue={skillInput}
                  onInputChange={(event, newInputValue) => {
                    setSkillInput(newInputValue);
                  }}
                  freeSolo
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        {...getTagProps({ index })}
                        color="primary"
                        variant="outlined"
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Required Skills"
                      placeholder="Add skills"
                      error={!!errors.skillsRequired}
                      helperText={errors.skillsRequired || 'Add skills that are required for the job'}
                    />
                  )}
                />
              </Grid>
              
              {/* Budget */}
              <Grid item xs={12} sm={6}>
                <TextField
                  name="budget"
                  label="Budget ($)"
                  type="number"
                  value={formData.budget}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.budget}
                  helperText={errors.budget || 'Enter the expected budget for the project'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              {/* Duration */}
              <Grid item xs={12} sm={6}>
                <TextField
                  name="duration"
                  label="Expected Duration"
                  select
                  value={formData.duration}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.duration}
                  helperText={errors.duration || 'Select the expected duration of the project'}
                >
                  {durationOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              {/* Location */}
              <Grid item xs={12} sm={6}>
                <TextField
                  name="location"
                  label="Location"
                  select
                  value={formData.location}
                  onChange={handleChange}
                  fullWidth
                  helperText="Select the work location for this job"
                >
                  {locationOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              {/* Tags */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex' }}>
                  <TextField
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    label="Tags"
                    placeholder="Add tags"
                    fullWidth
                    helperText="Press Enter to add tags"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddTag}
                    sx={{ ml: 1, mt: 1 }}
                  >
                    Add
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                  {formData.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleDeleteTag(tag)}
                      size="small"
                    />
                  ))}
                </Box>
              </Grid>
              
              {/* Submit Button */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/jobs')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                  >
                    {loading ? 'Posting...' : 'Post Job'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
        
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

export default CreateJobPage; 