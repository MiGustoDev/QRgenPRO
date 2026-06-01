import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '../hooks/useLanguage';

interface LanguageToggleProps {
  language: Language;
  onToggle: () => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ language, onToggle }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="relative p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-wf-elevated hover:bg-wf-cyan/10 border border-transparent dark:border-white/10 transition-all duration-300"
      title={language === 'en' ? 'Cambiar a español' : 'Switch to English'}
    >
      <div className="flex items-center space-x-1 sm:space-x-2">
        <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-wf-cyan" />
        <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-white/80 uppercase">
          {language}
        </span>
      </div>
    </button>
  );
};
