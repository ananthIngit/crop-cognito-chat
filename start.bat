@echo off
echo ================================================
echo Plant Disease Detection - Starting Servers
echo ================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if Python dependencies are installed
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo Installing Python dependencies...
    pip install -r requirements.txt
)

REM Check if Node dependencies are installed
if not exist "node_modules" (
    echo Installing Node.js dependencies...
    call npm install
)

echo.
echo Starting Flask backend server...
start "Flask Backend" cmd /k "python app.py"

timeout /t 3 /nobreak >nul

echo Starting React frontend...
start "React Frontend" cmd /k "npm run dev"

timeout /t 5 /nobreak >nul

echo Opening browser...
start http://localhost:5173

echo.
echo ================================================
echo Servers are starting!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo ================================================
echo.
echo Press any key to exit (servers will continue running)...
pause >nul

