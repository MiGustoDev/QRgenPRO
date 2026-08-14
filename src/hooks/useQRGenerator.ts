import { useState, useCallback, useEffect } from 'react';
import { QRCodeData, QRCodeOptions, GeneratedQR } from '../types/qr';
import { generateQRCode, formatQRContent } from '../utils/qrGenerator';
import { useLocalStorage } from './useLocalStorage';
import { saveQRToSupabase, getScanCount } from '../utils/supabaseQR';

export const useQRGenerator = () => {
  const [qrData, setQrData] = useState<QRCodeData>({
    type: 'url',
    content: '',
  });

  const [qrOptions, setQrOptions] = useState<QRCodeOptions>({
    size: 256,
    errorCorrectionLevel: 'M',
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
  });

  const [currentQR, setCurrentQR] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useLocalStorage<GeneratedQR[]>('qr-history', []);
  const [currentQRId, setCurrentQRId] = useState<string | null>(null);
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

      const qrId = await saveQRToSupabase(qrData, formattedContent);
      console.log('💾 QR guardado en Supabase con ID:', qrId);

      let contentForQR = formattedContent;

      // Si se guardó exitosamente, crear URL de seguimiento (SOLO PARA URL)
      if (qrId) {
        if (qrData.type === 'url') {
          const envUrl = import.meta.env.VITE_APP_URL || window.location.origin;
          const baseUrl = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
          const trackingUrl = `${baseUrl}/track/${qrId}`;
          console.log('🔗 URL de seguimiento creada para URL:', trackingUrl);
          contentForQR = trackingUrl;
        } else {
          console.log('ℹ️ Tipo no-URL detectado, usando contenido nativo directo sin redirección');
        }
        setCurrentQRId(qrId);
        setScanCount(0);
      } else {
        console.warn('⚠️ No se pudo guardar en Supabase, usando contenido original sin seguimiento');
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
  };
};