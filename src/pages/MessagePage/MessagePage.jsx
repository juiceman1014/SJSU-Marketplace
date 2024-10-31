import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../../configuration/firebase-config";
import { ref, onValue, push, update } from "firebase/database";
import "./MessagePage.css";

const MessagePage = () => {
    const { buyerID, sellerID, conversationID } = useParams();
    const [conversations, setConversations] = useState([]);
    const [ messages, setMessages ] = useState([]);
    const [ newMessage, setNewMessage] = useState("");
    const currentUserID = auth.currentUser.uid;

    useEffect(() => {
        const userConversationsRef = ref(db, `users/${currentUserID}/conversations`);
        const unsubscribe = onValue(userConversationsRef, (snapshot) => {
            if(snapshot.exists()){
                setConversations(Object.keys(snapshot.val()));
            }
        });

        return() => unsubscribe();
    }, [currentUserID]);

    useEffect(() => {
        const messagesRef = ref(db, `conversations/${conversationID}/messages`);
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            if(snapshot.exists()){
                setMessages(Object.values(snapshot.val()));
            }else{
                setMessages([]);
            }
        });

        return () => unsubscribe();

    }, [conversationID]);
    
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if(!newMessage.trim()) return;

        const messageRef = ref(db, `conversations/${conversationID}/messages`);
        await push(messageRef, {senderID: currentUserID, message: newMessage, timestamp: Date.now() });
        
        const conversationRef = ref(db, `conversations/${conversationID}`);
        await update(conversationRef, { lastMessageSnippet: newMessage, lestMessageTimestamp: Date.now() });
        setNewMessage("");
    }

    return(
        <div className = "messages-container">
            <div className = "conversations-list">
                <h3>Your Conversations</h3>
                {conversations.map((convoID) => (
                    <div key = {convoID} onClick = {() => setMessages([])}>
                        <p>{convoID === conversationID ? `Conversation with ${sellerID}` : `Conversation ID: ${convoID}`}</p>
                    </div>
                ))}
            </div>


            
        </div>

    );
};

export default MessagePage;