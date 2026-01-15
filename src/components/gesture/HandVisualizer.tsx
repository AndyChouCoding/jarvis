
import React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// MediaPipe Hand Connections (Indices of connected landmarks)
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8], // Index
  [0, 9], [9, 10], [10, 11], [11, 12], // Middle
  [0, 13], [13, 14], [14, 15], [15, 16], // Ring
  [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
  [5, 9], [9, 13], [13, 17] // Palm
];

interface HandVisualizerProps {
  landmarks: any[]; // Normalized landmarks from MediaPipe
}

const HandVisualizer: React.FC<HandVisualizerProps> = ({ landmarks }) => {
  const pointsRef = React.useRef<THREE.Group>(null);
  const linesRef = React.useRef<THREE.Group>(null);

  useFrame(() => {
    if (!landmarks || landmarks.length === 0) return;

    // Scale and flip logic
    // MediaPipe Vision gives x, y, z in [0,1]. Y is down.
    // We Map to Three.js world space:
    // x: (0..1) -> (-5..5) (flipped for mirror effect: 1-x)
    // y: (0..1) -> (4..-4)
    // z: (0..1) -> (0..2) (approx depth)
    
    // Update Joints (Spheres)
    if (pointsRef.current) {
        pointsRef.current.children.forEach((mesh, index) => {
            if (landmarks[index]) {
                const lm = landmarks[index];
                // Mirror X axis: (1 - x)
                const x = (1 - lm.x) * 10 - 5; 
                const y = (1 - lm.y) * 8 - 4;
                const z = -lm.z * 10;
                mesh.position.set(x, y, z);
            }
        });
    }

    // Update Connections (Lines)
    if (linesRef.current) {
        // Rebuild geometry for lines every frame is expensive, 
        // but for <30 lines it's acceptable for this demo.
        // Better approach: Update buffer attributes.
        // For simplicity with basic Three.js logic:
        // We will just draw lines between updated points.
        // Actually, let's use a simpler approach: 
        // We assume line segments are pre-created.
    }
  });
  
  // Helper to get position from landmark index
  const getPos = (index: number) => {
      if(!landmarks || !landmarks[index]) return new THREE.Vector3(0,0,0);
      const lm = landmarks[index];
      return new THREE.Vector3(
          (1 - lm.x) * 10 - 5,
          (1 - lm.y) * 8 - 4,
          -lm.z * 10
      );
  }

  return (
    <group>
        {/* Joints */}
      <group ref={pointsRef}>
        {Array.from({ length: 21 }).map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
          </mesh>
        ))}
      </group>
      
      {/* Connections (Drawing as separate Line objects for simplicity) */}
      <group>
         {HAND_CONNECTIONS.map((pair, i) => {
             const start = getPos(pair[0]);
             const end = getPos(pair[1]);
             // Quick line segment logic
             const curve = new THREE.LineCurve3(start, end);
             const geometry = new THREE.TubeGeometry(curve, 1, 0.08, 8, false);
             return (
                 <mesh key={i} geometry={geometry}>
                     <meshStandardMaterial color="#0088ff" transparent opacity={0.6} />
                 </mesh>
             )
         })}
      </group>
    </group>
  );
};

export default HandVisualizer;
