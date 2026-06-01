import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { incrementScanCount } from '../utils/supabaseQR';
import { WaveFrameLogo } from '../components/WaveFrameBrand';
import { TrackSplash, waitForTrackSplash } from '../components/TrackSplash';

export default function Track() {
  const { qrId } = useParams<{ qrId: string }>();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'splash' | 'error' | 'done'>('splash');
  const [error, setError] = useState<string | null>(null);
  const redirectStarted = useRef(false);

  useEffect(() => {
    const redirectTo = (url: string) => {
      if (redirectStarted.current) return;
      redirectStarted.current = true;
      window.location.replace(url);
    };

    const handleRedirect = async () => {
      if (!qrId) {
        setError('QR ID no válido');
        setPhase('error');
        return;
      }

      if (!isSupabaseConfigured) {
        setError('Supabase no está configurado. Revisá el archivo .env del proyecto.');
        setPhase('error');
        return;
      }

      try {
        await waitForTrackSplash(async () => {
          let { data, error: fetchError } = await supabase
            .from('qr_codes')
            .select('*')
            .eq('qr_id', qrId)
            .single();

          if (fetchError || !data) {
            const { data: allData, error: allError } = await supabase
              .from('qr_codes')
              .select('*');

            if (!allError && allData) {
              data =
                allData.find((item) => String(item.qr_id) === String(qrId)) || null;
              fetchError = data
                ? null
                : { message: 'QR no encontrado después de búsqueda manual' };
            }
          }

          if (fetchError) {
            throw new Error(`QR no encontrado: ${fetchError.message}`);
          }

          if (!data) {
            throw new Error(
              'QR no encontrado en la base de datos. Generá un nuevo código con Supabase configurado.'
            );
          }

          const originalContent = data.original_content;
          if (originalContent?.includes('/track/')) {
            throw new Error(
              'El QR fue guardado incorrectamente. Por favor, generá un nuevo código.'
            );
          }

          if (!originalContent) {
            throw new Error('El QR no tiene contenido original');
          }

          const counted = await incrementScanCount(qrId);
          if (!counted) {
            console.warn('[WaveFrame QR] No se pudo incrementar el contador de escaneos');
          }

          if (
            originalContent.startsWith('http://') ||
            originalContent.startsWith('https://')
          ) {
            redirectTo(originalContent);
            return;
          }

          if (originalContent.startsWith('mailto:') || originalContent.startsWith('tel:')) {
            redirectTo(originalContent);
            return;
          }

          if (
            originalContent.startsWith('WIFI:') ||
            originalContent.startsWith('BEGIN:VCARD')
          ) {
            if (navigator.clipboard) {
              await navigator.clipboard.writeText(originalContent);
            }
            setPhase('done');
            return;
          }

          if (navigator.clipboard) {
            await navigator.clipboard.writeText(originalContent);
          }
          redirectTo(
            `data:text/plain;charset=utf-8,${encodeURIComponent(originalContent)}`
          );
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setPhase('error');
      }
    };

    handleRedirect();
  }, [qrId]);

  if (phase === 'splash') {
    return <TrackSplash />;
  }

  if (phase === 'error' && error) {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-[#060c14] flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full rounded-2xl border border-white/10 bg-[#0d1520] p-8 shadow-wf-lg">
          <WaveFrameLogo className="h-14 w-auto mx-auto mb-6" />
          <p className="text-[#ff4081] mb-6 font-medium">{error}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="wf-btn-primary"
            >
              Volver al inicio
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2 rounded-lg border border-white/15 text-white/80 hover:bg-white/5 transition-colors"
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
