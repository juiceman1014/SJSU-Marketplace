import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, db } from "../../configuration/firebase-config.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, get } from "firebase/database";

const Header = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = ref(db, `users/${currentUser.uid}/username`);
        get(userRef).then((snapshot) => {
          if (snapshot.exists()) {
            setUsername(snapshot.val());
          }
        });
      } else {
        setUser(null);
        setUsername("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        alert("Error logging out: ", error);
      });
  };

  const toggleLogout = () => {
    setShowLogout(!showLogout);
  };

  return (
    <div className="header-parent-container">
      <header className="header">
        <Link className="title-link" to="/">
          <h1 className="logo">
            SJSU <span className="marketplace">MarketPlace</span>
          </h1>
        </Link>

        <nav className="nav-links">
          <Link to="/listing">Listing</Link>
          <Link to="/message">Message</Link>
          <Link to="/profile">Profile</Link>

          {user ? (
            <div className="nav-logged-in">
              <p onClick={toggleLogout} className="icon">Hi, {username || "Anonymous"}</p>
              {showLogout && (
                <button onClick={handleLogout} className="logout-dropdown">
                  Logout
                </button>
              )}
            </div>
          ) : (
            <Link to="/login">Log In</Link>
          )}
        </nav>
      </header>
    </div>
  );
};

export default Header;
