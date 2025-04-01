'use client';
import React, { useState, useEffect } from "react";
import { Clock, Book, Plus } from 'lucide-react';  // Import Lucide icons

export default function Chat() {
  const [input, setInput] = useState("");  // Store user input
  const [response, setResponse] = useState("");  // Store AI response
  const [loading, setLoading] = useState(false); // Loading state
  const [currentTime, setCurrentTime] = useState(""); // Current time state
  const [chatHistory, setChatHistory] = useState([]); // Store chat history
  const [activeChat, setActiveChat] = useState(null); // Active chat

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    }, 60000); // Update every minute
    return () => clearInterval(timer); // Cleanup interval on unmount
  }, []);

  async function AIResponse(prompt) {
    const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";
    const MODEL_NAME = "gemini-1.5-pro";  
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;  // Fetch API key from environment variable

    console.log("API Key:", apiKey);  // Debugging log to ensure the key is loaded

    if (!apiKey) {
      setResponse("API key is missing! Please check your .env.local file.");
      return;
    }
    setLoading(true); // Show loading animation

    try {
      const res = await fetch(
        `${GEMINI_API_URL}/${MODEL_NAME}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a Japanese language tutor. Teach the user Japanese with explanations and examples. 
                    Make sure to explain grammar, vocabulary, and provide example sentences. 
                    User input: "${prompt}"`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await res.json();

      // Extract and handle the response content
      const aiResponse = data.candidates?.[0]?.content;
      
      // Check if there's a valid response and if it's an object (in case of nested response)
      if (aiResponse) {
        // If the response is an object (like { parts, role }), extract the parts or content
        if (typeof aiResponse === 'object') {
          setResponse(aiResponse.parts?.map(part => part.text).join(' ') || "No valid content.");
        } else {
          setResponse(aiResponse);
        }
      } else {
        setResponse("No response from AI.");
      }

      // Add the chat to the history after receiving a response
      const newChat = {
        id: Date.now(),  // Unique ID for each chat
        prompt: prompt,
        response: aiResponse,
      };
      setChatHistory((prevHistory) => [...prevHistory, newChat]);

    } catch (error) {
      console.error("Error fetching AI response:", error);
      setResponse("Failed to get a response. Please try again.");
    } finally {
      setLoading(false); // Hide loading animation
    }
  }

  // Function to handle the Enter key press event
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();  // Prevent the default action (form submission)
      AIResponse(input);  // Trigger the AI response
    }
  };

  const handleNewChat = () => {
    setActiveChat(null); // Clear active chat
    setInput(""); // Clear input
    setResponse(""); // Clear AI response
  };

  const handleSelectChat = (chatId) => {
    setActiveChat(chatId);
    const selectedChat = chatHistory.find(chat => chat.id === chatId);
    setInput(selectedChat.prompt);
    setResponse(selectedChat.response);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-950 p-4 space-y-4">
        <nav className="text-center text-2xl font-bold text-white mb-6">
          NGK 🇯🇵
        </nav>
        <div className="flex flex-col space-y-2">
          <button
            onClick={handleNewChat}
            className="flex items-center space-x-2 text-lg p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            <Plus className="w-5 h-5" />
            <span>New Chat</span>
          </button>
          <div className="text-lg">Old Chats</div>
          <ul className="space-y-2">
            {chatHistory.map((chat) => (
              <li key={chat.id}>
                <button
                  onClick={() => handleSelectChat(chat.id)}
                  className="flex items-center space-x-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-md w-full"
                >
                  <Book className="w-5 h-5" />
                  <span>Chat {chat.id}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {/* Navbar with Clock and Book Icons */}
        <nav className="flex items-center justify-between p-4 text-center text-3xl font-bold bg-gray-950 shadow-lg rounded-lg mb-6">
          {/* Clock Icon */}
          <div className="flex items-center space-x-4">
            <Clock className="w-6 h-6 text-white" />
            <span className="ml-2">{currentTime}</span>
          </div>

          {/* Title */}
          <span>Japanese Language Trainer</span>

          {/* Book Icon */}
          <div className="flex items-center">
            <Book className="w-6 h-6 text-white" />
          </div>
        </nav>

        {/* Chat Container */}
        <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="text-lg font-semibold text-center text-gray-300">
            Your AI-powered Japanese tutor is ready! Type your question below.
          </div>

          {/* AI Response */}
          <div className="mt-4 p-4 bg-gray-700 rounded-lg min-h-[120px]">
            {loading ? (
              <div className="text-center text-blue-400 animate-pulse">Loading AI response...</div>
            ) : (
              <p className="whitespace-pre-wrap">{response || "Ask me anything about Japanese!"}</p>
            )}
          </div>
        </div>

        {/* Input & Send Button */}
        <div className="flex items-center justify-center mt-6">
          <input
            type="text"
            placeholder="Ask about Japanese grammar, vocabulary..."
            className="w-[80%] max-w-lg h-[45px] p-3 border-2 border-gray-600 rounded-lg text-black focus:outline-none focus:border-blue-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}  // Handle Enter key press
          />
          <button
            className="ml-3 bg-blue-500 hover:bg-blue-600 text-white font-bold px-5 py-2 rounded-lg transition-all duration-300"
            onClick={() => AIResponse(input)}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}