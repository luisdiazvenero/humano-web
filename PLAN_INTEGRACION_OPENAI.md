# Plan de Integración OpenAI para Chatbot Humano Hotel

## Resumen
Convertir el demo actual de flujo predefinido a un chatbot con IA real usando OpenAI GPT-4.

---

## 1. Configuración Inicial

### Instalación de Dependencias
```bash
npm install openai
```

### Variables de Entorno
Crear archivo `.env.local`:
```env
OPENAI_API_KEY=tu_clave_api_aqui
```

---

## 2. Arquitectura Propuesta

### Opción A: API Route (Recomendada para producción)
```
Cliente → Next.js API Route → OpenAI → Respuesta
```

**Ventajas:**
- Clave API segura (server-side)
- Control de rate limiting
- Logging centralizado

### Opción B: Cliente directo (Solo desarrollo)
```
Cliente → OpenAI API
```

**Desventajas:**
- Expone API key
- Sin control de costos

---

## 3. Implementación Paso a Paso

### Paso 1: Crear API Route
**Archivo:** `/src/app/api/chat/route.ts`

```typescript
import { OpenAI } from 'openai'
import { NextRequest, NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Contexto del hotel
const SYSTEM_PROMPT = `Eres el asistente virtual del Hotel Humano en Miraflores, Lima, Perú.

INFORMACIÓN DEL HOTEL:
- Ubicación: Corazón de Miraflores, a pasos del malecón y el Pacífico
- Servicios: Habitaciones Superior King, Deluxe King, Junior Suite, Signature Suite
- Transfer aeropuerto: $30 USD
- Amenidades: WiFi, desayuno buffet, gym, piscina, spa, room service 24h
- Cercanías: Larcomar, parques, restaurantes, museos

TIPOS DE VIAJEROS:
1. Trabajo (solo/pareja/grupo): Wifi rápido, escritorios, salas de reuniones
2. Descanso (solo/pareja/grupo): Relax, spa, vistas al mar
3. Aventura (solo/pareja/grupo): Actividades, surf, parapente, tours

TONO: Amigable, profesional, conciso. Usa emojis ocasionalmente.

FLUJO:
1. Identifica: ¿Trabajo, descanso o aventura?
2. Pregunta: ¿Solo, pareja o grupo?
3. Ofrece opciones personalizadas
4. Sugiere CTAs: Ver habitaciones, Transfer, Contacto, Reservar

IMPORTANTE:
- Responde en español
- Menciona precios cuando sea relevante
- Sugiere siempre próximos pasos
- Máximo 3-4 oraciones por respuesta
`

export async function POST(request: NextRequest) {
  try {
    const { messages, caracteristica, grupo } = await request.json()

    // Construir contexto dinámico
    const contextMessages = [
      { role: 'system', content: SYSTEM_PROMPT }
    ]

    // Agregar contexto del usuario si existe
    if (caracteristica && grupo) {
      contextMessages.push({
        role: 'system',
        content: `El usuario viene por ${caracteristica} y viaja ${grupo}.`
      })
    }

    // Agregar historial de conversación
    contextMessages.push(...messages)

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // o 'gpt-3.5-turbo' para más económico
      messages: contextMessages,
      temperature: 0.7,
      max_tokens: 250,
    })

    const response = completion.choices[0].message.content

    return NextResponse.json({
      response,
      usage: completion.usage // Para tracking de costos
    })

  } catch (error: any) {
    console.error('Error OpenAI:', error)
    return NextResponse.json(
      { error: 'Error al procesar mensaje' },
      { status: 500 }
    )
  }
}
```

---

### Paso 2: Actualizar `/src/app/demo/page.tsx`

**Cambios principales:**

