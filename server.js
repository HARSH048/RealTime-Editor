// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
// import cors from 'cors'
// import Actions from "./src/action.js";
// const app = express();
// const server = http.createServer(app);

// app.use(cors());
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//   },
// });
// const socketMapper = {};
// function getAllCollectedClientInRoom(roomId) {
//   const clients = [];
//   const clientsInRoom = io.sockets.adapter.rooms.get(roomId) || new Set();
//   clientsInRoom.forEach((socketId) => {
//     const clientSocket = io.sockets.sockets.get(socketId);
//     if (clientSocket) {
//       clients.push({
//         socketId: clientSocket.id,
//         userName: socketMapper[socketId],
//       });
//     }
//   });
//   return clients;
// }

// io.on("connection", (socket) => {
//   console.log("a user connected", socket.id);
//   socket.on(Actions.JOIN, ({ roomId, userName }) => {
//     socketMapper[socket.id] = userName;
//     socket.join(roomId);
//     const client = getAllCollectedClientInRoom(roomId);
//     console.log(client)
//     io.to(roomId).emit(Actions.JOINED, {
//       client,
//       userName,
//       socketId: socket.id,
//     });
//   });

//   socket.on(Actions.CODE_CHANGE, ({roomId,newCode}) => {
//     // Broadcast the code change to all other clients
//     io.to(roomId).emit(Actions.CODE_CHANGE, {
//       newCode
//     });
//     console.log(`Code change broadcasted to room ${roomId}`);
//   });

//   socket.on("disconnect", (roomId) => {
//     console.log("user disconnected");
//   });

//   socket.on(Actions.LEAVE,({roomId})=>{
//     console.log("huuufuug")
//     const client = getAllCollectedClientInRoom(roomId);
//     console.log(client);
//     io.to(roomId).emit(Actions.LEAVE, {
//       client
//     });
//   })

// });

// server.listen(4000, () => {
//   console.log("listening on 4000");
// });


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
    socket.to(roomId).emit('message', { userName, message: `${userName} has joined the room.` });
  });

  socket.on(Actions.CODE_CHANGE, ({ roomId, newCode }) => {
    io.to(roomId).emit(Actions.CODE_CHANGE, {
      newCode,
    });
  });

  socket.on(Actions.LEAVE, ({ roomId }) => {
    socket.leave(roomId);
    const client = getAllCollectedClientInRoom(roomId);
    // io.to(roomId).emit(Actions.LEAVE, {
    //   client,
    //   userName: socketMapper[socket.id]
    // });
    console.log("client",client);
    socket.broadcast.to(roomId).emit(Actions.LEAVE, {
        client,
        userName: socketMapper[socket.id]
      });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    // Remove the user from the socketMapper
    const rooms = Array.from(socket.rooms);
    rooms.forEach((roomId) => {
     // socket.leave(roomId);
      // const client = getAllCollectedClientInRoom(roomId);
      // io.to(roomId).emit(Actions.LEAVE, {
      //   client,
      // });
    });
    delete socketMapper[socket.id];
  });
});

server.listen(4000, () => {
  console.log("listening on 4000");
});
