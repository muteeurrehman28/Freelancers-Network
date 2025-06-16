import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Stack,
  Divider,
  Paper,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import HandshakeIcon from '@mui/icons-material/Handshake';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import PaymentsIcon from '@mui/icons-material/Payments';
import StarIcon from '@mui/icons-material/Star';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import CodeIcon from '@mui/icons-material/Code';
import MarketingIcon from '@mui/icons-material/Campaign';
import TranslateIcon from '@mui/icons-material/Translate';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';

import SEO from '../components/ui/SEO';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, user } = useAuth();
  
  const features = [
    {
      title: 'Find Top Talent',
      description: 'Access a global network of qualified freelancers across various professional domains.',
      icon: <PeopleIcon fontSize="large" />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Post Jobs Easily',
      description: 'Create detailed job listings to attract the perfect freelancer for your project.',
      icon: <WorkIcon fontSize="large" />,
      color: theme.palette.secondary.main,
    },
    {
      title: 'Secure Payments',
      description: 'Our secure payment system ensures safe transactions for both parties.',
      icon: <PaymentsIcon fontSize="large" />,
      color: theme.palette.success.main,
    },
    {
      title: 'Collaboration Tools',
      description: 'Built-in tools to facilitate seamless communication and project management.',
      icon: <HandshakeIcon fontSize="large" />,
      color: theme.palette.info.main,
    },
  ];
  
  const categories = [
    { name: 'Web Development', icon: <CodeIcon />, color: '#3f51b5' },
    { name: 'Design & Creative', icon: <DesignServicesIcon />, color: '#f50057' },
    { name: 'Marketing', icon: <MarketingIcon />, color: '#ff9800' },
    { name: 'Writing & Translation', icon: <TranslateIcon />, color: '#009688' },
    { name: 'Finance & Accounting', icon: <AccountBalanceIcon />, color: '#795548' },
    { name: 'Consulting', icon: <EmojiObjectsIcon />, color: '#673ab7' },
  ];
  
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Client',
      company: 'TechSolutions Inc.',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      text: 'ProConnect helped me find the perfect developer for my web project. The quality of freelancers on this platform is outstanding!',
    },
    {
      name: 'Michael Chen',
      role: 'Freelancer',
      company: 'Independent Developer',
      avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
      text: "Since joining ProConnect, I've been able to connect with amazing clients and build my portfolio. The platform is intuitive and the job matching is spot on.",
    },
    {
      name: 'Emma Rodriguez', 
      role: 'Client',
      company: 'Creative Designs Co.',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      text: "I've hired multiple freelancers through ProConnect and have been consistently impressed with the results. Highly recommended for businesses of all sizes!"
    }
  ];

  return (
    <>
      <SEO 
        title="Professional Freelancing Platform"
        description="Connect with top freelancers and find the perfect talent for your projects on ProConnect, the leading platform for remote work collaboration."
        keywords={["freelance", "hire freelancers", "find projects", "remote work", "freelance marketplace", "professional services"]}
      />
      
      {/* Hero Section */}
      <Box 
        sx={{
          position: 'relative',
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 8, md: 12 },
          mb: 6,
          borderRadius: { xs: 0, md: 2 },
          overflow: 'hidden',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: 'url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                }}
              >
                Connect with Top Talent & Projects
              </Typography>
              <Typography 
                variant="h5" 
                paragraph
                sx={{ 
                  mb: 4,
                  maxWidth: 600,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                }}
              >
                ProConnect brings together skilled freelancers and quality clients in a seamless collaboration platform.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  component={RouterLink}
                  to={isAuthenticated ? (user?.role === 'client' ? '/create-job' : '/jobs') : '/register'}
                  sx={{ 
                    py: 1.5, 
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                  }}
                  startIcon={isAuthenticated && user?.role === 'client' ? <WorkIcon /> : <SearchIcon />}
                >
                  {isAuthenticated 
                    ? (user?.role === 'client' ? 'Post a Job' : 'Find Jobs') 
                    : 'Get Started Now'}
                </Button>
                
                {!isAuthenticated && (
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="large"
                    component={RouterLink}
                    to="/login"
                    sx={{ 
                      py: 1.5, 
                      px: 4,
                      fontSize: '1.1rem',
                      border: '2px solid',
                      '&:hover': {
                        border: '2px solid',
                      }
                    }}
                  >
                    Log In
                  </Button>
                )}
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 4, gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleIcon sx={{ mr: 0.5 }} />
                  <Typography variant="body2">Verified Professionals</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleIcon sx={{ mr: 0.5 }} />
                  <Typography variant="body2">Secure Payments</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleIcon sx={{ mr: 0.5 }} />
                  <Typography variant="body2">24/7 Support</Typography>
                </Box>
              </Box>
            </Grid>
            
            {!isSmallScreen && (
              <Grid size={{ md: 5 }}>
                <Box
                  component="img"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: 500,
                    borderRadius: 4,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  }}
                  src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=700&q=80"
                  alt="Professionals working together"
                />
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
      
      {/* Stats Section */}
      <Container maxWidth="lg">
        <Box sx={{ mb: 8 }}>
          <Grid container spacing={3} justifyContent="center">
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  py: 3,
                  px: 2,
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <Typography 
                  variant="h3" 
                  component="div" 
                  color="primary" 
                  gutterBottom
                  sx={{ fontWeight: 'bold' }}
                >
                  10K+
                </Typography>
                <Typography variant="body1">Skilled Freelancers</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  py: 3,
                  px: 2,
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <Typography 
                  variant="h3" 
                  component="div" 
                  color="secondary" 
                  gutterBottom
                  sx={{ fontWeight: 'bold' }}
                >
                  5K+
                </Typography>
                <Typography variant="body1">Satisfied Clients</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  py: 3,
                  px: 2,
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <Typography 
                  variant="h3" 
                  component="div" 
                  color="success.main" 
                  gutterBottom
                  sx={{ fontWeight: 'bold' }}
                >
                  15K+
                </Typography>
                <Typography variant="body1">Projects Completed</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  py: 3,
                  px: 2,
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <Typography 
                  variant="h3" 
                  component="div" 
                  color="info.main" 
                  gutterBottom
                  sx={{ fontWeight: 'bold' }}
                >
                  98%
                </Typography>
                <Typography variant="body1">Satisfaction Rate</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        
        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              How ProConnect Works
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ maxWidth: 700, mx: 'auto' }}
            >
              Our platform makes it easy to find top talent and exciting projects
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Card 
                  elevation={2}
                  sx={{ 
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Box
                      sx={{
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        bgcolor: `${feature.color}15`,
                        color: feature.color,
                        mx: 'auto',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Categories Section */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              Explore Categories
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ maxWidth: 700, mx: 'auto' }}
            >
              Find freelancers across various professional domains
            </Typography>
          </Box>
          
          <Grid container spacing={2}>
            {categories.map((category, index) => (
              <Grid size={{ xs: 6, sm: 4, md: 2 }} key={index}>
                <Paper
                  component={RouterLink}
                  to={`/jobs?category=${category.name}`}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: category.color,
                      mb: 1,
                      fontSize: '2rem',
                    }}
                  >
                    {category.icon}
                  </Box>
                  <Typography 
                    variant="body1" 
                    color="text.primary"
                    sx={{ fontWeight: 500 }}
                  >
                    {category.name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Call to Action Section */}
        <Box sx={{ mb: 8 }}>
          <Paper
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              background: 'linear-gradient(to right, #2196f3, #21cbf3)',
              color: 'white',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                backgroundImage: 'url(https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1920&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 0,
              }}
            />
            
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography 
                variant="h3" 
                component="h2" 
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                }}
              >
                Ready to Get Started?
              </Typography>
              <Typography 
                variant="h6" 
                paragraph
                sx={{ 
                  mb: 4,
                  maxWidth: 700,
                  mx: 'auto',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                }}
              >
                Join thousands of freelancers and clients who are already benefiting from ProConnect's powerful platform.
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  component={RouterLink}
                  to="/register"
                  sx={{ 
                    py: 1.5, 
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                  }}
                >
                  Sign Up Now
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  component={RouterLink}
                  to="/jobs"
                  sx={{ 
                    py: 1.5, 
                    px: 4,
                    fontSize: '1.1rem',
                    border: '2px solid',
                    '&:hover': {
                      border: '2px solid',
                    }
                  }}
                >
                  Browse Jobs
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
        
        {/* Testimonials Section */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              What Our Users Say
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ maxWidth: 700, mx: 'auto' }}
            >
              Success stories from freelancers and clients
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Card 
                  elevation={2}
                  sx={{ 
                    height: '100%',
                    borderRadius: 3,
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', mb: 3 }}>
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          sx={{ color: theme.palette.warning.main, fontSize: 20 }} 
                        />
                      ))}
                    </Box>
                    
                    <Typography 
                      variant="body1" 
                      paragraph
                      sx={{ 
                        mb: 3,
                        fontStyle: 'italic',
                        color: 'text.secondary',
                      }}
                    >
                      "{testimonial.text}"
                    </Typography>
                    
                    <Divider sx={{ mb: 3 }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        sx={{ width: 48, height: 48, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}, {testimonial.company}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default HomePage; 