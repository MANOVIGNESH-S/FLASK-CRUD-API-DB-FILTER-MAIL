import React, { useState } from 'react';
import './QueryProcess.css';

const QueryProcess = () => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle query submission logic here
    console.log('Query submitted:', query);
  };

  return (
    <div className="query-body">
      <div className="query-container">
        <h2 className="query-header">Submit a Query</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Query</label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="query-btn">Submit Query</button>
        </form>
      </div>
    </div>
  );
};

export default QueryProcess;
