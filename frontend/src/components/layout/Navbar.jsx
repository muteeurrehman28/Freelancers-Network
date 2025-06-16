import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Container,
  Avatar,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user, logout, isAuthenticated } = useAuth();
  
  // Mobile drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Profile menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/');
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'Jobs', path: '/jobs', icon: <WorkIcon /> },
    { text: 'Freelancers', path: '/freelancers', icon: <PeopleIcon /> },
  ];
  
  const authItems = isAuthenticated
    ? [
        { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
        { text: 'Post a Job', path: '/create-job', icon: <AddIcon /> },
      ]
    : [
        { text: 'Login', path: '/login', icon: <LoginIcon /> },
        { text: 'Register', path: '/register', icon: <PersonIcon /> },
      ];
  
  const profileMenu = (
    <Menu
      anchorEl={anchorEl}
      id="profile-menu"
      open={open}
      onClose={handleProfileMenuClose}
      onClick={handleProfileMenuClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      PaperProps={{
        elevation: 3,
        sx: {
          mt: 1.5,
          minWidth: 180,
          borderRadius: 2,
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
    >
      <MenuItem 
        component={RouterLink} 
        to={`/profile/${user?._id}`}
        sx={{ 
          py: 1.5,
          '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' },
        }}
      >
        <ListItemIcon>
          <PersonIcon fontSize="small" color="primary" />
        </ListItemIcon>
        Profile
      </MenuItem>
      <MenuItem 
        component={RouterLink} 
        to="/dashboard"
        sx={{ 
          py: 1.5,
          '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' },
        }}
      >
        <ListItemIcon>
          <DashboardIcon fontSize="small" color="primary" />
        </ListItemIcon>
        Dashboard
      </MenuItem>
      <Divider />
      <MenuItem 
        onClick={handleLogout}
        sx={{ 
          py: 1.5,
          '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.08)' },
        }}
      >
        <ListItemIcon>
          <LogoutIcon fontSize="small" color="error" />
        </ListItemIcon>
        <Typography color="error">Logout</Typography>
      </MenuItem>
    </Menu>
  );
  
  const drawer = (
    <Box onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <Box sx={{ textAlign: 'center', py: 3, backgroundColor: 'primary.main', color: 'white' }}>
        <WorkIcon sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="h6" component="div">
          ProConnect
        </Typography>
        <Typography variant="caption">
          Freelancers & Collaboration Network
        </Typography>
      </Box>
      <Divider />
      {isAuthenticated && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
          <Avatar 
            src={user?.profilePicture} 
            alt={user?.name}
            sx={{ width: 60, height: 60, mb: 1 }}
          />
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {user?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.role === 'freelancer' ? 'Freelancer' : 'Client'}
          </Typography>
        </Box>
      )}
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              component={RouterLink} 
              to={item.path}
              selected={isActiveRoute(item.path)}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        {authItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              component={RouterLink} 
              to={item.path}
              selected={isActiveRoute(item.path)}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        {isAuthenticated && (
          <ListItem disablePadding>
            <ListItemButton 
              onClick={handleLogout}
              sx={{ color: theme.palette.error.main }}
            >
              <ListItemIcon>
                <LogoutIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo and title */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 2 }}>
            <WorkIcon 
              sx={{ 
                mr: 1, 
                color: 'primary.main',
                fontSize: 32
              }} 
            />
            <Box>
              <Typography
                variant="h6"
                noWrap
                component={RouterLink}
                to="/"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  textDecoration: 'none',
                  lineHeight: 1.2
                }}
              >
                ProConnect
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block',
                  color: 'text.secondary',
                  lineHeight: 1
                }}
              >
                Freelancers & Collaboration Network
              </Typography>
            </Box>
          </Box>

          {/* Mobile menu icon */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Mobile title */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
            }}
          >
            ProConnect
          </Typography>

          {/* Desktop navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {navItems.map((item) => (
              <Button
                key={item.text}
                component={RouterLink}
                to={item.path}
                sx={{ 
                  mx: 1, 
                  color: isActiveRoute(item.path) ? 'primary.main' : 'text.primary',
                  fontWeight: isActiveRoute(item.path) ? 600 : 400,
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  },
                }}
                startIcon={item.icon}
              >
                {item.text}
              </Button>
            ))}
          </Box>

          {/* Auth buttons or profile menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {isAuthenticated ? (
              <>
                <Button
                  component={RouterLink}
                  to="/create-job"
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  sx={{ mr: 2 }}
                >
                  Post a Job
                </Button>
                <Button
                  component={RouterLink}
                  to="/dashboard"
                  color="inherit"
                  startIcon={<DashboardIcon />}
                  sx={{ mr: 2 }}
                >
                  Dashboard
                </Button>
                <IconButton
                  onClick={handleProfileMenuOpen}
                  size="large"
                  edge="end"
                  color="inherit"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  sx={{ 
                    ml: 1,
                    border: user?.profilePicture ? 'none' : '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  {user?.profilePicture ? (
                    <Avatar src={user.profilePicture} alt={user.name} />
                  ) : (
                    <AccountCircleIcon />
                  )}
                </IconButton>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  color="inherit"
                  startIcon={<LoginIcon />}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="primary"
                  startIcon={<PersonIcon />}
                  sx={{ ml: 2 }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
      
      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawer}
      </Drawer>
      
      {/* Profile Menu */}
      {profileMenu}
    </AppBar>
  );
};

export default Navbar; 