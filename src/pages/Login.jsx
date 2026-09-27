import { useState } from "react";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "../firebase";

import "./Auth.css";


function Login({
  onSwitchToSignup,
}) {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showForgotPassword, setShowForgotPassword] =
    useState(false);


  // =========================================
  // LOGIN
  // =========================================

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      window.location.reload();

    } catch (error) {

      alert(
        "Login failed: " +
        error.message
      );

    }
  };


  // =========================================
  // FORGOT PASSWORD
  // =========================================

  const handleForgotPassword =
    async (e) => {

      e.preventDefault();

      if (!email) {

        alert(
          "Please enter your email address first."
        );

        return;
      }


      try {

        await sendPasswordResetEmail(
          auth,
          email
        );

        alert(
          "Password reset email sent! Please check your inbox."
        );

        setShowForgotPassword(
          false
        );

      } catch (error) {

        alert(
          "Password reset failed: " +
          error.message
        );

      }
    };


  // =========================================
  // FORGOT PASSWORD SCREEN
  // =========================================

  if (showForgotPassword) {

    return (

      <div className="auth-page">

        <div className="auth-card">

          <div className="auth-logo">
            🔐
          </div>


          <h1>
            Expense Tracker
          </h1>


          <p className="auth-subtitle">
            Manage your money smarter
          </p>


          <h2>
            Reset Password 🔑
          </h2>


          <p className="auth-description">
            Enter your email and we will
            send you a password reset link.
          </p>


          <form
            onSubmit={
              handleForgotPassword
            }
          >

            <div className="input-group">

              <label>
                Email Address
              </label>


              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                required
              />

            </div>


            <button
              className="auth-btn"
              type="submit"
            >
              Send Reset Email
            </button>

          </form>


          <div className="auth-switch">

            <button
              type="button"
              onClick={() =>
                setShowForgotPassword(
                  false
                )
              }
            >
              ← Back to Login
            </button>

          </div>


          <div className="auth-footer">

            <p>
              🔒 Password reset is handled
              securely by Firebase.
            </p>

          </div>

        </div>

      </div>

    );
  }


  // =========================================
  // LOGIN SCREEN
  // =========================================

  return (

    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          💰
        </div>


        <h1>
          Expense Tracker
        </h1>


        <p className="auth-subtitle">
          Manage your money smarter
        </p>


        <h2>
          Welcome Back 👋
        </h2>


        <p className="auth-description">
          Login to continue to your dashboard
        </p>


        <form
          onSubmit={handleLogin}
        >

          <div className="input-group">

            <label>
              Email Address
            </label>


            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              required
            />

          </div>


          <div className="input-group">

            <label>
              Password
            </label>


            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              required
            />

          </div>


          {/* FORGOT PASSWORD */}

          <div className="forgot-password">

            <button
              type="button"
              onClick={() =>
                setShowForgotPassword(
                  true
                )
              }
            >
              Forgot Password?
            </button>

          </div>


          <button
            className="auth-btn"
            type="submit"
          >
            Login
          </button>

        </form>


        <div className="auth-switch">

          <span>
            Don't have an account?
          </span>


          <button
            type="button"
            onClick={
              onSwitchToSignup
            }
          >
            Sign Up
          </button>

        </div>


        <div className="auth-footer">

          <p>
            🔒 Your financial data is
            securely stored with Firebase.
          </p>

        </div>

      </div>

    </div>

  );
}


export default Login;