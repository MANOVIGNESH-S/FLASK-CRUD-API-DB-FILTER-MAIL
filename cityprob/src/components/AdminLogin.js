import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './AdminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle admin login logic here
    console.log('Admin logged in:', { username, password });
    // Navigate to the Complaint Status page
    navigate('/view-complaint');
  };

  return (
    <div className="admin-login-body">
      <div className="admin-login-container">
        <h2 className="admin-login-header">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="admin-login-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
