/** WaveFrame Studio — identidad visual y assets en /public */

const publicAsset = (file: string) => `${import.meta.env.BASE_URL}${file}`;

export const WF_ASSETS = {
  favicon: publicAsset('favicon.ico'),
  logo: publicAsset('icon.png'),
  logoQr: publicAsset('iconqr.png'),
} as const;

/** Rutas antiguas de Mi Gusto que pueden quedar en historial o caché */
const LEGACY_LOGO_PATTERNS = [/logo-migusto/i, /migusto\.com/i, /migusto/i];

export const isLegacyLogo = (url?: string): boolean =>
  Boolean(url && LEGACY_LOGO_PATTERNS.some((pattern) => pattern.test(url)));

/** Reemplaza logos viejos por el asset de WaveFrame */
export const normalizeLogoUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  if (isLegacyLogo(url)) return WF_ASSETS.logo;
  return url;
};

export const WF_COLORS = {
  dark: '#060c14',
  surface: '#0d1520',
  cyan: '#33ffb5',
  teal: '#3dd6f5',
  violet: '#6040ff',
  pink: '#ff4081',
} as const;
