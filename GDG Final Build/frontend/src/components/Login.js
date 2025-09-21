import React, { useState } from 'react';
import { loginUser } from '../services/api';

const Login = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await loginUser(name, grade);
      onLogin(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="card login-card">
        <div className="login-logo">🧠</div>
        <h1>CareerQuest Oracle</h1>
        <p>Discover your career path through AI-powered assessment</p>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="grade">Your Grade Level</label>
            <select
              id="grade"
              className="form-control"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              required
            >
              <option value="">Select Grade</option>
              <option value="6">6th Grade</option>
              <option value="7">7th Grade</option>
              <option value="8">8th Grade</option>
              <option value="9">9th Grade</option>
              <option value="10">10th Grade</option>
              <option value="11">11th Grade</option>
              <option value="12">12th Grade</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-block" 
            disabled={isLoading}
            style={{width: '100%'}}
          >
            {isLoading ? <div className="spinner"></div> : 'Begin Your Journey'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;