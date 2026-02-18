import React from 'react';
import WebcamCapture from './components/WebcamCapture';
import EmotionChart from './components/EmotionChart';

function App() {
  const [predictions, setPredictions] = React.useState([]);

  const handlePrediction = (newPredictions) => {
    setPredictions(newPredictions);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white selection:bg-indigo-500 selection:text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-sm">
            Emotix - AI-powered Emotion Detector
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Real-time facial expression recognition powered by Deep Learning.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="col-span-1 lg:col-span-2">
            <WebcamCapture onPrediction={handlePrediction} />
          </div>

          <div className="col-span-1 h-full">
            <EmotionChart predictions={predictions} />
          </div>
        </main>

        <footer className="mt-16 text-center text-gray-600 text-sm">
          <p>Running on TensorFlow & Flask Backend</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
