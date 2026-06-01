import React from 'react';
import { QRCodeData } from '../types/qr';

interface QRInputFormProps {
  data: QRCodeData;
  onChange: (data: QRCodeData) => void;
  t: (key: string) => string;
}

export const QRInputForm: React.FC<QRInputFormProps> = ({ data, onChange, t }) => {
  const handleContentChange = (content: string) => {
    onChange({ ...data, content });
  };

  const renderInputFields = () => {
    switch (data.type) {
      case 'url':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-2">
                {t('urlLabel')}
              </label>
              <input
                type="url"
                value={data.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder={t('urlPlaceholder')}
                className="wf-input"
              />
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-2">
                {t('textLabel')}
              </label>
              <textarea
                value={data.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder={t('textPlaceholder')}
                rows={4}
                className="wf-input resize-none"
              />
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-2">
                {t('emailLabel')}
              </label>
              <input
                type="email"
                value={data.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder={t('emailPlaceholder')}
                className="wf-input"
              />
            </div>
          </div>
        );

      case 'phone':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-2">
                {t('phoneLabel')}
              </label>
              <input
                type="tel"
                value={data.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder={t('phonePlaceholder')}
                className="wf-input"
              />
            </div>
          </div>
        );

      case 'wifi':
        const [ssid = '', password = '', security = 'WPA'] = data.content.split('|');
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-2">
                {t('networkName')}
              </label>
              <input
                type="text"
                value={ssid}
                onChange={(e) => handleContentChange(`${e.target.value}|${password}|${security}`)}
                placeholder={t('networkPlaceholder')}
                className="wf-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-2">
                {t('password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => handleContentChange(`${ssid}|${e.target.value}|${security}`)}
                placeholder={t('passwordPlaceholder')}
                className="wf-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-2">
                {t('securityType')}
              </label>
              <select
                value={security}
                onChange={(e) => handleContentChange(`${ssid}|${password}|${e.target.value}`)}
                className="wf-input"
              >
                <option value="WPA">{t('wpaOption')}</option>
                <option value="WEP">{t('wepOption')}</option>
                <option value="nopass">{t('noPasswordOption')}</option>
              </select>
            </div>
          </div>
        );

      case 'vcard':
        const [name = '', phone = '', email = ''] = data.content.split('|');
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-2">
                {t('fullName')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleContentChange(`${e.target.value}|${phone}|${email}`)}
                placeholder={t('namePlaceholder')}
                className="wf-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-2">
                {t('contactPhone')}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => handleContentChange(`${name}|${e.target.value}|${email}`)}
                placeholder={t('contactPhonePlaceholder')}
                className="wf-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-2">
                {t('contactEmail')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => handleContentChange(`${name}|${phone}|${e.target.value}`)}
                placeholder={t('contactEmailPlaceholder')}
                className="wf-input"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="wf-panel p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-4">
        {t(data.type)} QR Code
      </h3>
      {renderInputFields()}
    </div>
  );
};