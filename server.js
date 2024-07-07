import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
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

const getRoomsForSocket = (socket) => {
  const allRooms = Array.from(socket.rooms);
  return allRooms.filter((room) => room !== socket.id);
};

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
    socket.to(roomId).emit("message", {
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
    console.log("client", client);
    socket.to(roomId).emit(Actions.LEAVE, {
      client,
      userName: socketMapper[socket.id],
    });
  });

  socket.on("disconnecting", () => {
    console.log("user is disconnecting");
    const roomId = getRoomsForSocket(socket);
    socket.leave(roomId[0]);
    const client = getAllCollectedClientInRoom(roomId[0]);
    socket.to(roomId[0]).emit(Actions.LEAVE, {
      client,
      userName: socketMapper[socket.id],
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    // Remove the user from the socketMapper
    const rooms = Array.from(socket.rooms);
    rooms.forEach((roomId) => {});
    delete socketMapper[socket.id];
  });
});

server.listen(4000, () => {
  console.log("listening on 4000");
});
