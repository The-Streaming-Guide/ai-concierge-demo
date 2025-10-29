import React from "react";
import BotAvatar from "./BotAvatar";
import ProductCard from "./ProductCard";

const Message = ({ message, onStyleRequest }) => {
  const { sender, text, products } = message;

  if (sender === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-xs md:max-w-md">
          <div className="chat-bubble-user p-3 rounded-lg shadow-sm">
            <p className="text-sm">{text}</p>
          </div>
        </div>
      </div>
    );
  }

  // Bot message
  return (
    <div className="flex items-start space-x-3">
      <BotAvatar />
      <div className="max-w-xs md:max-w-md">
        <div className="chat-bubble-bot p-3 rounded-lg shadow-sm">
          {/* Using dangerouslySetInnerHTML to render the HTML tags like <br> and <em> from the initial message */}
          <p
            className="text-sm text-gray-800"
            dangerouslySetInnerHTML={{ __html: text }}
          ></p>
        </div>
        {products && products.length > 0 && (
          <div
            className="mt-3 -ml-3 -mr-3 pl-3 pr-3 flex overflow-x-auto space-x-4 py-2"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onStyleRequest={onStyleRequest}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
