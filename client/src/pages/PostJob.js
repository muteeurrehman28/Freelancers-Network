import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import EmojiPicker from 'emoji-picker-react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Popover,
  Grid,
} from '@mui/material';
import { createJob } from '../redux/slices/jobSlice';
import { SentimentSatisfied as EmojiIcon } from '@mui/icons-material';

const validationSchema = Yup.object({
  title: Yup.string()
    .min(5, 'Title must be at least 5 characters')
    .required('Title is required'),
  description: Yup.string()
    .min(20, 'Description must be at least 20 characters')
    .required('Description is required'),
  budget: Yup.number()
    .min(1, 'Budget must be greater than 0')
    .required('Budget is required'),
  skillsRequired: Yup.array()
    .min(1, 'At least one skill is required')
    .required('Skills are required'),
  category: Yup.string().required('Category is required'),
  experienceLevel: Yup.string().required('Experience level is required'),
  location: Yup.string(),
  isRemote: Yup.boolean(),
});

const PostJob = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.jobs);
  const [anchorEl, setAnchorEl] = useState(null);
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState('');

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      budget: '',
      skillsRequired: [],
      category: '',
      experienceLevel: '',
      location: '',
      isRemote: false,
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(createJob(values));
      navigate('/dashboard');
    },
  });

  const handleEmojiClick = (emojiObject) => {
    const { description } = emojiObject;
    formik.setFieldValue(
      'description',
      formik.values.description + description
    );
    setAnchorEl(null);
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && currentSkill.trim()) {
      e.preventDefault();
      if (!skills.includes(currentSkill.trim())) {
        setSkills([...skills, currentSkill.trim()]);
        formik.setFieldValue('skillsRequired', [...skills, currentSkill.trim()]);
      }
      setCurrentSkill('');
    }
  };

  const handleDeleteSkill = (skillToDelete) => {
    const newSkills = skills.filter((skill) => skill !== skillToDelete);
    setSkills(newSkills);
    formik.setFieldValue('skillsRequired', newSkills);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Post a New Job
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="title"
                name="title"
                label="Job Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ position: 'relative' }}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Job Description"
                  multiline
                  rows={4}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                />
                <IconButton
                  sx={{ position: 'absolute', right: 8, top: 8 }}
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                  <EmojiIcon />
                </IconButton>
                <Popover
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  onClose={() => setAnchorEl(null)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                >
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </Popover>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="budget"
                name="budget"
                label="Budget"
                type="number"
                value={formik.values.budget}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.budget && Boolean(formik.errors.budget)}
                helperText={formik.touched.budget && formik.errors.budget}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.category && Boolean(formik.errors.category)
                  }
                >
                  <MenuItem value="web-development">Web Development</MenuItem>
                  <MenuItem value="mobile-development">
                    Mobile Development
                  </MenuItem>
                  <MenuItem value="design">Design</MenuItem>
                  <MenuItem value="writing">Writing</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="experience-level-label">
                  Experience Level
                </InputLabel>
                <Select
                  labelId="experience-level-label"
                  id="experienceLevel"
                  name="experienceLevel"
                  value={formik.values.experienceLevel}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.experienceLevel &&
                    Boolean(formik.errors.experienceLevel)
                  }
                >
                  <MenuItem value="entry">Entry Level</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="expert">Expert</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="location"
                name="location"
                label="Location"
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.location && Boolean(formik.errors.location)
                }
                helperText={formik.touched.location && formik.errors.location}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Skills Required"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyPress={handleAddSkill}
                helperText="Press Enter to add a skill"
              />
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={() => handleDeleteSkill(skill)}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? 'Posting...' : 'Post Job'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default PostJob; 