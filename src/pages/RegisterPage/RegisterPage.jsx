import "./RegisterPage.css";
import { useState } from "react";
import { auth } from "../../configuration/firebase-config.js";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if(!email.endsWith("@sjsu.edu")){
        alert("Email must end with @sjsu.edu");
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

      alert("Successfully registered! Please verify your email address!");
    } catch (error) {
      alert(`Error encountered: ${error.message}`);
    }
  };

  return (
    <div className="register-container">
      <header>Register</header>

      <form className="register-form" onSubmit = {handleRegister}>
        <input type="email" 
        placeholder="Email Address" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        >
        </input>
        <input type="password" 
        placeholder="Password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        >
        </input>
        <button type = "submit">Submit</button>
      </form>
    </div>
  );
};

export default RegisterPage;
