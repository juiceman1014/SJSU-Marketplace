import './HomePage.css'
import { Link } from 'react-router-dom'; 

const HomePage = () =>{
    return(
        <div className = "home-parent-container">
            <div className = "links-div">
                <p><Link to="/register">Register</Link></p>
                <p><Link to="/login">Log In</Link></p>
                <p>Post</p>
            </div>
        </div>
    )
}

export default HomePage