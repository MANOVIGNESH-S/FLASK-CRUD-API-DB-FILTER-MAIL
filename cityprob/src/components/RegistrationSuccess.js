import React from 'react';
import './RegistrationSuccess.css'; // Ensure to create this file for CSS styles

const RegistrationSuccess = () => {
  return (
    <div className="success-body">
      <div className="success-container">
        <h2 className="success-header">Registration Successful</h2>
        <p className="success-message">
          Thank you for submitting your complaint. You will receive a response through email within 4-5 working days. If you have any further questions, please do not hesitate to contact us.
        </p>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
