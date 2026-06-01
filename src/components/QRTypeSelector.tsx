import React from 'react';
import { Link, Type, Mail, Phone, Wifi, User } from 'lucide-react';

interface QRTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  t: (key: string) => string;
}

export const QRTypeSelector: React.FC<QRTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
  t,
}) => {
  const qrTypes = [
    { id: 'url', labelKey: 'url', icon: Link },
    { id: 'text', labelKey: 'text', icon: Type },
    { id: 'email', labelKey: 'email', icon: Mail },
    { id: 'phone', labelKey: 'phone', icon: Phone },
    { id: 'wifi', labelKey: 'wifi', icon: Wifi },
    { id: 'vcard', labelKey: 'contact', icon: User },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
      {qrTypes.map((type) => {
        const Icon = type.icon;
        const isSelected = selectedType === type.id;

        return (
          <button
            key={type.id}
            type="button"
            onClick={() => onTypeChange(type.id)}
            className={`
              relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 group
              ${
                isSelected
                  ? 'border-wf-cyan bg-wf-cyan/10 shadow-wf scale-105'
                  : 'border-slate-200 dark:border-white/10 bg-white dark:bg-wf-elevated hover:border-wf-cyan/40 hover:shadow-md hover:scale-102'
              }
            `}
          >
            <div
              className={`
              w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-2 mx-auto transition-all duration-300
              ${
                isSelected
                  ? 'bg-gradient-to-br from-wf-cyan to-wf-violet'
                  : 'bg-slate-100 dark:bg-wf-surface group-hover:bg-wf-cyan/10'
              }
            `}
            >
              <Icon
                className={`w-5 h-5 sm:w-6 sm:h-6 ${
                  isSelected ? 'text-wf-dark' : 'text-slate-600 dark:text-white/60'
                }`}
              />
            </div>
            <span
              className={`
              text-xs sm:text-sm font-medium transition-colors duration-300
              ${isSelected ? 'text-wf-cyan' : 'text-slate-700 dark:text-white/70'}
            `}
            >
              {t(type.labelKey)}
            </span>
          </button>
        );
      })}
    </div>
  );
};
