import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Filter, ChevronDown, ChevronUp, Mail, X } from 'lucide-react';
import './ViewComplaints.css';

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/complaints');
        setComplaints(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch complaints. Please try again later.');
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  // Normalize priority names and sort by priority
  const normalizePriority = (priority) => {
    const priorityMap = {
      'high': 'High',
      'medium': 'Medium',
      'low': 'Low',
      'HIGH': 'High',
      'MEDIUM': 'Medium',
      'LOW': 'Low'
    };
    return priorityMap[priority] || 'Unknown';
  };

  const sortComplaintsByPriority = (complaintsToSort, order) => {
    const priorityOrder = {
      'High': 3,
      'Medium': 2,
      'Low': 1,
      'Unknown': 0
    };

    return [...complaintsToSort].sort((a, b) => {
      const priorityA = priorityOrder[normalizePriority(a.priority)] ?? priorityOrder['Unknown'];
      const priorityB = priorityOrder[normalizePriority(b.priority)] ?? priorityOrder['Unknown'];

      if (priorityA === priorityB) {
        // If priorities are the same, sort by date (most recent first)
        return new Date(b.date) - new Date(a.date);
      }

      return order === 'asc' ? priorityA - priorityB : priorityB - priorityA;
    });
  };

  const sortedComplaints = useMemo(() => {
    return sortComplaintsByPriority(complaints, sortOrder);
  }, [complaints, sortOrder]);

  const filteredComplaints = useMemo(() => {
    return filterPriority === 'all'
      ? sortedComplaints
      : sortedComplaints.filter(complaint => normalizePriority(complaint.priority).toLowerCase() === filterPriority);
  }, [sortedComplaints, filterPriority]);

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'desc' ? 'asc' : 'desc'));
  };

  const priorityCounts = complaints.reduce((acc, complaint) => {
    const normalizedPriority = normalizePriority(complaint.priority);
    acc[normalizedPriority] = (acc[normalizedPriority] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(priorityCounts).map(([priority, count]) => ({
    priority,
    count,
  }));

  const handleEmailClick = (e, complaint) => {
    e.stopPropagation();
    setSelectedComplaint(complaint);
    setEmailModalOpen(true);
    setEmailSubject(`Regarding your complaint: ${complaint.name}`);
    setEmailBody(
      `Dear ${complaint.user.name},\n\nWe have received your complaint regarding "${complaint.name}" submitted on ${new Date(complaint.date).toLocaleDateString()}. We are currently reviewing your case and will get back to you shortly.\n\nBest regards,\nComplaint Management Team`
    );
  };

  const sendEmail = async () => {
    try {
      await axios.post('http://localhost:8080/api/send-email', {
        to: selectedComplaint.user.email,
        subject: emailSubject,
        body: emailBody,
      });
      alert('Email sent successfully!');
      setEmailModalOpen(false);
    } catch (err) {
      alert('Failed to send email. Please try again.');
    }
  };

  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
    setDetailModalOpen(true);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="view-complaints-body">
      <div className="view-complaints-container">
        <h1 className="view-complaints-header">Complaint Management Dashboard</h1>
        <div className="complaints-content">
          <div className="complaints-summary">
            <h2 className="complaints-subheader">Complaints Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="priority" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3498db" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="complaints-list-container">
            <h2 className="complaints-subheader">Recent Complaints</h2>
            <div className="complaints-controls">
              <div className="filter-dropdown">
                <Filter size={18} />
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <button className="sort-button" onClick={toggleSortOrder}>
                Sort by Priority {sortOrder === 'asc' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>
            {filteredComplaints.length === 0 ? (
              <p className="no-complaints">No complaints found.</p>
            ) : (
              <ul className="complaints-list">
                {filteredComplaints.map((complaint) => (
                  <li
                    key={complaint.id}
                    className="complaint-item"
                    onClick={() => handleComplaintClick(complaint)}
                  >
                    <div className="complaint-header">
                      <h3>{complaint.name}</h3>
                      <div className="complaint-actions">
                        <span className={`priority ${normalizePriority(complaint.priority).toLowerCase()}`}>
                          {normalizePriority(complaint.priority)}
                        </span>
                        <button className="email-button" onClick={(e) => handleEmailClick(e, complaint)}>
                          <Mail size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="complaint-details">
                      <p><strong>Date:</strong> {new Date(complaint.date).toLocaleDateString()}</p>
                      <p><strong>Description:</strong> {complaint.description.substring(0, 100)}...</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      {emailModalOpen && (
        <div className="modal email-modal">
          <div className="modal-content email-modal-content">
            <h2>Compose Email</h2>
            <p><strong>To:</strong> {selectedComplaint.user.email}</p>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Subject"
              className="email-input"
            />
            <textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              placeholder="Email body"
              className="email-textarea"
            />
            <div className="email-actions">
              <button className="send-email" onClick={sendEmail}>Send Email</button>
              <button className="close-modal" onClick={() => setEmailModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {detailModalOpen && selectedComplaint && (
        <div className="modal detail-modal">
          <div className="modal-content detail-modal-content">
            <button className="close-modal" onClick={() => setDetailModalOpen(false)}>
              <X size={24} />
            </button>
            <h2>{selectedComplaint.name}</h2>
            <p><strong>Priority:</strong> <span className={`priority ${normalizePriority(selectedComplaint.priority).toLowerCase()}`}>{normalizePriority(selectedComplaint.priority)}</span></p>
            <p><strong>Date:</strong> {new Date(selectedComplaint.date).toLocaleDateString()}</p>
            <p><strong>Description:</strong> {selectedComplaint.description}</p>
            <p><strong>Submitted by:</strong> {selectedComplaint.user.name} ({selectedComplaint.user.email})</p>
            {selectedComplaint.image && (
              <div className="complaint-image-container">
                <img
                  src={`data:image/jpeg;base64,${selectedComplaint.image}`}
                  alt="Complaint"
                  className="complaint-image"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewComplaints;
