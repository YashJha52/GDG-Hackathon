import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/dashboard" className="navbar-brand">
          <span>🧠</span> CareerQuest Oracle
        </Link>
        
        <div className="navbar-user">
          <div className="user-info">
            <div className="user-avatar">{getInitial(user.name)}</div>
            <span>Welcome, {user.name} (Grade {user.grade})</span>
          </div>
          
          <div>
            <Link to="/dashboard" className="btn btn-outline" style={{ marginRight: '10px' }}>
              Dashboard
            </Link>
            <Link to="/assessment" className="btn" style={{ marginRight: '10px' }}>
              Assessment
            </Link>
            <button onClick={onLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;