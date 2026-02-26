import { supabase } from '../lib/supabase';
import { QRCodeData } from '../types/qr';

// Función simple para generar UUID sin dependencias externas
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
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
 * Guarda un QR en Supabase para seguimiento
 */
export async function saveQRToSupabase(
  qrData: QRCodeData,
  formattedContent: string
): Promise<string | null> {
  try {
    const qrId = generateUUID();
    
    console.log('Guardando QR en Supabase:', {
      qrId,
      original_content: formattedContent,
      qr_type: qrData.type
    });
    
    const { data, error } = await supabase
      .from('qr_codes')
      .insert({
        qr_id: qrId,
        original_content: formattedContent,
        qr_type: qrData.type,
        scan_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving QR to Supabase:', error);
      return null;
    }

    console.log('QR guardado exitosamente:', data);
    return qrId;
  } catch (error) {
    console.error('Error saving QR to Supabase:', error);
    return null;
  }
}

/**
 * Incrementa el contador de escaneos de un QR
 */
export async function incrementScanCount(qrId: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('increment_scan_count', {
      qr_id_param: qrId,
    });

    if (error) {
      // Si la función RPC no existe, usar update directo
      const { data: currentData, error: fetchError } = await supabase
        .from('qr_codes')
        .select('scan_count')
        .eq('qr_id', qrId)
        .single();

      if (fetchError) {
        console.error('Error fetching QR:', fetchError);
        return false;
      }

      const { error: updateError } = await supabase
        .from('qr_codes')
        .update({ scan_count: (currentData.scan_count || 0) + 1 })
        .eq('qr_id', qrId);

      if (updateError) {
        console.error('Error updating scan count:', updateError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error incrementing scan count:', error);
    return false;
  }
}

/**
 * Obtiene el número de escaneos de un QR
 */
export async function getScanCount(qrId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('qr_codes')
      .select('scan_count')
      .eq('qr_id', qrId)
      .single();

    if (error) {
      console.error('Error fetching scan count:', error);
      return 0;
    }

    return data?.scan_count || 0;
  } catch (error) {
    console.error('Error fetching scan count:', error);
    return 0;
  }
}

/**
 * Obtiene todos los QRs con sus estadísticas
 */
export async function getAllQRStats(): Promise<QRTrackingData[]> {
  try {
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching QR stats:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching QR stats:', error);
    return [];
  }
}

