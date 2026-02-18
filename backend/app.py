from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from camera import EmotionRecognizer
import os
import cv2
import numpy as np
import base64

app = Flask(__name__)
CORS(app)

# Global variables
recognizer = EmotionRecognizer()

@app.route('/analyze', methods=['POST'])
def analyze_frame():
    try:
        data = request.json
        if 'image' not in data:
            return jsonify({"error": "No image provided"}), 400
            
        # Decode base64 image
        image_data = data['image'].split(',')[1]
        image_bytes = base64.b64decode(image_data)
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
             return jsonify({"error": "Failed to decode image"}), 400

        # Get predictions
        predictions = recognizer.detect_emotion(frame)
        
        return jsonify(predictions)
        
    except Exception as e:
        print(f"Error processing frame: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "emotion-detection-api"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
