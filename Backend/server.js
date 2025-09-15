require('dotenv').config()
const app = require("./src/app");
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require("./src/services/ai.service");

const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

const chatHistory = 
[
  
]

io.on("connection", (socket) => {
  console.log("user A is connected to the server");

  socket.on("disconnect", (socket)=>{
    console.log("A user disconnected");
  });

  socket.on("ai-message",async (data)=>{
    console.log("ai-message received: ", data);
    chatHistory.push({
      role: "user",
      parts: [{text: data}]
    });
    const response = await generateResponse(chatHistory);
    console.log("ai-message-response: ", response);

    chatHistory.push({
      role: "model",
      parts: [{text: response}]
    })

    socket.emit("ai-message-response", response);
  });
});

httpServer.listen(3000,()=>{
    console.log("server is running on port 3000");
});