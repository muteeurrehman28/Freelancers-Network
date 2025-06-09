import React, { useState } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  Drawer,
  Typography,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const SearchBar = ({ onSearch, onFilter }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    experienceLevel: [],
    categories: [],
    skills: [],
    isRemote: false,
  });

  const categories = [
    'Web Development',
    'Mobile Development',
    'Design',
    'Writing',
    'Marketing',
    'Data Science',
  ];

  const experienceLevels = ['Entry Level', 'Intermediate', 'Expert'];

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleApplyFilters = () => {
    onFilter(filters);
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      experienceLevel: [],
      categories: [],
      skills: [],
      isRemote: false,
    });
  };

  return (
    <>
      <Paper
        component="form"
        onSubmit={handleSearch}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          mb: 3,
          borderRadius: 2,
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search jobs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <IconButton
          type="button"
          sx={{ p: '10px' }}
          onClick={() => setIsFilterOpen(true)}
        >
          <FilterIcon />
        </IconButton>
        <IconButton type="submit" sx={{ p: '10px' }}>
          <SearchIcon />
        </IconButton>
      </Paper>

      <Drawer
        anchor="right"
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      >
        <Box sx={{ width: 300, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setIsFilterOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Typography gutterBottom>Price Range</Typography>
          <Slider
            value={filters.priceRange}
            onChange={(e, newValue) => handleFilterChange('priceRange', newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={1000}
            sx={{ mb: 3 }}
          />

          <Typography gutterBottom>Experience Level</Typography>
          <FormGroup sx={{ mb: 3 }}>
            {experienceLevels.map((level) => (
              <FormControlLabel
                key={level}
                control={
                  <Checkbox
                    checked={filters.experienceLevel.includes(level)}
                    onChange={(e) => {
                      const newLevels = e.target.checked
                        ? [...filters.experienceLevel, level]
                        : filters.experienceLevel.filter((l) => l !== level);
                      handleFilterChange('experienceLevel', newLevels);
                    }}
                  />
                }
                label={level}
              />
            ))}
          </FormGroup>

          <Typography gutterBottom>Categories</Typography>
          <FormGroup sx={{ mb: 3 }}>
            {categories.map((category) => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    checked={filters.categories.includes(category)}
                    onChange={(e) => {
                      const newCategories = e.target.checked
                        ? [...filters.categories, category]
                        : filters.categories.filter((c) => c !== category);
                      handleFilterChange('categories', newCategories);
                    }}
                  />
                }
                label={category}
              />
            ))}
          </FormGroup>

          <FormControlLabel
            control={
              <Checkbox
                checked={filters.isRemote}
                onChange={(e) => handleFilterChange('isRemote', e.target.checked)}
              />
            }
            label="Remote Only"
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={handleResetFilters} variant="outlined">
              Reset
            </Button>
            <Button onClick={handleApplyFilters} variant="contained">
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default SearchBar; 