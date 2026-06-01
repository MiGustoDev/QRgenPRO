-- =============================================================================
-- WaveFrame QR Generator — setup completo para Supabase
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run
-- =============================================================================

-- Limpieza opcional (descomentar solo si querés reinstalar desde cero)
-- DROP TRIGGER IF EXISTS update_qr_codes_updated_at ON qr_codes;
-- DROP FUNCTION IF EXISTS increment_scan_count(UUID);
-- DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
-- DROP TABLE IF EXISTS qr_codes CASCADE;

-- -----------------------------------------------------------------------------
-- Tabla principal
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_id UUID NOT NULL UNIQUE,
  original_content TEXT NOT NULL,
  qr_type VARCHAR(50) NOT NULL,
  scan_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.qr_codes IS 'Códigos QR generados por WaveFrame QR con tracking de escaneos';

-- -----------------------------------------------------------------------------
-- Índices
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_qr_codes_qr_id ON public.qr_codes (qr_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_created_at ON public.qr_codes (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qr_codes_qr_type ON public.qr_codes (qr_type);

-- -----------------------------------------------------------------------------
-- Trigger: actualizar updated_at
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_qr_codes_updated_at ON public.qr_codes;

CREATE TRIGGER update_qr_codes_updated_at
  BEFORE UPDATE ON public.qr_codes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- -----------------------------------------------------------------------------
-- RPC: incrementar escaneos (usada por la app)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.increment_scan_count(qr_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.qr_codes
  SET
    scan_count = scan_count + 1,
    updated_at = NOW()
  WHERE qr_id = qr_id_param;
END;
$$;

-- Permisos para la API anon (clave pública del frontend)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.qr_codes TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_scan_count(UUID) TO anon, authenticated;

-- -----------------------------------------------------------------------------
-- Row Level Security (RLS)
-- -----------------------------------------------------------------------------
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous insert" ON public.qr_codes;
DROP POLICY IF EXISTS "Allow anonymous select" ON public.qr_codes;
DROP POLICY IF EXISTS "Allow anonymous update" ON public.qr_codes;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.qr_codes;
DROP POLICY IF EXISTS "Allow authenticated select" ON public.qr_codes;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.qr_codes;

CREATE POLICY "Allow anonymous insert"
  ON public.qr_codes
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select"
  ON public.qr_codes
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous update"
  ON public.qr_codes
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated insert"
  ON public.qr_codes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated select"
  ON public.qr_codes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated update"
  ON public.qr_codes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- Verificación rápida (debe devolver 1 fila con rls_enabled = true)
-- -----------------------------------------------------------------------------
SELECT
  schemaname,
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'qr_codes';
