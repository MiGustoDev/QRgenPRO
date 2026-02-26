import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { incrementScanCount } from '../utils/supabaseQR';

export default function Track() {
  const { qrId } = useParams<{ qrId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!qrId) {
        setError('QR ID no válido');
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Buscando QR con ID:', qrId);

        // Obtener el QR de Supabase
        let { data, error: fetchError } = await supabase
          .from('qr_codes')
          .select('*')
          .eq('qr_id', qrId)
          .single();

        console.log('📊 Resultado directo:', { data, error: fetchError });

        // Si no se encuentra, intentar buscar todos y filtrar manualmente
        if (fetchError || !data) {
          console.log('⚠️ Primera búsqueda falló, intentando búsqueda alternativa...');
          const { data: allData, error: allError } = await supabase
            .from('qr_codes')
            .select('*');

          console.log('📋 Todos los QRs:', { allData, allError });

          if (!allError && allData) {
            // Buscar manualmente por qr_id (puede ser string o UUID)
            data = allData.find(item => {
              const itemId = String(item.qr_id);
              const searchId = String(qrId);
              console.log(`🔎 Comparando: "${itemId}" === "${searchId}"`, itemId === searchId);
              return itemId === searchId;
            }) || null;
            fetchError = data ? null : { message: 'QR no encontrado después de búsqueda manual' };
          }
        }

        console.log('✅ Resultado final de la consulta:', { data, fetchError });
        setDebugInfo({ data, error: fetchError, qrId });

        if (fetchError) {
          console.error('❌ Error al buscar QR:', fetchError);
          setError(`QR no encontrado: ${fetchError.message}`);
          setLoading(false);
          return;
        }

        if (!data) {
          console.error('❌ No se encontró data para el QR');
          setError('QR no encontrado en la base de datos. Verifica que el QR fue generado después de configurar Supabase.');
          setLoading(false);
          return;
        }

        console.log('✅ QR encontrado!');
        console.log('📝 Contenido original:', data.original_content);
        console.log('📝 Tipo de QR:', data.qr_type);
        console.log('📝 Datos completos:', data);

        // Verificar que el contenido original no sea una URL de tracking
        const originalContent = data.original_content;
        if (originalContent && originalContent.includes('/track/')) {
          console.error('⚠️ ERROR: El contenido original es una URL de tracking! Esto indica un problema en cómo se guardó el QR.');
          setError('Error: El QR fue guardado incorrectamente. Por favor, genera un nuevo QR.');
          setLoading(false);
          return;
        }

        if (!originalContent) {
          setError('El QR no tiene contenido original');
          setLoading(false);
          return;
        }

        // Incrementar el contador de escaneos
        console.log('📈 Incrementando contador...');
        await incrementScanCount(qrId);
        console.log('✅ Contador incrementado');

        console.log('🚀 Redirigiendo a:', originalContent);

        // Forzar redirección inmediata
        // Si es una URL, redirigir directamente
        if (originalContent.startsWith('http://') || originalContent.startsWith('https://')) {
          console.log('🌐 Redirigiendo a URL:', originalContent);
          window.location.href = originalContent;
          // También intentar con replace como respaldo
          setTimeout(() => {
            window.location.replace(originalContent);
          }, 100);
          return;
        }

        // Si es mailto, tel, etc., intentar abrir
        if (originalContent.startsWith('mailto:') || originalContent.startsWith('tel:')) {
          console.log('📞 Redirigiendo a:', originalContent);
          window.location.href = originalContent;
          setTimeout(() => {
            window.location.replace(originalContent);
          }, 100);
          return;
        }

        // Si es WiFi o vCard, copiar al portapapeles y mostrar mensaje
        if (originalContent.startsWith('WIFI:') || originalContent.startsWith('BEGIN:VCARD')) {
          if (navigator.clipboard) {
            await navigator.clipboard.writeText(originalContent);
          }
          setError(null);
          setLoading(false);
          return;
        }

        // Para texto plano
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(originalContent);
        }
        window.location.href = `data:text/plain;charset=utf-8,${encodeURIComponent(originalContent)}`;
        setTimeout(() => {
          window.location.replace(`data:text/plain;charset=utf-8,${encodeURIComponent(originalContent)}`);
        }, 100);
      } catch (err) {
        console.error('❌ Error processing QR redirect:', err);
        setError(`Error al procesar el QR: ${err instanceof Error ? err.message : 'Error desconocido'}`);
        setLoading(false);
      }
    };

    handleRedirect();
  }, [qrId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img
              src={`${import.meta.env.BASE_URL}logo-migusto.png`}
              alt="Mi Gusto Logo"
              className="h-24 w-auto object-contain"
            />
          </div>

          {/* Spinner */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>

          {/* Texto */}
          <p className="text-white text-lg font-medium animate-pulse">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-2xl w-full">
          <p className="text-red-600 dark:text-red-400 mb-4 font-semibold">{error}</p>


          <div className="mt-6 space-x-4">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Volver al inicio
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

