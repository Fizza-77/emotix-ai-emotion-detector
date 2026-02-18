import React, { useRef, useState, useEffect } from 'react';

const WebcamCapture = ({ onPrediction }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState(null);

    // Start Camera
    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 480 }
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    // Wait for metadata to load to play
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current.play().catch(e => console.error("Play error:", e));
                        setIsStreaming(true);
                    };
                }
            } catch (err) {
                console.error("Error accessing webcam:", err);
                setError("Camera access denied or unavailable. Please allow permissions.");
            }
        };

        startCamera();

        return () => {
            // Cleanup stream
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Capture and Analyze Frame
    useEffect(() => {
        if (!isStreaming) return;

        const interval = setInterval(async () => {
            if (videoRef.current && canvasRef.current) {
                // Use an offscreen canvas for capture to avoid clearing the overlay
                const captureCanvas = document.createElement('canvas');
                captureCanvas.width = 640;
                captureCanvas.height = 480;
                const captureCtx = captureCanvas.getContext('2d');
                captureCtx.drawImage(videoRef.current, 0, 0, 640, 480);

                // Get Base64 image
                const imageData = captureCanvas.toDataURL('image/jpeg', 0.8);

                // Send to Backend
                try {
                    const response = await fetch('http://localhost:5000/analyze', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ image: imageData })
                    });

                    if (response.ok) {
                        const predictions = await response.json();

                        // Draw Bounding Boxes on the OVERLAY canvas
                        const context = canvasRef.current.getContext('2d');
                        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Clear previous boxes

                        if (predictions.length > 0) {
                            predictions.forEach(pred => {
                                const [x, y, w, h] = pred.box;
                                context.strokeStyle = '#00FF00';
                                context.lineWidth = 3;
                                context.strokeRect(x, y, w, h);

                                context.fillStyle = '#00FF00';
                                context.font = 'bold 20px Arial';
                                context.fillText(`${pred.emotion} (${(pred.confidence * 100).toFixed(1)}%)`, x, y - 10);
                            });
                        }

                        // Pass prediction to parent (for chart)
                        if (onPrediction) {
                            onPrediction(predictions);
                        }
                    }
                } catch (err) {
                    console.error("Analysis error:", err);
                }
            }
        }, 200); // 5 FPS is enough for emotion (reduce load)

        return () => clearInterval(interval);
    }, [isStreaming, onPrediction]);

    return (
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <div className="relative bg-black rounded-lg overflow-hidden ring-1 ring-gray-900/5 shadow-2xl min-h-[480px] flex items-center justify-center">
                {error ? (
                    <div className="text-white/80 text-center p-8">
                        <p className="text-xl font-bold mb-2 text-red-500">Camera Error</p>
                        <p className="text-sm">{error}</p>
                    </div>
                ) : (
                    <div className="relative w-[640px] h-[480px]">
                        {/* Video Layer - Always Visible */}
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Overlay Layer - Transparent for drawing boxes */}
                        <canvas
                            ref={canvasRef}
                            width="640"
                            height="480"
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        />

                        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white/80 font-mono border border-white/10 z-10">
                            LIVE FEED ● CLIENT-SIDE
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WebcamCapture;