```typescript
// Estado para historial de chat
const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([])
const [isAIResponding, setIsAIResponding] = useState(false)

// Nueva función para enviar mensaje a OpenAI
const sendMessageToAI = async (userMessage: string) => {
  setIsAIResponding(true)

  // Agregar mensaje del usuario al historial
  const newHistory = [
    ...chatHistory,
    { role: 'user', content: userMessage }
  ]
  setChatHistory(newHistory)

  // Agregar mensaje del usuario a la UI
  setMessages(prev => [...prev, {
    id: Date.now(),
    sender: 'user',
    type: 'text',
    content: userMessage
  }])

  try {
    // Llamar a la API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: newHistory,
        caracteristica: selectedCaracteristica,
        grupo: selectedGrupo
      })
    })

    const data = await response.json()

    // Agregar respuesta al historial
    setChatHistory([
      ...newHistory,
      { role: 'assistant', content: data.response }
    ])

    // Mostrar respuesta en UI
    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      sender: 'agent',
      type: 'text',
      content: data.response
    }])

    // Generar sugerencias basadas en la respuesta
    generateSuggestions(data.response)

  } catch (error) {
    console.error('Error:', error)
    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      sender: 'agent',
      type: 'text',
      content: 'Disculpa, hubo un error. ¿Puedes intentar de nuevo?'
    }])
  } finally {
    setIsAIResponding(false)
  }
}

// Función para generar sugerencias automáticas
const generateSuggestions = (aiResponse: string) => {
  // Análisis simple de palabras clave en la respuesta
  const response = aiResponse.toLowerCase()
  const suggestions = []

  if (response.includes('habitación') || response.includes('suite')) {
    suggestions.push('Ver habitaciones')
  }
  if (response.includes('transfer') || response.includes('aeropuerto')) {
    suggestions.push('Transfer aeropuerto')
  }
  if (response.includes('reserva')) {
    suggestions.push('Hacer reserva')
  }
  if (response.includes('precio') || response.includes('tarifa')) {
    suggestions.push('Ver tarifas')
  }

  // Agregar sugerencias genéricas si hay pocas
  if (suggestions.length < 2) {
    suggestions.push('Hablar con asesor', 'Ver más opciones')
  }

  // Mostrar sugerencias
  if (suggestions.length > 0) {
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 2,
        sender: 'agent',
        type: 'suggestions',
        content: suggestions.slice(0, 3) // Max 3 sugerencias
      }])
    }, 500)
  }
}

// Actualizar handleSendMessage
const handleSendMessage = () => {
  const messageText = userInput || transcript
  if (!messageText.trim() || isAIResponding) return

  setUserInput("")
  sendMessageToAI(messageText)
}
```

---

## 4. Mejoras Avanzadas

### A. Function Calling (Acciones Estructuradas)
Permitir que GPT ejecute acciones específicas:

```typescript
const tools = [
  {
    type: "function",
    function: {
      name: "buscar_habitacion",
      description: "Busca habitaciones disponibles",
      parameters: {
        type: "object",
        properties: {
          tipo_habitacion: {
            type: "string",
            enum: ["Superior King", "Deluxe King", "Junior Suite"]
          },
          num_personas: { type: "number" },
          fecha_checkin: { type: "string", format: "date" }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "solicitar_transfer",
      description: "Solicita transfer desde aeropuerto",
      parameters: {
        type: "object",
        properties: {
          fecha_llegada: { type: "string" },
          hora_llegada: { type: "string" },
          num_pasajeros: { type: "number" }
        }
      }
    }
  }
]

// En la llamada a OpenAI:
const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: contextMessages,
  tools: tools,
  tool_choice: "auto"
})

// Manejar tool calls
if (completion.choices[0].message.tool_calls) {
  const toolCall = completion.choices[0].message.tool_calls[0]

  if (toolCall.function.name === 'buscar_habitacion') {
    const params = JSON.parse(toolCall.function.arguments)
    // Llamar a API de reservas real
    const habitaciones = await buscarHabitacionesDisponibles(params)
    // Retornar a GPT
  }
}
```

### B. Streaming de Respuestas
Para respuestas en tiempo real:

```typescript
const stream = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: contextMessages,
  stream: true,
})

let fullResponse = ''
for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || ''
  fullResponse += content

  // Actualizar UI en tiempo real
  updateMessageInRealTime(content)
}
```

