// pages/LoginPage.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedButton from '../components/AnimatedButton';
import './LoginPage.css';

const LoginPage = ({ onLogin, connectionStatus }) => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeInput, setActiveInput] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!name.trim()) {
      setFormError('Please enter your name');
      return;
    }
    
    if (!grade) {
      setFormError('Please select your grade');
      return;
    }

    if (name && grade) {
      setIsLoading(true);
      try {
        await onLogin(name, parseInt(grade));
      } catch (error) {
        setFormError('Login failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const iconGrid = [
    { icon: '🚀', row: 1, col: 1, delay: 0 },
    { icon: '💡', row: 1, col: 3, delay: 0.5 },
    { icon: '🎯', row: 2, col: 2, delay: 1 },
    { icon: '📊', row: 3, col: 1, delay: 1.5 },
    { icon: '🌟', row: 3, col: 3, delay: 2 }
  ];

  return (
    <div className="login-page">
      <div className="background-overlay"></div>
      
      <div className="floating-icons-grid">
        {iconGrid.map((item, index) => (
          <motion.div
            key={index}
            className="grid-icon"
            style={{
              gridRow: item.row,
              gridColumn: item.col
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: item.delay,
              duration: 0.8,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ scale: 1.2, rotate: 10 }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>

      <div className="login-content">
        <motion.div 
          className="login-illustration"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="illustration-container">
            <div className="main-illustration">
              <div className="ai-brain">🔮</div>
              <div className="circular-glow"></div>
            </div>
            <h2 className="illustration-text">Discover Your Career Path</h2>
            <p className="illustration-subtext">AI-powered analysis of your unique talents</p>
            
            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-icon">✅</span>
                <span>Personalized Analysis</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✅</span>
                <span>Career Recommendations</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✅</span>
                <span>Skill Assessment</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="login-form-container"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="form-wrapper">
            <div className="form-header">
              <motion.div 
                className="logo"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              >
                <span className="logo-icon">🔮</span>
                <span className="logo-text">CareerQuest Oracle</span>
              </motion.div>
              <h1 className="welcome-text">Welcome to CareerQuest</h1>
              <p className="welcome-subtext">Discover your career path through AI analysis</p>
            </div>

            <motion.form 
              onSubmit={handleSubmit}
              className="login-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {formError && (
                <div className="form-error">
                  <span className="error-icon">⚠️</span>
                  {formError}
                </div>
              )}

              <div className="form-group">
                <div className={`input-field ${activeInput === 'name' ? 'active' : ''} ${name ? 'filled' : ''}`}>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setFormError('');
                    }}
                    onFocus={() => setActiveInput('name')}
                    onBlur={() => setActiveInput('')}
                    required
                    className="modern-input"
                    disabled={isLoading}
                  />
                  <label htmlFor="name" className="input-label">
                    <span className="label-text">Your Name</span>
                  </label>
                  <div className="input-highlight"></div>
                </div>
              </div>

              <div className="form-group">
                <div className={`input-field ${activeInput === 'grade' ? 'active' : ''} ${grade ? 'filled' : ''}`}>
                  <select
                    id="grade"
                    value={grade}
                    onChange={(e) => {
                      setGrade(e.target.value);
                      setFormError('');
                    }}
                    onFocus={() => setActiveInput('grade')}
                    onBlur={() => setActiveInput('')}
                    required
                    className="modern-select"
                    disabled={isLoading}
                  >
                    <option value=""></option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                      <option key={grade} value={grade}>
                        Grade {grade}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="grade" className="input-label">
                    <span className="label-text">Your Grade</span>
                  </label>
                  <div className="select-arrow">▼</div>
                  <div className="input-highlight"></div>
                </div>
              </div>

              <motion.div
                className="button-container"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <AnimatedButton type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <div className="loading-spinner">
                      <div className="spinner"></div>
                      <span>Starting Journey...</span>
                    </div>
                  ) : (
                    'Begin Your Quest →'
                  )}
                </AnimatedButton>
              </motion.div>
            </motion.form>

            <motion.div
              className="connection-status"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className={`status-dot ${connectionStatus.includes('Connected') ? 'connected' : 'disconnected'}`}></div>
              <span className="status-text">{connectionStatus}</span>
            </motion.div>

            <motion.div
              className="form-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <p>🔒 Secure & Private • Powered by AI</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;