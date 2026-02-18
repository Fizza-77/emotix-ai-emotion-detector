# 🎭 Emotix - AI-Powered Emotion Detector

Emotix is a real-time facial emotion recognition web application powered by Deep Learning.

It uses a React frontend with a Flask backend running a TensorFlow model to detect human emotions from live webcam input.

---

## 🚀 Features

- 🎥 Live webcam emotion detection
- 📊 Real-time emotion probability chart
- 🤖 Deep learning model for facial expression recognition
- 🌐 REST API powered by Flask
- ⚡ Clean modern UI using Tailwind CSS
- 📦 Modular frontend & backend architecture

---

## 🏗️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Chart.js
- Axios

### Backend
- Flask
- TensorFlow
- OpenCV
- NumPy

---

## 📂 Project Structure

emotion-detector/
│
├── frontend/        → React frontend
├── backend/         → Flask API + TensorFlow model
├── README.md
└── .gitignore

---

## 🧠 How It Works

1. Webcam captures live video frames
2. Frames are sent to Flask backend
3. Face detection is performed using OpenCV
4. TensorFlow model predicts emotion
5. Predictions are returned to frontend
6. Emotion probabilities are visualized in real-time

---

## 📦 Installation Guide

### 1️⃣ Clone the Repository

git clone https://github.com/YOUR_USERNAME/emotix-ai-emotion-detector.git

---

### 2️⃣ Backend Setup

cd backend
python -m venv venv

Activate environment:

Windows:
venv\Scripts\activate

Mac/Linux:
source venv/bin/activate

Install dependencies:
pip install -r requirements.txt

Run server:
python app.py

---

### 3️⃣ Frontend Setup

cd frontend
npm install
npm start

---

## ⚠️ Model File

Request it by sending mail to fizzaijaz2@gmail.com


## 🎯 Future Improvements

- Add user authentication
- Improve model accuracy
- Deploy using Docker
- Add emotion history tracking
- Mobile responsiveness improvements
