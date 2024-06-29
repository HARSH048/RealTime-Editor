import React, { useState, useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { githubDark } from "@uiw/codemirror-theme-github";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView, Decoration,ViewPlugin, ViewUpdate } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import RandomColor from "randomcolor";
import { CodemirrorBinding } from "y-codemirror";
import io from "socket.io-client";
import { Awareness } from "y-protocols/awareness";

const Actions = {
  CODE_CHANGE: 'code_change',
  JOIN_ROOM: 'join_room'
};

const Editor = ({ roomId }) => {
  const [code, setCode] = useState("console.log('Code Mirror!');");
  const socketRef = useRef();
  const editorViewRef = useRef(null);
  const yTextRef = useRef(null);
  const awarenessRef = useRef(null);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (socketRef.current) {
      socketRef.current.emit(Actions.CODE_CHANGE, { roomId, newCode });
    }
  };

  useEffect(() => {
    socketRef.current = io('http://localhost:4000');
    socketRef.current.emit(Actions.JOIN_ROOM, roomId);

    const ydoc = new Y.Doc();
    const provider = new WebrtcProvider(roomId, ydoc, {
      signaling: ["wss://demos.yjs.dev/ws"],
    });

    const yText = ydoc.getText("codemirror");
    yTextRef.current = yText;
    const yUndoManager = new Y.UndoManager(yText);

    const awareness = provider.awareness;
    awarenessRef.current = awareness;
    const color = RandomColor();

    awareness.setLocalStateField("user", {
      name: "User's Name",
      color: color,
    });

    const decorationsPlugin = createDecorationsPlugin(awareness);

    const state = EditorState.create({
      doc: code,
      extensions: [
        javascript({ jsx: true }),
        githubDark,
        EditorView.lineWrapping,
        decorationsPlugin,
      ],
    });

    const editorView = new EditorView({
      state: state,
      parent: document.querySelector("#editor")
    });
    editorViewRef.current = editorView;

    const binding = new CodemirrorBinding(yText, editorView, awareness, { yUndoManager });

    yText.observe(() => {
      setCode(yText.toString());
    });

    socketRef.current.on(Actions.CODE_CHANGE, ({ newCode }) => {
      yText.applyDelta([{ insert: newCode }]);
    });

    awareness.on("change", () => {
      editorView.dispatch({
        effects: editorView.state.updateListener.of(update => {
          editorView.update([update]);
        })
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off(Actions.CODE_CHANGE);
        socketRef.current.disconnect();
      }
      provider.disconnect();
      ydoc.destroy();
    };
  }, [roomId]);

  const createCursorWidget = (name, color) => {
    const cursorElement = document.createElement("span");
    cursorElement.style.position = "relative";
    cursorElement.style.backgroundColor = color;
    cursorElement.style.color = "#fff";
    cursorElement.style.padding = "2px 4px";
    cursorElement.style.borderRadius = "4px";
    cursorElement.style.fontSize = "small";
    cursorElement.innerText = name;
    return {
      toDOM: () => cursorElement
    };
  };

  const createDecorationsPlugin = (awareness) => {
    return ViewPlugin.fromClass(class {
      constructor(view) {
        this.decorations = this.getDecorations(view);
      }
      update(update) {
        this.decorations = this.getDecorations(update.view);
      }
      getDecorations(view) {
        const decorations = [];
        const userStates = awareness.getStates();
        userStates.forEach((state) => {
          const user = state.user;
          if (user && state.cursor != null) {
            const cursorPos = state.cursor;
            const deco = Decoration.widget({
              widget: createCursorWidget(user.name, user.color),
              side: 1
            }).range(cursorPos);

            decorations.push(deco);
          }
        });
        return Decoration.set(decorations);
      }
      get plugin() {
        return this.decorations;
      }
    }, { decorations: v => v.plugin });
  };

  return (
    <div id="editor" style={{ height: "100vh" }} />
  );
};

export default Editor;
