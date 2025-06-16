import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Avatar,
  Stack,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { formatDistanceToNow } from 'date-fns';

const JobCard = ({ job, isBookmarked, onBookmark }) => {
  // Format the date
  const formattedDate = job.createdAt
    ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })
    : 'Recently';

  return (
    <Card 
      elevation={1}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              alt={job.postedBy?.name || 'User'} 
              src={job.postedBy?.profilePicture}
              component={RouterLink}
              to={`/profile/${job.postedBy?._id}`}
              sx={{ mr: 2, cursor: 'pointer' }}
            />
            <Box>
              <Typography 
                variant="body2" 
                color="text.secondary"
                component={RouterLink}
                to={`/profile/${job.postedBy?._id}`}
                sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { textDecoration: 'underline' } }}
              >
                {job.postedBy?.name || 'Unknown User'}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                {formattedDate}
              </Typography>
            </Box>
          </Box>
          <Tooltip title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}>
            <IconButton 
              size="small" 
              onClick={() => onBookmark(job._id)}
              color={isBookmarked ? "primary" : "default"}
            >
              {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          </Tooltip>
        </Box>

        <Typography 
          variant="h6" 
          component={RouterLink} 
          to={`/jobs/${job._id}`}
          sx={{ 
            textDecoration: 'none', 
            color: 'text.primary',
            '&:hover': { color: 'primary.main' },
            mb: 1,
            display: 'block'
          }}
        >
          {job.title}
        </Typography>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
          }}
        >
          {job.description}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AttachMoneyIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              ${job.budget}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {job.duration}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {job.location}
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {job.skillsRequired && job.skillsRequired.slice(0, 3).map((skill, index) => (
            <Chip 
              key={index} 
              label={skill} 
              size="small" 
              variant="outlined" 
              color="primary"
            />
          ))}
          {job.skillsRequired && job.skillsRequired.length > 3 && (
            <Chip 
              label={`+${job.skillsRequired.length - 3} more`} 
              size="small" 
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>

      <Divider />
      
      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Box>
          <Chip 
            label={job.status} 
            size="small" 
            color={
              job.status === 'open' ? 'success' : 
              job.status === 'in-progress' ? 'warning' : 
              job.status === 'completed' ? 'info' : 
              'default'
            }
          />
        </Box>
        <Button 
          component={RouterLink} 
          to={`/jobs/${job._id}`} 
          variant="contained" 
          size="small"
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default JobCard;