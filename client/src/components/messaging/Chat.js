import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';

const Chat = ({ recipientId, recipientName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const messagesEndRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // TODO: Implement WebSocket connection for real-time messaging
    // For now, we'll use mock data
    const mockMessages = [
      {
        id: 1,
        senderId: recipientId,
        content: "Hello! I saw your job posting and I'm interested.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
      {
        id: 2,
        senderId: user._id,
        content: "Hi! Thanks for your interest. What experience do you have?",
        timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
      },
      {
        id: 3,
        senderId: recipientId,
        content: "I have 5 years of experience in web development...",
        timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
      },
    ];

    setMessages(mockMessages);
  }, [recipientId, user._id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() && attachments.length === 0) return;

    const message = {
      id: Date.now(),
      senderId: user._id,
      content: newMessage,
      attachments,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage('');
    setAttachments([]);
  };

  const handleFileAttach = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...files]);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        height: '600px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">{recipientName}</Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent:
                  message.senderId === user._id ? 'flex-end' : 'flex-start',
              }}
            >
              <Box
                sx={{
                  maxWidth: '70%',
                  bgcolor:
                    message.senderId === user._id
                      ? 'primary.main'
                      : 'grey.100',
                  color:
                    message.senderId === user._id
                      ? 'primary.contrastText'
                      : 'text.primary',
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <Typography variant="body1">{message.content}</Typography>
                {message.attachments?.map((file, index) => (
                  <Box
                    key={index}
                    sx={{
                      mt: 1,
                      p: 1,
                      bgcolor: 'rgba(0, 0, 0, 0.1)',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2">
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </Typography>
                  </Box>
                ))}
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 1,
                    opacity: 0.7,
                  }}
                >
                  {formatDistanceToNow(message.timestamp, {
                    addSuffix: true,
                  })}
                </Typography>
              </Box>
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

      {attachments.length > 0 && (
        <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Attachments:
          </Typography>
          <List dense>
            {attachments.map((file, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() =>
                      setAttachments((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <CloseIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={file.name}
                  secondary={`${(file.size / 1024).toFixed(1)} KB`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          gap: 1,
        }}
      >
        <IconButton
          component="label"
          size="small"
          sx={{ alignSelf: 'flex-end' }}
        >
          <input
            type="file"
            hidden
            multiple
            onChange={handleFileAttach}
          />
          <AttachFileIcon />
        </IconButton>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          variant="outlined"
          size="small"
        />
        <IconButton
          type="submit"
          color="primary"
          disabled={!newMessage.trim() && attachments.length === 0}
          sx={{ alignSelf: 'flex-end' }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default Chat; 