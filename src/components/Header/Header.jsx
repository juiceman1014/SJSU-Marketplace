import './Header.css'
import { Link } from 'react-router-dom'; 

const Header = () =>{
    return(
        <div className = "header-parent-container">
            <p><Link to="/">Home</Link></p>
        </div>
    )
}

export default Header