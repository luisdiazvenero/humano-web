# Changelog

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
