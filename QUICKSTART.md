# 🚀 Quick Start Guide

## One-Command Startup

### Windows
```bash
start.bat
```

### Linux/Mac
```bash
chmod +x start.sh && ./start.sh
```

### Python (Any OS)
```bash
python start.py
```

## What Happens?

1. ✅ Checks and installs dependencies automatically
2. 🚀 Starts Flask backend on http://localhost:5000
3. 🚀 Starts React frontend on http://localhost:5173
4. 🌐 Opens your browser automatically

## First Time Setup

If this is your first time running:

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Train or download a model:**
   - Option A: Train your own model
     ```bash
     python train.py
     ```
     (Requires dataset in `data/PlantVillage/`)
   
   - Option B: Download a pre-trained model and save as `hybrid_model.pth`

4. **Run the startup script:**
   ```bash
   # Windows
   start.bat
   
   # Linux/Mac
   ./start.sh
   
   # Or Python
   python start.py
   ```

## Using the Web Interface

1. Navigate to http://localhost:5173
2. Click on "Detection" in the navigation
3. Choose:
   - **Start Camera** - Use your webcam
   - **Upload Image** - Upload a plant image file
4. Wait for the AI to analyze
5. View results with confidence scores
6. Click "Get AI Treatment Advice" for recommendations

## Troubleshooting

### "Model not found" error
- Train the model: `python train.py`
- Or place a pre-trained model as `hybrid_model.pth` in the root directory

### Port 5000 or 5173 already in use
- Stop other applications using these ports
- Or modify the ports in `app.py` and `vite.config.ts`

### Camera not working
- Check browser permissions
- Use "Upload Image" instead

### Backend not responding
- Check if Flask is running: `python app.py`
- Check console for errors
- Verify model file exists

## Manual Startup (Alternative)

If the startup script doesn't work:

**Terminal 1:**
```bash
python app.py
```

**Terminal 2:**
```bash
npm run dev
```

Then open http://localhost:5173

