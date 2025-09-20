import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedButton from '../components/AnimatedButton';
import './TasksPage.css';

const TasksPage = ({ tasks, onComplete, onTaskTimeUpdate, onCancel }) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [taskStartTimes, setTaskStartTimes] = useState({});
  const [taskTimes, setTaskTimes] = useState({});

  useEffect(() => {
    const startTime = Date.now();
    setTaskStartTimes(prev => ({
      ...prev,
      [currentTaskIndex]: startTime
    }));

    return () => {
      const endTime = Date.now();
      const timeSpent = Math.round((endTime - (taskStartTimes[currentTaskIndex] || endTime)) / 1000);
      
      if (taskStartTimes[currentTaskIndex]) {
        const newTaskTimes = {
          ...taskTimes,
          [currentTaskIndex]: timeSpent
        };
        setTaskTimes(newTaskTimes);
        onTaskTimeUpdate(newTaskTimes);
      }
    };
  }, [currentTaskIndex]);

  const handleAnswerChange = (value) => {
    setAnswers(prev => ({
      ...prev,
      [currentTaskIndex]: value
    }));
  };

  const goToNextTask = () => {
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    }
  };

  const goToPreviousTask = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(currentTaskIndex - 1);
    }
  };

  const handleSubmit = () => {
    const formattedAnswers = tasks.map((task, index) => ({
      task_id: task.id,
      task_title: task.title,
      answer: answers[index] || "No answer provided"
    }));
    
    onComplete(formattedAnswers);
  };

  if (tasks.length === 0) {
    return (
      <div className="tasks-page">
        <div className="tasks-container">
          <div className="no-tasks">
            <h2>No tasks available</h2>
            <AnimatedButton onClick={onCancel}>
              Return to Dashboard
            </AnimatedButton>
          </div>
        </div>
      </div>
    );
  }

  const task = tasks[currentTaskIndex];
  const progress = ((currentTaskIndex + 1) / tasks.length) * 100;
  const isLastTask = currentTaskIndex === tasks.length - 1;

  return (
    <div className="tasks-page">
      <div className="tasks-background">
        <div className="task-shape shape-1"></div>
        <div className="task-shape shape-2"></div>
        <div className="task-shape shape-3"></div>
      </div>

      <div className="tasks-container">
        <div className="tasks-header">
          <div className="header-content">
            <h1>Career Quest</h1>
            <p>Complete the tasks to discover your career strengths</p>
          </div>
          
          <div className="progress-display">
            <span className="progress-text">
              Question {currentTaskIndex + 1} of {tasks.length}
            </span>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="task-content">
          <div className="task-header">
            <div className="task-number">
              <span className="number">{currentTaskIndex + 1}</span>
              <span className="label">Task</span>
            </div>
            <h2 className="task-title">{task.title}</h2>
          </div>

          <div className="task-body">
            {task.image_url && (
              <div className="task-image">
                <img src={task.image_url} alt="Task visualization" />
              </div>
            )}
            
            <div className="task-description">
              <p>{task.description}</p>
            </div>

            <div className="answer-section">
              <label htmlFor="answer" className="answer-label">
                Your Response:
              </label>
              <textarea
                id="answer"
                className="answer-textarea"
                value={answers[currentTaskIndex] || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Type your answer here..."
                rows={5}
              />
              <div className="character-count">
                {(answers[currentTaskIndex] || '').length} characters
              </div>
            </div>
          </div>
        </div>

        <div className="task-navigation">
          <div className="nav-buttons">
            {currentTaskIndex > 0 && (
              <AnimatedButton 
                onClick={goToPreviousTask}
                className="nav-btn prev-btn"
              >
                ← Previous
              </AnimatedButton>
            )}
            
            {!isLastTask ? (
              <AnimatedButton 
                onClick={goToNextTask}
                className="nav-btn next-btn"
              >
                Next Question →
              </AnimatedButton>
            ) : (
              <AnimatedButton 
                onClick={handleSubmit}
                className="nav-btn submit-btn"
              >
                Complete Assessment 🎯
              </AnimatedButton>
            )}
          </div>

          <div className="progress-dots">
            {tasks.map((_, index) => (
              <div
                key={index}
                className={`progress-dot ${index === currentTaskIndex ? 'active' : ''} ${answers[index] ? 'completed' : ''}`}
                onClick={() => setCurrentTaskIndex(index)}
              />
            ))}
          </div>
        </div>

        <div className="task-tips">
          <div className="tip-card">
            <div className="tip-icon">💡</div>
            <div className="tip-content">
              <h4>Pro Tip</h4>
              <p>Be thoughtful and detailed in your responses for the most accurate career analysis.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;