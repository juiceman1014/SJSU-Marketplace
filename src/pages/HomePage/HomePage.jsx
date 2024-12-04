
import './HomePage.css';
import { Link } from 'react-router-dom';


const HomePage = () => {
    return (
        <div className="home-container">
            

            <div className="banner">
                <h2>Connect, Trade, Thrive: Your Campus Marketplace Awaits!</h2>
            </div>

            
            <div className="content">
                <div className = "text">
                <p className="description">
                    Transaction is backed by trust and reliability to find what you need and make extra cash, all in a secure, student-friendly environment.
                </p>
                
                </div>
                <div className="image">
                    <img src = "/images/SJSU.png" alt="Description"></img>
                </div>
                    
            </div>
        </div>
    );
};

export default HomePage;