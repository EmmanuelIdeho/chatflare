import Auth from './components/Auth.jsx'
import Chat from './components/Chat.jsx'
import { useState, useRef } from "react"

import Cookies from 'universal-cookie'

import {signOut, deleteUser} from "firebase/auth"
import {auth} from "./firebase-config.js"
const cookies = new Cookies()

function App() {
  //used to represent whether the user is authenticated or not. Checks if a cookie of the specified name is already in the browser.
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token")) 

  //used to represent whether the user is in a room or not 
  const [room, setRoom] = useState(null)

  const signUserOut = async () =>{
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);
    setRoom(null);

  }

  /*
  const deleteUserAccount = async () =>{
    try{
      await deleteUser(auth.currentUser);
    }catch(err){
      console.log(err.code);
      console.log(err.message);
    }
      
  }*/

  //used to reference what the user types in the <input /> and use that text to create the room.
  const roomInputRef = useRef(null)
  if(!isAuth){
    return (
      <>
        <div><Auth setIsAuth={setIsAuth}/></div>
      </>
    )
  }

  return (
    //is there a room? If there is, then we should display the Chat. If not, then let the user type in a room to enter.
    <> 
      {room ? (<><Chat room={room}/></>) : 
      (
      <div className="generalForm">
          <p>Enter Room Name</p>
          <input ref={roomInputRef}/>
          <button className="generalButton" onClick={() => setRoom(roomInputRef.current.value)}>Enter Chat</button>
        <div id="sign-out">
          <button className="generalButton" onClick={signUserOut}>SignOut</button>
        </div> 
      </div>)}
    </>
  )
}

export default App
