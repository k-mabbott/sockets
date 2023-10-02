import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client';

const Chat = () => {


    const [userName, setUserName] = useState('')
    const [userForm, setUserForm] = useState('')
    const [msgBox, setMsgBox] = useState('')
    const [msgList, setMsgList] = useState(['hello', 'test'])
    // notice that we pass a callback function to initialize the socket
    // we don't need to destructure the 'setSocket' function since we won't be updating the socket state
    //const [socket] = useState(() => io(':8000'));
    
    const connectionOptions = {
        "force new connection": true,
        "reconnectionAttempts": "Infinity",
        "timeout": 10000,
        "transports": ["websocket"]
    };
    
    const socket = io.connect('https://sockets-api.vercel.app', connectionOptions);



    useEffect(() => {
        // we need to set up all of our event listeners
        // in the useEffect callback function
        // console.log('Is this running?');
        socket.on('Welcome', data => console.log('connected' + data));

        socket.on('message_posted', data => {
            setMsgList(oldMsgs => [...oldMsgs, data])
        })

        // note that we're returning a callback function
        // this ensures that the underlying socket will be closed if App is unmounted
        // this would be more critical if we were creating the socket in a subcomponent
        return () => socket.removeAllListeners;
    }, [socket]);

    const userNamePicked = (e) => {
        e.preventDefault()
        setUserName(userForm)
    }
    const onMsgSend = (e) => {
        e.preventDefault()

        socket.emit('message_from_client', `${userName}: ${msgBox}`)

        setMsgBox('')
    }



    return (
        <div>

            {
                userName.length < 1 ?

                    <form onSubmit={userNamePicked}>
                        <h2>Pick a user name:</h2>
                        <input type="text" name='username' onChange={e => setUserForm(e.target.value)} value={userForm} />
                        <button>Submit</button>
                    </form>
                    :
                    <div>
                        <form onSubmit={onMsgSend}>
                            <h2>Say something:</h2>
                            <input type="text" name='msgBox' onChange={e => setMsgBox(e.target.value)} value={msgBox} />
                            <button>Submit</button>
                        </form>
                        {msgList.map((msg, key) => 
                        <h3 key={key} >{msg}</h3> )}
                    </div>
            }

            <p>Hi</p>
        </div>
    )
}

export default Chat