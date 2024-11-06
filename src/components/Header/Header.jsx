import './Header.css'
import { Link, useNavigate } from 'react-router-dom'; 
import { useState, useEffect } from "react";
import { auth, db } from "../../configuration/firebase-config.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, get } from "firebase/database";

const Header = () =>{
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if(currentUser){
                setUser(currentUser);
                const userRef = ref(db, `users/${currentUser.uid}/username`);
                get(userRef).then((snapshot) => {
                    if(snapshot.exists()){
                        setUsername(snapshot.val());
                    }
                });
            }else{
                setUser(null);
                setUsername("");
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        signOut(auth).then(() => {
            navigate("/");
        }).catch((error) => {
            alert("Error logging out: ", error);
        });
    };


    return(
        <div className = "header-parent-container">
            <p><Link to="/">Home</Link></p>
            <p><Link to="/listing">Listings</Link></p>
            <p><Link to="/profile">Profile</Link></p>
            <p><Link to="/message">Messages</Link></p>

            {user ? (
                <div>
                <p>Hi, {username}</p>
                <button onClick = {handleLogout}>Logout</button>
                </div>
            ) : (
                <p><Link to="/login">Log In</Link></p>
            )}
        </div>
    )
}


export default Header;
