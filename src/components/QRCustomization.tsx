import React from 'react';
import { QRCodeOptions } from '../types/qr';

interface QRCustomizationProps {
  options: QRCodeOptions;
  onChange: (options: QRCodeOptions) => void;
  t: (key: string) => string;
}

export const QRCustomization: React.FC<QRCustomizationProps> = ({
  options,
  onChange,
  t,
}) => {
  const handleChange = (key: keyof QRCodeOptions, value: string | number) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="wf-panel p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-4">
        {t('customizationTitle')}
      </h3>

      <div className="space-y-4 sm:space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-2">
            {t('sizeLabel')}: {options.size}px
          </label>
          <input
            type="range"
            min="128"
            max="512"
            step="32"
            value={options.size}
            onChange={(e) => handleChange('size', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-wf-elevated rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-slate-500 dark:text-white/40 mt-1">
            <span>128px</span>
            <span>512px</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-2">
            {t('errorCorrectionLabel')}
          </label>
          <select
            value={options.errorCorrectionLevel}
            onChange={(e) => handleChange('errorCorrectionLevel', e.target.value)}
            className="wf-input"
          >
            <option value="L">{t('lowError')}</option>
            <option value="M">{t('mediumError')}</option>
            <option value="Q">{t('quartileError')}</option>
            <option value="H">{t('highError')}</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-2">
              {t('foregroundColor')}
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={options.foregroundColor}
                onChange={(e) => handleChange('foregroundColor', e.target.value)}
                className="w-10 h-10 sm:w-12 sm:h-12 border border-slate-300 dark:border-white/15 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={options.foregroundColor}
                onChange={(e) => handleChange('foregroundColor', e.target.value)}
                className="wf-input-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-2">
              {t('backgroundColor')}
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={options.backgroundColor}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                className="w-10 h-10 sm:w-12 sm:h-12 border border-slate-300 dark:border-white/15 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={options.backgroundColor}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                className="wf-input-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
