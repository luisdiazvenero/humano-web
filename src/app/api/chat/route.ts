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
- Amenidades: WiFi rápido, desayuno buffet, gym, piscina, spa, room service 24h
- Cercanías: Larcomar, parques, restaurantes, museos, playas

TUS OBJETIVOS:
1. Identificar el perfil del usuario (Trabajo, Descanso o Aventura).
2. Si no sabes cuántos son, pregunta (Solo, Pareja o Grupo).
3. Ofrecer información específica del hotel que sea relevante para su perfil.
4. Siempre intentar cerrar con un CTA (Consultar disponibilidad, Ver habitaciones, etc).

TIPOS DE VIAJEROS:
1. Trabajo: Prioriza Wifi, coworking y cercanía a centros de negocios.
2. Descanso: Prioriza Spa, vistas al mar y tranquilidad.
3. Aventura: Prioriza actividades locales, surf y tours.

PRECIOS APROXIMADOS:
- Superior King: $120/noche
- Deluxe King: $150/noche
- Junior Suite: $200/noche
- Signature Suite: $280/noche

ESTRATEGIA DE RESPUESTA:
- Si el usuario te cuenta un plan muy específico, adapta tu recomendación.
- Si el usuario es vago, intenta guiarlo hacia uno de los perfiles.
- Usa un lenguaje cálido y acogedor.

IMPORTANTE:
- Responde en español (claro y neutro).
- Máximo 3 oraciones.
- No inventes servicios que no están en la lista.
`

export async function POST(request: NextRequest) {
    try {
        const { messages, caracteristica, grupo } = await request.json()

        // Construir contexto dinámico
        const contextMessages: any[] = [
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

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: contextMessages,
            temperature: 0.7,
            max_tokens: 350,
            stream: true,
        })

        // Create a ReadableStream for Next.js
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder()
                try {
                    for await (const chunk of response) {
                        const text = chunk.choices[0]?.delta?.content || ""
                        if (text) {
                            controller.enqueue(encoder.encode(text))
                        }
                    }
                } catch (err) {
                    controller.error(err)
                } finally {
                    controller.close()
                }
            },
        })

        return new Response(stream)

    } catch (error: any) {
        console.error('Error OpenAI:', error)
        return NextResponse.json(
            { error: 'Error al procesar mensaje' },
            { status: 500 }
        )
    }
}
