import React from 'react';
import { Download, RotateCcw, Eye, Link2, AlertTriangle } from 'lucide-react';
import { downloadQRCode } from '../utils/qrGenerator';
import { getTrackingUrl } from '../utils/trackingUrl';

interface QRPreviewProps {
  qrCode: string | null;
  isGenerating: boolean;
  onRegenerate: () => void;
  onSaveToHistory: () => void;
  scanCount?: number;
  qrId?: string | null;
  trackingActive?: boolean;
  supabaseConfigured?: boolean;
  t: (key: string) => string;
}

export const QRPreview: React.FC<QRPreviewProps> = ({
  qrCode,
  isGenerating,
  onRegenerate,
  onSaveToHistory,
  scanCount = 0,
  qrId,
  trackingActive = false,
  supabaseConfigured = false,
  t,
}) => {
  const handleDownload = () => {
    if (qrCode) {
      downloadQRCode(qrCode, `waveframe-qrcode-${Date.now()}`);
      onSaveToHistory();
    }
  };

  const trackingUrl = qrId ? getTrackingUrl(qrId) : null;

  return (
    <div className="wf-panel p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white">{t('previewTitle')}</h3>
        <button
          type="button"
          onClick={onRegenerate}
          disabled={isGenerating}
          className="p-2 text-slate-500 dark:text-white/40 hover:text-wf-cyan transition-colors duration-200 disabled:opacity-50"
          title={t('regenerateTooltip')}
        >
          <RotateCcw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {qrCode && !isGenerating && supabaseConfigured && !trackingActive && (
        <div className="mb-4 p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 flex gap-2 text-sm text-amber-200/90">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{t('trackingUnavailable')}</p>
        </div>
      )}

      {trackingActive && qrId && (
        <div className="mb-4 space-y-2">
          <div className="p-3 bg-wf-gradient-soft rounded-lg border border-wf-cyan/20">
            <div className="flex items-center space-x-2 text-sm">
              <Eye className="w-4 h-4 text-wf-cyan shrink-0" />
              <span className="text-slate-700 dark:text-white/70 font-medium">
                {t('scanCountLabel')}: <span className="text-wf-cyan font-bold">{scanCount}</span>
              </span>
            </div>
          </div>
          {trackingUrl && (
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-wf-elevated border border-slate-200 dark:border-white/10">
              <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-white/50">
                <Link2 className="w-3.5 h-3.5 text-wf-cyan shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-medium text-slate-600 dark:text-white/60 mb-0.5">{t('trackingUrlHint')}</p>
                  <p className="break-all text-wf-cyan/90">{trackingUrl}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col items-center">
        <div className="relative mb-4 sm:mb-6">
          {isGenerating ? (
            <div className="w-48 h-48 sm:w-64 sm:h-64 bg-slate-100 dark:bg-wf-elevated rounded-2xl flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wf-cyan" />
            </div>
          ) : qrCode ? (
            <div className="relative group">
              <img
                src={qrCode}
                alt="Generated QR Code"
                className="w-48 h-48 sm:w-64 sm:h-64 rounded-2xl shadow-wf-lg transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-2xl transition-all duration-300" />
            </div>
          ) : (
            <div className="w-48 h-48 sm:w-64 sm:h-64 bg-slate-100 dark:bg-wf-elevated rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-white/15">
              <p className="text-slate-500 dark:text-white/40 text-center text-sm sm:text-base px-4">
                {t('fillFormMessage').split('\\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i === 0 && <br />}
                  </span>
                ))}
              </p>
            </div>
          )}
        </div>

        {qrCode && !isGenerating && (
          <button type="button" onClick={handleDownload} className="wf-btn-primary">
            <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            {t('downloadButton')}
          </button>
        )}
      </div>
    </div>
  );
};
