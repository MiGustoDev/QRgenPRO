import React from 'react';
import { Shield, Zap, Sparkles } from 'lucide-react';
import { DarkModeToggle } from './components/DarkModeToggle';
import { LanguageToggle } from './components/LanguageToggle';
import { QRTypeSelector } from './components/QRTypeSelector';
import { QRInputForm } from './components/QRInputForm';
import { QRCustomization } from './components/QRCustomization';
import { LogoOptions } from './components/LogoOptions';
import { QRPreview } from './components/QRPreview';
import { QRHistory } from './components/QRHistory';
import { WaveFrameLogo } from './components/WaveFrameBrand';
import { useQRGenerator } from './hooks/useQRGenerator';
import { useDarkMode } from './hooks/useDarkMode';
import { useLanguage } from './hooks/useLanguage';
import { getTranslation } from './utils/translations';

function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { language, toggleLanguage } = useLanguage();
  const {
    qrData,
    setQrData,
    qrOptions,
    setQrOptions,
    currentQR,
    isGenerating,
    history,
    generateQR,
    saveToHistory,
    clearHistory,
    removeFromHistory,
    currentQRId,
    scanCount,
    isSupabaseConfigured,
    trackingActive,
  } = useQRGenerator();

  const t = (key: string) => getTranslation(language, key);

  return (
    <div className="wf-page">
      <header className="wf-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <WaveFrameLogo className="h-10 sm:h-11 w-auto shrink-0" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold wf-gradient-text">
                  {t('title')}
                </h1>
                <p className="text-sm text-slate-600 dark:text-white/50">{t('subtitle')}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden lg:flex items-center space-x-4 xl:space-x-6 text-sm text-slate-600 dark:text-white/50">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-wf-cyan" />
                  <span>{t('permanentCodes')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-wf-teal" />
                  <span>{t('instantGeneration')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-wf-violet" />
                  <span>{t('highQuality')}</span>
                </div>
              </div>
              <LanguageToggle language={language} onToggle={toggleLanguage} />
              <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="wf-panel p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white mb-4">
                {t('chooseType')}
              </h2>
              <QRTypeSelector
                selectedType={qrData.type}
                onTypeChange={(type) =>
                  setQrData({ ...qrData, type: type as 'url' | 'text' | 'email' | 'phone' | 'wifi' | 'vcard', content: '' })
                }
                t={t}
              />
            </div>

            <QRInputForm data={qrData} onChange={setQrData} t={t} />
            <LogoOptions options={qrOptions} onChange={setQrOptions} t={t} />
            <QRCustomization options={qrOptions} onChange={setQrOptions} t={t} />
          </div>

          <div className="space-y-4 sm:space-y-6">
            <QRPreview
              qrCode={currentQR}
              isGenerating={isGenerating}
              onRegenerate={generateQR}
              onSaveToHistory={saveToHistory}
              scanCount={scanCount}
              qrId={currentQRId}
              trackingActive={trackingActive}
              supabaseConfigured={isSupabaseConfigured}
              t={t}
            />
            <QRHistory
              history={history}
              onClearHistory={clearHistory}
              onRemoveItem={removeFromHistory}
              t={t}
            />
          </div>
        </div>

        <section className="mt-12 sm:mt-16 text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-4">
            {t('featuresTitle')}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-white/60 mb-6 sm:mb-8 max-w-2xl mx-auto">
            {t('featuresSubtitle')}
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="wf-panel p-4 sm:p-6">
              <div className="w-12 h-12 bg-wf-cyan/15 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-wf-cyan" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-2">{t('permanentTitle')}</h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-white/60">{t('permanentDesc')}</p>
            </div>

            <div className="wf-panel p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-wf-teal/15 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-wf-teal" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-2">{t('instantTitle')}</h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-white/60">{t('instantDesc')}</p>
            </div>

            <div className="wf-panel p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-wf-violet/15 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-wf-violet" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-2">{t('customizationFeatureTitle')}</h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-white/60">{t('customizationDesc')}</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="wf-header border-t border-b-0 mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm sm:text-base text-slate-600 dark:text-white/50">
            <WaveFrameLogo className="h-8 w-auto opacity-90" variant="qr" />
            <p>
              {t('footerCopyright')} | {t('footerCraftedBy')}{' '}
              <a
                href="https://waveframe.com.ar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-wf-cyan hover:text-wf-teal font-medium transition-colors duration-200"
              >
                WaveFrame Studio
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
