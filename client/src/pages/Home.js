import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Slider,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { fetchJobs } from '../redux/slices/jobSlice';
import JobCard from '../components/jobs/JobCard';

const Home = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { jobs, loading, error } = useSelector((state) => state.jobs);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    skills: searchParams.get('skills')?.split(',') || [],
    minBudget: searchParams.get('minBudget') || '',
    maxBudget: searchParams.get('maxBudget') || '',
    category: searchParams.get('category') || '',
    experienceLevel: searchParams.get('experienceLevel') || '',
    isRemote: searchParams.get('isRemote') === 'true',
  });

  useEffect(() => {
    dispatch(fetchJobs(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value };
      setSearchParams(newFilters);
      return newFilters;
    });
  };

  const handleSkillsChange = (event) => {
    const value = event.target.value;
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        skills: typeof value === 'string' ? value.split(',') : value,
      };
      setSearchParams(newFilters);
      return newFilters;
    });
  };

  const handleBudgetChange = (event, newValue) => {
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        minBudget: newValue[0],
        maxBudget: newValue[1],
      };
      setSearchParams(newFilters);
      return newFilters;
    });
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      skills: [],
      minBudget: '',
      maxBudget: '',
      category: '',
      experienceLevel: '',
      isRemote: false,
    });
    setSearchParams({});
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>

            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Search"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                size="small"
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Skills</InputLabel>
                <Select
                  multiple
                  value={filters.skills}
                  onChange={handleSkillsChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {['React', 'Node.js', 'Python', 'Java', 'JavaScript'].map(
                    (skill) => (
                      <MenuItem key={skill} value={skill}>
                        {skill}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>Budget Range</Typography>
              <Slider
                value={[filters.minBudget || 0, filters.maxBudget || 1000]}
                onChange={handleBudgetChange}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
                step={100}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">
                  ${filters.minBudget || 0}
                </Typography>
                <Typography variant="body2">
                  ${filters.maxBudget || 1000}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange('category', e.target.value)
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="web-development">Web Development</MenuItem>
                  <MenuItem value="mobile-development">
                    Mobile Development
                  </MenuItem>
                  <MenuItem value="design">Design</MenuItem>
                  <MenuItem value="writing">Writing</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Experience Level</InputLabel>
                <Select
                  value={filters.experienceLevel}
                  onChange={(e) =>
                    handleFilterChange('experienceLevel', e.target.value)
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="entry">Entry Level</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="expert">Expert</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.isRemote}
                    onChange={(e) =>
                      handleFilterChange('isRemote', e.target.checked)
                    }
                  />
                }
                label="Remote Only"
              />
            </Box>

            <Button
              fullWidth
              variant="outlined"
              onClick={handleClearFilters}
              sx={{ mt: 2 }}
            >
              Clear Filters
            </Button>
          </Paper>
        </Grid>

        {/* Job Listings */}
        <Grid item xs={12} md={9}>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <Grid container spacing={3}>
              {jobs.map((job) => (
                <Grid item xs={12} sm={6} md={4} key={job._id}>
                  <JobCard job={job} />
                </Grid>
              ))}
              {jobs.length === 0 && (
                <Grid item xs={12}>
                  <Typography align="center" color="text.secondary">
                    No jobs found matching your criteria
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home; 