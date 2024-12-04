import "./PasswordPage.css";
import { useState } from "react";
import { auth } from "../../configuration/firebase-config.js";
import { sendPasswordResetEmail } from "firebase/auth";

const PasswordPage = () => {
  const [email, setEmail] = useState("");

  const handlePasswordReset = async (e) =>{
    e.preventDefault();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset email sent!");
      })
      .catch((error) => {
        alert("Error resetting email!", error);
      })
  }

  return (
    <div className="password-reset-container">
      <div className="password-reset-form__box">
        <h1 className="password-reset-form__title">Password Reset</h1>
        <form className="password-reset-form" onSubmit={handlePasswordReset}>
          <input
            type="email"
            placeholder="Enter Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Reset</button>
        </form>
      </div>
    </div>
  );
};

export default PasswordPage;