import Link from "next/link";
import React from "react";
import { LucideIcon } from "lucide-react";

interface AppIconProps {
  icon: LucideIcon;
  label: string;
  href: string;
  color?: string; // e.g. "bg-blue-500"
}

export const AppIcon: React.FC<AppIconProps> = ({ icon: Icon, label, href, color = "bg-blue-500" }) => {
  return (
    <Link href={href} className="group flex flex-col items-center gap-2">
      {/* Icon Container */}
      <div 
        className={`
            relative w-[88px] h-[88px] sm:w-[96px] sm:h-[96px] rounded-[22px] 
            flex items-center justify-center 
            shadow-lg transition-all duration-300 ease-out
            group-hover:scale-105 group-active:scale-95 group-active:brightness-90
            ${color}
        `}
      >
        {/* Inner Gloss/Glow (Simulate glass surface) */}
        <div className="absolute inset-0 rounded-[22px] bg-gradient-to-br from-white/30 via-transparent to-black/10 pointer-events-none" />
        
        {/* Icon */}
        <Icon size={48} className="text-white drop-shadow-sm z-10" />
      </div>

      {/* Label */}
      <span className="text-xs sm:text-sm font-medium text-white/90 text-center tracking-tight drop-shadow-md">
        {label}
      </span>
    </Link>
  );
};
