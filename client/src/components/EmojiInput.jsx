// EmojiInput.js
import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";

const EmojiInput = ({ value, onChange, placeholder }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiClick = (emojiData) => {
    onChange({ target: { value: value + emojiData.emoji } });
  };

  return (
    <div style={{ position: "relative" }}>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows="4"
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
      />
      <button
        type="button"
        onClick={() => setShowPicker((val) => !val)}
        style={{ position: "absolute", right: "10px", bottom: "10px" }}
      >
        😀
      </button>
      {showPicker && (
        <div style={{ position: "absolute", zIndex: 10, bottom: "40px", right: 0 }}>
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default EmojiInput;
