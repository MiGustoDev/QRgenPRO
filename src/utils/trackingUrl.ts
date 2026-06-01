/**
 * URL pública de la página /track/:id (debe incluir el base de Vite, ej. /tools/QR/)
 */
export function getTrackingUrl(qrId: string): string {
  const origin = (import.meta.env.VITE_APP_URL || window.location.origin).replace(/\/$/, '');
  const basePath = import.meta.env.BASE_URL.replace(/\/?$/, '/'); // siempre termina en /
  return `${origin}${basePath}track/${qrId}`;
}
