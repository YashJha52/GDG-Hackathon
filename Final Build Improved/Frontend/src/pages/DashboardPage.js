import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './DashboardPage.css';

const DashboardPage = ({ userData, analysisResult, onStartQuest, onReset }) => {
  const [progress, setProgress] = useState(0);
  const [questStats, setQuestStats] = useState({
    completed: 0,
    total: 4,
    accuracy: 0
  });

  // Safe access to analysis result properties
  const strengths = analysisResult?.strengths || [];
  const suggestedCareers = analysisResult?.suggested_careers || [];
  const careerPath = analysisResult?.career_path || 'Not yet determined';

  useEffect(() => {
    // Simulate progress animation
    const timer = setTimeout(() => {
      setProgress(analysisResult ? 100 : 0);
      if (analysisResult) {
        setQuestStats({
          completed: 4,
          total: 4,
          accuracy: Math.floor(Math.random() * 30) + 70 // Random accuracy between 70-100
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [analysisResult]);

  return (
    <div className="dashboard-page">
      {/* Animated background shapes */}
      <div className="dashboard-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>

      <div className="dashboard-container">
        {/* Header Section */}
        <motion.div 
          className="dashboard-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="header-content">
            <div className="welcome-section">
              <h1 className="welcome-title">
                Welcome, <span className="highlight">{userData?.name}</span>!
              </h1>
              <p className="welcome-subtitle">
                {analysisResult 
                  ? "Your career discovery journey is complete!" 
                  : "Your career discovery journey awaits"}
              </p>
            </div>
            <div className="user-badge">
              <span className="badge-icon">👤</span>
              Grade {userData?.grade}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3 className="stat-value">{questStats.completed}/{questStats.total}</h3>
              <p className="stat-label">Quests Completed</p>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h3 className="stat-value">{questStats.accuracy}%</h3>
              <p className="stat-label">Accuracy Score</p>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <h3 className="stat-value">{analysisResult ? "12:45" : "00:00"}</h3>
              <p className="stat-label">Total Time</p>
            </div>
          </motion.div>
        </div>

        {/* Progress Section */}
        {analysisResult && (
          <motion.div 
            className="progress-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="progress-header">
              <h2>Your Journey Progress</h2>
              <span className="progress-percent">{progress}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </motion.div>
        )}

        {/* Action Section */}
        <motion.div 
          className="action-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="action-content">
            <div className="action-text">
              <h2>
                {analysisResult 
                  ? "Ready to explore more?" 
                  : "Begin your career discovery journey"}
              </h2>
              <p>
                {analysisResult
                  ? "Retake the assessment to refine your results or explore new career paths."
                  : "Complete our engaging quests to discover your ideal career path based on your strengths and interests."}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="start-quest-btn"
              onClick={onStartQuest}
              style={{ cursor: 'pointer' }}
            >
              {analysisResult ? "Retake Quest" : "Start Quest"}
            </motion.button>
          </div>
        </motion.div>

        {/* Results Summary */}
        {analysisResult && (
          <motion.div 
            className="results-summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2>Your Career Profile: {careerPath}</h2>
            
            {strengths.length > 0 && (
              <div className="strengths-section">
                <h3>Your Top Strengths</h3>
                <div className="strengths-grid">
                  {strengths.map((strength, index) => (
                    <div key={index} className="strength-pill">
                      {strength}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {suggestedCareers.length > 0 && (
              <div className="careers-section">
                <h3>Suggested Career Paths</h3>
                <div className="careers-grid">
                  {suggestedCareers.map((career, index) => (
                    <div key={index} className="career-card">
                      <div className="career-icon">💼</div>
                      <h4>{career}</h4>
                      <p>High compatibility with your skills</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {strengths.length === 0 && suggestedCareers.length === 0 && (
              <div className="no-results-message">
                <p>Complete the assessment to see your personalized career analysis.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Quick Stats */}
        <motion.div 
          className="quick-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="stat-item">
            <span className="stat-emoji">🔮</span>
            <span>Career Match Found</span>
          </div>
          <div className="stat-item">
            <span className="stat-emoji">⭐</span>
            <span>Personalized Results</span>
          </div>
          <div className="stat-item">
            <span className="stat-emoji">🚀</span>
            <span>Ready to Explore</span>
          </div>
        </motion.div>

        {/* Reset Button */}
        <motion.button
          onClick={onReset}
          className="btn-reset"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ cursor: 'pointer' }}
        >
          Reset & Start Over
        </motion.button>
      </div>
    </div>
  );
};

export default DashboardPage;