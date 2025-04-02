import { useState, useEffect } from "react"
import { addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy } from 'firebase/firestore'
import { db, auth } from '../firebase-config.js'

const Chat = ({ room }) =>{
    const [newMessage, setNewMessage] = useState(""); //will represent what the user is typing in the form input
    const [messages, setMessages] = useState([]);
    const messagesRef = collection(db, "messages"); //a reference to the messages collection

    function scrollToBottom() {
        const chatBox = document.querySelector(".chat-messages");
        chatBox.scrollTop = chatBox.scrollHeight;
    }


    //our program will be listening for any changes to the collection.
    //onSnapshot will help us specify exactly which changes to listen for.
    //In this case, we are only listening for changes in the messages collection for the room that the user user is in.
    useEffect( () => {
        if (!room) return; // Ensure room is defined before querying Firestore
        
        const queryMessages = query(
            messagesRef, 
            where("room", "==", room),
            orderBy("createdAt", "asc")  
        );
        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
            let messages = [];
            snapshot.forEach((doc) => {
                messages.push({...doc.data(), id: doc.id}); //push the data from doc into an empty messages array, along with a unique id
            });
            setMessages(messages);
            scrollToBottom();
        });
        return () => unsubscribe(); //cleaning up useEffect
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(newMessage === "") return;

        await addDoc(messagesRef, { 
            text: newMessage,
            createdAt: serverTimestamp(),
            user: auth.currentUser.displayName,
            room: room
        });

        setNewMessage("");  
        scrollToBottom();
    };
    

    return(
    <div className="generalForm">
        <div>
            <h1>Welcome to: {room.toUpperCase()}</h1>
        </div>
        <div className="chat-messages">
            {messages.map((message) => (
            <div className="message" key={message.id}>
                <span className="user">{message.user}: </span>
                {message.text}
            </div>))}
        </div>
        <footer>
        <form onSubmit={handleSubmit} className="new-message-form">
            <input type="text" className="new-message-input" placeholder="Type your message here..." onChange={(e) => setNewMessage(e.target.value)} value={newMessage} />
            <button type="submit" className="generalButton">Send</button>
        </form>
        </footer>
    </div>
    );
};

export default Chat;