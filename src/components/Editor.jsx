import React, { useEffect } from 'react';
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import { githubDarkInit,githubDark } from '@uiw/codemirror-theme-github';
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";

const Editor = () => {
    // useEffect(() => {
    //     async function init() {
    //         // Initialize Codemirror on the 'realTimeEditor' textarea
    //         const editor = Codemirror.fromTextArea(document.getElementById('realTimeEditor'), {
    //             mode: { name: 'javascript', json: true },
    //             theme: 'dracula',
    //             autoCloseTags: true // Corrected the option name to autoCloseTags
    //         });
    //     }
    //     init();
    // }, []); // Empty dependency array to run the effect only once

    // // Return the textarea that Codemirror will replace
    // return <textarea id='realTimeEditor'></textarea>;

    const code = "console.log('Code Mirror!');";
    return (
        <CodeMirror
      value={code}
      height="100vh"
      theme={githubDarkInit({
        settings: {
           caret: '#c8c8c8',
          fontFamily: 'monospace',
        }
      })}
      interactive={true}
      options={{
        mode: "javascript", // Set the language mode
        lineNumbers: true, // Show line numbers
        autofocus: true, // Autofocus the editor on load
        syntaxHighlighting: true,
        // Any other CodeMirror options you want to include
      }}
      />
    );

    // const editorState = EditorState.create({
    //     doc: 'console.log("Hello, CodeMirror!");',
    //     extensions: [
    //       githubDark,
    //       javascript({ jsx: true })
    //     ]
    //   });

    //   const code = editorState.toString();
    
    //   return (
    //     <CodeMirror
    //       value={code}
    //       height="100vh"
    //       theme="github-dark" // Use theme="github-dark" to apply the GitHub Dark theme
    //       options={{
    //         mode: "javascript",
    //         lineNumbers: true,
    //         autofocus: true,
    //       }}
    //     />
    //   );
}

export default Editor;


// import React from 'react';
// import { Controlled as CodeMirror } from 'react-codemirror2';
// import 'codemirror/mode/javascript/javascript';
// import 'codemirror/theme/dracula.css';
// import 'codemirror/addon/edit/closetag';

// const Editor = () => {
//     return (
//         <div className="editorWrap">
//             <CodeMirror
//                 value="// Start coding here..."
//                 options={{
//                     mode: 'javascript',
//                     theme: 'dracula',
//                     lineNumbers: true,
//                     autoCloseTags: true
//                 }}
//                 onBeforeChange={(editor, data, value) => {
//                     // Handle changes
//                 }}
//             />
//         </div>
//     );
// }

// export default Editor;

