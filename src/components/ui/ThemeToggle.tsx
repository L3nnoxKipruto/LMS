import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ThemeToggleProps {
  variant?: 'minimal' | 'full';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'minimal', className }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      setIsDark(document.documentElement.classList.contains('dark'));
      
      const observer = new MutationObserver(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
      });
      
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });
      
      return () => observer.disconnect();
    }
  }, []);

  const toggleTheme = () => {
    if (typeof document !== 'undefined') {
      const nextDark = !isDark;
      if (nextDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      setIsDark(nextDark);
    }
  };

  if (variant === 'minimal') {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          "p-2 rounded-xl text-zinc-500 hover:text-blue-600 bg-zinc-100 hover:bg-zinc-200/50 border border-zinc-200/50 transition-all duration-300 focus:outline-none cursor-pointer flex items-center justify-center",
          className
        )}
        aria-label="Toggle Theme"
      >
        <span className="relative h-5 w-5 flex items-center justify-center">
          <Sun className={cn(
            "h-5 w-5 transition-all duration-500 absolute",
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100 text-amber-500"
          )} />
          <Moon className={cn(
            "h-5 w-5 transition-all duration-500 absolute",
            isDark ? "rotate-0 scale-100 opacity-100 text-blue-400" : "-rotate-90 scale-0 opacity-0"
          )} />
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "w-full flex items-center justify-between p-2.5 rounded-xl border transition-all duration-300 focus:outline-none cursor-pointer text-left",
        isDark 
          ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-850" 
          : "bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100",
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        <div className={cn(
          "p-1.5 rounded-lg transition-colors duration-300",
          isDark ? "bg-blue-900/30 text-blue-400" : "bg-amber-100 text-amber-600"
        )}>
          {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold leading-none">Theme Mode</span>
          <span className="text-[10px] text-zinc-400 mt-0.5 capitalize">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
        </div>
      </div>
      
      {/* Switch Track */}
      <div className={cn(
        "relative w-9 h-5 rounded-full p-0.5 transition-colors duration-300 flex items-center shrink-0",
        isDark ? "bg-blue-600" : "bg-zinc-300"
      )}>
        {/* Switch Thumb */}
        <div className={cn(
          "w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 transform",
          isDark ? "translate-x-4" : "translate-x-0"
        )} />
      </div>
    </button>
  );
};
