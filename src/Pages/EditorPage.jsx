import React, { useState, useRef, useEffect } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Actions from "../action";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { initSocket } from "../../socket";
// import socket from "../../socket";

const EditorPage = () => {
  const socketRef = useRef(null); 
  const location = useLocation();
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
   const init = async()=>{
    socketRef.current = await initSocket();

    // Set up event listeners and handle socket connection errors
    const handleErrors = (err) => {
      console.log("socket error", err);
      toast.error("Socket connection failed, try again later");
      navigate("/");
    };

    socketRef.current.on("connect_error", handleErrors);
    socketRef.current.on("connect_failed", handleErrors);

    const userName = location.state?.userName;

    if (!userName) {
      navigate("/");
      return;
    }

  //  // Emit JOIN event
    socketRef.current.emit(Actions.JOIN, { roomId, userName });

  //   // Handle JOINED event
    socketRef.current.on(Actions.JOINED, ({client,userName,socketId}) => {
      if (socketId !== socketRef.current.id) {
        toast.success(`${userName} joined the room`);
      }
      setClients(client);
    });

  }

  init()

    // Clean up function
    return () => {
      // socketRef.current.disconnect();
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
