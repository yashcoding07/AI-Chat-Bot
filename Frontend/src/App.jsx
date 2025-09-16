import { useState,useEffect } from "react"; 
import "./App.css";
import { io } from "socket.io-client";

function App() {
  const [socket, setSocket] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to conversation
    const newMessage = {
      text: input,
      sender: "user",
      id: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
    
    socket.emit("ai-message", input)
    
    setInput("");

  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(()=>{
    let socketInstance = io("http://localhost:3000");
    setSocket(socketInstance)

    socketInstance.on("ai-message-response", (response) => {
      const botMessage = {
        id: Date.now() + 1,
        text: response,
        sender: "bot"
      }

      setMessages(prev => [...prev, botMessage])
    })
  }, []);

  return (
    <div
      className={`chat-container ${isDarkMode ? "dark-mode" : "light-mode"}`}
    >
      <div className="chat-header">
        <h1>AI Chat Bot</h1>
        <button onClick={toggleTheme} className="theme-toggle">
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.sender === "user" ? "user-message" : "bot-message"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <form className="input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="message-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
}

export default App;
