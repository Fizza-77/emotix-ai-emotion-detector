import React, { useEffect, useState } from 'react';

const EMOTIONS = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral'];
const EMOTION_COLORS = {
    'Angry': 'bg-red-500',
    'Disgust': 'bg-green-600',
    'Fear': 'bg-purple-600',
    'Happy': 'bg-yellow-400',
    'Sad': 'bg-blue-500',
    'Surprise': 'bg-pink-400',
    'Neutral': 'bg-gray-400'
};

const EmotionChart = ({ predictions }) => {
    // predictions is now passed from parent
    const data = (predictions && predictions.length > 0) ? predictions[0] : null;

    // Internal state/effect for fetching is removed

    if (!data) {
        return (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20 h-full flex items-center justify-center text-white/50">
                Waiting for face detection...
            </div>
        );
    }

    const { emotion: dominantEmotion, emotions } = data;

    // Sort emotions by probability for better visualization? Or fixed order?
    // Fixed order is better for comparison.

    return (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20 h-full">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>Current Emotion:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-extrabold tracking-wide uppercase ${EMOTION_COLORS[dominantEmotion] || 'bg-gray-500'} text-white shadow-lg`}>
                    {dominantEmotion}
                </span>
            </h2>

            <div className="space-y-3">
                {EMOTIONS.map(emotionLabel => {
                    const score = emotions ? (emotions[emotionLabel] || 0) : 0;
                    const percentage = (score * 100).toFixed(1);

                    return (
                        <div key={emotionLabel} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium text-gray-300">
                                <span>{emotionLabel}</span>
                                <span>{percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className={`h-2.5 rounded-full transition-all duration-500 ease-out ${EMOTION_COLORS[emotionLabel]}`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EmotionChart;
