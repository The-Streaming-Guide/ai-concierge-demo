import React from "react";
import BotAvatar from "./BotAvatar";

const TypingIndicator = () => (
  <div className="flex items-start space-x-3 p-4 md:p-6">
    <BotAvatar />
    <div className="max-w-xs md:max-w-md">
      <div className="chat-bubble-bot p-3 rounded-lg shadow-sm">
        <div className="flex space-x-1">
          <div
            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.3s" }}
          ></div>
        </div>
      </div>
    </div>
  </div>
);

export default TypingIndicator;
