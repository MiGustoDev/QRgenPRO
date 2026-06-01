import React, { useEffect, useState } from 'react';
import { WF_ASSETS } from '../theme/waveframe';

const MIN_VISIBLE_MS = 1600;

/** Pantalla de carga al escanear un QR — logo WaveFrame visible un mínimo de tiempo */
export const TrackSplash: React.FC = () => {
  const [logoLoaded, setLogoLoaded] = useState(false);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#060c14] flex flex-col items-center justify-center p-6 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(51,255,181,0.12) 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(96,64,255,0.1) 0%, transparent 50%)',
        }}
      />

      <div className="relative text-center animate-fadeInUp z-10">
        <div className="mb-10 flex justify-center">
          <img
            src={WF_ASSETS.logo}
            alt="WaveFrame Studio"
            className={`h-24 sm:h-28 w-auto object-contain transition-opacity duration-500 ${
              logoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setLogoLoaded(true)}
            onError={() => setLogoLoaded(true)}
          />
        </div>

        <div className="relative mx-auto mb-6 w-14 h-14">
          <div className="absolute inset-0 rounded-full border-2 border-[#33ffb5]/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#33ffb5] animate-spin" />
        </div>

        <p className="text-white/90 text-lg font-medium tracking-wide">Redirigiendo...</p>
        <p className="text-white/40 text-sm mt-2">WaveFrame Studio</p>

        <img
          src={WF_ASSETS.logoQr}
          alt=""
          className="h-5 w-auto mx-auto mt-8 opacity-30"
          aria-hidden
        />
      </div>
    </div>
  );
};

/** Espera el splash mínimo + trabajo async (Supabase, etc.) */
export async function waitForTrackSplash<T>(work: () => Promise<T>): Promise<T> {
  const minDelay = new Promise<void>((resolve) => {
    window.setTimeout(resolve, MIN_VISIBLE_MS);
  });
  const [result] = await Promise.all([work(), minDelay]);
  return result;
}

export const TRACK_SPLASH_MIN_MS = MIN_VISIBLE_MS;
