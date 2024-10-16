import React, { useState } from 'react';
import './ComplaintStatus.css';

const ComplaintStatus = () => {
  const [complaintId, setComplaintId] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle status upload logic here
    console.log('Status uploaded:', { complaintId, status });
  };

  return (
    <div className="status-upload-body">
      <div className="status-upload-container">
        <h2 className="status-upload-header">Update Complaint Status</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Complaint ID</label>
            <input
              type="text"
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="status-upload-btn">Update Status</button>
        </form>
      </div>
    </div>
  );
};

export default ComplaintStatus;
