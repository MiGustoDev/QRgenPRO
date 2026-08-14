import QRCode from 'qrcode';
import { QRCodeOptions, QRCodeData } from '../types/qr';

export const generateQRCode = async (
  data: QRCodeData,
  options: QRCodeOptions
): Promise<string> => {
  try {
    // Generate base QR code
    const qrDataUrl = await QRCode.toDataURL(data.content, {
      width: options.size,
      margin: 2,
      errorCorrectionLevel: 'H', // Always use high error correction when logo is present
      color: {
        dark: options.foregroundColor,
        light: options.backgroundColor,
      },
    });

    if (!options.logo) {
      return qrDataUrl;
    }

    // Create canvas to draw QR code and logo
    const canvas = document.createElement('canvas');
    canvas.width = options.size;
    canvas.height = options.size;
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Could not get canvas context');

    // Load QR code image
    const qrImage = await loadImage(qrDataUrl);
    ctx.drawImage(qrImage, 0, 0, options.size, options.size);

    // Load and draw logo
    const logoImage = await loadImage(options.logo);
    const logoScale = options.logoSize || 0.26; // Increased from 0.20 to 0.26 for a larger, clearer logo
    const logoSize = options.size * logoScale;
    const logoX = (options.size - logoSize) / 2;
    const logoY = (options.size - logoSize) / 2;

    // Draw background for logo with rounded corners
    const padding = Math.max(4, Math.round(options.size * 0.015));
    const bgSize = logoSize + padding;
    const bgX = (options.size - bgSize) / 2;
    const bgY = (options.size - bgSize) / 2;
    const borderRadius = Math.round(bgSize * 0.15);

    ctx.fillStyle = options.backgroundColor;
    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(bgX, bgY, bgSize, bgSize, borderRadius);
      ctx.fill();
    } else {
      ctx.fillRect(bgX, bgY, bgSize, bgSize);
    }

    ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);

    return canvas.toDataURL();
  } catch (error) {
    console.error(error);
    throw new Error('Error generating QR code');
  }
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const formatQRContent = (data: QRCodeData, trackingUrl?: string): string => {
  // Si hay una URL de seguimiento, usarla en lugar del contenido original
  if (trackingUrl) {
    return trackingUrl;
  }

  switch (data.type) {
    case 'url':
      return data.content.startsWith('http') ? data.content : `https://${data.content}`;
    case 'email':
      return `mailto:${data.content}`;
    case 'phone':
      return `tel:${data.content}`;
    case 'wifi':
      // Format: WIFI:T:WPA;S:NetworkName;P:Password;H:false;;
      const [ssid, password, security] = data.content.split('|');
      return `WIFI:T:${security || 'WPA'};S:${ssid};P:${password};H:false;;`;
    case 'vcard':
      // Simple vCard format
      const [name, phone, email] = data.content.split('|');
      return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone}\nEMAIL:${email}\nEND:VCARD`;
    default:
      return data.content;
  }
};

export const downloadQRCode = (qrCode: string, filename: string = 'qrcode') => {
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = qrCode;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};