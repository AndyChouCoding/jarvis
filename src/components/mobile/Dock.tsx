import React from 'react';

interface DockProps {
  children: React.ReactNode;
}

export const Dock: React.FC<DockProps> = ({ children }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-md">
      <div className="
        flex items-center justify-around px-4 py-4
        bg-white/10 backdrop-blur-2xl border border-white/20
        rounded-3xl shadow-2xl
      ">
        {children}
      </div>
    </div>
  );
};
