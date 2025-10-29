import React, { useState } from "react";
import Header from "./components/Header";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import { mockCatalog } from "./data/mockCatalog";
import { getStructuredQuery, getStylingAdvice } from "./api/gemini";

const initialMessage = {
  id: "initial",
  sender: "bot",
  text: `Hi! I'm your AI shopping assistant. How can I help you find the perfect outfit today? <br /><br />
         You can try saying: <br /><em>"I need a dress for a summer wedding."</em> <br />
         <em>"Do you have any casual blue jeans?"</em> <br />
         <em>"Show me some formal blazers."</em>`,
  products: [],
};

function App() {
  const [messages, setMessages] = useState([initialMessage]);
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = (message) => {
    setMessages((prev) => [...prev, { id: Date.now(), ...message }]);
  };

  const handleSendMessage = async (messageText) => {
    addMessage({ sender: "user", text: messageText });
    setIsTyping(true);

    let products = [];
    let botText = "";

    try {
      const queryObject = await getStructuredQuery(messageText.toLowerCase());
      products = findProductsFromQuery(queryObject);
    } catch (error) {
      console.error(
        "Gemini 'Structured Query' call failed, falling back to simple search:",
        error
      );
      products = findProductsSimple(messageText.toLowerCase());
    }

    if (products.length > 0) {
      botText = `Great! I found ${products.length} item(s) that match your request for "${messageText}". Here they are:`;
    } else if (messageText.toLowerCase().includes("wedding")) {
      botText =
        "I couldn't find an exact match for that, but here are some other items perfect for a wedding.";
      products.push(...findProductsSimple("wedding"));
    } else if (messageText.toLowerCase().includes("thank")) {
      botText =
        "You're very welcome! Is there anything else I can help you find today?";
    } else {
      botText = `I wasn't able to find an exact match for "${messageText}". However, here are some of our best-sellers you might like:`;
      products.push(mockCatalog[1], mockCatalog[3]);
    }

    setIsTyping(false);
    addMessage({ sender: "bot", text: botText, products });
  };

  const handleStyleRequest = async (productId, productName) => {
    const userMessage = `How should I style the "${productName}"?`;
    addMessage({ sender: "user", text: userMessage });
    setIsTyping(true);

    let botResponse = "";
    try {
      botResponse = await getStylingAdvice(productName);
    } catch (error) {
      console.error("Gemini 'Style Me' call failed:", error);
      botResponse =
        "I'm sorry, I'm having a little trouble thinking of styling tips right now. Please try again in a moment!";
    }

    setIsTyping(false);
    addMessage({ sender: "bot", text: botResponse, products: [] });
  };

  // --- "RETRIEVAL" FUNCTIONS ---

  const findProductsSimple = (query) => {
    return mockCatalog.filter((item) => {
      return (
        item.inStock &&
        (query.includes(item.category) ||
          query.includes(item.style) ||
          query.includes(item.color) ||
          (item.occasion && query.includes(item.occasion)) ||
          item.name.toLowerCase().includes(query))
      );
    });
  };

  const findProductsFromQuery = (queryObject) => {
    return mockCatalog.filter((item) => {
      if (!item.inStock) return false;

      if (queryObject.category && item.category !== queryObject.category) {
        return false;
      }
      if (queryObject.style && item.style !== queryObject.style) {
        return false;
      }
      if (queryObject.color && item.color !== queryObject.color) {
        return false;
      }
      if (queryObject.occasion && item.occasion !== queryObject.occasion) {
        return false;
      }

      return true;
    });
  };

  return (
    <div className="bg-white antialiased">
      <div className="flex h-screen w-full flex-col">
        <Header />
        <ChatWindow
          messages={messages}
          isTyping={isTyping}
          onStyleRequest={handleStyleRequest}
        />
        <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
      </div>
    </div>
  );
}

export default App;
