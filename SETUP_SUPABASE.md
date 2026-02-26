# Configuración de Supabase para Seguimiento de QRs

Este documento explica cómo configurar Supabase para el seguimiento de escaneos de códigos QR.

## Pasos de Configuración

### 1. Crear un Proyecto en Supabase

1. Ve a [https://app.supabase.com](https://app.supabase.com)
2. Crea un nuevo proyecto o usa uno existente
3. Espera a que el proyecto esté completamente configurado

### 2. Configurar la Base de Datos

1. Ve a la sección **SQL Editor** en el panel de Supabase
2. Copia y pega el contenido del archivo `supabase_setup.sql`
3. Ejecuta el script SQL para crear la tabla y las funciones necesarias

### 3. Configurar Variables de Entorno

1. Crea un archivo `.env` en la raíz del proyecto (si no existe)
2. Obtén tus credenciales de Supabase desde:
   - **Settings** → **API**
   - Copia la **URL del proyecto** y la **anon/public key**

3. Agrega las siguientes variables a tu archivo `.env`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

### 4. Verificar la Configuración

1. Reinicia el servidor de desarrollo si está corriendo
2. Genera un nuevo código QR
3. Verifica que se guarde en Supabase (puedes verificar en la tabla `qr_codes`)

## Estructura de la Tabla

La tabla `qr_codes` tiene la siguiente estructura:

- `id`: UUID único del registro
- `qr_id`: UUID único del código QR (usado para seguimiento)
- `original_content`: Contenido original del QR
- `qr_type`: Tipo de QR (url, text, email, phone, wifi, vcard)
- `scan_count`: Número de escaneos (se incrementa automáticamente)
- `created_at`: Fecha de creación
- `updated_at`: Fecha de última actualización

## Funcionalidad

- **Al generar un QR**: Se guarda automáticamente en Supabase con `scan_count = 0`
- **Al escanear un QR**: Se redirige a `/track/{qr_id}`, se incrementa el contador y se redirige al contenido original
- **Visualización**: El número de escaneos se muestra en tiempo real en la interfaz

## Solución de Problemas

### Error: "Missing Supabase environment variables"
- Verifica que el archivo `.env` existe y contiene las variables correctas
- Asegúrate de que las variables comienzan con `VITE_`
- Reinicia el servidor de desarrollo después de agregar/modificar variables

### Error: "QR no encontrado"
- Verifica que la tabla `qr_codes` existe en Supabase
- Verifica que las políticas RLS están configuradas correctamente
- Revisa la consola del navegador para más detalles del error

### El contador no se actualiza
- Verifica que la función `increment_scan_count` existe en Supabase
- Si no existe, el código usará un UPDATE directo como fallback
- Revisa los logs de Supabase para ver si hay errores
















