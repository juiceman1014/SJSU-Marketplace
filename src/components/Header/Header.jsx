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
    
    return(
        <div className = "header-parent-container">
            <p><Link to="/">Home</Link></p>
            <p><Link to="/login">Log In</Link></p>
            <p><Link to="/listing">Listings</Link></p>
            <p><Link to="/profile">Profile</Link></p>
            <p><Link to="/message">Messages</Link></p>
        </div>
    )
}

export default Header