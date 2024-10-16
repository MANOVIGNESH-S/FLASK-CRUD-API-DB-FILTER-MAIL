import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-body">
      <div className="landing-page-container">
        <div className="content-wrapper">
          <h1 className="page-title">Grievance Facilitation Center</h1>
          <p className="instruction-text">Select an option to proceed:</p>
          <div className="button-group">
            <a href="/admin-login" className="button admin-button">Admin Login</a>
            <a href="/user-login" className="button user-button">User Login</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
