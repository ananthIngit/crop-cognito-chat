"""
Real-time Detection (Webcam or Jetson)
Standalone inference script for testing without the web interface
"""
import cv2
import torch
from torchvision import transforms
from models.hybrid_model import HybridPlantNet
from utils.dataset_loader import get_class_names
import os

# --- Configuration ---
MODEL_PATH = "hybrid_model.pth"
DATA_DIR = "data/PlantVillage"
# Fallback classes (used if get_class_names fails)
CLASSES_FALLBACK = ["Class 0", "Class 1", "Class 2"] 
# ---------------------

# --- Dynamic Class Loading ---
try:
    # Attempt to load classes from the dataset directory
    if os.path.exists(DATA_DIR):
        CLASSES = get_class_names(DATA_DIR)
        NUM_CLASSES = len(CLASSES)
    else:
        raise FileNotFoundError(f"Dataset directory {DATA_DIR} not found")
except Exception as e:
    print(f"WARNING: Could not determine classes from {DATA_DIR}. Using fallback classes.")
    print(f"Error: {e}")
    CLASSES = CLASSES_FALLBACK
    NUM_CLASSES = len(CLASSES_FALLBACK)

# --- Model Loading ---
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
try:
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file {MODEL_PATH} not found")
    
    model = HybridPlantNet(num_classes=NUM_CLASSES)
    model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
    model.eval()
    model.to(DEVICE)
    print(f"✅ Model loaded successfully on {DEVICE}")
    print(f"📊 Classes: {CLASSES}")
except FileNotFoundError as e:
    print(f"ERROR: {e}")
    print(f"Please train the model first by running: python train.py")
    exit(1)
except Exception as e:
    print(f"ERROR: Failed to load model: {e}")
    exit(1)

# --- Preprocessing Transform ---
transform = transforms.Compose([
    transforms.ToPILImage(), 
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

# --- Real-time Inference Loop ---
if __name__ == '__main__':
    cap = cv2.VideoCapture(0) # Open default webcam

    if not cap.isOpened():
        print("ERROR: Could not open video stream (Webcam).")
        exit(1)

    print("Starting real-time detection. Press 'q' to exit.")

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        # Preprocessing
        img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        input_tensor = transform(img_rgb).unsqueeze(0).to(DEVICE)

        # Prediction
        with torch.no_grad():
            output = model(input_tensor)
            probabilities = torch.nn.functional.softmax(output, dim=1)
            pred_idx = torch.argmax(probabilities, dim=1).item()
            confidence = probabilities[0][pred_idx].item()
            pred_class = CLASSES[pred_idx] if pred_idx < len(CLASSES) else f"Class {pred_idx}"

        # Visualization/Output
        label = f"{pred_class}: {confidence*100:.1f}%"
        cv2.putText(frame, label, (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        
        cv2.imshow("Leaf Disease Detection", frame)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Cleanup
    cap.release()
    cv2.destroyAllWindows()

