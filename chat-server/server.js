const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Import CORS middleware

// Initialize Express app
const app = express();
const port = 3000;
const chatHistory = {};
// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with the server
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:4200", // Angular app's URL
    methods: ["GET", "POST"]
  }
});

// Serve static files (if you have any)
app.use(express.static('public'));

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle 'joinRoom' event
  socket.on('joinRoom', ({ room, username }) => {
    socket.join(room);
    console.log(`User ${username} joined room: ${room}`);

    // Send chat history to the newly joined user
    if (chatHistory[room]) {
      socket.emit('messageHistory', chatHistory[room]);
    }

    // Optionally send a welcome message or list of messages
    socket.to(room).emit('message', { user: 'System', message: `${username} has joined the room.` });
  });

  // Handle 'message' event
  socket.on('message', ({ room, username, message }) => {
    console.log(`Message received by user ${username} in room ${room}: ${message}`);

    // Save the message to chat history
    if (!chatHistory[room]) {
      chatHistory[room] = [];
    }
    chatHistory[room].push({ user: username, message: message });

    // Broadcast the message to the specified room
    io.to(room).emit('message', { user: username, message: message });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
