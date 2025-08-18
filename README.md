# 🎯 HabitLink Challenges

Una aplicación web moderna para crear y gestionar retos de hábitos personales y grupales. Construye nuevos hábitos, mantén la motivación y comparte tu progreso con otros.

## ✨ Características

### 🎯 **Gestión de Retos**
- **Retos Individuales**: Crea desafíos personales para formar nuevos hábitos
- **Retos Grupales**: Invita a amigos y familiares para mayor motivación
- **Seguimiento de Progreso**: Visualiza tu avance día a día
- **Personalización**: Elige emojis y configura la duración de tus retos

### 📊 **Dashboard Intuitivo**
- **Vista general** de todos tus retos activos
- **Estadísticas detalladas** de progreso y completados
- **Filtros avanzados** para organizar tus retos
- **Vista de cuadrícula y lista** para mejor visualización

### 🔐 **Sistema de Autenticación**
- **Registro seguro** con verificación por email
- **Inicio de sesión** con Supabase Authentication
- **Gestión de perfil** de usuario
- **Recuperación de contraseña**

### 🎨 **Interfaz Moderna**
- **Diseño responsive** para móviles y escritorio
- **Navbar fija** con navegación fluida
- **Glass morphism** y efectos visuales modernos
- **Tema verde** inspirado en crecimiento y naturaleza

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Backend**: Supabase (Database + Auth)
- **Icons**: Lucide React
- **Linting**: ESLint
- **Deployment**: Ready for Vercel/Netlify

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 16+ 
- npm o yarn
- Cuenta de Supabase

### 1. Clonar el repositorio
```bash
git clone https://github.com/davidcaroo/habitlink-challenges.git
cd habitlink-challenges
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto:
```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### 4. Configurar la base de datos
Ejecuta el script SQL proporcionado en `schema.sql` en tu proyecto de Supabase.

### 5. Ejecutar en desarrollo
```bash
npm run dev
```

### 6. Construir para producción
```bash
npm run build
```

## 📁 Estructura del Proyecto

```
habitlink-challenges/
├── src/
│   ├── components/          # Componentes React
│   │   ├── AnimatedBackground.tsx
│   │   ├── AuthModal.tsx
│   │   ├── ChallengeView.tsx
│   │   ├── CreateChallenge.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Landing.tsx
│   │   └── MyChallenges.tsx
│   ├── data/               # Datos mock y configuración
│   │   └── mockChallenges.ts
│   ├── App.tsx             # Componente principal
│   ├── main.tsx           # Punto de entrada
│   └── index.css          # Estilos globales
├── schema.sql             # Esquema de base de datos
├── project-context.md     # Contexto del proyecto
└── README.md             # Este archivo
```

## 🗄️ Base de Datos

El proyecto utiliza Supabase con las siguientes tablas principales:

- **`challenges`**: Información de los retos
- **`challenge_participants`**: Participantes en retos grupales
- **`daily_progress`**: Progreso diario de cada usuario
- **`profiles`**: Perfiles de usuario extendidos

## 🎨 Componentes Principales

### 🏠 **Landing Page**
- Página de bienvenida con información del producto
- Botones de registro e inicio de sesión
- Diseño atractivo con animaciones

### 📊 **Dashboard**
- Vista general de retos activos
- Estadísticas de progreso
- Acceso rápido a funciones principales

### 🎯 **Mis Retos**
- Gestión completa de retos personales
- Filtros por estado (activo, completado, no iniciado)
- Opciones de edición y eliminación

### ➕ **Crear Reto**
- Formulario intuitivo de 2 columnas
- Vista previa en tiempo real
- Selección de emojis y configuración

### 👀 **Vista de Reto**
- Seguimiento detallado del progreso
- Marcado de días completados
- Estadísticas y motivación

## 🚀 Características Técnicas

### **Performance**
- ⚡ Vite para desarrollo y build rápidos
- 📱 Código splitting automático
- 🎨 CSS optimizado con Tailwind

### **Seguridad**
- 🔐 Row Level Security (RLS) en Supabase
- ✅ Verificación de email obligatoria
- 🛡️ Autenticación segura

### **UX/UI**
- 📱 Diseño completamente responsive
- 🎭 Interfaz intuitiva y moderna
- ⚡ Navegación fluida sin recargas

## 📝 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linting con ESLint
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**David Caro**
- GitHub: [@davidcaroo](https://github.com/davidcaroo)
- Email: dacamo0502@gmail.com

## 🙏 Agradecimientos

- React Team por el excelente framework
- Supabase por la infraestructura backend
- Tailwind CSS por el sistema de design
- Lucide por los iconos hermosos

---

**¿Listo para transformar tus hábitos? ¡Comienza tu primer reto hoy! 🚀**
