# PROJECT_CONTEXT.md - HabitLink

## 🎯 RESUMEN DEL PROYECTO
**HabitLink** es una plataforma web para crear y compartir retos de hábitos personales. Los usuarios pueden crear retos individuales o grupales, hacer seguimiento de su progreso y compartir links virales en redes sociales.

## 📍 FASE ACTUAL
**Phase 2: Integración Supabase ACTIVA** ⚡
- ✅ Base frontend funcional creada con bolt.new
- ✅ Migración a VSCode completada
- ✅ Database schema en Supabase implementado
- ✅ Componentes de autenticación agregados
- ✅ Dashboard de usuario implementado
- 🔄 **EN PROCESO**: Integración hooks y funcionalidades avanzadas

## 🛠️ STACK TECNOLÓGICO
- **Frontend**: Vite + React 18 + TypeScript
- **Estilos**: Tailwind CSS + Paleta personalizada verde lima
- **Iconos**: Lucide React
- **Notificaciones**: React Hot Toast
- **Backend**: Supabase (PostgreSQL + Auth + Real-time) ✅
- **Database**: Schema implementado y funcional ✅
- **Hosting**: Vercel (frontend) + Supabase (backend)

## 🎨 PALETA DE COLORES PERSONALIZADA
```css
cream: #fffff7     /* Fondo principal */
lime-100: #e9fccf  /* Acentos suaves */
lime-200: #d8fcb3  /* Estados hover */
lime-300: #b1fcb3  /* Elementos activos */
lime-400: #89fcb3  /* Botones principales */
```

**Configuración Tailwind:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        cream: '#fffff7',
        lime: {
          100: '#e9fccf',
          200: '#d8fcb3', 
          300: '#b1fcb3',
          400: '#89fcb3'
        }
      }
    }
  }
}
```

## 📊 ESTRUCTURA ACTUAL DEL PROYECTO
```
src/
├── App.tsx                    # ✅ Componente principal con routing y auth
├── components/
│   ├── Landing.tsx            # ✅ Página principal actualizada
│   ├── CreateChallenge.tsx    # ✅ Formulario con integración Supabase
│   ├── ChallengeView.tsx      # ✅ Vista individual con progreso
│   ├── AuthModal.tsx          # ✅ Modal de login/registro NUEVO
│   ├── Dashboard.tsx          # ✅ Panel de usuario registrado NUEVO
│   └── AnimatedBackground.tsx # ✅ Fondo animado para UX NUEVO
├── lib/
│   └── supabase.ts           # ✅ Cliente Supabase configurado
├── hooks/
│   ├── useAuth.ts            # 🔄 Hook de autenticación (en desarrollo)
│   └── useChallenges.ts      # 🔄 Hook CRUD retos (en desarrollo)
├── contexts/
│   └── AuthContext.tsx       # 🔄 Context de usuario (pendiente)
├── data/
│   └── mockChallenges.ts     # 📋 Datos mock para fallback
├── index.css                 # ✅ Estilos globales actualizados
└── tailwind.config.js        # ✅ Config con paleta personalizada
```

## 🎯 FUNCIONALIDADES PRINCIPALES

### ✅ YA IMPLEMENTADAS (localStorage + Supabase)
1. **✅ Crear retos** sin registro
   - Nombre, duración (7/14/21/30 días), emoji, tipo (individual/grupal)
   - Generación de ID único
   - Persistencia híbrida (localStorage + Supabase)

2. **✅ Seguimiento de progreso**
   - Marcar días completados/no completados
   - Visualización de calendario
   - Barra de progreso animada
   - Cálculo de porcentaje de completación

3. **✅ Compartir retos**
   - Generación de links únicos
   - Botón copiar al clipboard
   - Feedback con toast notifications

4. **✅ Navegación fluida**
   - Landing → Create → Challenge → Dashboard
   - Estado centralizado en App.tsx
   - Sistema de routing por estado

5. **✅ Autenticación implementada**
   - AuthModal con login/registro
   - Integración con Supabase Auth
   - Dashboard de usuario registrado
   - Manejo de estados anónimo/registrado

6. **✅ Base de datos funcional**
   - Schema completo en Supabase
   - Tablas: challenges, progress_entries, challenge_participants
   - RLS policies configuradas
   - Datos de ejemplo cargados

### 🎯 EN DESARROLLO (Phase 2 activa)
1. **🔄 Hooks personalizados**
   - useAuth: Manejo completo de autenticación
   - useChallenges: CRUD híbrido (localStorage + Supabase)
   - useProgress: Seguimiento de progreso en tiempo real

2. **🔄 AuthContext**
   - Estado global de usuario
   - Migración de retos anónimos → registrados
   - Persistencia de sesión

3. **🔄 Funcionalidades avanzadas**
   - Real-time updates para retos grupales
   - Sincronización bidireccional de datos
   - Dashboard con estadísticas personalizadas

4. **📋 Funcionalidades futuras (Phase 3)**
   - Sistema de invitaciones por email
   - Notificaciones push
   - Gamificación y logros
   - Integración con redes sociales
   - Links públicos SEO-friendly
   - Analytics y métricas de usuario

## 🗄️ DATABASE SCHEMA (Supabase)

### Tablas requeridas:
```sql
-- 1. Retos principales
challenges (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  duration INTEGER NOT NULL,
  type TEXT CHECK (type IN ('individual', 'grupal')),
  emoji TEXT NOT NULL,
  participants INTEGER DEFAULT 1,
  created_at TIMESTAMP,
  created_by UUID REFERENCES auth.users(id), -- NULL para anónimos
  is_public BOOLEAN DEFAULT true
)

