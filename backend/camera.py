import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
import os

class EmotionRecognizer(object):
    def __init__(self, model_path='model.keras'):
        # Load Face Detection Cascade
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
        # Load Emotion Detection Model
        self.emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']
        self.model = self.load_emotion_model(model_path)

    def load_emotion_model(self, model_path):
        if os.path.exists(model_path):
            print(f"Loading model from {model_path}")
            try:
                return load_model(model_path)
            except Exception as e:
                print(f"Error loading model: {e}")
                return None
        else:
            print(f"ERROR: Model file '{model_path}' not found.")
            return None

    def detect_emotion(self, image):
        if image is None:
            return []

        # Convert to Grayscale for Face Detection
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Detect Faces
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
        
        predictions = []

        for (x, y, w, h) in faces:
            # 1. Extract Face
            face_roi = image[y:y+h, x:x+w]
            
            # 2. Preprocess for MobileNetV2
            try:
                # Resize to 224x224
                face_roi = cv2.resize(face_roi, (224, 224))
                # MobileNetV2 expects RGB (cv2 is BGR, so convert)
                face_roi = cv2.cvtColor(face_roi, cv2.COLOR_BGR2RGB)
                # Normalize using MobileNetV2's preprocess_input
                face_roi = np.expand_dims(face_roi, axis=0)
                face_roi = preprocess_input(face_roi)

                if self.model:
                    prediction = self.model.predict(face_roi, verbose=0)[0]
                    max_index = int(np.argmax(prediction))
                    predicted_emotion = self.emotion_labels[max_index]
                    confidence = float(prediction[max_index])
                    
                    # Get all emotions
                    emotion_probs = {label: float(score) for label, score in zip(self.emotion_labels, prediction)}

                    predictions.append({
                        "emotion": predicted_emotion,
                        "confidence": confidence,
                        "box": [int(x), int(y), int(w), int(h)],
                        "emotions": emotion_probs
                    })
            except Exception as e:
                print(f"Error processing face: {e}")
                continue
                
        return predictions
