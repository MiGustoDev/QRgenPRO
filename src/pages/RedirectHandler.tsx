import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function RedirectHandler() {
  const { qrId: pathQrId } = useParams<{ qrId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processRedirect = async () => {
      // 1. Obtener posibles parámetros de URL
      const toParam = searchParams.get('to') || searchParams.get('url') || searchParams.get('target');
      const idParam = pathQrId || searchParams.get('id') || searchParams.get('qrId');

      // 2. Si existe parámetro 'to' / 'url', es una redirección auto-contenida (Zero Database)
      if (toParam) {
        try {
          let targetUrl = toParam;

          // Decodificar Base64 si fue codificado en base64
          if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://') && !targetUrl.startsWith('mailto:') && !targetUrl.startsWith('tel:')) {
            try {
              const decoded = atob(targetUrl);
              if (decoded.startsWith('http://') || decoded.startsWith('https://') || decoded.startsWith('mailto:') || decoded.startsWith('tel:')) {
                targetUrl = decoded;
              }
            } catch {
              // No era base64, usar original
            }
          }

          // Asegurar protocolo
          if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://') && !targetUrl.startsWith('mailto:') && !targetUrl.startsWith('tel:')) {
            targetUrl = `https://${targetUrl}`;
          }

          // Registrar escaneo local
          registerLocalScan(targetUrl);

          // Redirigir de inmediato
          window.location.replace(targetUrl);
          return;
        } catch (err) {
          console.error('Error decoding target URL:', err);
        }
      }

      // 3. Si existe ID y Supabase está configurado, consultar en la base de datos (QR Dinámico)
      if (idParam && supabase) {
        const client = supabase;
        try {
          const { data, error: fetchError } = await client
            .from('qr_codes')
            .select('*')
            .eq('qr_id', idParam)
            .single();

          if (data && data.original_content) {
            let destination = data.original_content;
            if (!destination.startsWith('http://') && !destination.startsWith('https://') && !destination.startsWith('mailto:') && !destination.startsWith('tel:')) {
              destination = `https://${destination}`;
            }

            // Incrementar contador de escaneos en Supabase sin bloquear redirección
            try {
              await client
                .from('qr_codes')
                .update({ scan_count: (data.scan_count || 0) + 1 })
                .eq('qr_id', idParam);
            } catch {
              // Ignorar error al incrementar contador
            }

            window.location.replace(destination);
            return;
          }

          if (fetchError) {
            console.warn('No se pudo obtener el QR de Supabase:', fetchError.message);
          }
        } catch (dbErr) {
          console.warn('Error al conectar con Supabase:', dbErr);
        }
      }

      // 4. Si fallaron ambos métodos, mostrar mensaje de error amigable
      setLoading(false);
      setError('No se pudo encontrar el enlace de destino para este código QR.');
    };

    processRedirect();
  }, [pathQrId, searchParams]);

  // Guardar historial de escaneos en localStorage
  const registerLocalScan = (url: string) => {
    try {
      const scans = JSON.parse(localStorage.getItem('qr-scan-logs') || '[]');
      scans.unshift({ url, timestamp: new Date().toISOString() });
      localStorage.setItem('qr-scan-logs', JSON.stringify(scans.slice(0, 50)));
    } catch {
      // Ignorar errores de localStorage
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full border border-gray-100 dark:border-gray-700">
          <div className="mb-6 flex justify-center">
            <img
              src={`${import.meta.env.BASE_URL}logo-migusto.png`}
              alt="Mi Gusto Logo"
              className="h-16 w-auto object-contain"
              onError={(e) => {
                // Fallback si no carga el logo
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-purple-200 dark:border-purple-900 opacity-25"></div>
            <div className="absolute inset-0 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
          </div>

          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            Redirigiendo...
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
            Te estamos llevando a tu destino
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl text-center max-w-md w-full border border-gray-100 dark:border-gray-700">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>

        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          Enlace no encontrado
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          {error || 'El código QR no contiene un destino válido.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-all duration-200 shadow-md text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ir al Generador QR
          </button>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl transition-all duration-200 text-sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </button>
        </div>
      </div>
    </div>
  );
}
