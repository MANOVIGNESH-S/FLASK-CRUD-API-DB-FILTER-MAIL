  import React from 'react';
  import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
  import Home from './components/Home';
  import AdminLogin from './components/AdminLogin';
  import UserLogin from './components/UserLogin';
  import Signup from './components/Signup';
  import ComplaintUpload from './components/ComplaintUpload';
  import ViewComplaint from './components/ViewComplaints';
  import ComplaintStatus from './components/ComplaintStatus';
  import QueryProcess from './components/QueryProcess';
  import RegistrationSuccess from './components/RegistrationSuccess';
  import './App.css';

  function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/complaint-upload" element={<ComplaintUpload />} />
          <Route path="/view-complaint" element={<ViewComplaint />} />
          <Route path="/complaint-status" element={<ComplaintStatus />} />
          <Route path="/query-process" element={<QueryProcess />} />
          <Route path="/success" element={<RegistrationSuccess />} />
        </Routes>
      </Router>
    );
  }

  export default App;
