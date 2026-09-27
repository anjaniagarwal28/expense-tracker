import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "./Auth.css";

function Signup({ onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Account created successfully!");
    } catch (error) {
      alert("Signup failed: " + error.message);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          💰
        </div>

        <h1>Expense Tracker</h1>

        <p className="auth-subtitle">
          Manage your money smarter
        </p>

        <h2>Create Account ✨</h2>

        <p className="auth-description">
          Start tracking your income and expenses
        </p>

        <form onSubmit={handleSignup}>

          <div className="input-group">

            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>

          <div className="input-group">

            <label>Password</label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>

          <div className="input-group">

            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              required
            />

          </div>

          <button
            className="auth-btn"
            type="submit"
          >
            Create Account
          </button>

        </form>

        {/* Login Switch */}
        <div className="auth-switch">

          <span>
            Already have an account?
          </span>

          <button
            type="button"
            onClick={onSwitchToLogin}
          >
            Login
          </button>

        </div>

        <div className="auth-footer">

          <p>
            🔒 Your account is securely protected
            with Firebase Authentication.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Signup;