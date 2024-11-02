import './Header.css'
import { Link } from 'react-router-dom'; 

const Header = () =>{
    return(
        <div className = "header-parent-container">
            <p><Link to="/">Home</Link></p>
            <p><Link to="/register">Register</Link></p>
            <p><Link to="/login">Log In</Link></p>
            <p><Link to="/listing">Listings</Link></p>
            <p><Link to="/profile">Profile</Link></p>
            <p><Link to="/message">Messages</Link></p>
        </div>
    )
}

export default Header