import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="relative p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-wf-elevated hover:bg-wf-cyan/10 border border-transparent dark:border-white/10 transition-all duration-300"
      title={isDarkMode ? 'Modo claro' : 'Modo oscuro'}
    >
      <div className="relative w-5 h-5 sm:w-6 sm:h-6">
        <Sun
          className={`absolute inset-0 w-5 h-5 sm:w-6 sm:h-6 text-wf-teal transition-all duration-300 transform ${
            isDarkMode ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
        />
        <Moon
          className={`absolute inset-0 w-5 h-5 sm:w-6 sm:h-6 text-wf-cyan transition-all duration-300 transform ${
            isDarkMode ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>
    </button>
  );
};
