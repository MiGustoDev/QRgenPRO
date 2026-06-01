import { useState, useCallback, useEffect, useRef } from 'react';
import { QRCodeData, QRCodeOptions, GeneratedQR } from '../types/qr';
import { generateQRCode, formatQRContent } from '../utils/qrGenerator';
import { useLocalStorage } from './useLocalStorage';
import { ensureQRTracking, getScanCount } from '../utils/supabaseQR';
import { isSupabaseConfigured } from '../lib/supabase';
import { isLegacyLogo, normalizeLogoUrl } from '../theme/waveframe';
import { getTrackingUrl } from '../utils/trackingUrl';

function sanitizeHistory(items: GeneratedQR[]): GeneratedQR[] {
  return items.map((item) => ({
    ...item,
    options: {
      ...item.options,
      logo: normalizeLogoUrl(item.options.logo),
    },
  }));
}

export const useQRGenerator = () => {
  const [qrData, setQrData] = useState<QRCodeData>({
    type: 'url',
    content: '',
  });

  const [qrOptions, setQrOptionsState] = useState<QRCodeOptions>({
    size: 256,
    errorCorrectionLevel: 'M',
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
  });

  const setQrOptions = (options: QRCodeOptions) => {
    setQrOptionsState({
      ...options,
      logo: normalizeLogoUrl(options.logo),
    });
  };

  const [currentQR, setCurrentQR] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useLocalStorage<GeneratedQR[]>('qr-history', []);

  // Migrar logos de Mi Gusto guardados en historial local
  useEffect(() => {
    if (!history.some((item) => isLegacyLogo(item.options.logo))) return;
    setHistory((prev) => sanitizeHistory(prev));
  }, [history, setHistory]);
  const [currentQRId, setCurrentQRId] = useState<string | null>(null);
  const currentQRIdRef = useRef<string | null>(null);
  currentQRIdRef.current = currentQRId;
  const [scanCount, setScanCount] = useState<number>(0);

  const generateQR = useCallback(async () => {
    if (!qrData.content.trim()) {
      setCurrentQR(null);
      setCurrentQRId(null);
      setScanCount(0);
      return;
    }

    setIsGenerating(true);
    try {
      // Guardar en Supabase para seguimiento
      const formattedContent = formatQRContent(qrData);
      console.log('📝 Contenido formateado para guardar:', formattedContent);

      // Reutilizar el mismo qr_id al editar → la URL /track/:id no cambia y los escaneos se acumulan
      const qrId = await ensureQRTracking(qrData, formattedContent, currentQRIdRef.current);
      console.log('💾 Tracking Supabase:', qrId ? `activo (${qrId})` : 'no disponible');

      let contentForQR = formattedContent;

      // El QR siempre apunta a nuestra app (/track/:id) → splash + contador + redirección al destino
      if (qrId) {
        const trackingUrl = getTrackingUrl(qrId);
        console.log('🔗 URL en el código QR (paso intermedio):', trackingUrl);
        contentForQR = trackingUrl;
        setCurrentQRId(qrId);
        if (!currentQRIdRef.current) {
          setScanCount(0);
        }
      } else {
        console.warn(
          '⚠️ Sin tracking: el QR lleva el destino directo y no registrará escaneos. Revisá .env y Supabase.'
        );
        setCurrentQRId(null);
        setScanCount(0);
      }

      const qrCode = await generateQRCode(
        { ...qrData, content: contentForQR },
        qrOptions
      );

      setCurrentQR(qrCode);
    } catch (error) {
      console.error('Error generating QR code:', error);
      setCurrentQR(null);
      setCurrentQRId(null);
      setScanCount(0);
    } finally {
      setIsGenerating(false);
    }
  }, [qrData, qrOptions]);

  const saveToHistory = useCallback(async () => {
    if (!currentQR || !qrData.content.trim()) {
      return;
    }

    // Obtener el conteo de escaneos actual si hay un QRId
    let currentScanCount = scanCount;
    if (currentQRId) {
      try {
        currentScanCount = await getScanCount(currentQRId);
        setScanCount(currentScanCount);
      } catch (error) {
        console.error('Error fetching scan count:', error);
      }
    }

    const newQR: GeneratedQR = {
      id: Date.now().toString(),
      data: qrData,
      options: qrOptions,
      qrCode: currentQR,
      timestamp: new Date(),
      supabaseId: currentQRId || undefined,
      scanCount: currentScanCount,
    };

    setHistory(prev => [newQR, ...prev.slice(0, 9)]); // Keep last 10
  }, [currentQR, qrData, qrOptions, setHistory, currentQRId, scanCount]);

  const clearHistory = () => {
    setHistory([]);
  };

  const removeFromHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  // Nuevo tipo de QR → nuevo registro de tracking
  useEffect(() => {
    setCurrentQRId(null);
    setScanCount(0);
  }, [qrData.type]);

  // Auto-generate QR when data or options change
  useEffect(() => {
    const timeoutId = setTimeout(generateQR, 300);
    return () => clearTimeout(timeoutId);
  }, [generateQR]);

  // Actualizar el conteo de escaneos periódicamente si hay un QRId
  useEffect(() => {
    if (!currentQRId) return;

    const updateScanCount = async () => {
      try {
        const count = await getScanCount(currentQRId);
        setScanCount(count);
      } catch (error) {
        console.error('Error updating scan count:', error);
      }
    };

    updateScanCount();
    const interval = setInterval(updateScanCount, 5000); // Actualizar cada 5 segundos

    return () => clearInterval(interval);
  }, [currentQRId]);

  // Actualizar estadísticas del historial periódicamente
  useEffect(() => {
    const fetchHistoryStats = async () => {
      if (history.length === 0) return;

      const ids = history.map(h => h.supabaseId).filter(id => id) as string[];
      if (ids.length === 0) return;

      // Consultar Supabase para obtener los conteos actualizados
      try {
        const module = await import('../lib/supabase');
        const { data, error } = await module.supabase
          .from('qr_codes')
          .select('qr_id, scan_count')
          .in('qr_id', ids);

        if (error || !data) return;

        // Actualizar el historial si hay cambios
        setHistory(prevHistory => {
          let hasChanges = false;
          const newHistory = prevHistory.map(item => {
            const stats = data.find(d => d.qr_id === item.supabaseId);
            if (stats && stats.scan_count !== item.scanCount) {
              hasChanges = true;
              return { ...item, scanCount: stats.scan_count };
            }
            return item;
          });

          return hasChanges ? newHistory : prevHistory;
        });
      } catch (err) {
        console.error('Error updating history stats:', err);
      }
    };

    fetchHistoryStats();
    // Actualizar cada 10 segundos
    const interval = setInterval(fetchHistoryStats, 10000);
    return () => clearInterval(interval);
  }, [history.length]); // Solo reiniciar si cambia la longitud del historial

  return {
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
    trackingActive: Boolean(currentQRId),
  };
};