import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './UserLogin.css';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for error messages
  const [success, setSuccess] = useState(''); // State for success messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setSuccess(''); // Clear previous success messages

    try {
      const response = await axios.post('http://localhost:8080/api/users/login', {
        email,
        password,
      });

      if (response.data && response.data.id) {
        // Store user ID in session storage
        sessionStorage.setItem('userId', response.data.id);
        setSuccess('Login successful!...');
        setTimeout(() => navigate('/complaint-upload'), 2000); // Redirect after 2 seconds
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="user-login-body">
      <div className="user-login-container">
        <h2 className="user-login-header">User Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="user-form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="user-form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="user-login-btn">Login</button>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
        </form>
        <p className="user-signup-link">
          No account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
