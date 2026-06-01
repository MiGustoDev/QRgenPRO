import React from 'react';
import { WF_ASSETS } from '../theme/waveframe';

interface WaveFrameLogoProps {
  className?: string;
  variant?: 'full' | 'qr';
}

export const WaveFrameLogo: React.FC<WaveFrameLogoProps> = ({
  className = 'h-10 w-auto',
  variant = 'full',
}) => (
  <img
    src={variant === 'qr' ? WF_ASSETS.logoQr : WF_ASSETS.logo}
    alt="WaveFrame Studio"
    className={`object-contain ${className}`}
  />
);

export const WaveFrameWordmark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span className={`font-bold tracking-tight ${className}`}>
    <span className="bg-gradient-to-r from-wf-cyan to-wf-teal bg-clip-text text-transparent">Wave</span>
    <span className="bg-gradient-to-r from-wf-violet to-wf-pink bg-clip-text text-transparent">Frame</span>
  </span>
);
