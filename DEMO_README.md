# Demo Conversacional - Humano Hotel

## 📍 Ubicación de la Demo

La demo está disponible en: **`/demo`**

**URL local:** `http://localhost:3000/demo`

---

## 🎯 Propósito

Esta es una **demo independiente** que muestra cómo el asistente virtual de Humano Hotel adapta sus conversaciones según el perfil del huésped. Los datos provienen del archivo Excel `doc/microsite-faqs.xlsx`.

**Características:**
- ✅ 7 perfiles de usuario diferentes
- ✅ Conversaciones personalizadas por perfil
- ✅ Flujo conversacional interactivo
- ✅ UI/UX profesional con animaciones
- ✅ No integrado en navegación principal (demo aislada)

---

## 👥 Perfiles Disponibles

La demo incluye los siguientes perfiles de usuario:

### 1. **Trabajo Solo** 💼
Viajero de negocios individual
- Enfoque en productividad y ubicación estratégica
- Servicios como coworking, wifi rápido, escritorio

### 2. **Trabajo Pareja** 💼👥
Viajeros de negocios en pareja
- Combinación de trabajo y relax
- Habitaciones confortables para dos

### 3. **Descanso Pareja** 🌴👥
Pareja buscando relax y desconexión
- Experiencias románticas y tranquilas
- Habitaciones con amenidades premium

### 4. **Descanso Grupo** 🌴👨‍👩‍👧‍👦
Grupo de amigos o familia en modo relax
- Habitaciones comunicantes o cercanas
- Actividades grupales relajadas

### 5. **Aventura Solo** 🧭
Viajero aventurero explorando solo
- Rutas urbanas, deportes, gastronomía
- Base de operaciones para explorar Lima

### 6. **Aventura Pareja** 🧭👥
Pareja de aventureros explorando juntos
- Experiencias de adrenalina y cultura
- Actividades en tándem (parapente, surf, etc.)

### 7. **Aventura Grupo** 🧭👨‍👩‍👧‍👦
Grupo de aventureros explorando Lima
- Tours grupales, deportes extremos
- Coordinación de actividades para grupos

---

## 🗣️ Estructura de Conversaciones

Cada perfil tiene **6 conversaciones** estructuradas con:

### Elementos de cada conversación:
1. **Topic:** Tema principal (UBICACIÓN, HABITACIONES, etc.)
2. **Sub Tema:** Subtema específico (MIRAFLORES, DISEÑO/COMODIDAD, etc.)
3. **Intro:** Mensaje de introducción del agente
4. **Fase Categoría:** Categoría de la experiencia
5. **Título:** Título del contenido
6. **Contenido:** Descripción detallada
7. **Cierre:** Pregunta o llamado a acción del agente
8. **CTAs:** Botones de acción recomendados

### Ejemplo de flujo:
```
1. Agente: "Genial, estás aquí por trabajo entonces"
2. Header: "La experiencia Humano"
3. Card: "Ubicación privilegiada" + descripción
4. Agente: "Dime cuántos días vienes..."
5. CTAs: [Solo 24 horas] [3 días] [Restaurantes]
```

---

## 🎨 Experiencia de Usuario

### Pantalla Inicial
- **Selector de perfiles:** Grid con 7 tarjetas interactivas
- **Iconos visuales:** Cada perfil tiene emoji representativo
- **Descripción breve:** Tooltip explicativo por perfil

### Chat Conversacional
- **Header sticky:** Muestra perfil actual y botón para cambiar
- **Mensajes del agente:** Con avatar de Humano Hotel
- **Tarjetas de contenido:** Información estructurada y visual
- **CTAs interactivos:** Botones para avanzar en la conversación
- **Indicador de typing:** Tres puntos animados mientras "escribe"
- **Auto-scroll:** Se desplaza automáticamente a nuevo contenido
- **Contador de progreso:** Muestra conversación actual de total

### Animaciones
- ✨ Fade-in-up en mensajes nuevos
- 🎯 Hover effects en botones y tarjetas
- 💬 Typing indicator animado
- 🔄 Transiciones suaves entre estados

---

## 🛠️ Implementación Técnica

### Archivos Creados

#### 1. `/src/app/demo/page.tsx`
Componente principal de la demo con:
- Estado de perfil seleccionado
- Gestión de mensajes conversacionales
- Lógica de progresión de conversaciones
- Renderizado de diferentes tipos de mensajes
- UI responsive

#### 2. `/src/app/demo/conversations-data.ts`
Datos estructurados de conversaciones:
- Interface TypeScript para tipado fuerte
- Array de 7 perfiles con sus conversaciones
- Datos extraídos y procesados del Excel

### Tecnologías Utilizadas
- **Next.js 16** (App Router)
- **React 19** (Hooks: useState, useEffect, useRef)
- **TypeScript 5** (Tipado estricto)
- **Tailwind CSS 4** (Estilos utility-first)
- **Lucide React** (Iconos)