-- 2. Progreso diario
progress_entries (
  id UUID PRIMARY KEY,
  challenge_id UUID REFERENCES challenges(id),
  user_id UUID REFERENCES auth.users(id), -- NULL para anónimos
  session_id TEXT, -- Para usuarios anónimos
  day_number INTEGER NOT NULL,
  completed BOOLEAN NOT NULL,
  completed_at TIMESTAMP
)

-- 3. Participantes grupales
challenge_participants (
  id UUID PRIMARY KEY,
  challenge_id UUID REFERENCES challenges(id),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  joined_at TIMESTAMP
)
```

## 🎯 OBJETIVOS DE LA MIGRACIÓN

### 🔄 Flujo híbrido deseado:
1. **Usuario anónimo**:
   - Crea reto → localStorage (temporal)
   - Opción: "¿Quieres guardar tu progreso permanentemente?"
   - Puede registrarse en cualquier momento

2. **Usuario registrado**:
   - Crea reto → Supabase (permanente)
   - Dashboard personal
   - Migración automática de retos anónimos

### 🎨 UX/UI a mantener:
- **Cero fricción inicial**: Crear reto sin registro en 30 segundos
- **Design system consistente**: Paleta verde lima
- **Componentes existentes**: Reutilizar Landing, CreateChallenge, ChallengeView
- **Navegación fluida**: Mismo sistema de vistas

## 📝 INTERFACE CHALLENGE (TypeScript)
```typescript
interface Challenge {
  id: string;
  name: string;
  duration: number;
  type: 'individual' | 'grupal';
  emoji: string;
  participants: number;
  progress: boolean[];
  createdAt: string;
}
```

## 🚀 PLAN DE IMPLEMENTACIÓN

### ✅ Phase 2.1: Setup Supabase - COMPLETADO
- [x] Configurar cliente Supabase
- [x] Crear schema de base de datos
- [x] Setup de tipos TypeScript
- [x] Componentes de autenticación
- [x] Dashboard básico

### 🔄 Phase 2.2: Hooks y Context - EN DESARROLLO
- [ ] Completar AuthContext con funcionalidades avanzadas
- [ ] Hook useAuth con manejo de estados
- [ ] Hook useChallenges (híbrido localStorage + Supabase)
- [ ] Hook useProgress para seguimiento tiempo real

### 📋 Phase 2.3: Data Sync - PENDIENTE
- [ ] Migración automática localStorage → Supabase
- [ ] Sincronización bidireccional de progreso
- [ ] Sistema de sesiones anónimas robusto
- [ ] Manejo de conflictos de datos

### 📋 Phase 2.4: Features Avanzadas - PENDIENTE
- [ ] Real-time subscriptions para retos grupales
- [ ] Links públicos funcionales con slugs
- [ ] Estadísticas avanzadas en Dashboard
- [ ] Sistema de notificaciones
- [ ] Optimización de performance

## 🎯 RESULTADO ESPERADO
Una aplicación que mantenga la **UX ultraliviana actual** para usuarios anónimos, pero que ofrezca **funcionalidades avanzadas** para usuarios registrados, con migración fluida entre ambos estados y sincronización en tiempo real.

## 🔥 ESTADO ACTUAL - Phase 2 ACTIVA
- ✅ **Frontend base**: Completamente funcional con nueva UI
- ✅ **Database**: Schema implementado y datos de prueba
- ✅ **Auth UI**: Modal de login/registro integrado
- ✅ **Dashboard**: Panel básico de usuario implementado
- 🔄 **Hooks**: En desarrollo para manejo de estado robusto
- 📋 **Real-time**: Pendiente para retos grupales
- 📋 **Data sync**: Pendiente migración automática

## 📚 RECURSOS IMPORTANTES
- **Supabase Docs**: https://supabase.com/docs
- **React + Supabase**: https://supabase.com/docs/guides/getting-started/tutorials/with-react
- **TypeScript**: Mantener tipado estricto en toda la migración
- **Real-time**: https://supabase.com/docs/guides/realtime

---
**Objetivo**: Completar Phase 2 con hooks robustos y sincronización automática, manteniendo código limpio y escalable.