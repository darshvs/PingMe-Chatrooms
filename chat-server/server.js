const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:4200';
const MAX_HISTORY = 200;
const MAX_MESSAGE_LENGTH = 1000;
const MAX_NAME_LENGTH = 40;

const chatHistory = {};
const roomUsers = {};

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST']
  }
});

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

function sanitizeText(value, maxLen) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, maxLen);
}

function isValidRoom(room) {
  return /^[a-zA-Z0-9][a-zA-Z0-9 _-]{0,39}$/.test(room);
}

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.data.username = null;
  socket.data.room = null;

  socket.on('joinRoom', ({ room, username }) => {
    const cleanRoom = sanitizeText(room, MAX_NAME_LENGTH);
    const cleanUser = sanitizeText(username, MAX_NAME_LENGTH);

    if (!cleanRoom || !cleanUser || !isValidRoom(cleanRoom)) {
      socket.emit('errorMessage', { message: 'Invalid room or username.' });
      return;
    }

    if (socket.data.room) {
      const prev = socket.data.room;
      socket.leave(prev);
      if (roomUsers[prev]) {
        roomUsers[prev] = roomUsers[prev].filter((u) => u !== socket.data.username);
        io.to(prev).emit('roomUsers', roomUsers[prev]);
        socket.to(prev).emit('message', {
          user: 'System',
          message: `${socket.data.username} left the room.`,
          timestamp: new Date().toISOString()
        });
      }
    }

    socket.join(cleanRoom);
    socket.data.room = cleanRoom;
    socket.data.username = cleanUser;

    if (!roomUsers[cleanRoom]) roomUsers[cleanRoom] = [];
    if (!roomUsers[cleanRoom].includes(cleanUser)) {
      roomUsers[cleanRoom].push(cleanUser);
    }

    console.log(`User ${cleanUser} joined room: ${cleanRoom}`);

    socket.emit('messageHistory', chatHistory[cleanRoom] || []);
    io.to(cleanRoom).emit('roomUsers', roomUsers[cleanRoom]);
    socket.to(cleanRoom).emit('message', {
      user: 'System',
      message: `${cleanUser} has joined the room.`,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('message', ({ room, username, message }) => {
    const cleanRoom = sanitizeText(room, MAX_NAME_LENGTH);
    const cleanUser = sanitizeText(username, MAX_NAME_LENGTH);
    const cleanMessage = sanitizeText(message, MAX_MESSAGE_LENGTH);

    if (!cleanRoom || !cleanUser || !cleanMessage) {
      socket.emit('errorMessage', { message: 'Message could not be sent.' });
      return;
    }

    if (socket.data.room !== cleanRoom) {
      socket.emit('errorMessage', { message: 'Join the room before sending messages.' });
      return;
    }

    const payload = {
      user: cleanUser,
      message: cleanMessage,
      timestamp: new Date().toISOString()
    };

    if (!chatHistory[cleanRoom]) chatHistory[cleanRoom] = [];
    chatHistory[cleanRoom].push(payload);
    if (chatHistory[cleanRoom].length > MAX_HISTORY) {
      chatHistory[cleanRoom] = chatHistory[cleanRoom].slice(-MAX_HISTORY);
    }

    io.to(cleanRoom).emit('message', payload);
  });

  socket.on('disconnect', () => {
    const { room, username } = socket.data;
    if (room && username && roomUsers[room]) {
      roomUsers[room] = roomUsers[room].filter((u) => u !== username);
      io.to(room).emit('roomUsers', roomUsers[room]);
      socket.to(room).emit('message', {
        user: 'System',
        message: `${username} left the room.`,
        timestamp: new Date().toISOString()
      });
    }
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`CORS origin: ${CLIENT_ORIGIN}`);
});
