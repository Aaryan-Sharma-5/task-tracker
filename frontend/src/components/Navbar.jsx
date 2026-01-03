import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthState = () => {
      setUser(authService.getCurrentUser());
      setIsAuthenticated(authService.isAuthenticated());
    };

    checkAuthState();

    window.addEventListener('authStateChanged', checkAuthState);
    window.addEventListener('storage', checkAuthState);

    return () => {
      window.removeEventListener('authStateChanged', checkAuthState);
      window.removeEventListener('storage', checkAuthState);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
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
