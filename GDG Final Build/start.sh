#!/bin/bash

echo "Starting CareerQuest Oracle..."

# Start backend
echo "Starting backend server on port 5001..."
cd backend
python app.py &

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting frontend server on port 5001..."
cd ../frontend
npm start