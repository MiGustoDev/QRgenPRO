export interface QRCodeOptions {
  size: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  foregroundColor: string;
  backgroundColor: string;
  logo?: string;
}

export interface QRCodeData {
  type: 'url' | 'text' | 'email' | 'phone' | 'wifi' | 'vcard';
  content: string;
  label?: string;
}

export interface GeneratedQR {
  id: string;
  data: QRCodeData;
  options: QRCodeOptions;
  qrCode: string;
  timestamp: Date;
}