import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedButton from '../components/AnimatedButton';
import { API_BASE_URL } from '../constants';
import './DashboardPage.css';

const DashboardPage = ({ userData, analysisResult, onStartQuest }) => {
  const [stats, setStats] = useState({ quests: 0, skills: 0, progress: 0 });
  const [dashboardData, setDashboardData] = useState({ quests_completed: 0, skill_timeline: [] });

  useEffect(() => {
    if (userData) {
      const loadDashboardData = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/get-dashboard-data?name=${encodeURIComponent(userData.name)}`);
          if (response.ok) {
            const data = await response.json();
            setDashboardData(data);
            
            setStats({
              quests: data.quests_completed || (analysisResult ? 1 : 0),
              skills: data.skill_timeline.length || (analysisResult ? 1 : 0),
              progress: Math.min((data.quests_completed || (analysisResult ? 1 : 0)) * 20, 100)
            });
          }
        } catch (error) {
          console.error('Error loading dashboard data:', error);
          setStats({
            quests: analysisResult ? 1 : 0,
            skills: analysisResult ? 1 : 0,
            progress: analysisResult ? 20 : 0
          });
        }
      };

      loadDashboardData();
    }
  }, [userData, analysisResult]);

  const recentQuests = userData?.report_history?.slice(-3).reverse() || [];

  return (
    <div className="dashboard-page">
      <div className="dashboard-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>

      <div className="dashboard-container">
        <motion.div 
          className="dashboard-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="header-content">
            <div className="welcome-section">
              <h1 className="welcome-title">
                Welcome, <span className="highlight">{userData?.name}</span>!
              </h1>
              <p className="welcome-subtitle">Ready to discover your career strengths?</p>
            </div>
            <div className="user-badge">
              <span className="badge-icon">🎓</span>
              <span className="badge-text">Grade {userData?.grade}</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="stats-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.quests}</h3>
              <p className="stat-label">Quests Completed</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.skills}</h3>
              <p className="stat-label">Skills Discovered</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.progress}%</h3>
              <p className="stat-label">Journey Progress</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="progress-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="progress-header">
            <h2>Your Journey Progress</h2>
            <span className="progress-percent">{stats.progress}% Complete</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${stats.progress}%` }}
            ></div>
          </div>
        </motion.div>

        <motion.div 
          className="action-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <div className="action-content">
            <div className="action-text">
              <h2>Start Career Quest</h2>
              <p>Discover your strengths and potential career paths through our assessment</p>
            </div>
            <AnimatedButton onClick={onStartQuest} className="start-quest-btn">
              🚀 Start Quest
            </AnimatedButton>
          </div>
        </motion.div>

        {recentQuests.length > 0 && (
          <motion.div 
            className="recent-quests"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <h2>Recent Activity</h2>
            <div className="quests-grid">
              {recentQuests.map((quest, index) => (
                <motion.div 
                  key={index}
                  className="quest-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 1, duration: 0.4 }}
                >
                  <div className="quest-icon">📋</div>
                  <div className="quest-content">
                    <h4>{quest.career_cluster || quest.skill_superpower || "Career Assessment"}</h4>
                    <p className="quest-date">{quest.date_completed || new Date().toLocaleDateString()}</p>
                    <div className="quest-stats">
                      <span className="stat-pill">⭐ {quest.confidence_score?.consistency_rating || '85%'}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div 
          className="quick-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <div className="stat-item">
            <span className="stat-emoji">⏱️</span>
            <span>Avg. completion: 10-15min</span>
          </div>
          <div className="stat-item">
            <span className="stat-emoji">🎯</span>
            <span>Personalized results</span>
          </div>
          <div className="stat-item">
            <span className="stat-emoji">🔒</span>
            <span>Private & secure</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;