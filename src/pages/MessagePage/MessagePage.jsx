import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../../configuration/firebase-config";
import { ref, onValue, push, update } from "firebase/database";
import "./MessagePage.css";

const MessagePage = () => {
    const { buyerID, sellerID, conversationID } = useParams();
    const [conversations, setConversations] = useState([]);
    const [ messages, setMessage ] = useState([]);
    const [ newMessages, setNewMesage] = useState("");
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
    
    return(
        <div>
            <div className = "message-container">Message Page</div>
        </div>

    );
};

export default MessagePage;