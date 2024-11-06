import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <Link className="title-link" to="/">
        <h1 className="logo">
         SJSU <span className="marketplace">MarketPlace</span>
        </h1>
      </Link>

      <nav className="nav-links">
        <Link to="/listing">Listing</Link>
        <Link to="/message">Message</Link>
        <Link to="/login">Login/Logout</Link>
      </nav>
    </header>
  );
};

export default Header;
