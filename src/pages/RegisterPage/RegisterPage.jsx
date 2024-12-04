import "./RegisterPage.css";

import { Link, useNavigate} from "react-router-dom";
import { useState } from "react";
import { auth } from "../../configuration/firebase-config.js";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";


const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email.endsWith("@sjsu.edu")) {
      alert("Email must end with @sjsu.edu");
      return;
    }

    if(password !== confirmPassword){
      alert("Passwords do not match!");
      return;
    }

    try {
      const userInfo = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userInfo.user;

      await sendEmailVerification(user);

      alert("Successfully registered! Please verify your email address before proceeding!");
      navigate("/")
    } catch (error) {
      alert(`Error encountered: ${error.message}`);
    }
  };

  return (
    <div>
      <div className="register-container">
        <div className="register-form__box">
          <header>Welcome</header>

          <form className="register-form" onSubmit={handleRegister}>
            <div className="register-form__input">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              ></input>
            </div>

            <div className="register-form__input">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              ></input>
            </div>

            <div className="register-form__input">
              <label htmlFor="password">Confirm Password:</label>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              ></input>
            </div>

            <button className="register-form__submit" type="submit">
              Sign Up
            </button>
            <Link to="/login" className="register-form__link">
              Already have an account? <span>Log In</span>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
