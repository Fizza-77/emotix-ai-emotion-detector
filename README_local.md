# AI Emotion Detection System

A production-ready AI system for real-time facial emotion recognition using Deep Learning (CNN) and Computer Vision.

## Features
- **Real-time Detection**: Uses OpenCV and TensorFlow to detect faces and emotions from webcam feed.
- **Deep Learning Model**: Custom CNN trained on FER2013 dataset.
- **Strict Pipeline**: Training and inference pipelines are strictly aligned for real-world performance.
- **Modern UI**: Built with React, Vite, and Tailwind CSS.

## Prerequisites
- Python 3.8+
- Node.js 16+
- Webcam
- **FER2013 Dataset**: You must provide the `fer2013.csv` file.

## Setup Instructions

### 1. Dataset Preparation
The system requires the FER2013 dataset in CSV format.
1. Place your `fer2013.csv` file in the `backend` directory.
2. Run the conversion script to generate the image dataset:
   ```bash
   cd backend
   python convert_csv.py
   ```
   *This will create `data/train` and `data/test` folders with images.*

### 2. Backend Setup
Install dependencies:
```bash
pip install -r requirements.txt
```

**Train the Model**:
Once data is converted, train the CNN:
```bash
python train.py
```
*The trained model will be saved as `model.keras`.*

**Start the Server**:
```bash
python app.py
```
The API will run at `http://localhost:5000`.

### 3. Frontend Setup
Navigate to the `frontend` directory and install dependencies:

```bash
cd ../frontend
npm install
```

**Start the UI**:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

## Troubleshooting
- **No Model Found?**: You MUST run `python train.py` successfully first.
- **CSV Not Found?**: Ensure `fer2013.csv` is in the `backend` folder.