### Características del Código
- ✅ Type-safe con interfaces TypeScript
- ✅ Componente funcional con hooks
- ✅ Auto-scroll a nuevos mensajes
- ✅ Delays realistas con setTimeout
- ✅ Animaciones CSS personalizadas
- ✅ Responsive design
- ✅ Dark mode compatible

---

## 🚀 Cómo Usar la Demo

### 1. Iniciar el servidor de desarrollo
```bash
npm run dev
```

### 2. Abrir en navegador
```
http://localhost:3000/demo
```

### 3. Interactuar con la demo
1. **Selecciona un perfil** en la pantalla inicial
2. **Observa la conversación** automatizada
3. **Haz clic en los CTAs** para avanzar
4. **Cambia de perfil** con el botón "Cambiar perfil"

---

## 📊 Datos Fuente

### Archivo Excel: `doc/microsite-faqs.xlsx`

**Estructura del Excel:**
- **12 pestañas** en total
- **7 pestañas de perfiles** (procesadas en la demo)
- **3 pestañas "Conversación I/II/III"** (no procesadas, contenido adicional)
- **2 pestañas sin datos** (Trabajo Grupo, Descanso Solo)

**Procesamiento:**
- Extraído con Python (openpyxl-like parsing)
- Convertido a JSON estructurado
- Transformado a TypeScript con interfaces
- Optimizado para renderizado en React

---

## 🎯 Casos de Uso

### Para Presentaciones
- Mostrar capacidades conversacionales del asistente
- Demostrar personalización por perfil de usuario
- Visualizar flujos de conversación completos

### Para Testing UX
- Validar copy y mensajes con stakeholders
- Probar diferentes flows conversacionales
- Identificar mejoras en contenido

### Para Desarrollo
- Referencia de estructura de conversaciones
- Template para implementación con IA real
- Ejemplo de manejo de estado conversacional

---

## 📝 Notas Técnicas

### Estado Actual
- ✅ **Demo completamente funcional**
- ✅ **Todos los perfiles implementados**
- ✅ **UI/UX pulida y profesional**
- ✅ **Responsive mobile/desktop**
- ✅ **Compilación exitosa sin errores**

### Próximos Pasos (Opcional)
- [ ] Integrar con backend real
- [ ] Conectar con API de IA (OpenAI/Gemini/Claude)
- [ ] Agregar entrada de texto del usuario
- [ ] Implementar entrada de voz
- [ ] Persistir conversaciones en base de datos
- [ ] Analytics de interacciones

### Diferencias con Producción
Esta demo tiene datos **hardcoded** y conversaciones **pre-programadas**. En producción:
- Las respuestas serán generadas por IA en tiempo real
- El usuario podrá escribir libremente (no solo CTAs)
- Se guardarán las conversaciones en base de datos
- Habrá integración con sistema de reservas
- Se conectará con APIs de terceros (clima, mapas, etc.)

---

## 🎨 Personalización

### Colores
Los colores siguen la paleta de Humano Hotel definida en `globals.css`:
- **Primary:** `#FFC85D` (Amarillo)
- **Background:** `#003035` (Azul profundo) en dark mode
- **Card:** Tonos de crema/teal según theme

### Iconos de Perfiles
Puedes cambiar los emojis en `conversations-data.ts`:
```typescript
{
  name: "Trabajo Solo",
  icon: "💼",  // <-- Cambiar aquí
  description: "...",
  conversations: [...]
}
```

### Timing de Mensajes
Ajusta los delays en `page.tsx`:
```typescript
setTimeout(() => {
  // Mostrar mensaje
}, 1000)  // <-- Cambiar delay (milisegundos)
```

---

## 🐛 Troubleshooting

### La demo no carga
- Verificar que el servidor esté corriendo: `npm run dev`
- Verificar que no haya errores de compilación: `npm run build`
- Limpiar cache: `rm -rf .next && npm run dev`

### Conversaciones no avanzan
- Revisar console del navegador (F12)
- Verificar que los datos en `conversations-data.ts` tengan `intro` y `cierre`
- Comprobar que los CTAs tengan valores

### Estilos no se aplican
- Verificar que `globals.css` esté importado en `layout.tsx`
- Verificar que Tailwind esté configurado correctamente
- Hacer rebuild: `npm run build`

---

## 📧 Contacto

Para preguntas sobre la demo:
- **Archivo fuente:** `doc/microsite-faqs.xlsx`
- **Código demo:** `src/app/demo/`
- **Datos procesados:** `src/app/demo/conversations-data.ts`

---

**Creado:** Enero 2026
**Versión:** 1.0
**Status:** ✅ Demo Funcional y Lista para Presentación
