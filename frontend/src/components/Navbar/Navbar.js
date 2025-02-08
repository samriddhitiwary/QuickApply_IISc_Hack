import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./Firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { FaUserCircle } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">🚀 Quick Apply</div>
      <ul className="nav-links">
        <li><Link to="/">🏠 Dashboard</Link></li>
        <li><Link to="/jobs">🔍 Job Listings</Link></li>
        <li><Link to="/resume">📄 Resume Optimizer</Link></li>
        <li><Link to="/saved">📌 Saved Jobs</Link></li>
        <li><Link to="/tracker">📊 Application Tracker</Link></li>
        
        {user ? (
          <li className="profile-dropdown">
            <FaUserCircle 
              size={30} 
              className="profile-icon" 
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">👤 Profile</Link>
                <button className="dropdown-item logout-btn" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            )}
          </li>
        ) : (
          <li>
            <button className="login-btn" onClick={() => navigate("/login")}>
              🔑 Login
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
