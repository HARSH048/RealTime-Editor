import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors'
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
    console.log(client)
    io.to(roomId).emit(Actions.JOINED, {
      client,
      userName,
      socketId: socket.id,
    });
  });

  // socket.on("codeChange", (code) => {
  //   // Broadcast the code change to all other clients
  //   socket.broadcast.emit("codeChange", code);
  // });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(4000, () => {
  console.log("listening on 4000");
});
