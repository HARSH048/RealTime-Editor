import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
  
    const getUUid = (e) => {
      e.preventDefault(); // Prevents the default action of the link
      const id = uuidv4();
      setRoomId(id);
      toast.success('Created a new room')
    }

    const redirectOnEditorPage = () => {

            if(!roomId || !username){
                toast.error('RoomId & username is required')
                return;
            }

        // redirect on editor page
        navigate(`editor/${roomId}`,{state:{
            username
        }});
    }

    const handleInputEnter = (e) =>{
        if(e.code === 'Enter')
            redirectOnEditorPage();
    }
  

  return (
    <div className='homePageWrapper'>
      <div className='formWrapper'>
        <img src='https://github.com/codersgyan/realtime-code-editor/blob/main/public/code-sync.png?raw=true' />
        {/* <h4 className='mainLabel'>
            Paste Invitation RoomId
        </h4> */}
        <div className='inputGroup'>
            <input type="text" className='inputBox' placeholder='ROOM ID' value={roomId}
            onChange={(e) => setRoomId(e.target.value)} onKeyUp={handleInputEnter}/>
            <input type='text' className='inputBox' placeholder='USERNAME'  value={username}
            onChange={(e) => setUsername(e.target.value)} onKeyUp={handleInputEnter}/>
            <button className='btn joinBtn' onClick={redirectOnEditorPage}>Join</button>
            <span className='createInfo'>
                If you don't have invite then create &nbsp;
                <a href='' className='createNewBtn' onClick={getUUid}>
                new Room
            </a>
            </span>
        </div>
      </div>
    </div>
  )
}

export default Home
