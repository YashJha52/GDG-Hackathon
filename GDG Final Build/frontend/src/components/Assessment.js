import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, saveAnswers, analyzeAnswers } from '../services/api';

const Assessment = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentTask, setCurrentTask] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasks(user.grade);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        // Fallback tasks if API fails
        setTasks([
          {
            id: "task1",
            title: "Task 1: Logical Reasoning",
            description: "A man is looking at a portrait and says, 'Brothers and sisters I have none, but that man's father is my father's son.' Who is in the portrait?"
          },
          {
            id: "task2", 
            title: "Task 2: Creative Thinking",
            description: "Invent a new mode of transportation. What is it called and how does it work?",
            image_url: "https://placehold.co/600x400/e0f2fe/0c4a6e?text=Creative+Transportation+Idea"
          },
          {
            id: "task3",
            title: "Task 3: Mathematical Thinking",
            description: "If a square has a side length of 5cm, what is its area? Explain your reasoning.",
            image_url: "https://placehold.co/600x400/e0e7ff/4338ca?text=Math+Problem+Solving"
          },
          {
            id: "task4",
            title: "Task 4: Problem Solving", 
            description: "Your school wants to reduce energy consumption. Propose a practical plan with at least 3 specific strategies.",
            image_url: "https://placehold.co/600x400/dbeafe/1e40af?text=Energy+Solution+Planning"
          },
          {
            id: "task5",
            title: "Task 5: Collaboration Skills",
            description: "Describe a time you worked in a team. What was your role and how did you contribute to the group's success?",
            image_url: "https://placehold.co/600x400/dcfce7/166534?text=Teamwork+Scenario"
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.grade) {
      fetchTasks();
    }
  }, [user]);

  const handleAnswerChange = (taskId, value) => {
    setAnswers({
      ...answers,
      [taskId]: value
    });
  };

  const handleNext = () => {
    if (currentTask < tasks.length - 1) {
      setCurrentTask(currentTask + 1);
    }
  };

  const handlePrevious = () => {
    if (currentTask > 0) {
      setCurrentTask(currentTask - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < tasks.length) {
      alert("Please complete all tasks before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Save answers
      await saveAnswers(user.name, answers);
      
      // Analyze answers
      await analyzeAnswers(user.name);
      
      // Navigate to report page
      navigate('/report');
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert('There was an error submitting your assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = ((currentTask + 1) / tasks.length) * 100;

  if (isLoading) {
    return (
      <div className="text-center mt-4">
        <div className="spinner"></div>
        <p>Loading assessment tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return <div className="card">No tasks available at the moment. Please try again later.</div>;
  }

  const task = tasks[currentTask];

  return (
    <div>
      <div className="dashboard-header">
        <h1>CareerQuest Comprehensive Assessment</h1>
        <p>Complete these 5 challenges to discover your detailed career profile</p>
      </div>

      <div className="card">
        <div className="progress-container">
          <div className="progress-label">
            Task {currentTask + 1} of {tasks.length} ({Math.round(progressPercentage)}% complete)
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="card task-card">
        <div className="task-header">
          <h2>{task.title}</h2>
          <span className="task-number">Task {currentTask + 1} of {tasks.length}</span>
        </div>

        {task.image_url && (
          <img src={task.image_url} alt="Task visual" className="task-image" />
        )}

        <div className="task-description">
          <p>{task.description}</p>
        </div>

        <div className="form-group">
          <label htmlFor={`answer-${task.id}`}>Your Response:</label>
          <textarea
            id={`answer-${task.id}`}
            className="answer-input"
            value={answers[task.id] || ''}
            onChange={(e) => handleAnswerChange(task.id, e.target.value)}
            placeholder="Share your thoughts, solutions, or ideas here..."
            rows={6}
          />
        </div>

        <div className="navigation-buttons">
          <button 
            onClick={handlePrevious} 
            className="btn btn-secondary"
            disabled={currentTask === 0}
          >
            Previous
          </button>

          {currentTask < tasks.length - 1 ? (
            <button 
              onClick={handleNext} 
              className="btn"
              disabled={!answers[task.id]}
            >
              Next Task
            </button>
          ) : (
            <button 
              onClick={handleSubmit} 
              className="btn btn-success"
              disabled={isSubmitting || !answers[task.id]}
            >
              {isSubmitting ? <div className="spinner"></div> : 'Complete Assessment'}
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <h3>Assessment Overview</h3>
        <div className="tasks-overview">
          {tasks.map((t, index) => (
            <div 
              key={t.id} 
              className={`task-indicator ${index === currentTask ? 'active' : ''} ${answers[t.id] ? 'completed' : ''}`}
              onClick={() => setCurrentTask(index)}
            >
              <span className="indicator-number">{index + 1}</span>
              <span className="indicator-title">{t.title.split(':')[1]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Assessment;