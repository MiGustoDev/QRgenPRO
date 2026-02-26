import React from 'react';
import { Download, RotateCcw, Eye } from 'lucide-react';
import { downloadQRCode } from '../utils/qrGenerator';

interface QRPreviewProps {
  qrCode: string | null;
  isGenerating: boolean;
  onRegenerate: () => void;
  onSaveToHistory: () => void;
  scanCount?: number;
  qrId?: string | null;
  t: (key: string) => string;
}

export const QRPreview: React.FC<QRPreviewProps> = ({
  qrCode,
  isGenerating,
  onRegenerate,
  onSaveToHistory,
  scanCount = 0,
  qrId,
  t,
}) => {
  const handleDownload = () => {
    if (qrCode) {
      downloadQRCode(qrCode, `qrcode-${Date.now()}`);
      onSaveToHistory();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">{t('previewTitle')}</h3>
        <button
          onClick={onRegenerate}
          disabled={isGenerating}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-orange-400 transition-colors duration-200 disabled:opacity-50"
          title={t('regenerateTooltip')}
        >
          <RotateCcw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Estadísticas de escaneos */}
      {qrId && (
        <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center space-x-2 text-sm">
            <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Escaneos: <span className="text-purple-600 dark:text-purple-400 font-bold">{scanCount}</span>
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center">
        <div className="relative mb-4 sm:mb-6">
          {isGenerating ? (
            <div className="w-48 h-48 sm:w-64 sm:h-64 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          ) : qrCode ? (
            <div className="relative group">
              <img
                src={qrCode}
                alt="Generated QR Code"
                className="w-48 h-48 sm:w-64 sm:h-64 rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-2xl transition-all duration-300"></div>
            </div>
          ) : (
            <div className="w-48 h-48 sm:w-64 sm:h-64 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
              <p className="text-gray-500 dark:text-gray-400 text-center text-sm sm:text-base px-4">
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
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-orange-500 dark:to-red-500 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 dark:hover:from-orange-600 dark:hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            {t('downloadButton')}
          </button>
        )}
      </div>
    </div>
  );
};