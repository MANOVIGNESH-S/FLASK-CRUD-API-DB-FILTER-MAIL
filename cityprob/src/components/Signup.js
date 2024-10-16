import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // State for messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    try {
      const response = await axios.post('http://localhost:8080/api/users/register', {
        name,
        mobileNumber,
        email,
        password,
      });
      const { id } = response.data; 
      console.log(id, 'User registered:', response.data);
      sessionStorage.setItem('userId', id); 
      setMessage('Registration Successful!...'); // Set success message
      setTimeout(() => navigate('/complaint-upload'), 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error('There was an error registering the user!', error);
      setMessage('Registration failed. Please try again.'); // Set error message
    }
  };

  return (
    <div className="signup-body">
      <div className="signup-container">
        <h2 className="signup-header">User Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="signup-form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="signup-form-group">
            <label>Mobile Number</label>
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
          </div>
          <div className="signup-form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="signup-form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="signup-btn">Sign Up</button>
          {message && (
            <p style={{ color: message.includes('Successful') ? 'green' : 'red', textAlign: 'center' }}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;
