"use client";

import React, { useEffect, useRef, useState } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { Canvas } from "@react-three/fiber";

interface GestureManagerProps {
  onGesture?: (gesture: string) => void;
}

const GestureManager: React.FC<GestureManagerProps> = ({ onGesture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [handLandmarker, setHandLandmarker] = useState<HandLandmarker | null>(null);
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize MediaPipe HandLandmarker
  useEffect(() => {
    const createHandLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 2,
        });
        setHandLandmarker(landmarker);
        setLoading(false);
      } catch (error) {
        console.error("Error creating HandLandmarker:", error);
        setLoading(false);
      }
    };

    createHandLandmarker();
  }, []);

  useEffect(() => {
    if (handLandmarker && !webcamRunning) {
        enableCam();
    }
  }, [handLandmarker]);

  // Activate Webcam
  const enableCam = async () => {
    if (!handLandmarker) {
      console.log("Wait for handLandmarker to load before clicking!");
      return;
    }

    if (webcamRunning) {
      setWebcamRunning(false);
      return;
    }

    setWebcamRunning(true);
  };

  useEffect(() => {
    if (webcamRunning && videoRef.current) {
        const constraints = { video: true };
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.addEventListener("loadeddata", predictWebcam);
            }
        });
    }
  }, [webcamRunning]);

  let lastVideoTime = -1;
  const predictWebcam = () => {
    if (videoRef.current && handLandmarker) {
        let startTimeMs = performance.now();
        if (lastVideoTime !== videoRef.current.currentTime) {
            lastVideoTime = videoRef.current.currentTime;
            const detections = handLandmarker.detectForVideo(videoRef.current, startTimeMs);
            if (detections.landmarks && detections.landmarks.length > 0) {
                 // Simple logic to detect "Open_Palm" or just logs for now
                 // In a real app we would map landmarks to gestures
                 console.log(detections.landmarks);
                 if (onGesture) {
                     onGesture("HAND_DETECTED");
                 }
            }
        }
        if (webcamRunning) {
            requestAnimationFrame(predictWebcam);
        }
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-center bg-gray-900/80 p-2 rounded-xl backdrop-blur-md border border-gray-700 shadow-2xl">
      <h3 className="text-white text-xs mb-2 font-bold uppercase tracking-wider">Gesture Control</h3>
      
      <div className="relative w-48 h-36 bg-black rounded-lg overflow-hidden border border-gray-600">
        {/* Webcam Feed (Hidden or Visible for Debug) */}
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover opacity-50"
          autoPlay
          playsInline
        />
        
        {/* Three.js Canvas for Visual Feedback */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <Canvas>
                 <ambientLight />
                 <pointLight position={[10, 10, 10]} />
                 {/* 3D visualization of hands could go here */}
            </Canvas>
        </div>
        
        {loading && (
            <div className="absolute inset-0 flex items-center justify-center text-white text-xs">
                Loading Model...
            </div>
        )}
      </div>

      <button
        onClick={enableCam}
        disabled={loading}
        className={`mt-2 px-3 py-1 rounded text-xs font-medium transition-colors ${
          webcamRunning 
            ? "bg-red-500 hover:bg-red-600 text-white" 
            : "bg-blue-500 hover:bg-blue-600 text-white"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loading ? "Initializing..." : webcamRunning ? "Stop Camera" : "Start Camera"}
      </button>
    </div>
  );
};

export default GestureManager;
