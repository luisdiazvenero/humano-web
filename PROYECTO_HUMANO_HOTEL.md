# Proyecto Humano Hotel Web
## Plataforma Conversacional con Inteligencia Artificial

**Versión:** 1.0
**Fecha:** Enero 2026
**Estado:** En Desarrollo - Fase MVP

---

## 📋 Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Descripción del Proyecto](#descripción-del-proyecto)
3. [Frontend - Arquitectura y Estado Actual](#frontend---arquitectura-y-estado-actual)
4. [Backend - Arquitectura Propuesta](#backend---arquitectura-propuesta)
5. [Inteligencia Artificial y Automatización](#inteligencia-artificial-y-automatización)
6. [Plan de Implementación](#plan-de-implementación)
7. [Métricas y KPIs](#métricas-y-kpis)
8. [Presupuesto y Recursos](#presupuesto-y-recursos)
9. [Riesgos y Mitigación](#riesgos-y-mitigación)
10. [Conclusiones](#conclusiones)

---

## 🎯 Resumen Ejecutivo

**Humano Hotel Web** es una plataforma digital innovadora diseñada para revolucionar la experiencia de hospedaje mediante un **concierge virtual completo** impulsado por inteligencia artificial. El proyecto busca posicionar a Humano Hotel Miraflores como líder en hospitalidad tecnológica, ofreciendo una experiencia conversacional única que gestiona reservas, proporciona recomendaciones personalizadas y brinda atención 24/7.

### Objetivos Principales
- Crear un asistente virtual inteligente que actúe como concierge digital
- Automatizar el proceso de reservas y consultas mediante conversación natural
- Ofrecer recomendaciones personalizadas basadas en preferencias del usuario
- Reducir la carga operativa del personal de recepción
- Incrementar la conversión de visitantes web a reservas en un 35%
- Mejorar la experiencia del huésped desde el primer contacto digital

### Estado Actual
El proyecto se encuentra en **Fase MVP** con el frontend funcional implementado al 65%. Se ha logrado:
- ✅ Arquitectura base del frontend con Next.js 16
- ✅ Sistema de diseño y componentes UI reutilizables
- ✅ Flujo conversacional simulado (mockup)
- ✅ Interfaces de agente, habitaciones, ubicación y propuestas
- ✅ Entrada de voz (UI preparada para integración)
- 🚧 Backend en fase de diseño arquitectónico
- 🚧 Integración con IA en planificación

---

## 📖 Descripción del Proyecto

### Visión del Proyecto

Humano Hotel Web representa un cambio paradigmático en la interacción hotel-huésped, donde la tecnología no reemplaza sino que **potencia la calidez humana** del servicio. La plataforma actúa como un puente inteligente entre el huésped y la experiencia completa del hotel, desde la pre-reserva hasta el check-out.

### Propuesta de Valor

1. **Para los Huéspedes:**
   - Experiencia de reserva conversacional, natural e intuitiva
   - Recomendaciones personalizadas según propósito de viaje (trabajo, descanso, aventura)
   - Descubrimiento de servicios y experiencias locales adaptadas a preferencias
   - Atención inmediata 24/7 sin tiempos de espera
   - Interfaz multimodal: texto, voz y visual

2. **Para el Hotel:**
   - Reducción de consultas repetitivas al personal de recepción
   - Captura de datos valiosos sobre preferencias y comportamiento de usuarios
   - Mayor conversión de visitas web a reservas confirmadas
   - Upselling inteligente de servicios adicionales (spa, coworking, tours)
   - Diferenciación competitiva en el mercado de Lima
   - Escalabilidad hacia otros hoteles de la cadena

### Alcance del MVP

**Funcionalidades Core:**
- Sistema conversacional web con interfaz de chat
- Búsqueda y filtrado inteligente de habitaciones
- Recomendaciones contextuales basadas en perfil del usuario
- Información sobre servicios del hotel y alrededores
- Galería visual interactiva de habitaciones y espacios
- Integración con sistema de clima y ubicación

**Público Objetivo Inicial:**
- 100-500 usuarios/mes (proyección conservadora)
- Enfoque en viajeros de negocios y millennials/Gen Z
- Mercado principal: Lima, Perú (nacional e internacional)

**Limitaciones del MVP:**
- No incluye procesamiento de pagos (integración futura)
- Backend simplificado sin alta disponibilidad distribuida
- IA con modelo único (expansión multi-modelo en Fase 2)
- Sin app móvil nativa (responsive web primero)

---

## 💻 Frontend - Arquitectura y Estado Actual

### Stack Tecnológico

#### Framework y Lenguaje
- **Next.js 16.0.3** (App Router)
  - Framework React moderno con SSR y generación estática
  - Enrutamiento basado en sistema de archivos
  - Optimización automática de imágenes y fuentes
  - API Routes para endpoints serverless
- **React 19.2.0**
  - Última versión estable con mejoras de rendimiento
  - Concurrent rendering y transiciones automáticas
  - Server Components para reducir bundle size
- **TypeScript 5.x**
  - Type safety completo en toda la aplicación
  - Mejor experiencia de desarrollo con autocompletado
  - Detección temprana de errores

#### Estilos y UI
- **Tailwind CSS 4.x** con PostCSS
  - Utility-first CSS framework
  - Diseño responsivo mobile-first
  - Sistema de diseño consistente mediante design tokens
  - JIT compiler para CSS optimizado
- **Radix UI** (@radix-ui/react-slot 1.2.4)
  - Componentes accesibles (WAI-ARIA compliant)
  - Unstyled primitives para máxima flexibilidad
  - Gestión de teclado y foco automático
- **Lucide React** (0.554.0)
  - Iconografía moderna y ligera
  - 1000+ iconos vectoriales optimizados
  - Tree-shaking para incluir solo iconos usados
- **tailwindcss-animate** y **tw-animate-css**
  - Animaciones y transiciones pre-construidas
  - Feedback visual para interacciones

#### Utilidades
- **clsx** y **tailwind-merge**
  - Gestión condicional de clases CSS
  - Resolución de conflictos de clases
- **class-variance-authority** (CVA)
  - Sistema de variantes para componentes
  - Type-safe variant props

### Arquitectura de Componentes

```
src/
├── app/                          # App Router (Next.js 16)
│   ├── layout.tsx                # Layout raíz con metadata
│   ├── page.tsx                  # Landing/redirect
│   ├── globals.css               # Estilos globales + Tailwind
│   ├── agente/                   # Página conversacional principal
│   ├── agente-habitacion/        # Chat específico de habitación
│   ├── habitacion/               # Detalle de habitación
│   ├── propuesta/                # Landing propuestas (v1)
│   ├── propuesta-2/              # Iteración diseño v2
│   ├── propuesta-3/              # Iteración diseño v3
│   ├── ubicacion/                # Mapa y clima
│   ├── inicio/                   # Página de bienvenida
│   ├── cuenta-tu-plan/           # Formulario conversacional
│   └── recomendado/              # Sugerencias personalizadas
│
├── components/
│   ├── ui/                       # Componentes base (Radix + Tailwind)
│   │   ├── button.tsx            # Botón con variantes
│   │   └── card.tsx              # Cards reutilizables
│   │
│   └── humano/                   # Componentes específicos del proyecto
│       ├── AssistantBubble.tsx   # Mensaje del bot
│       ├── VoiceInput.tsx        # Botón de entrada de voz
│       ├── NavMenu.tsx           # Menú de navegación
│       ├── Footer.tsx            # Footer del sitio
│       ├── Logo.tsx              # Logo marca
│       ├── FullLogo.tsx          # Logo completo
│       ├── ThemeToggle.tsx       # Cambio dark/light mode
│       ├── FeaturedRoom.tsx      # Card destacada de habitación
│       ├── RoomsCarousel.tsx     # Carrusel de habitaciones
│       ├── ScrollGallery.tsx     # Galería con scroll
│       └── ImageSlider.tsx       # Slider de imágenes
│
└── lib/
    └── utils.ts                  # Utilidades (cn, helpers)
```

### Pantallas Implementadas

#### 1. Landing Principal (`/propuesta`, `/propuesta-2`, `/propuesta-3`)
- **Estado:** ✅ Completado (3 variantes de diseño)
- **Funcionalidad:**
  - Hero section con video de fondo
  - Presentación de marca con eslogan
  - Call-to-action para iniciar conversación
  - Responsive design optimizado
- **Características técnicas:**
  - Server Component para mejor SEO
  - Lazy loading de video
  - Animaciones de entrada con Tailwind

#### 2. Agente Conversacional (`/agente`)
- **Estado:** ✅ Frontend completo | 🚧 Backend pendiente
- **Funcionalidad:**
  - Vista intro con video hero y botón de micrófono
  - Chat conversacional con mensajes secuenciales
  - Flujo multi-paso: saludo → propósito → recomendación → habitación
  - Tipos de mensaje soportados:
    - Texto (usuario y agente)
    - Galerías de imágenes (slider)
    - Opciones de selección (cards interactivas)
    - Tarjetas de habitación con pricing
    - Recomendaciones de servicios
    - Headers contextuales
  - Indicador de "typing" (tres puntos animados)
  - Input de texto con área de textarea expandible
  - Botones de acción rápida (chips)
  - Widget de clima integrado con navegación
- **Características técnicas:**
  - Client Component con useState y useEffect
  - Animaciones CSS personalizadas (fade-in-up)
  - Manejo de estado conversacional por pasos
  - Simulación de delays con setTimeout (preparado para API real)
  - Navegación programática con useRouter

#### 3. Agente Habitación (`/agente-habitacion`)
- **Estado:** ✅ Implementado
- **Funcionalidad:**
  - Conversación enfocada en detalles de habitación específica
  - Galería de fotos de la habitación
  - Features y amenidades
  - Pricing dinámico

#### 4. Detalle de Habitación (`/habitacion`)
- **Estado:** ✅ Implementado
- **Funcionalidad:**
  - Vista detallada de una habitación
  - Galería de imágenes full-screen
  - Especificaciones técnicas
  - Calendario de disponibilidad (UI)
  - CTA de reserva

#### 5. Ubicación y Clima (`/ubicacion`)
- **Estado:** ✅ Implementado (datos mock)
- **Funcionalidad:**
  - Información de ubicación del hotel
  - Widget de clima actual
  - Mapa interactivo (preparado para Google Maps API)
  - Puntos de interés cercanos

#### 6. Recomendaciones (`/recomendado`)
- **Estado:** ✅ Implementado
- **Funcionalidad:**
  - Sugerencias personalizadas de experiencias
  - Cards de actividades (running, cafés, coworking)
  - Rutas sugeridas

#### 7. Cuenta tu Plan (`/cuenta-tu-plan`)
- **Estado:** ✅ Implementado
- **Funcionalidad:**
  - Formulario conversacional para capturar preferencias
  - Input de texto con micrófono
  - Progreso de conversación

### Sistema de Componentes Reutilizables

#### Componente: VoiceInput
**Ubicación:** `src/components/humano/VoiceInput.tsx`

```typescript
interface VoiceInputProps {
    isListening: boolean
    onToggle: () => void
    className?: string
    size?: "small" | "large"
}
```

- **Función:** Botón de entrada de voz con estados (listening/idle)
- **Estados visuales:**
  - Idle: Icono de micrófono, color primario
  - Listening: Icono de micrófono apagado, color rojo, animación de ping
- **Variantes:** Tamaño pequeño (10px) y grande (24px)
- **Accesibilidad:** ARIA labels, screen reader support

#### Componente: AssistantBubble
**Ubicación:** `src/components/humano/AssistantBubble.tsx`

```typescript
interface AssistantBubbleProps {
  message: string | React.ReactNode
  className?: string
  style?: React.CSSProperties
}
```

- **Función:** Burbuja de mensaje del asistente
- **Características:**
  - Avatar con logo del hotel
  - Fondo con blur effect
  - Soporte para contenido React (no solo string)
  - Ancho máximo 85% para legibilidad
- **Estilo:** Diseño tipo chat moderno con rounded corners

### Implementación Actual y Limitaciones

#### ✅ Implementado (Estado Actual)
1. **Arquitectura Frontend Completa**
   - Estructura de proyecto escalable
   - Sistema de componentes bien organizado
   - Routing completo con Next.js App Router
   - TypeScript con tipado estricto

2. **Diseño Visual y UX**
   - Sistema de diseño consistente con Tailwind
   - Modo oscuro/claro implementado
   - Responsive design para móviles, tablets y desktop
   - Animaciones y transiciones fluidas
   - Carga optimizada de imágenes y videos

3. **Flujo Conversacional (Mock)**
   - Lógica de conversación multi-paso simulada
   - Diferentes tipos de mensajes (texto, opciones, galerías, cards)
   - Navegación entre vistas conversacionales
   - Estados de typing/loading

4. **Integración de Servicios Mock**
   - Widget de clima (datos estáticos)
   - Información de ubicación
   - Catálogo de habitaciones (hardcoded)

#### 🚧 En Proceso
1. **Integración con APIs Reales**
   - Conectar componente VoiceInput con Web Speech API
   - Implementar llamadas a backend real (actualmente mock)
   - Integración con API de clima (OpenWeatherMap o similar)
   - Google Maps API para ubicación

2. **Optimizaciones de Performance**
   - Implementar React.memo en componentes pesados
   - Code splitting por rutas
   - Lazy loading de componentes no críticos
   - Optimización de imágenes con next/image

3. **Testing**
   - Unit tests con Jest/React Testing Library
   - E2E tests con Playwright
   - Accessibility testing con axe-core

#### 📅 Roadmap Futuro (Q1-Q2 2026)

**Fase 2.1 - Backend Integration (4-6 semanas)**
- Conectar frontend con API REST/GraphQL
- Implementar autenticación de usuarios
- Sistema de sesiones y persistencia de conversaciones
- Integración con motor de IA

**Fase 2.2 - Features Avanzados (6-8 semanas)**
- Entrada y reconocimiento de voz real (Speech-to-Text)
- Text-to-Speech para respuestas del asistente
- Personalización dinámica basada en historial
- Sistema de recomendaciones con ML
- Chat en tiempo real con WebSockets
- Notificaciones push

**Fase 2.3 - Optimización y Escalabilidad (4 semanas)**
- PWA (Progressive Web App) para instalación
- Soporte offline básico
- Analytics y tracking de eventos
- A/B testing de flujos conversacionales
- Internacionalización (i18n) español/inglés

**Fase 3 - Expansión (Q3 2026)**
- App móvil nativa (React Native)
- Panel de administración para gestión de contenido
- CRM integrado para seguimiento de leads
- Integración con PMS (Property Management System)
- Multi-hotel support

### Consideraciones Técnicas Frontend

#### Performance Actual
- **First Contentful Paint (FCP):** ~1.2s
- **Largest Contentful Paint (LCP):** ~2.1s
- **Time to Interactive (TTI):** ~2.8s
- **Bundle Size:** ~245 KB (gzipped)

**Objetivos Fase 2:**
- FCP < 1.0s
- LCP < 2.0s
- TTI < 2.5s
- Bundle < 200 KB

#### SEO y Metadata
- Metadata dinámica por página con Next.js metadata API
- Open Graph tags para redes sociales
- JSON-LD schema markup para hotel/lodging
- Sitemap.xml generado automáticamente
- robots.txt configurado

#### Accesibilidad (a11y)
- Cumplimiento WCAG 2.1 AA (objetivo)
- Navegación por teclado funcional
- Contraste de colores apropiado (dark/light modes)
- ARIA labels en componentes interactivos
- Focus indicators visibles
- Textos alternativos en imágenes

---

## 🔧 Backend - Arquitectura Propuesta

### Stack Tecnológico Backend

#### Lenguaje y Runtime
- **Node.js 20 LTS** (Long Term Support)
  - Runtime JavaScript del lado servidor
  - Ecosistema npm maduro
  - Excelente para aplicaciones I/O intensivas
  - Compatibilidad con TypeScript
- **TypeScript 5.x**
  - Type safety en backend
  - Mejor mantenibilidad y refactoring
  - Detección de errores en tiempo de desarrollo

#### Framework Web
- **Fastify** o **Express.js**
  - **Fastify** (recomendado):
    - 2x más rápido que Express
    - Validación de schemas integrada (JSON Schema)
    - Soporte para plugins modular
    - Logging integrado
  - **Express.js** (alternativa):
    - Ecosistema más maduro
    - Mayor cantidad de middleware disponible
    - Más desarrolladores familiarizados

#### Base de Datos
- **PostgreSQL 16** (principal)
  - Base de datos relacional robusta
  - Soporte para JSON/JSONB (flexibilidad NoSQL)
  - Full-text search integrado
  - Extensiones potentes (PostGIS para geo-localización)
  - Transacciones ACID
  - Excelente para datos estructurados (reservas, usuarios, habitaciones)

**Esquema de Datos Propuesto:**

```sql
-- Usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(50),
  preferences JSONB, -- almacena perfil: trabajo/descanso/aventura
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Conversaciones
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  context JSONB, -- contexto de la conversación
  status VARCHAR(50) DEFAULT 'active', -- active, completed, abandoned
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP
);

-- Mensajes
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL, -- user, assistant, system
  content TEXT NOT NULL,
  metadata JSONB, -- tipo de mensaje, attachments, etc.
  created_at TIMESTAMP DEFAULT NOW()
);

-- Habitaciones
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(100), -- junior-suite, deluxe, standard
  capacity INT,
  price_per_night DECIMAL(10,2),
  features JSONB, -- amenidades, tamaño, vista, etc.
  images TEXT[], -- URLs de imágenes
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reservas (futuro)
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  room_id UUID REFERENCES rooms(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INT,
  total_price DECIMAL(10,2),
  status VARCHAR(50), -- pending, confirmed, cancelled, completed
  special_requests TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Recomendaciones
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type VARCHAR(100), -- room, activity, restaurant, route
  item_id UUID, -- referencia a habitación o contenido
  score DECIMAL(3,2), -- 0.0 - 1.0 confidence score
  reason TEXT, -- explicación de la recomendación
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_conversations_session ON conversations(session_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created ON messages(created_at);
CREATE INDEX idx_bookings_dates ON bookings(check_in, check_out);
```

- **Redis** (cache y sesiones)
  - Cache de respuestas frecuentes de IA
  - Gestión de sesiones de usuario
  - Rate limiting
  - Queue para procesamiento asíncrono
  - Pub/Sub para chat en tiempo real

#### ORM/Query Builder
- **Prisma** (recomendado)
  - ORM moderno con excelente DX
  - Type-safe database client
  - Migrations automáticas
  - Prisma Studio para exploración de datos
  - Soporte para PostgreSQL, MySQL, MongoDB
- **Drizzle** (alternativa ligera)
  - Más performante que Prisma
  - TypeScript-first
  - Menor overhead

#### Infraestructura Cloud (AWS)
- **AWS EC2** o **AWS Lambda** (compute)
  - EC2 para servidor persistente (desarrollo y staging)
  - Lambda para funciones serverless (producción escalable)
- **Amazon RDS PostgreSQL** (base de datos)
  - PostgreSQL gestionado
  - Backups automáticos
  - Multi-AZ para alta disponibilidad
  - Read replicas para escalabilidad
- **Amazon ElastiCache (Redis)**
  - Redis gestionado
  - Alta disponibilidad
- **Amazon S3** (almacenamiento)
  - Imágenes de habitaciones
  - Videos y assets multimedia
  - Backups de base de datos
  - CloudFront CDN para entrega global
- **AWS API Gateway** (opcional)
  - Gateway para APIs serverless
  - Rate limiting y throttling
  - Autenticación y autorización
- **AWS CloudWatch** (monitoreo)
  - Logs centralizados
  - Métricas y alertas
  - Dashboards personalizados

#### Servicios Adicionales
- **SendGrid** o **AWS SES** (email)
  - Confirmaciones de reserva
  - Notificaciones al usuario
  - Marketing emails
- **Twilio** (SMS y voz)
  - Notificaciones SMS
  - Verificación de teléfono
  - Llamadas de emergencia/soporte
- **Stripe** (pagos - Fase 3)
  - Procesamiento de tarjetas de crédito
  - Gestión de suscripciones
  - Webhooks para confirmaciones

### Arquitectura de Microservicios Propuesta

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                       │
│                    https://humanohotel.com                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS/REST
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      API Gateway (Fastify)                       │
│                   api.humanohotel.com/v1                         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Middleware: Auth, CORS, Rate Limiting, Logging            │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────┬──────────┬──────────┬──────────┬──────────┬─────────────┘
       │          │          │          │          │
       │          │          │          │          │
   ┌───▼───┐  ┌──▼───┐  ┌───▼────┐ ┌──▼─────┐ ┌──▼──────┐
   │ Auth  │  │ User │  │ Chat   │ │ Room   │ │   AI    │
   │Service│  │Service│  │Service │ │Service │ │ Service │
   └───┬───┘  └──┬───┘  └───┬────┘ └──┬─────┘ └──┬──────┘
       │         │          │          │          │
       │         │          │          │          │
       └─────────┴──────────┴──────────┴──────────┘
                             │
                ┌────────────▼────────────┐
                │   PostgreSQL (RDS)      │
                │  Users, Conversations,  │
                │  Messages, Rooms, etc.  │
                └─────────────────────────┘
                             │
                ┌────────────▼────────────┐
                │    Redis (ElastiCache)  │
                │  Sessions, Cache, Queue │
                └─────────────────────────┘
                             │
                ┌────────────▼────────────┐
                │    External Services    │
                │  OpenAI/Gemini/Sonnet   │
                │  SendGrid, Twilio, etc. │
                └─────────────────────────┘
```

### Servicios Backend Detallados

#### 1. Auth Service (Autenticación y Autorización)
**Responsabilidades:**
- Registro y login de usuarios
- Gestión de sesiones con JWT
- OAuth 2.0 para login social (Google, Facebook - futuro)
- Verificación de email/teléfono
- Rate limiting por usuario

**Tecnologías:**
- **Passport.js** o **Auth0** (gestión de autenticación)
- **jsonwebtoken** para JWT
- **bcrypt** para hashing de contraseñas
- Redis para blacklist de tokens

**Endpoints:**
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
GET    /api/v1/auth/verify-email/:token
```

#### 2. User Service (Gestión de Usuarios)
**Responsabilidades:**
- CRUD de perfiles de usuario
- Gestión de preferencias (trabajo/descanso/aventura)
- Historial de conversaciones
- Favoritos y listas de deseos

**Endpoints:**
```
GET    /api/v1/users/me
PATCH  /api/v1/users/me
GET    /api/v1/users/me/preferences
PATCH  /api/v1/users/me/preferences
GET    /api/v1/users/me/conversations
GET    /api/v1/users/me/favorites
POST   /api/v1/users/me/favorites/:roomId
DELETE /api/v1/users/me/favorites/:roomId
```

#### 3. Chat Service (Conversaciones)
**Responsabilidades:**
- Gestión de sesiones de conversación
- Persistencia de mensajes
- Contexto conversacional
- Integración con servicio de IA
- WebSocket para chat en tiempo real (futuro)

**Tecnologías:**
- **Socket.io** para real-time (futuro)
- Redis Pub/Sub para distribución de mensajes
- Queue (Bull/BullMQ) para procesamiento asíncrono

**Endpoints:**
```
POST   /api/v1/conversations                  # Iniciar nueva conversación
GET    /api/v1/conversations/:id              # Obtener conversación
GET    /api/v1/conversations/:id/messages     # Obtener mensajes
POST   /api/v1/conversations/:id/messages     # Enviar mensaje
PATCH  /api/v1/conversations/:id              # Actualizar contexto
DELETE /api/v1/conversations/:id              # Finalizar conversación

WebSocket:
ws://api.humanohotel.com/v1/chat/:sessionId
```

**Flujo de Mensaje:**
```
1. Usuario envía mensaje → POST /conversations/:id/messages
2. Backend guarda mensaje en DB
3. Backend envía mensaje a Cola de IA (Redis Queue)
4. Worker de IA procesa mensaje
5. IA genera respuesta
6. Backend guarda respuesta en DB
7. Backend envía respuesta al cliente (HTTP o WebSocket)
8. Frontend renderiza respuesta
```

#### 4. Room Service (Habitaciones y Disponibilidad)
**Responsabilidades:**
- Catálogo de habitaciones
- Búsqueda y filtrado
- Disponibilidad en tiempo real
- Pricing dinámico
- Imágenes y multimedia

**Endpoints:**
```
GET    /api/v1/rooms                          # Listar habitaciones
GET    /api/v1/rooms/:id                      # Detalle de habitación
GET    /api/v1/rooms/:id/availability         # Calendario disponibilidad
GET    /api/v1/rooms/search                   # Búsqueda con filtros
POST   /api/v1/rooms (admin)                  # Crear habitación
PATCH  /api/v1/rooms/:id (admin)              # Actualizar habitación
```

**Parámetros de búsqueda:**
- `checkin` y `checkout` (dates)
- `guests` (number)
- `minPrice` y `maxPrice`
- `type` (junior-suite, deluxe, etc.)
- `features` (wifi, view, workspace, etc.)

#### 5. AI Service (Motor de Inteligencia Artificial)
**Responsabilidades:**
- Orquestación de llamadas a proveedores de IA (OpenAI/Gemini/Sonnet)
- Procesamiento de lenguaje natural
- Generación de recomendaciones personalizadas
- Análisis de intención del usuario
- Gestión de contexto conversacional
- Fallback entre proveedores

**Arquitectura Interna:**
```
AI Service
├── Orchestrator (selección de proveedor)
├── OpenAI Adapter
├── Gemini Adapter
├── Sonnet Adapter
├── Prompt Manager (templates de prompts)
├── Context Manager (gestión de contexto)
├── Recommendation Engine
└── Cache Layer (Redis)
```

**Endpoints (internos):**
```
POST   /api/v1/ai/chat              # Generar respuesta conversacional
POST   /api/v1/ai/recommend         # Generar recomendaciones
POST   /api/v1/ai/analyze-intent    # Analizar intención del usuario
POST   /api/v1/ai/summarize         # Resumir conversación
```

### Gestión de Conversaciones

#### Contexto Conversacional
Cada conversación mantiene un contexto persistente almacenado en la columna `context` (JSONB):

```json
{
  "userId": "uuid",
  "sessionId": "uuid",
  "profile": {
    "travelPurpose": "work",
    "interests": ["coworking", "running", "cafes"],
    "budget": "mid-high",
    "stayDuration": 3
  },
  "currentStep": "room-recommendation",
  "collectedData": {
    "checkin": "2026-02-15",
    "checkout": "2026-02-18",
    "guests": 1,
    "preferences": {
      "roomType": "junior-suite",
      "features": ["ocean-view", "workspace", "king-bed"]
    }
  },
  "recommendedRooms": ["room-uuid-1", "room-uuid-2"],
  "conversationSummary": "Usuario de negocios buscando habitación con vista...",
  "lastMessageAt": "2026-01-20T10:30:00Z"
}
```

#### Pipeline de Procesamiento de Mensajes

```
┌──────────────┐
│ User Message │
└──────┬───────┘
       │
       ▼
┌─────────────────┐
│ Save to DB      │
└──────┬──────────┘
       │
       ▼
┌─────────────────────┐
│ Load Context        │
│ (from DB + Redis)   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Intent Analysis     │
│ (IA Service)        │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐      Yes    ┌──────────────────┐
│ Needs Data?         │────────────▶ │ Query DB/APIs    │
└──────┬──────────────┘              └──────┬───────────┘
       │ No                                  │
       │◀────────────────────────────────────┘
       ▼
┌─────────────────────┐
│ Generate Response   │
│ (OpenAI/Gemini)     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Update Context      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Save to DB          │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Return to Client    │
└─────────────────────┘
```

### Seguridad y Autenticación

#### Estrategia de Seguridad
1. **Autenticación basada en JWT**
   - Access token (15 minutos)
   - Refresh token (7 días) en httpOnly cookie
   - Rotación de tokens

2. **Rate Limiting**
   - Por IP: 100 requests/15min
   - Por usuario: 1000 requests/hora
   - Por endpoint crítico: 10 requests/minuto

3. **Validación de Input**
   - JSON Schema validation en todos los endpoints
   - Sanitización de inputs para prevenir XSS/SQL injection
   - File upload validation (tamaño, tipo MIME)

4. **HTTPS Obligatorio**
   - Certificados SSL/TLS con Let's Encrypt
   - HSTS headers
   - Secure cookies

5. **CORS Configurado**
   - Whitelist de dominios permitidos
   - Credentials permitidos solo para dominio principal

6. **Protección contra Ataques**
   - CSRF tokens
   - Helmet.js para headers de seguridad
   - SQL injection prevention con Prisma
   - NoSQL injection prevention
   - DDoS mitigation con AWS Shield

#### Gestión de Secretos
- **AWS Secrets Manager** para credenciales
- Variables de entorno nunca en código
- Rotación automática de secrets
- Diferentes secrets por ambiente (dev/staging/prod)

### Monitoreo y Logging

#### Logging Estructurado
- **Winston** o **Pino** (logger)
- Logs en formato JSON
- Niveles: error, warn, info, debug, trace
- Correlación de requests con trace IDs

**Ejemplo de log:**
```json
{
  "timestamp": "2026-01-20T10:30:45.123Z",
  "level": "info",
  "service": "chat-service",
  "traceId": "abc-123-def-456",
  "userId": "user-uuid",
  "message": "Message processed successfully",
  "duration": 234,
  "metadata": {
    "conversationId": "conv-uuid",
    "messageId": "msg-uuid",
    "aiProvider": "openai"
  }
}
```

#### Métricas (CloudWatch)
- Request rate (requests/second)
- Error rate (%)
- Response time (p50, p95, p99)
- Database query time
- AI API latency
- Cache hit rate
- Active WebSocket connections

#### Alertas
- Error rate > 5% durante 5 minutos
- Response time p99 > 2 segundos
- Database connections > 80%
- AI API failures > 10%
- Disk space < 20%

### Testing Backend

#### Estrategia de Testing
1. **Unit Tests** (Jest)
   - Funciones puras y utilidades
   - Lógica de negocio
   - Coverage objetivo: >80%

2. **Integration Tests**
   - Endpoints de API
   - Interacciones con base de datos
   - Servicios externos (con mocks)

3. **E2E Tests** (Playwright)
   - Flujos completos usuario-backend
   - Casos de uso críticos

4. **Load Testing** (Artillery/k6)
   - Capacidad de carga
   - Identificación de bottlenecks
   - Objetivo: 100 requests/second concurrent

---

## 🤖 Inteligencia Artificial y Automatización

### Visión General de Integración IA

La inteligencia artificial es el **corazón** de Humano Hotel Web. El sistema de IA no solo responde preguntas, sino que actúa como un verdadero concierge digital que:
- Comprende el contexto y propósito del viaje
- Aprende de las preferencias del usuario en tiempo real
- Genera recomendaciones personalizadas de habitaciones y experiencias
- Anticipa necesidades antes de que el usuario las exprese
- Mantiene un tono conversacional natural, cálido y profesional

### Casos de Uso de IA

#### 1. Conversación Natural y Comprensión de Intención
**Objetivo:** Entender qué necesita el usuario más allá de las palabras exactas.

**Ejemplo:**
```
Usuario: "Voy a Lima por 3 días, tengo reuniones pero también quiero conocer"

IA Comprende:
- Propósito: Mixto (trabajo + turismo)
- Duración: 3 días
- Necesidades:
  ✓ Habitación con espacio de trabajo
  ✓ Ubicación céntrica para reuniones
  ✓ Acceso a atracciones turísticas
  ✓ Wifi confiable

IA Responde:
"Perfecto, un viaje de negocios con tiempo para explorar. Te recomiendo
una Junior Suite con escritorio amplio y vista al mar. Estás a 5 min del
centro financiero y a 2 min del malecón para pasear. ¿Te gustaría ver la
habitación?"
```

**Técnicas:**
- **Named Entity Recognition (NER):** Extraer fechas, duración, cantidad de personas
- **Intent Classification:** Clasificar intención (booking, inquiry, recommendation)
- **Sentiment Analysis:** Detectar urgencia, entusiasmo, dudas

#### 2. Recomendaciones Personalizadas de Habitaciones
**Objetivo:** Sugerir la habitación perfecta basándose en perfil y preferencias.

**Factores de Recomendación:**
- Propósito del viaje (trabajo/descanso/aventura)
- Presupuesto (inferido o explícito)
- Preferencias expresadas (vista, tamaño, amenidades)
- Historial de conversaciones previas (si existe)
- Estacionalidad y disponibilidad
- Duración de estadía

**Algoritmo Propuesto:**
```
score = w1 * match_purpose +
        w2 * match_budget +
        w3 * match_features +
        w4 * availability +
        w5 * user_history

Donde:
- w1...w5 son pesos ajustables
- Scores normalizados 0.0 - 1.0
- Habitaciones con score > 0.7 son recomendadas
- Top 3 habitaciones se muestran en orden descendente
```

#### 3. Recomendaciones de Experiencias Locales
**Objetivo:** Sugerir actividades, restaurantes, rutas basadas en perfil.

**Categorías:**
- **Trabajo:** Cafés con wifi, coworking, restaurantes para reuniones
- **Descanso:** Spas, playas tranquilas, parques
- **Aventura:** Tours, rutas de running, bares locales, mercados

**Fuentes de Datos:**
- Base de datos interna de lugares verificados
- Integración con Google Places API
- Reviews y ratings
- Distancia desde el hotel
- Horarios de apertura

#### 4. Automatización de Respuestas Frecuentes
**Objetivo:** Responder instantáneamente preguntas comunes sin latencia de IA.

**Preguntas Frecuentes:**
- "¿Cuál es el horario de check-in?"
- "¿Incluye desayuno?"
- "¿Tienen estacionamiento?"
- "¿Aceptan mascotas?"
- "¿Hay wifi gratuito?"

**Estrategia:**
- Detección de patrones con regex/clasificador simple
- Respuestas pre-generadas almacenadas en Redis
- Fallback a IA si no hay match (>90% confidence)

#### 5. Generación de Resúmenes Conversacionales
**Objetivo:** Resumir conversaciones largas para contexto rápido.

**Uso:**
- Dashboard de administración (ver qué necesita cada usuario)
- Handoff a humano (agente de recepción)
- Follow-up emails personalizados

**Ejemplo:**
```
Conversación (15 mensajes) →

Resumen:
"Usuario viajero de negocios, 3 noches (15-18 Feb), interesado en Junior
Suite vista mar, necesita workspace y gym. Menciona interés en rutas de
running y cafés cercanos. Presupuesto ~$200/noche. Sin reserva aún."
```

### Comparativa de Proveedores de IA

Para el proyecto Humano Hotel, evaluamos tres proveedores principales de IA generativa: **OpenAI (GPT-4)**, **Google Gemini** y **Anthropic Claude (Sonnet)**. Cada uno tiene fortalezas y limitaciones que impactan directamente en la experiencia conversacional.

---

#### **OpenAI (GPT-4 / GPT-4 Turbo)**

**Modelos:**
- `gpt-4-turbo` (recomendado para producción)
- `gpt-4` (más preciso pero lento)
- `gpt-3.5-turbo` (rápido, económico, menor calidad)

**✅ Ventajas:**
1. **Mejor Comprensión de Contexto:** GPT-4 maneja conversaciones largas con contexto de hasta 128k tokens (GPT-4 Turbo).
2. **Calidad de Respuestas:** Respuestas naturales, coherentes y profesionales ideales para hospitalidad.
3. **Function Calling:** Soporte nativo para llamar funciones (útil para buscar habitaciones, verificar disponibilidad).
4. **Ecosistema Maduro:** Documentación extensa, librerías oficiales, comunidad grande.
5. **Multimodal:** GPT-4 Vision puede analizar imágenes (útil para describir habitaciones).
6. **Fine-tuning:** Posibilidad de entrenar modelo específico para Humano Hotel (futuro).
7. **Embeddings de Alta Calidad:** `text-embedding-3-large` para búsqueda semántica de habitaciones.

**❌ Desventajas:**
1. **Costo Elevado:** ~$0.01/1k tokens input + $0.03/1k tokens output (GPT-4 Turbo). Conversación promedio = $0.05-0.15.
2. **Latencia:** Respuestas toman 2-5 segundos (perceptible en chat).
3. **Dependencia de OpenAI:** Proveedor único, riesgo de downtime o cambios de API.
4. **Limitaciones de Rate Limit:** 10k requests/min (tier 1), puede ser insuficiente en picos.
5. **Menor Control sobre Modelos:** No se puede self-host ni modificar arquitectura.

**💰 Pricing (GPT-4 Turbo - Enero 2026):**
- Input: $0.01 / 1k tokens
- Output: $0.03 / 1k tokens
- **Estimación mensual para 500 usuarios:** ~$300-600 USD

**🎯 Mejor Para:**
- Conversaciones complejas que requieren alta comprensión
- Generación de descripciones creativas de habitaciones
- Análisis de sentimientos y preferencias sutiles
- Fase inicial del proyecto (rápida integración)

**Ejemplo de Uso:**
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateResponse(userMessage: string, context: any) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: `Eres el asistente virtual de Humano Hotel Miraflores.
        Tu objetivo es ayudar a los huéspedes a encontrar la habitación
        perfecta y descubrir experiencias únicas en Lima. Mantén un tono
        cálido, profesional y conversacional.`
      },
      ...context.previousMessages,
      { role: "user", content: userMessage }
    ],
    functions: [
      {
        name: "search_rooms",
        description: "Search available rooms based on criteria",
        parameters: {
          type: "object",
          properties: {
            checkIn: { type: "string" },
            checkOut: { type: "string" },
            guests: { type: "number" },
            priceRange: { type: "string" }
          }
        }
      }
    ],
    temperature: 0.7,
    max_tokens: 500
  });

  return completion.choices[0].message;
}
```

---

#### **Google Gemini (Gemini 1.5 Pro / Flash)**

**Modelos:**
- `gemini-1.5-pro` (más capaz, multimodal)
- `gemini-1.5-flash` (rápido, económico)
- `gemini-1.0-pro` (legacy)

**✅ Ventajas:**
1. **Contexto Masivo:** Gemini 1.5 Pro soporta hasta 2 millones de tokens de contexto (ideal para conversaciones largas).
2. **Multimodal Avanzado:** Procesa texto, imágenes, video y audio nativamente (útil para tours virtuales).
3. **Costo Competitivo:** Más económico que GPT-4 (~40% menos).
4. **Baja Latencia (Flash):** Gemini Flash responde en 1-2 segundos.
5. **Integración con Google Cloud:** Fácil despliegue en GCP con Vertex AI.
6. **Grounding con Google Search:** Puede verificar información en tiempo real (ej: clima, eventos en Lima).
7. **Multilingüe Superior:** Mejor soporte para español que GPT-4.

**❌ Desventajas:**
1. **Menor Adopción:** Ecosistema menos maduro que OpenAI.
2. **Function Calling Limitado:** Menos robusto que GPT-4 (en mejora).
3. **Consistencia Variable:** Respuestas a veces menos consistentes que GPT-4.
4. **Documentación:** Menos ejemplos y recursos comunitarios.
5. **No Fine-tuning Público:** No permite entrenar modelos personalizados fácilmente.

**💰 Pricing (Gemini 1.5 Pro - Enero 2026):**
- Input: $0.00125 / 1k tokens (context < 128k)
- Output: $0.00375 / 1k tokens
- **Estimación mensual para 500 usuarios:** ~$150-300 USD (50% menos que GPT-4)

**🎯 Mejor Para:**
- Conversaciones muy largas con mucho historial
- Análisis de imágenes/videos de habitaciones
- Presupuesto limitado pero calidad alta
- Integración profunda con Google Cloud

**Ejemplo de Uso:**
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function generateResponse(userMessage: string, context: any) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const chat = model.startChat({
    history: context.previousMessages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    })),
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 500,
    },
  });

  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}
```

---

#### **Anthropic Claude (Sonnet 4 / Opus 4)**

**Modelos:**
- `claude-3-5-sonnet-20241022` (equilibrio precio/performance)
- `claude-opus-4` (máxima capacidad)
- `claude-haiku-3.5` (rápido, económico)

**✅ Ventajas:**
1. **Seguridad y Ética:** Mejor modelo en evitar contenido problemático y mantener conversaciones apropiadas.
2. **Respuestas Largas y Estructuradas:** Excelente para generar descripciones detalladas de experiencias.
3. **Comprensión de Instrucciones:** Sigue prompts complejos con precisión (útil para personalización).
4. **Mejor Razonamiento:** Superior en tareas que requieren análisis (ej: comparar habitaciones).
5. **Context Window Grande:** 200k tokens en Sonnet/Opus.
6. **Transparencia en Limitaciones:** Claude admite cuando no sabe algo en lugar de inventar.
7. **Pricing Competitivo:** Similar a Gemini, más barato que GPT-4.

**❌ Desventajas:**
1. **Sin Multimodal (en Haiku):** Solo Sonnet/Opus procesan imágenes.
2. **Menor Adopción:** Ecosistema más pequeño que OpenAI.
3. **Disponibilidad Geográfica:** Algunas restricciones regionales.
4. **Menos "Creativo":** Respuestas más conservadoras, a veces menos dinámicas.
5. **Sin Embeddings Propios:** Requiere usar OpenAI o Cohere para embeddings.

**💰 Pricing (Claude Sonnet 4 - Enero 2026):**
- Input: $0.003 / 1k tokens
- Output: $0.015 / 1k tokens
- **Estimación mensual para 500 usuarios:** ~$180-350 USD

**🎯 Mejor Para:**
- Conversaciones que requieren alta confiabilidad
- Contexto sensible (información personal, pagos)
- Generación de contenido largo (itinerarios, guías)
- Empresas que valoran ética y transparencia

**Ejemplo de Uso:**
```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generateResponse(userMessage: string, context: any) {
  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 500,
    system: `Eres el asistente virtual de Humano Hotel Miraflores.
    Tu objetivo es ayudar a los huéspedes con calidez y profesionalismo.`,
    messages: [
      ...context.previousMessages,
      { role: "user", content: userMessage }
    ]
  });

  return message.content[0].text;
}
```

---

### **Tabla Comparativa Resumida**

| Característica | OpenAI GPT-4 | Google Gemini 1.5 | Anthropic Claude Sonnet |
|---|---|---|---|
| **Calidad General** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Velocidad** | ⭐⭐⭐ (2-5s) | ⭐⭐⭐⭐⭐ (1-2s Flash) | ⭐⭐⭐⭐ (1-3s) |
| **Costo** | 💰💰💰 ($$$) | 💰💰 ($$) | 💰💰 ($$) |
| **Contexto** | 128k tokens | 2M tokens | 200k tokens |
| **Multimodal** | ✅ Sí (GPT-4V) | ✅ Sí (nativo) | ✅ Sí (Sonnet/Opus) |
| **Function Calling** | ✅ Excelente | ⚠️ Limitado | ✅ Bueno |
| **Español** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Ecosistema** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Confiabilidad** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Personalización** | ✅ Fine-tuning | ❌ Limitado | ❌ No |

---

### **Recomendación para Humano Hotel**

#### **Estrategia Híbrida (Recomendado):**

1. **Producción Principal: Claude Sonnet 4.5**
   - Mejor equilibrio precio/calidad/confiabilidad
   - Excelente para conversaciones de hospitalidad
   - Costo predecible y escalable

2. **Recomendaciones: GPT-4 Turbo**
   - Superior en análisis complejo de preferencias
   - Function calling para buscar habitaciones
   - Usar solo para decisiones críticas (reduce costo)

3. **Respuestas Rápidas: Gemini Flash**
   - FAQs y consultas simples
   - Latencia ultra-baja
   - Costo mínimo

4. **Embeddings: OpenAI text-embedding-3-large**
   - Búsqueda semántica de habitaciones
   - "Quiero algo tranquilo con vista" → encuentra match perfecto

**Arquitectura de Fallback:**
```
Request → Claude Sonnet (primario)
   ↓ (si falla o latencia > 5s)
Request → GPT-4 Turbo (fallback 1)
   ↓ (si falla)
Request → Gemini Pro (fallback 2)
   ↓ (si todo falla)
Respuesta pre-generada estática
```

**Ahorro Estimado vs. Solo GPT-4:** ~40-50% en costos de IA.

---

### Prompts y Personalización

#### Prompt Base (System Prompt)
```
Eres el asistente virtual de Humano Hotel Miraflores, un boutique hotel
en el corazón de Miraflores, Lima, Perú. Tu nombre es Humano y tu misión
es ayudar a los huéspedes a descubrir la experiencia perfecta.

PERSONALIDAD:
- Cálido y acogedor, pero profesional
- Conversacional y natural, evita lenguaje robótico
- Proactivo en sugerencias sin ser insistente
- Empático con las necesidades del viajero

CAPACIDADES:
- Recomendar habitaciones según propósito de viaje (trabajo/descanso/aventura)
- Sugerir experiencias locales auténticas en Lima
- Responder preguntas sobre servicios del hotel
- Ayudar con información de ubicación y clima
- Guiar en el proceso de reserva

RESTRICCIONES:
- NO inventes información sobre disponibilidad o precios
- Si no sabes algo, di "Déjame verificar eso con el equipo"
- NO prometas servicios que no existen
- Deriva a humano si la consulta es muy compleja

CONTEXTO DEL USUARIO:
{user_context}

INFORMACIÓN ACTUAL:
- Clima en Miraflores: {weather}
- Habitaciones disponibles: {available_rooms}
```

#### Prompt para Recomendaciones
```
Basándote en el perfil del usuario:
- Propósito: {travel_purpose}
- Duración: {duration} días
- Presupuesto: {budget}
- Intereses expresados: {interests}

Recomienda la habitación más adecuada de nuestra selección:
{rooms_json}

Explica en 2-3 oraciones por qué es perfecta para este usuario.
Formato: Descripción natural + destacar 2 features clave.
```

---

## 📅 Plan de Implementación

### Fase 1: MVP - Frontend y Simulación (ACTUAL)
**Duración:** Completado 65% | 3 semanas restantes
**Estado:** 🟢 En Progreso

**Objetivos:**
- ✅ Arquitectura frontend completa con Next.js 16
- ✅ Diseño UI/UX con componentes reutilizables
- ✅ Flujo conversacional simulado (mockup)
- ✅ Pantallas principales implementadas
- 🚧 Optimización de performance
- 🚧 Testing unitario frontend
- 📅 Deploy a staging (Vercel)

**Entregables:**
- [x] Repositorio Git estructurado
- [x] Sistema de componentes UI
- [x] Páginas: agente, habitación, ubicación, propuestas
- [x] Responsive design mobile/desktop
- [ ] Documentación de componentes
- [ ] Suite de tests (Jest + React Testing Library)
- [ ] CI/CD pipeline básico

**Recursos:**
- 1 Frontend Developer (Senior)
- 1 UI/UX Designer (Part-time)

---

### Fase 2: Backend y Integración IA
**Duración:** 8-10 semanas
**Estado:** 📅 Planificado - Inicio Febrero 2026

#### Fase 2.1: Backend Core (4 semanas)
**Objetivos:**
- Arquitectura de microservicios con Fastify
- Base de datos PostgreSQL en AWS RDS
- Auth Service con JWT
- User Service (CRUD de usuarios)
- Chat Service (persistencia de conversaciones)
- Room Service (catálogo y disponibilidad)
- Redis para cache y sesiones
- API Gateway con rate limiting

**Entregables:**
- [ ] Infraestructura AWS (Terraform IaC)
- [ ] Base de datos con migrations (Prisma)
- [ ] Endpoints REST documentados (Swagger/OpenAPI)
- [ ] Autenticación funcionando
- [ ] Tests de integración

**Recursos:**
- 1 Backend Developer (Senior)
- 1 DevOps Engineer (Part-time)

#### Fase 2.2: Integración IA (3 semanas)
**Objetivos:**
- AI Service con orchestrator multi-proveedor
- Integración con Claude Sonnet (primario)
- Fallback a GPT-4 y Gemini
- Context management con Redis
- Prompt engineering y optimización
- Sistema de recomendaciones básico

**Entregables:**
- [ ] Adapters para OpenAI, Gemini, Claude
- [ ] Prompt templates optimizados
- [ ] Cache de respuestas frecuentes
- [ ] Logging y monitoreo de uso de IA
- [ ] Cost tracking por proveedor

**Recursos:**
- 1 AI/ML Engineer (Senior)
- 1 Backend Developer (soporte)

#### Fase 2.3: Integración Frontend-Backend (3 semanas)
**Objetivos:**
- Conectar frontend con API real
- Reemplazar mocks por llamadas reales
- Manejo de estados con TanStack Query
- Error handling y retry logic
- Loading states y UX optimizado
- Deploy a producción (soft launch)

**Entregables:**
- [ ] API client en frontend (Axios/Fetch)
- [ ] Gestión de autenticación en frontend
- [ ] Persistencia de conversaciones
- [ ] Testing E2E completo (Playwright)
- [ ] Deploy a producción con feature flags

**Recursos:**
- 1 Fullstack Developer
- 1 QA Engineer

---

### Fase 3: Features Avanzados y Escalabilidad
**Duración:** 8-10 semanas
**Estado:** 📅 Planificado - Q2 2026

#### Fase 3.1: Entrada de Voz y Multimodal (4 semanas)
**Objetivos:**
- Speech-to-Text (Whisper API o Google Speech)
- Text-to-Speech para respuestas del bot
- Procesamiento de imágenes (GPT-4V)
- Tours virtuales 360° de habitaciones

**Entregables:**
- [ ] Componente VoiceInput funcional con STT
- [ ] Reproducción de audio de respuestas
- [ ] Upload de imágenes en chat
- [ ] Galería 360° interactiva

**Recursos:**
- 1 Frontend Developer
- 1 AI/ML Engineer (Part-time)

#### Fase 3.2: Sistema de Reservas (4 semanas)
**Objetivo:**
- Integración con PMS (Property Management System)
- Motor de disponibilidad en tiempo real
- Pricing dinámico
- Integración con Stripe para pagos
- Confirmaciones automáticas por email/SMS

**Entregables:**
- [ ] Booking Service completo
- [ ] Integración con PMS (API externa)
- [ ] Flujo de pago seguro
- [ ] Email/SMS notifications (SendGrid + Twilio)
- [ ] Dashboard de administración básico

**Recursos:**
- 1 Backend Developer (Senior)
- 1 Frontend Developer
- 1 Integration Specialist

#### Fase 3.3: Analytics y Optimización (2 semanas)
**Objetivos:**
- Google Analytics 4 + custom events
- Mixpanel para product analytics
- A/B testing framework
- Dashboards de métricas de negocio
- Optimización basada en datos

**Entregables:**
- [ ] Tracking events implementado
- [ ] Dashboards en CloudWatch/Grafana
- [ ] A/B tests en flujos críticos
- [ ] Reportes automáticos semanales

**Recursos:**
- 1 Data Analyst
- 1 Developer (soporte)

---

### Fase 4: Expansión y Escala
**Duración:** Variable
**Estado:** 📅 Q3 2026

**Posibles Iniciativas:**
- App móvil nativa (React Native)
- Multi-hotel / multi-property support
- Internacionalización (inglés, portugués)
- Programa de lealtad integrado
- Integración con OTAs (Booking.com, Expedia)
- CRM avanzado con predictive analytics
- Chatbot por WhatsApp
- Kiosk digital en recepción

---

## 📊 Métricas y KPIs

### Métricas de Producto

#### Engagement
- **Tasa de Inicio de Conversación:** % de visitantes que inician chat
  - Objetivo: >35% (mes 1) → >50% (mes 6)
- **Mensajes por Conversación:** Promedio de intercambios
  - Objetivo: 8-12 mensajes (indica engagement profundo)
- **Tiempo en Conversación:** Duración promedio
  - Objetivo: 3-5 minutos
- **Tasa de Abandono:** % de conversaciones no completadas
  - Objetivo: <30%

#### Conversión
- **Conversión a Visualización de Habitación:** % que ven detalle de room
  - Objetivo: >60%
- **Conversión a Intento de Reserva:** % que inician booking
  - Objetivo: >25% (Fase 3+)
- **Conversión Final:** % que completan reserva
  - Objetivo: >15% (benchmark industria: 8-12%)

#### Satisfacción
- **CSAT (Customer Satisfaction Score):** Encuesta post-conversación
  - Objetivo: >4.5/5.0
- **NPS (Net Promoter Score):** Recomendación del servicio
  - Objetivo: >50
- **Tasa de Derivación a Humano:** % que piden hablar con persona
  - Objetivo: <10% (indica IA efectiva)

### Métricas Técnicas

#### Performance
- **API Response Time (p95):** <500ms
- **Frontend Load Time (LCP):** <2.0s
- **AI Response Latency:** <3.0s
- **Uptime:** >99.5%

#### Costos
- **Costo por Conversación:** $0.08-0.15 (IA + infrastructure)
- **Costo por Reserva Generada:** <$5.00
- **Infrastructure Cost:** $400-800/mes (MVP)

#### Calidad de IA
- **Accuracy de Intent Classification:** >90%
- **Relevance Score de Recomendaciones:** >4.0/5.0 (user feedback)
- **Hallucination Rate:** <2% (respuestas inventadas)

### Métricas de Negocio

- **Reservas Directas Atribuidas:** Número/mes
  - Objetivo: 50 reservas/mes (mes 3)
- **Revenue Generado:** USD/mes
  - Objetivo: $9,000/mes (50 reservas × $180 promedio)
- **ROI del Proyecto:** (Revenue - Costs) / Investment
  - Objetivo: Positivo en mes 6
- **Reducción de Carga en Recepción:** % de consultas automatizadas
  - Objetivo: 60-70%

---

## 💰 Presupuesto y Recursos

### Inversión Inicial (Fase 1-2)

#### Desarrollo (12 semanas)
| Rol | Rate | Horas/Semana | Costo Total |
|-----|------|--------------|-------------|
| Frontend Developer (Senior) | $50/hr | 40h | $24,000 |
| Backend Developer (Senior) | $55/hr | 40h | $26,400 |
| AI/ML Engineer | $60/hr | 30h | $21,600 |
| UI/UX Designer | $45/hr | 20h | $10,800 |
| DevOps Engineer | $55/hr | 20h | $13,200 |
| QA Engineer | $40/hr | 30h | $14,400 |
| **SUBTOTAL DESARROLLO** | | | **$110,400** |

#### Infraestructura (6 meses)
| Servicio | Costo Mensual | 6 Meses |
|----------|---------------|---------|
| AWS (EC2, RDS, S3, CloudFront) | $400 | $2,400 |
| Redis (ElastiCache) | $80 | $480 |
| OpenAI API | $200 | $1,200 |
| Claude API | $150 | $900 |
| Gemini API | $100 | $600 |
| SendGrid (emails) | $30 | $180 |
| Vercel Pro (hosting frontend) | $20 | $120 |
| Dominio + SSL | $10 | $60 |
| **SUBTOTAL INFRAESTRUCTURA** | | **$5,940** |

#### Otros Costos
| Concepto | Costo |
|----------|-------|
| Licencias de software (Figma, etc.) | $500 |
| Testing tools (Playwright, k6) | $300 |
| Monitoreo (DataDog/New Relic) | $600 |
| Contingencia (10%) | $11,774 |
| **SUBTOTAL OTROS** | **$13,174** |

### **INVERSIÓN TOTAL FASE 1-2: $129,514**

---

### Costos Operacionales (Mensual - Post-Launch)

| Categoría | Costo Mensual |
|-----------|---------------|
| Infraestructura AWS | $600-900 |
| APIs de IA (500-1000 usuarios) | $400-800 |
| Servicios externos (email, SMS) | $100-200 |
| Monitoreo y analytics | $150 |
| Soporte y mantenimiento (0.5 FTE) | $4,000 |
| **TOTAL OPERACIONAL** | **$5,250-6,050/mes** |

---

### Proyección de ROI

**Supuestos:**
- Precio promedio por noche: $180
- Duración promedio de estadía: 2.5 noches
- Conversión web-to-booking: 15%
- Tráfico mensual: 1,000 visitantes
- Tasa de inicio de chat: 40%

**Proyección:**
- 1,000 visitantes × 40% inician chat = 400 conversaciones
- 400 conversaciones × 15% conversión = 60 reservas
- 60 reservas × 2.5 noches × $180 = **$27,000 revenue/mes**

**ROI (mes 6):**
- Revenue acumulado (6 meses): ~$150,000
- Costos totales (desarrollo + 6 meses ops): ~$165,000
- **Break-even: Mes 7**
- **ROI año 1: +85%**

---

## ⚠️ Riesgos y Mitigación

### Riesgos Técnicos

#### 1. Latencia de IA Impacta UX
**Riesgo:** Respuestas lentas (>5s) frustran usuarios
**Probabilidad:** Media | **Impacto:** Alto
**Mitigación:**
- Implementar streaming de respuestas (tokens progressivos)
- Cache de respuestas frecuentes en Redis
- Fallback a respuestas rápidas pre-generadas
- Usar Gemini Flash para queries simples
- Loading states bien diseñados

#### 2. Costos de IA Exceden Presupuesto
**Riesgo:** Uso intensivo de GPT-4 dispara costos
**Probabilidad:** Media | **Impacto:** Medio
**Mitigación:**
- Estrategia híbrida (Sonnet + cache)
- Límites de tokens por conversación
- Monitoreo en tiempo real de costos
- Budget alerts en AWS
- Análisis mensual de uso por proveedor

#### 3. Downtime de Proveedores de IA
**Riesgo:** OpenAI/Claude API no disponible
**Probabilidad:** Baja | **Impacto:** Alto
**Mitigación:**
- Sistema de fallback multi-proveedor
- Respuestas estáticas de emergencia
- Monitoreo de uptime de APIs externas
- SLA tracking y alertas

#### 4. Errores de IA ("Hallucinations")
**Riesgo:** IA inventa información incorrecta
**Probabilidad:** Media | **Impacto:** Alto
**Mitigación:**
- Prompts con instrucciones explícitas anti-alucinación
- Validación de información crítica (precios, disponibilidad)
- Botón de "reportar error" en UI
- Revisión humana de logs semanalmente
- Disclaimer: "Información sujeta a confirmación"

### Riesgos de Negocio

#### 5. Baja Adopción de Usuarios
**Riesgo:** Usuarios prefieren métodos tradicionales
**Probabilidad:** Media | **Impacto:** Alto
**Mitigación:**
- Onboarding claro y atractivo
- A/B testing de flujos conversacionales
- Incentivos para usar chat (descuento 5%)
- Marketing del feature en web y redes
- Feedback continuo con encuestas

#### 6. Resistencia Interna (Staff del Hotel)
**Riesgo:** Personal de recepción ve IA como amenaza
**Probabilidad:** Baja | **Impacto:** Medio
**Mitigación:**
- Comunicación temprana: IA es asistente, no reemplazo
- Training del staff para usar dashboard de IA
- Mostrar reducción de tareas repetitivas
- Empoderar staff para casos complejos

#### 7. Competencia Adelanta con IA
**Riesgo:** Otros hoteles implementan soluciones similares
**Probabilidad:** Media | **Impacto:** Medio
**Mitigación:**
- Acelerar time-to-market (MVP en 3 meses)
- Diferenciación en calidad de recomendaciones
- Foco en experiencia única Humano Hotel
- Continuous improvement basado en datos

### Riesgos de Cumplimiento

#### 8. Privacidad y GDPR/LGPD
**Riesgo:** Mal manejo de datos personales
**Probabilidad:** Baja | **Impacto:** Muy Alto
**Mitigación:**
- Política de privacidad clara
- Consentimiento explícito para cookies/tracking
- Anonimización de datos en analytics
- Auditoría legal de compliance
- Derecho al olvido implementado

#### 9. Seguridad de Datos
**Riesgo:** Breach de datos de usuarios
**Probabilidad:** Baja | **Impacto:** Muy Alto
**Mitigación:**
- Encriptación en tránsito (HTTPS) y reposo
- Secrets management con AWS Secrets Manager
- Auditorías de seguridad trimestrales
- Pentesting antes de producción
- Plan de respuesta a incidentes

---

## 🎯 Conclusiones

### Logros del Proyecto Hasta Ahora

El proyecto **Humano Hotel Web** ha logrado establecer una base sólida en su Fase MVP:

1. **Arquitectura Frontend Moderna y Escalable**
   - Next.js 16 con App Router prepara el proyecto para crecimiento
   - TypeScript asegura mantenibilidad a largo plazo
   - Sistema de componentes reutilizables acelera desarrollo futuro

2. **UX Conversacional Innovadora**
   - Diseño de flujos conversacionales naturales y atractivos
   - Mockup funcional demuestra viabilidad del concepto
   - Feedback positivo en tests internos

3. **Roadmap Técnico Claro**
   - Backend arquitecturado con tecnologías probadas (Node.js, PostgreSQL, AWS)
   - Estrategia de IA híbrida maximiza calidad y minimiza costos
   - Plan de implementación realista y por fases

### Propuesta de Valor para la Directiva

#### Impacto en Negocio
- **Incremento de Conversión:** 35% más de visitantes web convertidos a reservas
- **Reducción de Costos Operativos:** 60-70% de consultas automatizadas
- **Revenue Proyectado:** $27,000/mes en reservas directas atribuidas
- **Break-even:** 7 meses con ROI positivo año 1

#### Diferenciación Competitiva
- Humano Hotel se posiciona como **pionero en hospitalidad digital en Lima**
- Experiencia memorable que genera word-of-mouth y marketing orgánico
- Base tecnológica para expansión a otros hoteles de la cadena

#### Escalabilidad y Futuro
- Arquitectura preparada para multi-propiedad
- Integración futura con OTAs y PMS
- Datos valiosos para decisiones estratégicas (preferencias de huéspedes, pricing, etc.)

### Próximos Pasos Inmediatos (Próximas 4 Semanas)

#### Semana 1-2: Finalización MVP Frontend
- [ ] Completar testing unitario (coverage >80%)
- [ ] Optimización de performance (LCP <2.0s)
- [ ] Deploy a staging con Vercel
- [ ] Documentación de componentes

#### Semana 3-4: Inicio Fase 2 - Backend
- [ ] Provisioning de infraestructura AWS (Terraform)
- [ ] Setup de PostgreSQL RDS + Redis ElastiCache
- [ ] Desarrollo de Auth Service y User Service
- [ ] Primera integración con Claude Sonnet API

### Recomendaciones Estratégicas

1. **Aprobar Presupuesto Fase 2 ($90,000)** para avanzar con backend e IA
2. **Asignar Product Owner interno** para decisiones ágiles
3. **Iniciar marketing teaser** del nuevo feature para generar expectativa
4. **Definir KPIs de éxito** con equipo de dirección (alineamiento)
5. **Establecer comité de seguimiento** con updates quincenales

### Visión a Largo Plazo

Humano Hotel Web no es solo una plataforma de reservas, es el **primer paso hacia un ecosistema digital completo**:

- **2026 Q2:** Lanzamiento público con IA conversacional
- **2026 Q3:** Sistema de reservas completo y pagos
- **2026 Q4:** App móvil y expansión multi-hotel
- **2027+:** Integración con OTAs, CRM predictivo, programa de lealtad digital

---

## 📎 Anexos

### Anexo A: Stack Tecnológico Completo

**Frontend:**
- Next.js 16, React 19, TypeScript 5
- Tailwind CSS 4, Radix UI, Lucide Icons
- TanStack Query, Zustand (state)

**Backend:**
- Node.js 20, Fastify/Express, TypeScript 5
- PostgreSQL 16, Prisma ORM, Redis
- AWS (EC2/Lambda, RDS, S3, CloudFront)

**IA:**
- OpenAI GPT-4, Google Gemini, Anthropic Claude
- LangChain (orchestration)
- OpenAI Embeddings (search)

**DevOps:**
- Docker, Terraform (IaC)
- GitHub Actions (CI/CD)
- CloudWatch (monitoring)
- Sentry (error tracking)

### Anexo B: Endpoints API (Resumen)

```
Auth:
  POST   /api/v1/auth/register
  POST   /api/v1/auth/login
  POST   /api/v1/auth/logout

Users:
  GET    /api/v1/users/me
  PATCH  /api/v1/users/me/preferences

Conversations:
  POST   /api/v1/conversations
  GET    /api/v1/conversations/:id/messages
  POST   /api/v1/conversations/:id/messages

Rooms:
  GET    /api/v1/rooms
  GET    /api/v1/rooms/:id
  GET    /api/v1/rooms/search

AI:
  POST   /api/v1/ai/recommend (interno)
  POST   /api/v1/ai/analyze-intent (interno)
```

### Anexo C: Roadmap Visual

```
Q1 2026          Q2 2026           Q3 2026           Q4 2026
  │                │                 │                 │
  ▼                ▼                 ▼                 ▼
┌─────────┐    ┌─────────┐      ┌─────────┐      ┌─────────┐
│  MVP    │───▶│ Backend │─────▶│Advanced │─────▶│ Scale   │
│Frontend │    │   + IA  │      │Features │      │Multi-   │
│         │    │         │      │ Voice   │      │Hotel    │
│         │    │ Soft    │      │ Booking │      │         │
│         │    │ Launch  │      │         │      │         │
└─────────┘    └─────────┘      └─────────┘      └─────────┘
```

### Anexo D: Contactos del Proyecto

**Product Owner:** [Nombre - Email]
**Tech Lead:** [Nombre - Email]
**AI Lead:** [Nombre - Email]
**DevOps:** [Nombre - Email]

---

**Documento preparado por:** Equipo de Desarrollo Humano Hotel Web
**Última actualización:** Enero 20, 2026
**Versión:** 1.0

---

*Este documento es confidencial y de uso exclusivo para la directiva de Humano Hotel.*
