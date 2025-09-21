import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardData } from '../services/api';

const Dashboard = ({ user }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardData(user.name);
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.name) {
      fetchDashboardData();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="text-center mt-4">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-header">
        <h1>Your CareerQuest Dashboard</h1>
        <p>Track your progress and discover your potential</p>
      </div>

      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-number">{dashboardData?.quests_completed || 0}</div>
          <div className="stat-label">Quests Completed</div>
        </div>
        
        <div className="card stat-card">
          <div className="stat-number">{dashboardData?.skill_timeline?.length || 0}</div>
          <div className="stat-label">Skills Discovered</div>
        </div>
        
        <div className="card stat-card">
          <div className="stat-number">{user.grade}</div>
          <div className="stat-label">Your Grade Level</div>
        </div>
      </div>

      <div className="card">
        <h2>Your Skill Timeline</h2>
        {dashboardData?.skill_timeline?.length > 0 ? (
          <div>
            {dashboardData.skill_timeline.map((skill, index) => (
              <span key={index} className="skill-badge">{skill}</span>
            ))}
          </div>
        ) : (
          <p>You haven't completed any assessments yet. Discover your skills by taking the assessment!</p>
        )}
        
        <div className="text-center mt-3">
          <Link to="/assessment" className="btn">
            {dashboardData?.quests_completed > 0 ? 'Take Another Assessment' : 'Start Your First Assessment'}
          </Link>
        </div>
      </div>

      {user.report_history && user.report_history.length > 0 && (
        <div className="card">
          <h2>Your Recent Reports</h2>
          <div className="row">
            {user.report_history.slice(-3).map((report, index) => (
              <div key={index} className="col-4">
                <div className="card role-card">
                  <h3>{report.career_cluster || report.skill_superpower || 'Career Assessment'}</h3>
                  <p>{report.date_completed}</p>
                  <Link to="/report" className="btn btn-outline">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;