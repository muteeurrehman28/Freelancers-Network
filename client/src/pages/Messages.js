import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Badge,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import Chat from '../components/messaging/Chat';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // TODO: Implement WebSocket connection for real-time conversations
    // For now, we'll use mock data
    const mockConversations = [
      {
        id: 1,
        participant: {
          id: 'user1',
          name: 'John Doe',
          avatar: null,
          lastSeen: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        },
        lastMessage: {
          content: 'I have 5 years of experience in web development...',
          timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
          unread: true,
        },
      },
      {
        id: 2,
        participant: {
          id: 'user2',
          name: 'Jane Smith',
          avatar: null,
          lastSeen: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        },
        lastMessage: {
          content: 'When can you start the project?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          unread: false,
        },
      },
    ];

    setConversations(mockConversations);
    setLoading(false);
  }, []);

  const filteredConversations = conversations.filter((conversation) =>
    conversation.participant.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    // Mark conversation as read
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversation.id
          ? {
              ...conv,
              lastMessage: { ...conv.lastMessage, unread: false },
            }
          : conv
      )
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Messages
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Divider />
            <List sx={{ flex: 1, overflow: 'auto' }}>
              {filteredConversations.map((conversation) => (
                <ListItem
                  key={conversation.id}
                  button
                  selected={selectedConversation?.id === conversation.id}
                  onClick={() => handleConversationSelect(conversation)}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      variant="dot"
                      color={
                        conversation.participant.lastSeen >
                        new Date(Date.now() - 1000 * 60 * 5)
                          ? 'success'
                          : 'default'
                      }
                    >
                      <Avatar src={conversation.participant.avatar}>
                        {conversation.participant.name[0]}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: conversation.lastMessage.unread
                              ? 'bold'
                              : 'normal',
                          }}
                        >
                          {conversation.participant.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(
                            conversation.lastMessage.timestamp
                          ).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontWeight: conversation.lastMessage.unread
                            ? 'bold'
                            : 'normal',
                        }}
                      >
                        {conversation.lastMessage.content}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          {selectedConversation ? (
            <Chat
              recipientId={selectedConversation.participant.id}
              recipientName={selectedConversation.participant.name}
            />
          ) : (
            <Paper
              elevation={3}
              sx={{
                height: '600px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Select a conversation to start messaging
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Messages; 