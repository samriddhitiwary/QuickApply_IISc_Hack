import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">🚀 Quick Apply</div>
      <ul className="nav-links">
        <li><Link to="/">🏠 Dashboard</Link></li>
        <li><Link to="/jobs">🔍 Job Listings</Link></li>
        <li><Link to="/resume">📄 Resume Optimizer</Link></li>
        <li><Link to="/saved">📌 Saved Jobs</Link></li>
        <li><Link to="/tracker">📊 Application Tracker</Link></li>
        <li><Link to="/profile">⚙️ Profile</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
