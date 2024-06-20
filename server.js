import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors'
const app = express();
const server = http.createServer(app);

app.use(cors());
const io = new Server(server,{
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },      
  });

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("codeChange", (code) => {
    // Broadcast the code change to all other clients
    socket.broadcast.emit("codeChange", code);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(4000, () => {
  console.log("listening on 4000");
});
