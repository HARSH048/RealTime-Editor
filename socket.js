import { io } from 'socket.io-client';
let socket;

export const initSocket = async () => {
    if (!socket) {
    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };
     socket =io("http://localhost:4000", options);
}
     return socket;
}

export default initSocket;


// const socket = io("http://localhost:4000");
// export default socket;
