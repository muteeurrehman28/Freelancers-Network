import React, { useState, useEffect } from 'react';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Work as WorkIcon,
  Message as MessageIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';

const Notifications = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // TODO: Implement WebSocket connection for real-time notifications
    // For now, we'll use mock data
    const mockNotifications = [
      {
        id: 1,
        type: 'job',
        message: 'New job posted matching your skills',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      },
      {
        id: 2,
        type: 'message',
        message: 'New message from John Doe',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
      {
        id: 3,
        type: 'application',
        message: 'Your job application was accepted',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter((n) => !n.read).length);
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'job':
        return <WorkIcon color="primary" />;
      case 'message':
        return <MessageIcon color="secondary" />;
      case 'application':
        return <CheckCircleIcon color="success" />;
      default:
        return <NotificationsIcon />;
    }
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 360, maxHeight: 480 },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Notifications</Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={handleMarkAllAsRead}>
              Mark all as read
            </Button>
          )}
        </Box>

        <Divider />

        <List sx={{ p: 0 }}>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="No notifications"
                secondary="You're all caught up!"
              />
            </ListItem>
          ) : (
            notifications.map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  bgcolor: notification.read ? 'inherit' : 'action.hover',
                }}
              >
                <ListItemAvatar>
                  <Avatar>{getNotificationIcon(notification.type)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={notification.message}
                  secondary={formatDistanceToNow(notification.createdAt, {
                    addSuffix: true,
                  })}
                />
                {!notification.read && (
                  <IconButton
                    size="small"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </ListItem>
            ))
          )}
        </List>
      </Menu>
    </>
  );
};

export default Notifications; 