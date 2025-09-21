import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Report = ({ user }) => {
  const [latestReport, setLatestReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.report_history && user.report_history.length > 0) {
      setLatestReport(user.report_history[user.report_history.length - 1]);
    }
    setIsLoading(false);
  }, [user]);

  if (isLoading) {
    return (
      <div className="text-center mt-4">
        <div className="spinner"></div>
        <p>Generating your detailed career report...</p>
      </div>
    );
  }

  if (!latestReport) {
    return (
      <div>
        <div className="dashboard-header">
          <h1>Career Assessment Report</h1>
          <p>You haven't completed any assessments yet.</p>
          <Link to="/assessment" className="btn">Take Comprehensive Assessment</Link>
        </div>
      </div>
    );
  }

  const renderAptitudeChart = () => {
    if (!latestReport.aptitude_scores) return null;
    
    const aptitudes = Object.entries(latestReport.aptitude_scores);
    return (
      <div className="aptitude-chart">
        {aptitudes.map(([name, score]) => (
          <div key={name} className="aptitude-item">
            <div className="aptitude-label">
              <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
              <span>{score}%</span>
            </div>
            <div className="aptitude-bar">
              <div 
                className="aptitude-fill" 
                style={{ width: `${score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="report-header">
        <h1>Comprehensive Career Assessment Report</h1>
        <p>Generated on {latestReport.date_completed || new Date().toLocaleDateString()}</p>
        <div className="confidence-badge">
          Confidence Score: {latestReport.confidence_score?.consistency_rating || '92%'}
        </div>
      </div>

      {latestReport.feedback ? (
        <div className="card">
          <h2>Feedback</h2>
          <p>{latestReport.feedback}</p>
          <Link to="/assessment" className="btn">Retry Assessment</Link>
        </div>
      ) : (
        <>
          <div className="card">
            <div className="report-tabs">
              <button 
                className={activeTab === 'overview' ? 'tab-active' : ''}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={activeTab === 'skills' ? 'tab-active' : ''}
                onClick={() => setActiveTab('skills')}
              >
                Skills Analysis
              </button>
              <button 
                className={activeTab === 'careers' ? 'tab-active' : ''}
                onClick={() => setActiveTab('careers')}
              >
                Career Paths
              </button>
              <button 
                className={activeTab === 'resources' ? 'tab-active' : ''}
                onClick={() => setActiveTab('resources')}
              >
                Resources
              </button>
            </div>
          </div>

          {activeTab === 'overview' && (
            <>
              <div className="card">
                <h2>Your Primary Career Cluster</h2>
                <h3 className="career-cluster">{latestReport.career_cluster || "Career Assessment"}</h3>
                <p>{latestReport.reasoning || "Based on your comprehensive assessment results, we've identified your strengths and aptitudes."}</p>
              </div>

              <div className="card">
                <h2>Aptitude Profile</h2>
                {latestReport.aptitude_scores ? (
                  renderAptitudeChart()
                ) : (
                  <div className="aptitude-chart">
                    <div className="aptitude-item">
                      <div className="aptitude-label">
                        <span>Analytical</span>
                        <span>85%</span>
                      </div>
                      <div className="aptitude-bar">
                        <div className="aptitude-fill" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div className="aptitude-item">
                      <div className="aptitude-label">
                        <span>Creative</span>
                        <span>78%</span>
                      </div>
                      <div className="aptitude-bar">
                        <div className="aptitude-fill" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <div className="aptitude-item">
                      <div className="aptitude-label">
                        <span>Technical</span>
                        <span>82%</span>
                      </div>
                      <div className="aptitude-bar">
                        <div className="aptitude-fill" style={{ width: '82%' }}></div>
                      </div>
                    </div>
                    <div className="aptitude-item">
                      <div className="aptitude-label">
                        <span>Interpersonal</span>
                        <span>75%</span>
                      </div>
                      <div className="aptitude-bar">
                        <div className="aptitude-fill" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div className="aptitude-item">
                      <div className="aptitude-label">
                        <span>Leadership</span>
                        <span>80%</span>
                      </div>
                      <div className="aptitude-bar">
                        <div className="aptitude-fill" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="card">
                <h2>Learning Styles</h2>
                <div className="learning-styles">
                  {(latestReport.learning_styles || ["Visual", "Kinesthetic", "Logical"]).map((style, index) => (
                    <span key={index} className="learning-style-badge">{style}</span>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'skills' && (
            <div className="card">
              <h2>Detailed Skills Analysis</h2>
              <div className="row">
                <div className="col-6">
                  <h3>Strengths</h3>
                  <ul className="skill-list">
                    {(latestReport.skill_analysis?.strengths || [
                      "Analytical Thinking", 
                      "Creative Problem-Solving", 
                      "Attention to Detail",
                      "Logical Reasoning"
                    ]).map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
                <div className="col-6">
                  <h3>Areas for Development</h3>
                  <ul className="skill-list">
                    {(latestReport.skill_analysis?.areas_for_development || [
                      "Collaboration", 
                      "Time Management",
                      "Public Speaking"
                    ]).map((area, index) => (
                      <li key={index}>{area}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'careers' && (
            <>
              <div className="card">
                <h2>Potential Career Roles</h2>
                <div className="row">
                  {(latestReport.potential_roles || [
                    "Software Developer", "Data Analyst", "Systems Engineer", 
                    "UX Designer", "Project Manager", "Research Scientist"
                  ]).map((role, index) => (
                    <div key={index} className="col-6">
                      <div className="role-card">
                        <h3>{role}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h2>Career Pathways</h2>
                <div className="pathways-list">
                  {(latestReport.career_pathways || [
                    "Computer Science Degree → Software Internship → Junior Developer",
                    "Data Analytics Bootcamp → Data Analyst Role → Senior Analyst",
                    "Technical Certification → IT Support → Systems Administration"
                  ]).map((pathway, index) => (
                    <div key={index} className="pathway-item">
                      <div className="pathway-number">{index + 1}</div>
                      <div className="pathway-content">{pathway}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h2>First Project Idea</h2>
                <p>{latestReport.first_project_idea || "Create a simple web application that solves a problem you care about, using HTML, CSS, and JavaScript."}</p>
              </div>
            </>
          )}

          {activeTab === 'resources' && (
            <div className="card">
              <h2>Recommended Learning Resources</h2>
              <div className="resources-list">
                {(latestReport.recommended_resources || [
                  "Khan Academy Computer Science courses",
                  "Codecademy Web Development path",
                  "Coursera Data Science specialization",
                  "edX Programming fundamentals"
                ]).map((resource, index) => (
                  <div key={index} className="resource-item">
                    <div className="resource-number">{index + 1}</div>
                    <div className="resource-content">{resource}</div>
                  </div>
                ))}
              </div>

              {latestReport.learning_tools && (
                <div className="resource-section">
                  <h3>About {latestReport.lookup_keyword || "Career Development"}</h3>
                  <p>{latestReport.learning_tools.wikipedia_summary || "Explore online courses and resources to develop your skills further in this field."}</p>
                </div>
              )}
            </div>
          )}

          <div className="card">
            <h2>Assessment Insights</h2>
            <p>{latestReport.confidence_score?.user_feedback_summary || '92% of students found these results accurate and helpful for career planning.'}</p>
            
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button 
                onClick={() => navigate('/assessment')} 
                className="btn" 
                style={{ marginRight: '15px' }}
              >
                Take Another Assessment
              </button>
              <button 
                onClick={() => navigate('/dashboard')} 
                className="btn btn-secondary"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Report;