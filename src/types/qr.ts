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
  supabaseId?: string;
  scanCount?: number;
}

export interface QRRecord {
  id: string;
  qr_id: string;
  original_content: string;
  qr_type: string;
  scan_count: number;
  created_at: string;
  updated_at: string;
}