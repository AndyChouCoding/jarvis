"use client";

import GestureCursor from "./GestureCursor";
import HandVisualizer from "./HandVisualizer";

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
  
  const lastClickTime = useRef(0);
  const lastHandPos = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastHoveredElement = useRef<HTMLElement | null>(null);
  const originalStyle = useRef<string | null>(null); // Store original style of hovered element
  
  // State for Visuals
  const [landmarks, setLandmarks] = useState<any[]>([]);
  
  // State for Cursor
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isPinching, setIsPinching] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<string | undefined>(undefined);
  
  // Debug State
  const [gestureMode, setGestureMode] = useState<string>("NONE");

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
          numHands: 1, 
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
    if (!handLandmarker) return;
    if (webcamRunning) {
      setWebcamRunning(false);
      return;
    }
    setWebcamRunning(true);
  };

  useEffect(() => {
    if (webcamRunning && videoRef.current) {
        const constraints = { video: { width: 1280, height: 720 } };
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.addEventListener("loadeddata", predictWebcam);
            }
        });
    }
  }, [webcamRunning]);

  // --- Helper Functions for Finger State ---
  
  const isFingerExtended = (landmarks: any[], fingerTipIndex: number, fingerPipIndex: number) => {
      const tip = landmarks[fingerTipIndex];
      const pip = landmarks[fingerPipIndex];
      // Basic check: is tip higher (smaller Y) than PIP? (Assumes upright hand)
      // Adding a small buffer to prevent flickering
      return tip.y < pip.y; 
  };

  const predictWebcam = () => {
    if (videoRef.current && handLandmarker) {
        let startTimeMs = performance.now();
        const detections = handLandmarker.detectForVideo(videoRef.current, startTimeMs);
        
        if (detections.landmarks && detections.landmarks.length > 0) {
             const hand = detections.landmarks[0];
             setLandmarks(hand);
             
             // --- Cursor Logic ---
             const indexTip = hand[8];
             
             // Map 0..1 to Window Dimensions (Flipped X because webcam is mirrored)
             const x = (1 - indexTip.x) * window.innerWidth;
             const y = indexTip.y * window.innerHeight;
             setCursorPos({ x, y });

             // --- Finger States (Relaxed) ---
             // Thumb: 1-4, Index: 5-8, Middle: 9-12, Ring: 13-16, Pinky: 17-20
             
             // 1. Is Index Extended? (Tip 8 vs PIP 6)
             const isIndexExtended = isFingerExtended(hand, 8, 6);
             
             // 2. Are others curled? (Tip vs PIP, inverted logic or just below)
             // Relaxed: Just check if middle finger tip (12) is below middle pip (10)
             // or just check if they are "not extended"
             const isMiddleExtended = isFingerExtended(hand, 12, 10);
             const isRingExtended = isFingerExtended(hand, 16, 14);
             const isPinkyExtended = isFingerExtended(hand, 20, 18);
             
             // Pointing Mode: Index is UP, at least Middle and Ring are DOWN
             const isPointingMode = isIndexExtended && !isMiddleExtended && !isRingExtended;
             
             // Open Palm: All main 4 fingers extended
             const isHandOpen = isIndexExtended && isMiddleExtended && isRingExtended && isPinkyExtended;


             let currentMode = "NONE";
             if (isHandOpen) currentMode = "OPEN_PALM";
             else if (isPointingMode) currentMode = "POINTING";
             setGestureMode(currentMode);

             // --- Pinch/Click Logic ---
             const thumbTip = hand[4];
             const distance = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);
             
             // TUNING: Increased threshold for easier clicking (0.05 -> 0.1)
             const PINCH_THRESHOLD = 0.1; 
             
             const isPinching = distance < PINCH_THRESHOLD;
             
             // TUNING: Relaxed Logic
             // Allow pinch if hand is NOT open palm. 
             // This covers "Pointing" but also "Sloppy Pointing" where maybe the ring finger is slightly out.
             // Crucially, it still blocks the "Open Palm" false positives.
             const validClickState = isPinching && !isHandOpen; 
             
             setIsPinching(validClickState);

             
             // --- Swipe Up Gesture Logic (Back) ---
             const now = Date.now();
             const currentY = indexTip.y; 
             const currentX = indexTip.x;
             
             if (lastHandPos.current) {
                 const dy = currentY - lastHandPos.current.y;
                 const dx = currentX - lastHandPos.current.x;
                 const dt = (now - lastHandPos.current.time) / 1000; 
                 
                 if (dt > 0) {
                     const velocityY = dy / dt; 
                     const SWIPE_VELOCITY_THRESHOLD = -1.5; // Easier swipe
                     
                     if (isHandOpen && velocityY < SWIPE_VELOCITY_THRESHOLD) {
                         if (now - lastClickTime.current > 1500) { 
                             console.log(`TRIGGER BACK (Velocity: ${velocityY.toFixed(2)})`);
                             window.history.back();
                             lastClickTime.current = now;
                             setHoveredElement("BACK SWIPE");
                         }
                     }
                 }
             }
             lastHandPos.current = { x: currentX, y: currentY, time: now };

             
             // --- Interaction & Hover Logic ---
             const elem = document.elementFromPoint(x, y) as HTMLElement;
             
             // Explicit "Response" from UI: Add outline/highlight to hovered element
             if (elem && elem !== lastHoveredElement.current) {
                 // CLEANUP Previous
                 if (lastHoveredElement.current) {
                     // Try to restore style? Or just remove outline
                     // Not perfect if element had outline, but good enough for demo
                     lastHoveredElement.current.style.outline = "";
                     lastHoveredElement.current.style.boxShadow = "";
                 }
                 
                 // SETUP New
                 const interactive = 
                    elem.tagName === 'A' || 
                    elem.tagName === 'BUTTON' || 
                    elem.tagName === 'INPUT' ||
                    elem.getAttribute('role') === 'button' ||
                    window.getComputedStyle(elem).cursor === 'pointer';
                 
                 if (interactive) {
                     // Visual "Response"
                     elem.style.outline = "2px solid #06b6d4"; // Cyan-500
                     elem.style.boxShadow = "0 0 10px rgba(6, 182, 212, 0.5)";
                     
                     const label = elem.innerText ? elem.innerText.slice(0, 15) : elem.tagName;
                     setHoveredElement(label);
                 } else {
                     setHoveredElement(undefined);
                 }
                 
                 lastHoveredElement.current = elem;
             } 
             else if (!elem && lastHoveredElement.current) {
                 lastHoveredElement.current.style.outline = "";
                 lastHoveredElement.current.style.boxShadow = "";
                 lastHoveredElement.current = null;
                 setHoveredElement(undefined);
             }
             
             // CLICK
             if (validClickState) {
                 if (elem) {
                      // TUNING: Reduced cooldown (500ms -> 300ms) for faster responsiveness
                      if (now - lastClickTime.current > 300) { 
                          console.log("TRIGGER CLICK on", elem);
                          elem.click(); 
                          if (elem.tagName === 'INPUT' || elem.tagName === 'TEXTAREA') elem.focus();
                          lastClickTime.current = now;
                      }
                 }
             }

             if (onGesture) {
                 onGesture(validClickState ? "PINCH" : "MOVE");
             }
        } else {
            setLandmarks([]);
            setGestureMode("NO_HAND");
        }
        
        if (webcamRunning) {
            requestAnimationFrame(predictWebcam);
        }
    }
  };

  return (
    <>
        {/* Full Screen Virtual Cursor */}
        {webcamRunning && (
            <GestureCursor 
                x={cursorPos.x} 
                y={cursorPos.y} 
                isPinching={isPinching} 
                hoveredElement={hoveredElement}
            />
        )}

        {/* Camera & Visualizer Widget */}
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-center bg-black/90 p-1 rounded-xl backdrop-blur-md border border-cyan-500/30 shadow-[0_0_20px_rgba(0,255,255,0.1)]">
        <div className="flex w-full justify-between px-2 py-1 items-center bg-gray-900 rounded-t-lg mb-1">
            <h3 className="text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-wider">SYSTEM.VISUAL</h3>
            <div className={`w-2 h-2 rounded-full ${webcamRunning ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
        </div>
        
        <div className="relative w-48 h-36 bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
            <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-cover opacity-20 filter grayscale"
            autoPlay
            playsInline
            muted
            />
            
            <div className="absolute top-0 left-0 w-full h-full">
                <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <HandVisualizer landmarks={landmarks} />
                </Canvas>
            </div>
            
            {/* HUD Info */}
            <div className="absolute bottom-1 left-1 bg-black/50 text-[10px] text-cyan-500 font-mono px-1 rounded">
                MODE: {gestureMode}
            </div>

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-cyan-500 font-mono text-xs">
                    INITIALIZING...
                </div>
            )}
        </div>

        <button
            onClick={enableCam}
            disabled={loading}
            className={`mt-2 w-full py-1 rounded text-[10px] font-mono font-bold transition-all ${
            webcamRunning 
                ? "bg-red-500/20 hover:bg-red-500/40 text-red-500 border border-red-500/50" 
                : "bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-500 border border-cyan-500/50"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            {loading ? "LOADING..." : webcamRunning ? "TERMINATE LINK" : "ESTABLISH LINK"}
        </button>
        </div>
    </>
  );
};

export default GestureManager;

