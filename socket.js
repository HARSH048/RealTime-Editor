import { io } from "socket.io-client";

function initSocket(){
    return io("http://localhost:4000");
}

export default initSocket;