import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { githubDark } from "@uiw/codemirror-theme-github";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import Actions from "../action";

const Editor = ({ socketRef, roomId }) => {
  const [code, setCode] = useState("console.log('Code Mirror!');");

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    // Send the new code to the server
    if (socketRef.current) {
      socketRef.current.emit(Actions.CODE_CHANGE, { roomId, newCode });
    }
  };

  useEffect(() => {
    if (socketRef.current) {

      console.log("Socket initialized:", socketRef.current);

      // Setup the event listener
      socketRef.current.on(Actions.CODE_CHANGE, ({newCode}) => {
        console.log("Code change received from server:", newCode);
        setCode(newCode);
      });

      // Cleanup on component unmount
      return () => {
        if (socketRef.current) {
          socketRef.current.off(Actions.CODE_CHANGE);
        }
      };
    }
  }, [socketRef.current]);

  return (
    <CodeMirror
      value={code}
      height="100vh"
      extensions={[EditorView.lineWrapping, javascript({ jsx: true })]}
      theme={githubDark}
      options={{
        lineNumbers: true, // Show line numbers
        autofocus: true, // Autofocus the editor on load
        syntaxHighlighting: true,
        lineWrapping: true, // Enable line wrapping
      }}
      onChange={(value) => handleCodeChange(value)}
    />
  );
};

export default Editor;
