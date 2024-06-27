import React, { useState, useRef, useEffect } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Actions from "../action";
import toast from "react-hot-toast";
import { initSocket } from "../../socket";

const EditorPage = () => {
  const socketRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();
  const isInitialized = useRef(false); // Track initialization

  const handleLeave = async () => {
    if (socketRef.current) {
      console.log(socketRef.current)
      await socketRef.current.emit(Actions.LEAVE, { roomId });
      socketRef.current.disconnect();
      navigate("/");
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId)
      .then(() => {
        toast.success("Room ID copied successfully!");
      })
      .catch(err => {
        toast.error("Failed to copy Room ID: " + err);
      });
  };

  useEffect(() => {
    const init = async () => {
      if (isInitialized.current) return; // Prevent re-initialization
      isInitialized.current = true;

      socketRef.current = await initSocket();

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

      socketRef.current.emit(Actions.JOIN, { roomId, userName });

      socketRef.current.on(Actions.JOINED, ({ client}) => {
        setClients(client);
      });

      socketRef.current.on('message', ({ message }) => {
        toast.success(`${message}`);
      });

      socketRef.current.on(Actions.LEAVE, ({ client, userName }) => {
        setClients(client);
        toast.success(`${userName} left the room`);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.off(Actions.JOINED);
          socketRef.current.off(Actions.LEAVE);
          socketRef.current.off("connect_error", handleErrors);
          socketRef.current.off("connect_failed", handleErrors);
          socketRef.current.disconnect();
        }
        isInitialized.current = false; // Reset initialization flag on cleanup
      };
    };

    init();
  }, [location.state?.userName, navigate, roomId]);

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
        <button className="btn copyBtn" onClick={copyRoomId}>Copy ROOM ID</button>
        <button className="btn leaveBtn" onClick={handleLeave}>Leave</button>
      </div>
      <div className="editorWrap">
        <Editor roomId={roomId} socketRef={socketRef} />
      </div>
    </div>
  );
};

export default EditorPage;
