import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Chip,
  Button,
  Paper,
  TextField,
  Autocomplete,
  Divider,
  Pagination,
  InputAdornment,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonIcon from '@mui/icons-material/Person';

import { useUsers } from '../context/UserContext';
import Loading from '../components/ui/Loading';
import AlertMessage from '../components/ui/AlertMessage';

const FreelancersPage = () => {
  const [filters, setFilters] = useState({
    search: '',
    skills: [],
    page: 1,
    limit: 8
  });
  
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  
  const { getFreelancers, freelancers, skills, pagination, loading, error, getAllSkills } = useUsers();
  
  const loadFreelancers = useCallback(async () => {
    try {
      await getFreelancers(filters);
    } catch (error) {
      setAlertMessage('Failed to load freelancers');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  }, [filters, getFreelancers, setAlertMessage, setAlertSeverity, setAlertOpen]);
  
  const loadSkills = useCallback(async () => {
    try {
      await getAllSkills();
    } catch (error) {
      console.error('Failed to load skills', error);
    }
  }, [getAllSkills]);
  
  // Load initial data
  useEffect(() => {
    loadFreelancers();
  }, [filters.page, loadFreelancers]);
  
  useEffect(() => {
    loadSkills();
  }, [loadSkills]);
  
  const handleSearchChange = (e) => {
    setFilters({
      ...filters,
      search: e.target.value,
      page: 1 // Reset to first page on search change
    });
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadFreelancers();
  };
  
  const handleSkillsChange = (event, newValue) => {
    setSelectedSkills(newValue);
    setFilters({
      ...filters,
      skills: newValue,
      page: 1 // Reset to first page on filter change
    });
    loadFreelancers();
  };
  
  const handlePageChange = (event, value) => {
    setFilters({
      ...filters,
      page: value
    });
  };
  
  const clearFilters = () => {
    setFilters({
      search: '',
      skills: [],
      page: 1,
      limit: 8
    });
    setSelectedSkills([]);
    loadFreelancers();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Find Talented Freelancers
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse our community of professional freelancers and find the perfect match for your project
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* Sidebar with filters */}
        <Grid item xs={12} md={3}>
          <Paper elevation={1} sx={{ p: 3, mb: { xs: 3, md: 0 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FilterListIcon sx={{ mr: 1 }} color="primary" />
              <Typography variant="h6" component="h2">
                Filter Freelancers
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            {/* Search field */}
            <Box component="form" onSubmit={handleSearchSubmit} sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Search Freelancers"
                variant="outlined"
                size="small"
                value={filters.search}
                onChange={handleSearchChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        edge="end" 
                        type="submit"
                        aria-label="search"
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
            {/* Skills filter */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Skills
              </Typography>
              <Autocomplete
                multiple
                id="skills-filter"
                options={skills || []}
                value={selectedSkills}
                onChange={handleSkillsChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    size="small"
                    placeholder="Select skills"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      size="small"
                      {...getTagProps({ index })}
                    />
                  ))
                }
              />
            </Box>
            
            {/* Clear filters button */}
            <Button
              variant="outlined"
              fullWidth
              onClick={clearFilters}
              disabled={!filters.search && selectedSkills.length === 0}
            >
              Clear Filters
            </Button>
          </Paper>
        </Grid>
        
        {/* Main content */}
        <Grid item xs={12} md={9}>
          {loading ? (
            <Loading message="Loading freelancers..." />
          ) : error ? (
            <AlertMessage
              open={true}
              setOpen={() => {}}
              message={error}
              severity="error"
            />
          ) : freelancers.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <PersonIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No freelancers found
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Try adjusting your search criteria
              </Typography>
              <Button variant="outlined" onClick={clearFilters}>
                Clear Filters
              </Button>
            </Paper>
          ) : (
            <>
              {/* Results count */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {freelancers.length} of {pagination.total} freelancers
                </Typography>
                {(filters.search || selectedSkills.length > 0) && (
                  <Button variant="text" size="small" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </Box>
              
              {/* Freelancers grid */}
              <Grid container spacing={3}>
                {freelancers.map((freelancer) => (
                  <Grid item xs={12} sm={6} key={freelancer._id}>
                    <Card elevation={1} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar
                            src={freelancer.profilePicture}
                            alt={freelancer.name}
                            sx={{ width: 64, height: 64, mr: 2 }}
                          />
                          <Box>
                            <Typography variant="h6" component="h3" gutterBottom>
                              {freelancer.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Freelancer
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Divider sx={{ mb: 2 }} />
                        
                        <Typography variant="body2" sx={{ mb: 2, minHeight: 60 }}>
                          {freelancer.bio
                            ? freelancer.bio.length > 120
                              ? `${freelancer.bio.substring(0, 120)}...`
                              : freelancer.bio
                            : 'No bio provided.'}
                        </Typography>
                        
                        <Typography variant="subtitle2" gutterBottom>
                          Skills:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {freelancer.skills && freelancer.skills.length > 0 ? (
                            freelancer.skills.slice(0, 5).map((skill, index) => (
                              <Chip key={index} label={skill} size="small" variant="outlined" />
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No skills listed
                            </Typography>
                          )}
                          {freelancer.skills && freelancer.skills.length > 5 && (
                            <Chip 
                              label={`+${freelancer.skills.length - 5} more`} 
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                        <Button
                          variant="outlined"
                          component={RouterLink}
                          to={`/profile/${freelancer._id}`}
                        >
                          View Profile
                        </Button>
                      </CardActions>
                    </Card>
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

export default FreelancersPage; 