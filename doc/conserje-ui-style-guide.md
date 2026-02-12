# Conserje UI Style Guide (Cards)

## Scope
- Route: `/conserje`
- Componentes: `ConserjeItemsMessage` y `ConserjeItemCard`
- Objetivo: mantener cards alineados al flujo del asistente, con imagen completa y jerarquía de contenido por tipo.

## Tokens y estilos base
- `background`: superficie general del chat.
- `card`: superficie del contenedor de cards.
- `foreground`: texto principal (título y contenido factual).
- `muted-foreground`: texto secundario (experiencial, metadatos, chips).
- `border`: separación suave entre bloques.
- `secondary`: base para badges de tipo.
- `muted`: base para chips y media fallback.

Clases utilitarias agregadas en `src/app/globals.css`:
- `.conserje-items-message`
- `.conserje-item-card`
- `.conserje-item-media`
- `.conserje-item-content`
- `.conserje-item-badge`
- `.conserje-item-chip`
- `.conserje-item-link`

## Anatomía del card
1. Media: imagen principal con `object-contain`, altura fija y fondo neutro.
2. Badge de tipo: etiqueta contextual (`Habitaciones`, `Servicios`, etc.).
3. Título: `nombre_publico`.
4. Capa factual: `desc_factual`.
5. Capa experiencial: `desc_experiencial`.
6. Metadata contextual por tipo (check-in/out, precio, horario, chips, mapa).

## Matriz de campos por tipo (Excel)
1. `Habitaciones`
- Core: `desc_factual`, `desc_experiencial`
- Metadata: `check_in`, `check_out`, `precio_desde`

2. `Servicios`
- Core: `desc_factual`, `desc_experiencial`
- Metadata: `condiciones_servicio` + `restricciones_requisitos` como chips (máx 3 + `+x`)

3. `Instalaciones`
- Core: `desc_factual`, `desc_experiencial`
- Metadata: `horario_apertura`, `horario_cierre`

4. `Recomendaciones_Locales`
- Core: `desc_factual`, `desc_experiencial`
- Metadata: acceso a `link_ubicacion_mapa`

## Reglas de layout
- El bloque de cards usa patrón de mensaje del asistente (avatar + bubble contenedor).
- Ancho máximo recomendado del bloque: `~760px`.
- Si llega 1 item: layout de una sola columna.
- Si llegan 2+ items: grilla responsive `1 col mobile / 2 cols md+`.

## Reglas de imagen
- Usar `object-contain` para no recortar contenido visual.
- Mantener altura estable de media para evitar saltos de layout.
- En ausencia de imagen, mostrar fallback con icono por tipo.

## Microcopy
- Normalizar espaciado y cierre de frases en UI.
- No modificar el JSON fuente; la normalización se hace al render.

## Do / Don’t
Do:
- usar tokens (`foreground`, `muted-foreground`, `card`, `border`).
- priorizar legibilidad en metadata.
- respetar el ancho de contenido del chat.

Don’t:
- volver a `object-cover` para este card.
- usar full-width para un card único.
- introducir hardcodes de color en el contenido del card.
