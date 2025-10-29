import React, { useState } from "react";

const ChatInput = ({ onSendMessage, disabled }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = inputValue.trim();
    if (message) {
      onSendMessage(message);
      setInputValue("");
    }
  };

  return (
    <div className="bg-gray-50 border-t border-gray-200 p-4 shadow-inner">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask me to find an item..."
          className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
          autoComplete="off"
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled}
          className="flex-shrink-0 bg-gray-900 text-white px-5 py-2 rounded-full font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 disabled:bg-gray-400"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
