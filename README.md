# WaveFrame QR Generator

<div align="center">
  <img src="public/icon.png" alt="WaveFrame Studio" width="120" />
  <h3>Generador profesional de códigos QR</h3>
  <p>App web con temática WaveFrame Studio — personalización, tracking y analytics con Supabase</p>

  <a href="https://waveframe.com.ar" target="_blank">
    <img src="https://img.shields.io/badge/WaveFrame_Studio-33ffb5?style=for-the-badge" alt="WaveFrame Studio" />
  </a>
</div>

---

## Características

- 6 tipos de QR: URL, texto, email, teléfono, WiFi y contacto (vCard)
- Logos WaveFrame (`icon.png`, `iconqr.png`) integrados en el centro del QR
- Seguimiento de escaneos con Supabase
- Historial local, modo oscuro y español/inglés
- Stack: React, TypeScript, Vite, Tailwind CSS

## Configuración

1. Copiá `.env.example` a `.env` con tus credenciales de Supabase
2. Ejecutá `supabase_setup.sql` en el SQL Editor de Supabase
3. `pnpm install` y `pnpm run dev`

## Assets en `/public`

| Archivo        | Uso                          |
|----------------|------------------------------|
| `icon.png`     | Logo principal WaveFrame     |
| `iconqr.png`   | Variante para QR / favicon   |
| `favicon.ico`  | Favicon del sitio            |

## Licencia

MIT — © WaveFrame Studio
