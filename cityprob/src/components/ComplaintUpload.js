import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ComplaintUpload.css';

const ComplaintUpload = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState('');
  const [description, setDescription] = useState('');
  const [cmpImage, setCmpImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = sessionStorage.getItem('userId'); // Retrieve user ID from session storage

    const formData = new FormData();
    formData.append('name', name);
    formData.append('date', date);
    formData.append('priority', priority);  
    formData.append('description', description);
    formData.append('cmpImage', cmpImage);
    formData.append('userId', userId); // Append user ID to FormData

    try {
      await axios.post('http://localhost:8080/api/complaints', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/success');
    } catch (error) {
      console.error('Error submitting complaint:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCmpImage(file);
  };

  return (
    <div className="complaint-upload-body">
      <div className="complaint-upload-container">
        <h2 className="complaint-upload-header">Complaint Upload</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name of Complaint</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '92%' }}
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={{ width: '92%' }}
            />
          </div>
          <div className="form-group">
            <label>Priority</label>
            <input
              type="text"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
              style={{ width: '92%' }}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{ width: '92%' }}
            />
          </div>
          <div className="form-group">
            <label>Complaint Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              required
              style={{ width: '92%' }}
            />
          </div>
          <button type="submit" className="complaint-upload-btn">Submit Complaint</button>
        </form>
      </div>
    </div>
  );
};

export default ComplaintUpload;
