import "./ProfilePage.css";
import { useState, useEffect } from "react";
import { auth, db } from "../../configuration/firebase-config.js";
import { ref, update } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if(!user.emailVerified){
          navigate("/");
          alert("Your email must be verified to access this page!");
          return;
        }
      }
    });

    return () => unsubscribe;
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const userID = auth.currentUser.uid;
      const userRef = ref(db, `users/${userID}`);

      await update(userRef, {
        username: username,
      });

      alert("Username updated successfully!");
    } catch (error) {
      alert("Error updating username: " + error);
    }
  };
  return (
    <div>
      <div className="profile-container">
        <header>Profile</header>

        <form className="profile-form" onSubmit={handleUpdate}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
          <button type="submit">Update Username</button>
          <button><Link to="/password">Reset Password</Link></button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
