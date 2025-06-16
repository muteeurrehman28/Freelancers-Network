import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Divider,
  TextField,
  Slider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Button,
  Chip,
  Stack,
  InputAdornment,
  Autocomplete,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';

const JobFilter = ({ onFilterChange, skills = [] }) => {
  const [filters, setFilters] = useState({
    search: '',
    skillsRequired: [],
    budget: [0, 10000],
    status: ['open']
  });

  const [selectedSkills, setSelectedSkills] = useState([]);
  
  // Common job status options
  const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'closed', label: 'Closed' },
  ];

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleBudgetChange = (event, newValue) => {
    setFilters(prev => ({ ...prev, budget: newValue }));
  };

  const handleStatusChange = (status) => {
    setFilters(prev => {
      const updatedStatus = prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status];
      
      return { ...prev, status: updatedStatus };
    });
  };

  const handleSkillChange = (event, newValue) => {
    setSelectedSkills(newValue);
    setFilters(prev => ({ ...prev, skillsRequired: newValue }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      skillsRequired: [],
      budget: [0, 10000],
      status: ['open']
    });
    setSelectedSkills([]);
  };

  // Format budget values for display
  const formatBudget = (value) => `$${value}`;

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FilterListIcon sx={{ mr: 1 }} color="primary" />
        <Typography variant="h6" component="h2">
          Filter Jobs
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Search field */}
      <TextField
        fullWidth
        label="Search Jobs"
        variant="outlined"
        size="small"
        margin="normal"
        value={filters.search}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {/* Skills filter */}
      <Typography variant="subtitle2" gutterBottom>
        Skills
      </Typography>
      <Autocomplete
        multiple
        size="small"
        options={skills}
        value={selectedSkills}
        onChange={handleSkillChange}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
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
        sx={{ mb: 3 }}
      />

      {/* Budget range slider */}
      <Typography variant="subtitle2" gutterBottom>
        Budget Range
      </Typography>
      <Box sx={{ px: 1 }}>
        <Slider
          value={filters.budget}
          onChange={handleBudgetChange}
          valueLabelDisplay="auto"
          valueLabelFormat={formatBudget}
          min={0}
          max={10000}
          step={100}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {formatBudget(filters.budget[0])}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatBudget(filters.budget[1])}
          </Typography>
        </Box>
      </Box>

      {/* Status checkboxes */}
      <Typography variant="subtitle2" gutterBottom>
        Job Status
      </Typography>
      <FormControl component="fieldset">
        <FormGroup>
          {statusOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  checked={filters.status.includes(option.value)}
                  onChange={() => handleStatusChange(option.value)}
                  size="small"
                />
              }
              label={option.label}
            />
          ))}
        </FormGroup>
      </FormControl>

      {/* Clear filters button */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={handleClearFilters}
        >
          Clear Filters
        </Button>
      </Box>

      {/* Applied filters summary */}
      {(selectedSkills.length > 0 || 
        filters.budget[0] > 0 || 
        filters.budget[1] < 10000 || 
        filters.status.length !== 1 ||
        filters.status[0] !== 'open') && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Applied Filters:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {selectedSkills.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                size="small"
                onDelete={() => {
                  setSelectedSkills(prev => prev.filter(s => s !== skill));
                  setFilters(prev => ({
                    ...prev,
                    skillsRequired: prev.skillsRequired.filter(s => s !== skill),
                  }));
                }}
              />
            ))}
            
            {(filters.budget[0] > 0 || filters.budget[1] < 10000) && (
              <Chip
                label={`Budget: ${formatBudget(filters.budget[0])} - ${formatBudget(filters.budget[1])}`}
                size="small"
                onDelete={() => setFilters(prev => ({ ...prev, budget: [0, 10000] }))}
              />
            )}
            
            {filters.status.map((status) => (
              <Chip
                key={status}
                label={`Status: ${statusOptions.find(o => o.value === status)?.label}`}
                size="small"
                onDelete={() => handleStatusChange(status)}
              />
            ))}
          </Stack>
        </Box>
      )}
    </Paper>
  );
};

export default JobFilter; 