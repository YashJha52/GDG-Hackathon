import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import ResultsPage from './pages/ResultsPage';
import AnimatedBackground from './components/AnimatedBackground';
import { API_BASE_URL } from './constants';
import './styles/Global.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [userData, setUserData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [taskTimes, setTaskTimes] = useState({});
  const [connectionStatus, setConnectionStatus] = useState('Checking backend connection...');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    testBackendConnection();
    document.title = "CareerQuest Oracle - Discover Your Career Path";
    
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔮</text></svg>';
    document.head.appendChild(link);
  }, []);

  const testBackendConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        setConnectionStatus('Backend connected ✅');
      } else {
        setConnectionStatus('Backend connection failed ❌ - Make sure Flask server is running on port 5001');
      }
    } catch (error) {
      setConnectionStatus('Backend connection failed ❌ - Make sure Flask server is running on port 5001');
      console.error('Connection error:', error);
    }
  };

  const handleLogin = async (name, grade) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, grade }),
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUserData(userData);
        
        const tasksResponse = await fetch(`${API_BASE_URL}/get-tasks?grade=${grade}`);
        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          setTasks(tasksData);
          setCurrentPage('tasks');
        }
      } else {
        console.error('Login failed:', response.statusText);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleAnalysis = async (answers) => {
    try {
      setIsSubmitting(true);
      
      await fetch(`${API_BASE_URL}/save-answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          answers: answers
        }),
      });
      
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        setAnalysisResult(result);
        setCurrentPage('results');
      } else {
        console.error('Analysis failed:', response.statusText);
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturnToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <LoginPage 
            onLogin={handleLogin} 
            connectionStatus={connectionStatus} 
          />
        );
      case 'dashboard':
        return (
          <DashboardPage 
            userData={userData} 
            analysisResult={analysisResult}
            onStartQuest={() => setCurrentPage('tasks')}
          />
        );
      case 'tasks':
        return (
          <TasksPage 
            tasks={tasks} 
            onComplete={handleAnalysis} 
            onTaskTimeUpdate={setTaskTimes}
            onCancel={() => setCurrentPage('dashboard')}
          />
        );
      case 'results':
        return (
          <ResultsPage 
            result={analysisResult} 
            onReturn={handleReturnToDashboard}
          />
        );
      default:
        return <LoginPage onLogin={handleLogin} connectionStatus={connectionStatus} />;
    }
  };

  return (
    <div className="App">
      <AnimatedBackground />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;