import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  Divider,
  IconButton,
  Stack,
  TextField,
  Paper,
  useTheme
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import SendIcon from '@mui/icons-material/Send';
import WorkIcon from '@mui/icons-material/Work';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'For Clients',
      links: [
        { name: 'How it Works', path: '#' },
        { name: 'Find Freelancers', path: '/freelancers' },
        { name: 'Post a Job', path: '/create-job' },
        { name: 'Success Stories', path: '#' },
      ],
    },
    {
      title: 'For Freelancers',
      links: [
        { name: 'How it Works', path: '#' },
        { name: 'Find Jobs', path: '/jobs' },
        { name: 'Success Stories', path: '#' },
        { name: 'Resources', path: '#' },
      ],
    },
    {
      title: 'About Us',
      links: [
        { name: 'Our Story', path: '#' },
        { name: 'Contact Us', path: '#' },
        { name: 'Terms of Service', path: '#' },
        { name: 'Privacy Policy', path: '#' },
      ],
    },
  ];

  return (
    <Box component="footer" sx={{ bgcolor: 'primary.dark', color: 'white', pt: 6, pb: 4, mt: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WorkIcon sx={{ fontSize: 24, mr: 1 }} />
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                ProConnect
              </Typography>
            </Box>
            <Typography variant="body2" paragraph sx={{ mb: 3 }}>
              Connect with top freelancers and find the perfect talent for your projects. 
              ProConnect is the leading platform for freelancers and businesses to collaborate 
              effectively and achieve outstanding results.
            </Typography>
            
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Subscribe to our newsletter
            </Typography>
            <Paper 
              component="form" 
              sx={{ 
                p: '2px 4px', 
                display: 'flex', 
                alignItems: 'center',
                maxWidth: 400,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: theme.shape.borderRadius,
              }}
            >
              <TextField
                size="small"
                placeholder="Your email address"
                variant="standard"
                fullWidth
                InputProps={{
                  disableUnderline: true,
                  sx: { px: 1, py: 0.5 }
                }}
              />
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <IconButton 
                color="primary" 
                sx={{ p: '10px' }} 
                aria-label="subscribe to newsletter"
              >
                <SendIcon />
              </IconButton>
            </Paper>
          </Grid>
          
          {footerLinks.map((section) => (
            <Grid size={{ xs: 12, sm: 6, md: 2 }} key={section.title}>
              <Typography 
                variant="subtitle1" 
                gutterBottom
                sx={{ fontWeight: 'bold', mb: 2 }}
              >
                {section.title}
              </Typography>
              <Stack spacing={1.5}>
                {section.links.map((link) => (
                  <Link
                    component={RouterLink}
                    to={link.path}
                    key={link.name}
                    color="inherit"
                    sx={{
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      '&:hover': { 
                        textDecoration: 'none',
                        color: theme.palette.secondary.light
                      }
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>
        
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', my: 4 }} />
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Typography variant="body2" sx={{ mb: { xs: 2, md: 0 } }}>
            © {currentYear} ProConnect. All rights reserved.
          </Typography>
          
          <Stack direction="row" spacing={1}>
            <IconButton color="inherit" aria-label="facebook" sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
            }}>
              <FacebookIcon fontSize="small" />
            </IconButton>
            <IconButton color="inherit" aria-label="twitter" sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
            }}>
              <TwitterIcon fontSize="small" />
            </IconButton>
            <IconButton color="inherit" aria-label="linkedin" sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
            }}>
              <LinkedInIcon fontSize="small" />
            </IconButton>
            <IconButton color="inherit" aria-label="instagram" sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
            }}>
              <InstagramIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 