import "./LoginPage.css";
import { useState } from "react";
import { auth } from "../../configuration/firebase-config.js";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try{
        const userInfo = await signInWithEmailAndPassword(auth, email, password);
        const user = userInfo.user;

        if(user.emailVerified){
            alert("Login successful!");
        }else{
            alert("Please verify your email before logging in!");
            auth.signOut();
        }
    }catch(error){
        alert(`Error encountered: ${error.message}`);
    }
  };

  return (
    <div className="login-container">
      <header>Login</header>

      <form className="login-form" onSubmit = {handleLogin}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        ></input>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        ></input>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default LoginPage;
