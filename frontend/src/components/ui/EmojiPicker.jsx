import React, { useState } from 'react';
import EmojiPickerLib from 'emoji-picker-react';
import { Box, Popover, IconButton, TextField, InputAdornment } from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

const EmojiPicker = ({ value, onChange, placeholder, multiline, rows, fullWidth, label, required }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleEmojiPickerOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleEmojiPickerClose = () => {
    setAnchorEl(null);
  };

  const handleEmojiClick = (emojiObject) => {
    onChange(value + emojiObject.emoji);
  };

  return (
    <Box>
      <TextField
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        multiline={multiline}
        rows={rows}
        fullWidth={fullWidth}
        label={label}
        required={required}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton 
                onClick={handleEmojiPickerOpen}
                edge="end"
                aria-label="emoji picker"
              >
                <EmojiEmotionsIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleEmojiPickerClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 1 }}>
          <EmojiPickerLib onEmojiClick={handleEmojiClick} />
        </Box>
      </Popover>
    </Box>
  );
};

export default EmojiPicker; 