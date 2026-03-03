import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./Header.css";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <div className="logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="url(#logoGrad)" />
              <path
                d="M7 8h14M7 12h10M7 16h12M7 20h8"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="21" cy="18" r="4" fill="#10b981" />
              <path
                d="M19.5 18l1 1 2-2"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-title">ResumeAI</span>
            <span className="logo-subtitle">ATS Checker</span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="header-nav">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Home
          </Link>
        </nav>

        {/* Auth Buttons / User Info */}
        <div className="header-auth">
          {isAuthenticated ? (
            <div className="user-info">
              <span className="user-name">Hi, {user?.name?.split(" ")[0] || "User"}</span>
              <button onClick={handleLogout} className="auth-btn logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-btn login-btn">
                Login
              </Link>
              <Link to="/register" className="auth-btn register-btn">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Badge */}
        <div className="header-badge">
          <span className="badge-dot"></span>
          <span>AI Powered</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
