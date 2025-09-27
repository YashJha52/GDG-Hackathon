import React from 'react';
import { motion } from 'framer-motion';
import AnimatedButton from '../components/AnimatedButton';
import './ResultsPage.css';

const ResultsPage = ({ result, onReturn }) => {
  // Safe access to result properties with fallbacks
  const safeResult = result || {};
  
  const careerCluster = safeResult.career_cluster || safeResult.career_path || 'Career Path';
  const skillSuperpower = safeResult.skill_superpower || 'Your Unique Skills';
  const reasoning = safeResult.reasoning || 'Your responses show great potential across multiple areas.';
  
  const strengths = safeResult.skill_analysis?.strengths || 
                   safeResult.strengths || 
                   ['Creative thinking', 'Problem solving', 'Adaptability'];
  
  const areasForDevelopment = safeResult.skill_analysis?.areas_for_development || 
                            ['Communication skills', 'Time management', 'Technical expertise'];
  
  const potentialRoles = safeResult.potential_roles || 
                        safeResult.suggested_careers || 
                        ['Software Developer', 'Data Analyst', 'Project Manager', 'UX Designer'];
  
  const firstProjectIdea = safeResult.first_project_idea || 
                          safeResult.learning_tip || 
                          'Start with a small project that combines your interests and skills.';
  
  const wikipediaSummary = safeResult.learning_tools?.wikipedia_summary || 
                          'Continue exploring different career paths and building your skills through hands-on projects.';

  const confidenceScore = safeResult.confidence_score || {
    consistency_rating: 'High',
    user_feedback_summary: 'Responses showed good depth and thoughtfulness'
  };

  if (!result) {
    return (
      <div className="results-page">
        <div className="results-container">
          <div className="no-results">
            <div className="no-results-icon">📊</div>
            <h2>No Results Yet</h2>
            <p>Complete a quest to see your career analysis results</p>
            <AnimatedButton onClick={onReturn}>
              ← Return to Dashboard
            </AnimatedButton>
          </div>
        </div>
      </div>
    );
  }

  if (result.feedback) {
    return (
      <div className="results-page">
        <div className="results-container">
          <div className="results-header">
            <h1>Feedback</h1>
          </div>
          <div className="main-result-card">
            <div className="result-icon">💬</div>
            <div className="result-content">
              <p>{result.feedback}</p>
            </div>
          </div>
          <AnimatedButton onClick={onReturn}>
            ← Return to Dashboard
          </AnimatedButton>
        </div>
      </div>
    );
  }

  return (
    <div className="results-page">
      <div className="results-background">
        <div className="result-shape shape-1"></div>
        <div className="result-shape shape-2"></div>
        <div className="result-shape shape-3"></div>
      </div>

      <div className="results-container">
        <motion.div 
          className="results-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="header-content">
            <div className="success-badge">
              <span className="badge-icon">🎯</span>
              <span className="badge-text">Analysis Complete</span>
            </div>
            <h1>Your Career Quest Results</h1>
            <p className="completion-date">{safeResult.date_completed || new Date().toLocaleDateString()}</p>
          </div>
        </motion.div>

        <motion.div 
          className="main-result-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="result-icon">🏆</div>
          <div className="result-content">
            <h2>{safeResult.career_cluster ? "Career Cluster" : "Skill Superpower"}</h2>
            <div className="primary-result">
              {careerCluster}
            </div>
            {reasoning && (
              <p className="result-description">{reasoning}</p>
            )}
          </div>
        </motion.div>

        {strengths.length > 0 && areasForDevelopment.length > 0 && (
          <motion.div 
            className="analysis-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h2>Skill Analysis</h2>
            <div className="analysis-grid">
              {strengths.length > 0 && (
                <div className="analysis-card strengths">
                  <h3>✅ Strengths</h3>
                  <ul>
                    {strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}
              {areasForDevelopment.length > 0 && (
                <div className="analysis-card improvements">
                  <h3>📈 Areas for Development</h3>
                  <ul>
                    {areasForDevelopment.map((area, index) => (
                      <li key={index}>{area}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {potentialRoles.length > 0 && (
          <motion.div 
            className="recommendations-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <h2>Potential Career Roles</h2>
            <div className="roles-grid">
              {potentialRoles.map((role, index) => (
                <motion.div 
                  key={index}
                  className="role-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 1, duration: 0.4 }}
                >
                  <span className="role-icon">💼</span>
                  <span className="role-name">{role}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {firstProjectIdea && (
          <motion.div 
            className="next-steps-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <h2>Next Steps</h2>
            <div className="next-step-card">
              <div className="step-icon">🚀</div>
              <div className="step-content">
                <p>{firstProjectIdea}</p>
              </div>
            </div>
          </motion.div>
        )}

        {wikipediaSummary && (
          <motion.div 
            className="learning-resources"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            <h2>Learn More</h2>
            <div className="resource-card">
              <div className="resource-icon">📚</div>
              <div className="resource-content">
                <p>{wikipediaSummary}</p>
              </div>
            </div>
          </motion.div>
        )}

        {confidenceScore && (
          <motion.div 
            className="confidence-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          >
            <div className="confidence-card">
              <h3>Confidence Score</h3>
              <div className="confidence-metrics">
                <div className="metric">
                  <span className="metric-label">Consistency Rating</span>
                  <span className="metric-value">{confidenceScore.consistency_rating}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">User Feedback</span>
                  <span className="metric-value">{confidenceScore.user_feedback_summary}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div 
          className="action-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.1, duration: 0.6 }}
        >
          <AnimatedButton onClick={onReturn}>
            ← Return to Dashboard
          </AnimatedButton>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsPage;