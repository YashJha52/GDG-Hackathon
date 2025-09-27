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
  const [backendAvailable, setBackendAvailable] = useState(false);

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
      console.log('Testing connection to:', API_BASE_URL);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log('Health check response:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Backend health:', data);
        setConnectionStatus('Backend connected ✅');
        setBackendAvailable(true);
        return true;
      } else {
        setConnectionStatus('Backend connection failed ❌ - Server error');
        setBackendAvailable(false);
        return false;
      }
    } catch (error) {
      console.error('Connection error:', error);
      if (error.name === 'AbortError') {
        setConnectionStatus('Backend connection failed ❌ - Timeout (server not responding)');
      } else {
        setConnectionStatus('Backend connection failed ❌ - Check server and CORS');
      }
      setBackendAvailable(false);
      return false;
    }
  };

  const handleLogin = async (name, grade) => {
    try {
      console.log('Attempting login with:', { name, grade });
      
      // First check if backend is available
      const isBackendAvailable = await testBackendConnection();
      
      if (!isBackendAvailable) {
        // Use mock data if backend is down
        await mockLogin(name, grade);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, grade }),
      });
      
      console.log('Login response status:', response.status);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('Login successful:', userData);
        setUserData(userData);
        
        // Fetch tasks but don't navigate to tasks page yet
        const tasksResponse = await fetch(`${API_BASE_URL}/get-tasks?grade=${grade}`);
        
        console.log('Tasks response status:', tasksResponse.status);
        
        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          console.log('Tasks received:', tasksData);
          setTasks(tasksData);
          setCurrentPage('dashboard'); // Go to dashboard instead of tasks
        } else {
          throw new Error(`Failed to fetch tasks: ${tasksResponse.status}`);
        }
      } else {
        throw new Error(`Login failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      // Fall back to mock data
      await mockLogin(name, grade);
    }
  };

  // Mock login function for when backend is unavailable
  const mockLogin = async (name, grade) => {
    console.log('Using mock login data');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUserData = {
      name: name,
      grade: grade,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    
    setUserData(mockUserData);
    
    // Mock tasks data
    const mockTasks = [
      {
        id: 1,
        title: "Problem Solving Challenge",
        description: "Describe a time when you faced a difficult problem and how you solved it. What was your thought process?",
        image_url: null
      },
      {
        id: 2,
        title: "Creative Thinking Exercise", 
        description: "Imagine you have to design something new and innovative. What would you create and why?",
        image_url: null
      },
      {
        id: 3,
        title: "Teamwork Experience",
        description: "Tell us about a time you worked in a team. What was your role and how did you contribute?",
        image_url: null
      },
      {
        id: 4,
        title: "Future Goals",
        description: "Where do you see yourself in 5 years? What kind of work would make you happy?",
        image_url: null
      }
    ];
    
    setTasks(mockTasks);
    setCurrentPage('dashboard'); // Go to dashboard instead of tasks
    
    return mockUserData;
  };

  const handleStartTest = () => {
    // Navigate to tasks page to begin the test
    setCurrentPage('tasks');
  };

  const handleAnalysis = async (answers) => {
    try {
      setIsSubmitting(true);
      
      if (backendAvailable) {
        // Try real backend first
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
          return;
        }
      }
      
      // Fall back to mock analysis if backend fails
      await mockAnalysis(answers);
      
    } catch (error) {
      console.error('Analysis error:', error);
      // Use mock analysis as fallback
      await mockAnalysis(answers);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock analysis function
  const mockAnalysis = async (answers) => {
    console.log('Using mock analysis data');
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResult = {
      career_cluster: "Technology & Innovation",
      skill_superpower: "Creative Problem Solving",
      reasoning: "Your responses show strong analytical thinking and creativity, making you well-suited for technology-driven roles that require innovation.",
      skill_analysis: {
        strengths: ["Analytical thinking", "Creativity", "Adaptability"],
        areas_for_development: ["Public speaking", "Time management"]
      },
      potential_roles: [
        "Software Developer",
        "Data Analyst", 
        "UX Designer",
        "Project Manager"
      ],
      first_project_idea: "Start with a small coding project or design challenge to build your portfolio",
      confidence_score: {
        consistency_rating: "High",
        user_feedback_summary: "Responses were detailed and thoughtful"
      },
      date_completed: new Date().toLocaleDateString()
    };
    
    setAnalysisResult(mockResult);
    setCurrentPage('results');
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
            backendAvailable={backendAvailable}
          />
        );
      case 'dashboard':
        return (
          <DashboardPage 
            userData={userData} 
            analysisResult={analysisResult}
            onStartQuest={handleStartTest} // Changed to use the new handler
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