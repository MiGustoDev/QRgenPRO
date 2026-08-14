-- Tabla para almacenar los códigos QR y su seguimiento
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  qr_id UUID UNIQUE NOT NULL,
  original_content TEXT NOT NULL,
  qr_type VARCHAR(50) NOT NULL,
  scan_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Índice para búsquedas rápidas por qr_id
CREATE INDEX IF NOT EXISTS idx_qr_codes_qr_id ON qr_codes(qr_id);

-- Índice para ordenar por fecha de creación
CREATE INDEX IF NOT EXISTS idx_qr_codes_created_at ON qr_codes(created_at DESC);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_qr_codes_updated_at
  BEFORE UPDATE ON qr_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función RPC para incrementar el contador de escaneos (opcional, pero más eficiente)
CREATE OR REPLACE FUNCTION increment_scan_count(qr_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE qr_codes
  SET scan_count = scan_count + 1,
      updated_at = NOW()
  WHERE qr_id = qr_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Política RLS (Row Level Security) - Permitir lectura y escritura anónima
-- Ajusta estas políticas según tus necesidades de seguridad
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserción anónima
CREATE POLICY "Allow anonymous insert" ON qr_codes
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Política para permitir lectura anónima
CREATE POLICY "Allow anonymous select" ON qr_codes
  FOR SELECT
  TO anon
  USING (true);

-- Política para permitir actualización anónima (para incrementar escaneos)
CREATE POLICY "Allow anonymous update" ON qr_codes
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

