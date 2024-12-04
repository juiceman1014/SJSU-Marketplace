import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../../configuration/firebase-config";
import { ref, onValue, push, update, get} from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import "./MessagePage.css";

const MessagePage = () => {
    const { buyerID, sellerID, conversationID } = useParams();
    const [ conversations, setConversations ] = useState([]);
    const [ conversationNames, setConversationNames ] = useState({});
    const [ messages, setMessages ] = useState([]);
    const [ newMessage, setNewMessage] = useState("");
    const [ currentUserID, setCurrentUserID] = useState(null);
    const [ loading, setLoading] = useState(true);
    const [ otherPersonName, setOtherPersonName ] = useState("");
    const [ currentUserName, setCurrentUsername ] = useState("");
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    const isGeneralMessagePage = !buyerID || !sellerID || !conversationID;
    const otherPersonID = currentUserID === buyerID ? sellerID : buyerID;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth,(user) => {
            if(user){
                if(!user.emailVerified){
                    navigate("/");
                    alert("Your email must be verified to access messages!");
                    return;
                }
                setCurrentUserID(user.uid);

                const userRef = ref(db, `users/${user.uid}/username`);
                get(userRef).then((snapshot) => {
                    if(snapshot.exists()){
                        setCurrentUsername(snapshot.val());
                    }
                });
            }else{
                setCurrentUserID(null);
            }
            setLoading(false);
        })

        return () => unsubscribe;
    }, []);

    useEffect(() => {
        const userConversationsRef = ref(db, `users/${currentUserID}/conversations`);
        const unsubscribe = onValue(userConversationsRef, async (snapshot) => {
            if(snapshot.exists()){
                const conversationIDs = Object.keys(snapshot.val());
                setConversations(conversationIDs);

                const names = {};
                for(const convoID of conversationIDs){
                    const [id1, id2] = convoID.split("_");
                    const otherUserID = id1 === currentUserID ? id2 : id1;

                    const otherUserRef = ref(db, `users/${otherUserID}/username`);
                    const otherUserSnapshot = await get(otherUserRef);
                    if(otherUserSnapshot.exists()){
                        names[convoID] = otherUserSnapshot.val();
                    }else{
                        names[convoID] = "Unknown User";
                    }
                }

                setConversationNames(names);
            }
        });

        return() => unsubscribe();
    }, [currentUserID]);

    useEffect(() => {
        if(!otherPersonID) return;

        const fetchUsername = async() =>{
            try{
                const userRef = ref(db, `users/${otherPersonID}/username`);
                const snapshot = await get(userRef);
                if(snapshot.exists()){
                    setOtherPersonName(snapshot.val());
                }else{
                    setOtherPersonName("Unknown User");
                }
            }catch(error){
                console.error("Error fetching username: ", error);
                setOtherPersonName("Unknown User");
            }
        }
        
        fetchUsername();
    }, [otherPersonID]);

    useEffect(() => {
        
        const messagesRef = ref(db, `conversations/${conversationID}/messages`);
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            if(snapshot.exists()){
                const messagesWithNames = Object.values(snapshot.val()).map((msg) => ({
                    ...msg,
                    senderName: msg.senderID === currentUserID ? currentUserName : otherPersonName,
                }));
                setMessages(messagesWithNames);
            }else{
                setMessages([]);
            }
        });

        return () => unsubscribe();

    }, [conversationID, currentUserName, otherPersonName, currentUserID]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if(!newMessage.trim()) return;

        const messageRef = ref(db, `conversations/${conversationID}/messages`);
        await push(messageRef, {senderID: currentUserID, senderName: currentUserName, message: newMessage, timestamp: Date.now() });
        
        const conversationRef = ref(db, `conversations/${conversationID}`);
        await update(conversationRef, { lastMessageSnippet: newMessage, lestMessageTimestamp: Date.now() });
        setNewMessage("");
    }

    const handleConversationClick = async (convoID) =>{
        const conversationRef = ref(db, `conversations/${convoID}/participants`);
        const snapshot = await get(conversationRef);

        if(snapshot.exists){
            const participants = Object.keys(snapshot.val());
            const buyerID = participants[0];
            const sellerID = participants[1];
            navigate(`/message/${buyerID}/${sellerID}/${convoID}`);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    };

    if(loading){
        return <p>Loading...</p>;
    }

    if(!currentUserID){
        navigate("/");
        alert("Please log in to view messages!");
    }
    

    return(
        <div>
            
            <div className = "messages-container">
                <div className = "conversations-list">
                    <h3>Messages</h3>
                    {conversations.map((convoID) => (
                        <div key = {convoID} onClick = {() => handleConversationClick(convoID)}>
                            <p>{`${conversationNames[convoID] || "Unknown User"}`}</p>
                        </div>
                    ))}
                </div>
                
                {!isGeneralMessagePage && (
                <div className = "conversation-messages">
                    <h3>{otherPersonName} </h3>
                    <div className = "messages-list">
                        {messages.map((msg, index) => (
                            <div key = {index} className = {msg.senderID === currentUserID ? "message-outgoing" : "message-incoming"}>
                                <p> <strong>{msg.senderName}:</strong> {msg.message}</p>
                            </div>
                        ))}
                        <div ref={messagesEndRef}/>
                    </div>
                    <form className="message-form" onSubmit = {handleSendMessage}>
                        <input type = "text" placeholder = "Type your message..." value = {newMessage} onChange={(e) => setNewMessage(e.target.value)}/>
                        <button type = "submit">Send</button>
                    </form>
                </div> 
                )}

                {isGeneralMessagePage && (
                    <div className="general-message">
                        <img src = "/images/SpartanLogo.png" alt="Description"></img>
                        <p>Select a conversation to get started!</p>
                  </div>
                )} 
            </div>
        </div>
    );
};

export default MessagePage;