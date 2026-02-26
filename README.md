# 🎯 QR Generator Pro

<div align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-5.4.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</div>

<div align="center">
  <h3>🚀 Generador Profesional de Códigos QR</h3>
  <p>App web moderna y completa para generar códigos QR de alta calidad con personalización avanzada</p>

  <a href="https://qr-gen-2n6g.bolt.host" target="_blank">
    <img src="https://img.shields.io/badge/🌐_Demo_Live-FF6B6B?style=for-the-badge" alt="Demo Live" />
  </a>
</div>
<img src="Demo.png" alt="Demo"/>

---

## ✨ Características Principales

### 🎨 **Interfaz Moderna**
- **Diseño responsive** optimizado para móviles, tablets y desktop
- **Modo oscuro/claro** con transiciones suaves
- **Soporte multiidioma** (Español/Inglés)
- **Animaciones fluidas** y micro-interacciones

### 🔧 **Tipos de QR Soportados**
- 🔗 **URL/Enlaces** - Sitios web y enlaces directos
- 📝 **Texto** - Mensajes y contenido de texto
- 📧 **Email** - Direcciones de correo electrónico
- 📱 **Teléfono** - Números telefónicos
- 📶 **WiFi** - Credenciales de red inalámbrica
- 👤 **Contacto** - Tarjetas vCard con información personal

### 🎯 **Personalización Avanzada**
- **Tamaño variable** (128px - 512px)
- **Colores personalizables** (primer plano y fondo)
- **Niveles de corrección de errores** (L, M, Q, H)
- **Vista previa en tiempo real**

### 💾 **Gestión de Historial**
- **Historial automático** de códigos generados
- **Descarga individual** de códigos QR
- **Eliminación selectiva** de registros
- **Persistencia local** de datos

### 📊 **Seguimiento de Escaneos**
- **Seguimiento en tiempo real** de escaneos de códigos QR
- **Almacenamiento en Supabase** para estadísticas persistentes
- **Contador de escaneos** visible en la interfaz
- **Redirección inteligente** que registra cada escaneo automáticamente

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18.3.1** - Biblioteca de interfaz de usuario
- **TypeScript 5.5.3** - Tipado estático
- **Tailwind CSS 3.4.1** - Framework de estilos
- **Vite 5.4.2** - Herramienta de construcción

### Librerías Principales
- **qrcode** - Generación de códigos QR
- **lucide-react** - Iconografía moderna
- **@types/qrcode** - Tipado para QR
- **@supabase/supabase-js** - Cliente de Supabase para seguimiento
- **react-router-dom** - Enrutamiento para páginas de seguimiento

---

## 🚀 Configuración Inicial

### Instalación de Dependencias

```bash
npm install
```

### Configuración de Supabase

Para habilitar el seguimiento de escaneos, necesitas configurar Supabase:

1. Crea un proyecto en [Supabase](https://app.supabase.com)
2. Ejecuta el script SQL en `supabase_setup.sql` en el SQL Editor de Supabase
3. Configura las variables de entorno en un archivo `.env`:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

Para más detalles, consulta [SETUP_SUPABASE.md](./SETUP_SUPABASE.md)

### Ejecutar en Desarrollo

```bash
npm run dev
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---


<div align="center">
  <p>⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub! ⭐</p>
  
  <a href="https://qr-gen-2n6g.bolt.host" target="_blank">
    <img src="https://img.shields.io/badge/🚀_Ver_Demo-4CAF50?style=for-the-badge" alt="Ver Demo" />
  </a>
</div>
