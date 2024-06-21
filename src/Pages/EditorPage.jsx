import React, { useState, useRef, useEffect } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { io } from "socket.io-client";
import { Navigate, useLocation, useParams } from "react-router-dom";
import Actions from "../action";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import initSocket from "../../socket";

const EditorPage = () => {
  const socketRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // const socket = io("http://localhost:4000");
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      const userName = location.state?.userName;

      socketRef.current.emit(Actions.JOIN, { roomId: roomId, userName });

      socketRef.current.on(Actions.JOINED, ({ client, userName, socketId }) => {
        if (socketId !== socket.id)
          toast.success(`${userName} joined the room`);

        setClients(client);
      });

      function handleErrors(err) {
        console.log("scoket error", e);
        toast.error("scoket connection failed try again later");
        navigate("/");
      }

      // if (!location.state) {
      //   <Navigate to="/" />;
      // }
    };
    init();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img
              className="logoImage"
              src="https://github.com/codersgyan/realtime-code-editor/blob/main/public/code-sync.png?raw=true"
              alt="logo"
            />
          </div>
          <h3>Connected</h3>
          <div className="clientList">
            {clients.map((client) => (
              <Client key={client.socketId} userName={client.userName} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn">Copy ROOM ID</button>
        <button className="btn leaveBtn">Leave</button>
      </div>
      <div className="editorWrap">
        <Editor />
      </div>
    </div>
  );
};

export default EditorPage;

// import React, { useState, useRef, useEffect } from "react";
// import Client from "../components/Client";
// import Editor from "../components/Editor";
// import { useLocation, useParams, useNavigate } from "react-router-dom";
// import Actions from "../action";
// import toast from "react-hot-toast";
// import socket from "../../socket"; // Import the singleton socket instance
// import { io } from "socket.io-client";

// const EditorPage = () => {
//   const socketRef = useRef(null); // Use the singleton socket instance
//   const location = useLocation();
//   const { roomId } = useParams();
//   const [clients, setClients] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const socket = io("http://localhost:4000");
//     socketRef.current = socket;
//     // Set up event listeners and handle socket connection errors
//     const handleErrors = (err) => {
//       console.log("socket error", err);
//       toast.error("Socket connection failed, try again later");
//       navigate("/");
//     };

//     socketRef.current.on("connect_error", handleErrors);
//     socketRef.current.on("connect_failed", handleErrors);

//     const userName = location.state?.userName;

//     if (!userName) {
//       navigate("/");
//       return;
//     }

//     // Emit JOIN event
//     socketRef.current.emit(Actions.JOIN, { roomId, userName });

//     // Handle JOINED event
//     socketRef.current.on(Actions.JOINED, ({ clients, userName: joinedUserName, socketId }) => {
//       if (socketId !== socketRef.current.id) {
//         toast.success(`${joinedUserName} joined the room`);
//       }
//       setClients(clients);
//     });

//     console.log("clients",clients);

//     // Clean up function
//     return () => {
//       // socketRef.current.off("connect_error", handleErrors);
//       // socketRef.current.off("connect_failed", handleErrors);
//       // socketRef.current.disconnect();
//     };
//   }, [roomId, location.state, navigate]);

//   return (
//     <div className="mainWrap">
//       <div className="aside">
//         <div className="asideInner">
//           <div className="logo">
//             <img
//               className="logoImage"
//               src="https://github.com/codersgyan/realtime-code-editor/blob/main/public/code-sync.png?raw=true"
//               alt="logo"
//             />
//           </div>
//           <h3>Connected</h3>
//           <div className="clientList">
//             {clients.map((client) => (
//               <Client key={client.socketId} userName={client.userName} />
//             ))}
//           </div>
//         </div>
//         <button className="btn copyBtn">Copy ROOM ID</button>
//         <button className="btn leaveBtn">Leave</button>
//       </div>
//       <div className="editorWrap">
//         <Editor />
//       </div>
//     </div>
//   );
// };

// export default EditorPage;
