
import React from "react";
import { ArrowUpLeft, Grab, MousePointer2 } from "lucide-react";

interface GestureCursorProps {
  x: number;
  y: number;
  isPinching: boolean;
  hoveredElement?: string;
}

const GestureCursor: React.FC<GestureCursorProps> = ({ x, y, isPinching, hoveredElement }) => {
  // Smooth transition for position could be handled here or in parent.
  // Assuming parent passes raw or smoothed coordinates.
  
  return (
    <div
      className="fixed pointer-events-none z-[9999] flex items-start justify-start transition-transform duration-75 ease-out"
      style={{
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`,
      }}
    >
      <div className={`
        relative flex items-center justify-center 
        transition-all duration-200 
        ${isPinching ? "scale-90" : "scale-100"}
      `}>
        {/* Ripple Effect on Pinch/Click - Made stronger */}
        {isPinching && (
            <div className="absolute w-16 h-16 rounded-full border-4 border-green-400 animate-ping opacity-75" />
        )}
        
        {/* Outer Ring */}
        <div className={`
            absolute w-12 h-12 rounded-full border-2 border-dashed animate-spin-slow
            ${isPinching ? "border-green-400 opacity-100 scale-125 bg-green-500/20" : "border-cyan-400 opacity-60"}
        `} />
        
        {/* Inner Dot/Icon */}
        <div className={`
            w-4 h-4 rounded-full shadow-[0_0_15px_rgba(0,255,255,0.8)] z-10
            ${isPinching ? "bg-green-400 scale-150 shadow-[0_0_20px_rgba(74,222,128,1)]" : "bg-cyan-500"}
        `}>
             {/* Optional Icon Overlay */}
             {isPinching && <Grab size={10} className="text-black absolute -top-0.5 -left-0.5" />}
        </div>
        
        {/* Connecting Lines / HUD elements */}
        <div className="absolute top-0 left-6 h-[1px] w-8 bg-cyan-500/50" />
        <div className="absolute top-0 left-14 text-[10px] font-mono whitespace-nowrap text-cyan-400 bg-black/80 px-1 rounded">
             {Math.round(x)}, {Math.round(y)}
        </div>
        
        {/* Hover Label */}
        {hoveredElement && !isPinching && (
            <div className="absolute top-6 left-0 text-xs font-bold text-white bg-blue-600/90 px-2 py-1 rounded shadow-lg backdrop-blur">
                {hoveredElement}
            </div>
        )}

        {/* CLICK Label - Explicit Feedback */}
        {isPinching && (
             <div className="absolute top-8 left-0 text-xs font-black text-green-400 bg-black/80 px-2 py-1 rounded border border-green-500 tracking-widest shadow-[0_0_10px_rgba(74,222,128,0.5)]">
                 CLICK!!
             </div>
        )}
      </div>
    </div>
  );
};

export default GestureCursor;
