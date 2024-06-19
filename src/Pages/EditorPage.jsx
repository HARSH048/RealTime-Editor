import React, { useState } from 'react'
import Client from '../components/Client'
import Editor from '../components/Editor'

const EditorPage = () => {
    const [clients,setClients]= useState([
        {
        socketId:1,userName:'Harsh Bhardwaj'
        },
        {
            socketId:2,userName:'Komal Bhardwaj'
        }
])
  return (
    <div className='mainWrap'>
      <div className='aside'>
        <div className='asideInner'>
            <div className='logo'>
                <img className='logoImage' src='https://github.com/codersgyan/realtime-code-editor/blob/main/public/code-sync.png?raw=true'/>
            </div>
            <h3>Connected</h3>
            <div className='clientList'>
                {clients.map(client=>(
                    <Client key={client.socketId} userName={client.userName}/>
                ))}
            </div>
        </div>
        <button className='btn copyBtn'>Copy ROOM ID</button>
        <button className='btn leaveBtn'>Leave</button>
      </div>
      <div className='editorWrap'>
        <Editor />
      </div>
    </div>
  )
}

export default EditorPage


