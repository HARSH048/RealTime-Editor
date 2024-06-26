import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import Actions from "./src/action.js";

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const socketMapper = {};

function getAllCollectedClientInRoom(roomId) {
  const clients = [];
  const clientsInRoom = io.sockets.adapter.rooms.get(roomId) || new Set();
  clientsInRoom.forEach((socketId) => {
    const clientSocket = io.sockets.sockets.get(socketId);
    if (clientSocket) {
      clients.push({
        socketId: clientSocket.id,
        userName: socketMapper[socketId],
      });
    }
  });
  return clients;
}

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on(Actions.JOIN, ({ roomId, userName }) => {
    socketMapper[socket.id] = userName;
    socket.join(roomId);
    const client = getAllCollectedClientInRoom(roomId);
    io.to(roomId).emit(Actions.JOINED, {
      client,
      userName,
      socketId: socket.id,
    });
    socket
      .to(roomId)
      .emit("message", {
        userName,
        message: `${userName} has joined the room.`,
      });
  });

  socket.on(Actions.CODE_CHANGE, ({ roomId, newCode }) => {
    io.to(roomId).emit(Actions.CODE_CHANGE, {
      newCode,
    });
  });

  socket.on(Actions.LEAVE, ({ roomId }) => {
    socket.leave(roomId);
    const client = getAllCollectedClientInRoom(roomId);
    socket.broadcast.to(roomId).emit(Actions.LEAVE, {
      client,
      userName: socketMapper[socket.id],
    });
  });

  socket.on('disconnecting', () => {
    console.log('user disconnecting', socket.id);

    // Get the rooms the socket is part of
    const rooms = Array.from(socket.rooms);
    
    rooms.forEach((roomId) => {
      if (roomId !== socket.id) { // Ignore the default room with the socket id
        socket.leave(roomId);
        const client = getAllCollectedClientInRoom(roomId);
        socket.broadcast.to(roomId).emit(Actions.LEAVE, {
          client,
          userName: socketMapper[socket.id],
        });
      }
    });

    delete socketMapper[socket.id];
  });

  // Handle regular disconnect event for cleanup
  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
});

server.listen(4000, () => {
  console.log("listening on 4000");
});
