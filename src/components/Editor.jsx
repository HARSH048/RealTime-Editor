import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import { githubDark } from "@uiw/codemirror-theme-github";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import { io } from "socket.io-client";

const socket = io('http://localhost:4000'); 

const Editor = () => {
  const [code, setCode] = useState("console.log('Code Mirror!');");

  useEffect(() => {
    // Listen for code changes from the server

    socket.on("codeChange", (newCode) => {
      setCode(newCode);
    });

    // Clean up the listener on component unmount
    // return () => {
    //   socket.off("codeChange");
    // };
  }, []);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    // Send the new code to the server
    socket.emit("codeChange", newCode);
    console.log(newCode)
  };
  return (
    <CodeMirror
      value={code}
      height="100vh"
      extensions={[EditorView.lineWrapping, javascript({ jsx: true })]}
      theme={githubDark}
      interactive="true"
      options={{
        mode: "javascript", // Set the language mode
        lineNumbers: true, // Show line numbers
        autofocus: true, // Autofocus the editor on load
        syntaxHighlighting: true,
        lineWrapping: true, // Enable line wrapping
        // Any other CodeMirror options you want to include
      }}
      onChange={(value) => handleCodeChange(value)}
    />
  );
};

export default Editor;
