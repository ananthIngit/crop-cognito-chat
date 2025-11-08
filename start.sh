#!/bin/bash

echo "================================================"
echo "Plant Disease Detection - Starting Servers"
echo "================================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python3 is not installed"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    exit 1
fi

# Check if Python dependencies are installed
if ! python3 -c "import flask" 2>/dev/null; then
    echo "Installing Python dependencies..."
    pip3 install -r requirements.txt
fi

# Check if Node dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
fi

echo ""
echo "Starting Flask backend server..."
python3 app.py &
FLASK_PID=$!

sleep 3

echo "Starting React frontend..."
npm run dev &
REACT_PID=$!

sleep 5

echo ""
echo "================================================"
echo "Servers are starting!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo "================================================"
echo ""
echo "Press Ctrl+C to stop all servers..."

# Wait for user interrupt
trap "kill $FLASK_PID $REACT_PID 2>/dev/null; exit" INT
wait

