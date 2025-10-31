import React from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

const Navbar = () => {
  const user = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  return (
    <div className="navbar">
      <div className="navbar-content">
        <h1>Task Manager</h1>
        <nav>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <span style={{ color: '#475569', fontWeight: '500' }}>
                {user?.name} ({user?.role})
              </span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
