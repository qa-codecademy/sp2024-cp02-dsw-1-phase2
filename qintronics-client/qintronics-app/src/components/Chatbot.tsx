import React, { useState } from "react";
import products from "../../public/products.json";

const Chatbot: React.FC<{ toggleChat: () => void }> = ({ toggleChat }) => {
  const [messages, setMessages] = useState<
    { from: string; text: string; img?: string }[]
  >([{ from: "bot", text: "Hello! How can I help you today?" }]);
  const [input, setInput] = useState("");

  const handleUserInput = (event: React.FormEvent) => {
    event.preventDefault();
    if (input.trim()) {
      const userMessage = { from: "user", text: input };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      // Simulate a bot response
      setTimeout(() => {
        const botResponse = findProduct(input);
        setMessages((prev) => [...prev, botResponse]);
      }, 1000);
    }
  };

  const findProduct = (userInput: string) => {
    const lowerCaseInput = userInput.toLowerCase();
    const foundProduct = products.find((product) =>
      product.name.toLowerCase().includes(lowerCaseInput)
    );

    if (foundProduct) {
      // Return an object with text and image URL
      return {
        from: "bot",
        text: `I found a product for you: **${foundProduct.name}**. It costs $${foundProduct.price}. ${foundProduct.description}`,
        img: foundProduct.img,
      };
    } else {
      return {
        from: "bot",
        text: "Sorry, I couldn't find any products matching your query. Please try another name!",
      };
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-[#1A3F6B] text-white p-4 flex justify-between items-center rounded-t-lg">
        <h4 className="font-bold">Qinbot</h4>
        <button className="text-lg" onClick={toggleChat}>
          ×
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg max-w-xs ${
              message.from === "user"
                ? "bg-[#1A3F6B] text-white self-end"
                : "bg-gray-200 text-black self-start"
            }`}
          >
            <div className="whitespace-pre-wrap">{message.text}</div>
            {message.img && (
              <img
                src={message.img}
                alt="Product"
                className="mt-2 rounded"
                style={{ width: "100%", height: "auto" }}
              />
            )}
          </div>
        ))}
      </div>

      <form
        className="flex items-center p-4 bg-gray-100"
        onSubmit={handleUserInput}
      >
        <input
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="ml-3 bg-[#1A3F6B] text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
