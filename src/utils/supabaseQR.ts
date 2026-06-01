import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { QRCodeData } from '../types/qr';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface QRTrackingData {
  id: string;
  qr_id: string;
  original_content: string;
  qr_type: string;
  scan_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Crea o actualiza el registro de tracking.
 * Reutiliza existingQrId para no cambiar la URL del QR al editar el destino.
 */
export async function ensureQRTracking(
  qrData: QRCodeData,
  formattedContent: string,
  existingQrId?: string | null
): Promise<string | null> {
  if (!isSupabaseConfigured) {
    console.warn('[WaveFrame QR] Supabase no configurado — el QR no tendrá tracking.');
    return null;
  }

  try {
    if (existingQrId) {
      const { data, error } = await supabase
        .from('qr_codes')
        .update({
          original_content: formattedContent,
          qr_type: qrData.type,
        })
        .eq('qr_id', existingQrId)
        .select('qr_id')
        .single();

      if (!error && data) {
        return existingQrId;
      }

      console.warn('[WaveFrame QR] No se pudo actualizar el QR, creando uno nuevo:', error);
    }

    const qrId = generateUUID();

    const { data, error } = await supabase
      .from('qr_codes')
      .insert({
        qr_id: qrId,
        original_content: formattedContent,
        qr_type: qrData.type,
        scan_count: 0,
      })
      .select('qr_id')
      .single();

    if (error) {
      console.error('[WaveFrame QR] Error al guardar en Supabase:', error.message, error);
      return null;
    }

    return data?.qr_id ?? qrId;
  } catch (error) {
    console.error('[WaveFrame QR] Error en ensureQRTracking:', error);
    return null;
  }
}

/** @deprecated Usar ensureQRTracking */
export async function saveQRToSupabase(
  qrData: QRCodeData,
  formattedContent: string
): Promise<string | null> {
  return ensureQRTracking(qrData, formattedContent, null);
}

/**
 * Incrementa escaneos — update directo (más fiable que depender solo del RPC)
 */
export async function incrementScanCount(qrId: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    return false;
  }

  try {
    const { data: current, error: fetchError } = await supabase
      .from('qr_codes')
      .select('scan_count')
      .eq('qr_id', qrId)
      .single();

    if (fetchError || !current) {
      console.error('[WaveFrame QR] QR no encontrado para incrementar:', fetchError);
      return false;
    }

    const nextCount = (current.scan_count ?? 0) + 1;

    const { error: updateError } = await supabase
      .from('qr_codes')
      .update({ scan_count: nextCount })
      .eq('qr_id', qrId);

    if (updateError) {
      console.error('[WaveFrame QR] Error al incrementar escaneos:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[WaveFrame QR] Error incrementing scan count:', error);
    return false;
  }
}

export async function getScanCount(qrId: string): Promise<number> {
  if (!isSupabaseConfigured) {
    return 0;
  }

  try {
    const { data, error } = await supabase
      .from('qr_codes')
      .select('scan_count')
      .eq('qr_id', qrId)
      .single();

    if (error) {
      console.error('[WaveFrame QR] Error fetching scan count:', error);
      return 0;
    }

    return data?.scan_count ?? 0;
  } catch (error) {
    console.error('[WaveFrame QR] Error fetching scan count:', error);
    return 0;
  }
}

export async function getAllQRStats(): Promise<QRTrackingData[]> {
  if (!isSupabaseConfigured) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[WaveFrame QR] Error fetching QR stats:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('[WaveFrame QR] Error fetching QR stats:', error);
    return [];
  }
}
