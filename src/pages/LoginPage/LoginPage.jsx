import "./LoginPage.css";
import { useState } from "react";
import { auth } from "../../configuration/firebase-config.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import Header from "../../components/Header/Header";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userInfo = await signInWithEmailAndPassword(auth, email, password);
      const user = userInfo.user;

      if (user.emailVerified) {
        alert("Login successful!");
        navigate("/");
      } else {
        alert("Please verify your email before logging in!");
        auth.signOut();
      }
    } catch (error) {
      alert(`Error encountered: ${error.message}`);
    }
  };

  return (
    <div>
      <div className="login-container">
        <div className="login-form__box">
          <header>Login</header>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="login-form__input">
              <label htmlFor="email">Username</label>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              ></input>
            </div>
            <div className="login-form__input">
              <label htmlFor="email">Password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              ></input>
            </div>

            <button className="login-form__submit" type="submit">
              Login
            </button>
            <Link to="/register" className="login-form__link">
              Don't have an account? <span>Sign up</span>
            </Link>

            <Link to="/password" className="login-form__link">
              <span>Forgot your password? </span>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