### C. Embeddings para Búsqueda Semántica
Buscar información en FAQs del hotel:

```typescript
// 1. Crear embeddings de FAQs (una vez)
const faqs = [
  "¿Cuál es el horario de check-in? 15:00 hrs",
  "¿Tienen desayuno incluido? Sí, buffet de 7-11am",
  // ...más FAQs
]

const embeddings = await Promise.all(
  faqs.map(faq => openai.embeddings.create({
    model: "text-embedding-3-small",
    input: faq
  }))
)

// 2. Buscar FAQ relevante
const userEmbedding = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: userMessage
})

const similarity = calculateCosineSimilarity(userEmbedding, embeddings)
const relevantFAQs = getTopK(similarity, 3)

// 3. Agregar al contexto
contextMessages.push({
  role: 'system',
  content: `FAQs relevantes: ${relevantFAQs.join('\n')}`
})
```

---

## 5. Gestión de Costos

### Estimación de Costos (GPT-4o)
- Input: $2.50 / 1M tokens
- Output: $10.00 / 1M tokens

**Ejemplo:**
- Conversación promedio: ~500 tokens (input + output)
- Costo por conversación: ~$0.006 (menos de 1 centavo)
- 1000 conversaciones/mes: ~$6 USD

### Alternativas Económicas
1. **GPT-3.5-turbo**: 10x más barato (~$0.0006/conversación)
2. **Claude 3 Haiku**: Similar a GPT-3.5
3. **Mixtral/LLaMA local**: Gratis pero requiere infraestructura

### Rate Limiting
```typescript
// En API Route
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 req/min
})

const { success } = await ratelimit.limit(userId)
if (!success) {
  return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
}
```

---

## 6. Testing

### Casos de Prueba
1. **Flujo básico:**
   - "Hola" → Saludo + opciones
   - "Busco habitación para 2 personas" → Pregunta fechas
   - "Del 15 al 20 de febrero" → Muestra opciones

2. **Intenciones específicas:**
   - "¿Cuánto cuesta el transfer?" → $30 USD
   - "Tienen wifi?" → Sí, incluido
   - "Horario de check-in" → 15:00 hrs

3. **Edge cases:**
   - Mensajes muy largos
   - Idioma inglés
   - Preguntas fuera de contexto

---

## 7. Monitoreo

### Métricas Clave
- Tiempo de respuesta promedio
- Tokens usados por conversación
- Tasa de satisfacción (thumbs up/down)
- Conversiones (reservas generadas)

### Herramientas
- **Langfuse**: Analytics para LLMs
- **Helicone**: Observability y caching
- **Vercel Analytics**: Performance general

---

## 8. Roadmap de Implementación

### Semana 1: MVP
- ✅ API Route básica
- ✅ Integración en /demo
- ✅ Manejo de errores

### Semana 2: Refinamiento
- ✅ Function calling para reservas
- ✅ Sugerencias inteligentes
- ✅ Rate limiting

### Semana 3: Optimización
- ✅ Caching de respuestas comunes
- ✅ A/B testing de prompts
- ✅ Analytics

### Semana 4: Producción
- ✅ Testing QA
- ✅ Documentación
- ✅ Deploy

---

## 9. Código de Inicio Rápido

### Quick Start (5 minutos)
```bash
# 1. Instalar
npm install openai

# 2. Configurar
echo "OPENAI_API_KEY=tu_clave" > .env.local

# 3. Crear API route (copiar código del Paso 1)

# 4. Actualizar demo/page.tsx (copiar código del Paso 2)

# 5. Probar
npm run dev
```

---

## 10. Recursos

### Documentación
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)

### Ejemplos
- [Next.js + OpenAI Example](https://github.com/vercel/ai)
- [Chatbot Template](https://vercel.com/templates/next.js/openai-chatgpt)

---

**¿Preguntas?** Contacta al equipo de desarrollo.
