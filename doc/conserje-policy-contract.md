# Conserje Policy Contract

## 1) Objetivo
Definir el contrato operativo entre:
- marco conversacional (tono y reglas de negocio),
- fuente factual (Excel/JSON),
- motor técnico (`/api/conserje` + UI `/conserje`).

Prioridad de ejecución:
1. Política conversacional y comercial.
2. Validación factual del SoT.
3. Generación LLM.
4. Render y CTAs de UI.

## 2) Contrato de salida por turno
La API mantiene el mismo endpoint y añade `decision`:

```json
{
  "reply": "string",
  "suggestions": ["string"],
  "items": [],
  "menu": [],
  "intent": "string|null",
  "profile": "string|null",
  "tipo": "string|null",
  "activeItemId": "string|null",
  "decision": {
    "mode": "inform|clarify|redirect_reservation|escalate_human|show_menu",
    "reason": "string",
    "required_slots": ["dates", "guests"]
  }
}
```

Semántica de `decision.mode`:
- `inform`: respuesta suficiente para avanzar sin pedir nuevo dato.
- `clarify`: falta un dato y se hace una sola pregunta breve.
- `redirect_reservation`: intención de reserva/precio/disponibilidad con datos suficientes.
- `escalate_human`: caso sensible o no confirmable, se deriva a equipo humano.
- `show_menu`: se requiere selección de opción.

## 3) Política de reserva
- Nunca usar copy de urgencia comercial.
- Si hay intención de reserva/precio/disponibilidad/tarifa:
  - responder en tono suave,
  - redirigir a Marriott:
    - https://www.marriott.com/es/hotels/limtx-humano-lima-a-tribute-portfolio-hotel/rooms/
- No prometer disponibilidad en chat.

## 4) Política de escalamiento humano
Escalar a `recepcion@humanohoteles.com` cuando aplique:
- información no confirmada crítica,
- reclamos formales,
- temas financieros sensibles,
- modificación/cancelación de reserva,
- situaciones conflictivas.

Plantilla:
- "Para gestionarlo correctamente, prefiero que escribas directamente a nuestro equipo: recepcion@humanohoteles.com."

## 5) Política de follow-up
- Una sola pregunta por turno.
- No repetir la pregunta previa textual.
- No reabrir slot ya confirmado (`dates`, `guests`).
- Si hay contexto activo (`activeItemId`), responder en ese contexto salvo cambio explícito.

## 6) Política geográfica
- Priorizar: Hotel Humano → entorno inmediato → Miraflores.
- No ampliar a “todo Lima” salvo solicitud explícita.

## 7) Estilo de respuesta
- Tono anfitrión: cercano, curado, seguro sin arrogancia.
- Sin presión comercial.
- Longitud objetivo: 1–3 líneas.
- Orden recomendado:
  - factual breve,
  - microcapa humana,
  - siguiente paso suave (si aplica).

## 8) Casos de prueba mínimos
1. Wi‑Fi: "¿trabajo o streaming?" + respuesta libre no debe repetir loop.
2. Instalaciones con horario: validar preferencia contra rango horario real del item.
3. Reserva: con fechas+huéspedes confirmados, redirigir suave a Marriott.
4. Servicios por correo: abrir `mailto` con asunto/cuerpo prellenado.
5. Recomendaciones: "sí/caminando/taxi" no debe rebotar a la misma pregunta.
6. Escalamiento: tema sensible deriva a correo humano.

## 9) Notas de implementación
- El Excel sigue siendo la única fuente factual.
- El LLM decide redacción y seguimiento dentro del contexto validado por SoT.
- La UI consume `decision.mode` para controlar render de menú/CTA y evitar bucles.
