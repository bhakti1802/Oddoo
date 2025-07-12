// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (!token) return null; // Hide navbar if not logged in

  return (
    <nav style={styles.nav}>
      <h3>SkillSwap</h3>
      <div style={styles.links}>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/browse" style={styles.link}>Browse</Link>
        <Link to="/swaps" style={styles.link}>Swaps</Link>
        <Link to="/profile" style={styles.link}>Profile</Link>
        <button onClick={handleLogout} style={styles.logout}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: '#333',
    color: '#fff',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  links: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
  logout: {
    background: '#ff4d4d',
    border: 'none',
    color: 'white',
    padding: '5px 10px',
    cursor: 'pointer'
  }
};
