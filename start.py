"""
Startup script to run both Flask backend and React frontend
"""
import subprocess
import sys
import os
import time
import webbrowser
from threading import Thread

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import flask
        import torch
        print("✅ Python dependencies found")
        return True
    except ImportError as e:
        print(f"❌ Missing Python dependency: {e}")
        print("Please run: pip install -r requirements.txt")
        return False

def start_flask():
    """Start Flask backend server"""
    print("🚀 Starting Flask backend server...")
    subprocess.run([sys.executable, "app.py"])

def start_react():
    """Start React frontend"""
    print("🚀 Starting React frontend...")
    # Check if node_modules exists
    if not os.path.exists("node_modules"):
        print("📦 Installing npm dependencies...")
        subprocess.run(["npm", "install"])
    
    subprocess.run(["npm", "run", "dev"])

def open_browser():
    """Open browser after a delay"""
    time.sleep(5)  # Wait for servers to start
    print("🌐 Opening browser...")
    webbrowser.open("http://localhost:5173")

if __name__ == "__main__":
    print("=" * 50)
    print("🌱 Plant Disease Detection - Starting Servers")
    print("=" * 50)
    
    if not check_dependencies():
        sys.exit(1)
    
    # Start Flask in a separate thread
    flask_thread = Thread(target=start_flask, daemon=True)
    flask_thread.start()
    
    # Wait a bit for Flask to start
    time.sleep(2)
    
    # Start browser opener in a separate thread
    browser_thread = Thread(target=open_browser, daemon=True)
    browser_thread.start()
    
    # Start React (this will block)
    try:
        start_react()
    except KeyboardInterrupt:
        print("\n👋 Shutting down servers...")
        sys.exit(0)

