# Changelog

## 2026-02-11

### Added
- Documento operativo `doc/conserje-policy-contract.md` con contrato de decisión por turno y reglas de conversación.
- Campo `decision` en respuestas de `/api/conserje`:
  - `mode` (`inform|clarify|redirect_reservation|escalate_human|show_menu`)
  - `reason`
  - `required_slots`

### Changed
- Política de reserva en backend y frontend:
  - redirección suave a Marriott para intención de reserva/disponibilidad/precio.
  - fallback de CTA de reserva apunta a Marriott (no búsqueda genérica).
- CTA de coordinación sin `redirigir` explícito ahora abre `mailto` a `recepcion@humanohoteles.com` con borrador.
- Integración de `generateFollowupReply` en seguimientos cortos con contexto activo para reducir loops.
- Ajuste de copy para reducir tono comercial agresivo.

### Fixed
- Respuestas duplicadas en seguimientos cortos (dedupe en UI para evitar repetir último mensaje del asistente).
- Escalamiento humano centralizado para consultas sensibles.

## 2026-02-07

### Changed
- Iconografía del onboarding y menús (Servicios, Instalaciones, Recomendaciones).
- Iconos específicos para servicios (room service, Wi‑Fi, concierge).
- Listado de habitaciones muestra todas las opciones para perfiles no grupales.

## 2026-02-06

### Added
- Conserje basado en Excel con API `/api/conserje` y UI `/conserje`.
- Script `scripts/excel-to-conserje-json.py` para convertir `SOURCE OF TRUTH.xlsx` a `src/data/conserje.json`.
- Lógica de recuperación semántica + validación de reglas desde Excel.

### Changed
- Respuestas conversacionales más naturales con IA y validación factual.
- Flujo de conversación con contexto (fechas, personas, tamaños) y CTAs no intrusivos.
- Documentación consolidada en `README.md`.

### Fixed
- Falsos positivos en detección de fechas (ej. “Junior Suite”).
- Loops al responder cantidad de personas y restricciones por grupo.
- Respuestas repetidas en pet friendly y normalización de condiciones.
- Seguimiento de contexto en respuestas cortas (evita saltos entre servicios).
- Loop en recomendaciones al responder “sí/caminando/taxi”.
- Detección de preguntas por “?” y parseo robusto de JSON en enrutamiento LLM.
