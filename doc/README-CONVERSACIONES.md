# Sistema de Conversaciones - Humano Hotel Demo

Este documento explica cómo funciona el sistema de conversaciones del microsite y cómo mantenerlo actualizado.

## 📁 Estructura de Archivos

```
humano-web/
├── doc/
│   ├── microsite-faqs.xlsx          # Excel con todas las conversaciones (FUENTE DE VERDAD)
│   └── README-CONVERSACIONES.md     # Este archivo
├── scripts/
│   └── excel-to-json.py             # Script de conversión Excel → JSON
└── src/app/demo/
    ├── page.tsx                     # Página de la demo
    ├── conversations-data.ts        # Datos TypeScript (generado automáticamente)
    └── conversations-data.json      # Datos JSON (generado automáticamente)
```

## 🎯 Flujo de Trabajo

### 1. Editar Contenido
**Archivo a editar:** `doc/microsite-faqs.xlsx`

El Excel contiene **9 pestañas** principales (una por cada tipo de viajero):

#### Características de Viajero:
- 🟦 **Trabajo**: Solo, Pareja, Grupo
- 🟩 **Descanso**: Solo, Pareja, Grupo
- 🟨 **Aventura**: Solo, Pareja, Grupo

#### Estructura de cada pestaña:

Cada pestaña tiene **6 bloques de conversación** organizados en columnas:

**Columnas 2-3:** (3 bloques)
1. UBICACIÓN > MIRAFLORES
2. UBICACIÓN > ¿CÓMO LLEGAR?
3. UBICACIÓN > ALREDEDORES

**Columnas 5-6:** (3 bloques)
4. HABITACIONES > DISEÑO / COMODIDAD
5. HABITACIONES > FAM Y COMUNICANTES
6. HABITACIONES > SUITES

#### Estructura de cada bloque:

Cada bloque sigue este patrón vertical:

| Fila | Campo | Descripción |
|------|-------|-------------|
| N | TOPIC | Tema principal (ej: UBICACIÓN, HABITACIONES) |
| N+1 | SUB TEMAS | Subtema (ej: MIRAFLORES, SUITES) |
| N+2 | Texto intro gente | Introducción que usa el agente |
| N+3 | Fase Categoría | Categoría de la experiencia |
| N+4 | Título Unidad de Contenido | Título de la tarjeta |
| N+5 | Párrafo / Contenido | Descripción principal |
| N+6 | Imagen / Video | URL de multimedia (opcional) |
| N+7 | Texto cierre agente | Cierre de la conversación |
| N+8 | Texto agente próximo paso | Siguiente paso (opcional) |
| N+9 | CTAS Recomendados | Botones separados por "/" |

### 2. Generar JSON y TypeScript

Después de editar el Excel, ejecuta:

```bash
python3 scripts/excel-to-json.py
```

Este script:
- ✅ Lee todas las pestañas del Excel
- ✅ Extrae los 6 bloques de cada perfil
- ✅ Genera `conversations-data.json`
- ✅ Genera `conversations-data.ts` con tipos TypeScript
- ✅ Valida que todos los bloques tengan título y contenido

### 3. Verificar la Demo

Abre el navegador en:
```
http://localhost:3000/demo
```

Deberías ver los **9 perfiles de viajero** disponibles.

## 📊 Estado Actual del Contenido

### ✅ Completado (100%):
- Trabajo Solo - 6 conversaciones
- Trabajo Pareja - 6 conversaciones
- Trabajo Grupo - 6 conversaciones (generado)
- Descanso Solo - 6 conversaciones (generado)
- Descanso Pareja - 6 conversaciones
- Aventura Solo - 6 conversaciones
- Aventura Pareja - 6 conversaciones

### ⚠️ Casi completado (83%):
- Descanso Grupo - 5 conversaciones (falta 1 bloque por completar)
- Aventura Grupo - 5 conversaciones (falta 1 bloque por completar)

**Total:** 52 conversaciones en 9 perfiles

## 🔄 Mejoras Realizadas

### ✨ Contenido Generado:

1. **Pestañas Trabajo Grupo y Descanso Solo**
   - Se generó contenido completo adaptado a cada perfil
   - Basado en perfiles similares pero personalizado

2. **Bloques FAM Y COMUNICANTES**
   - Completados en todas las pestañas
   - Contenido específico según tipo de viajero

### 🛠️ Herramientas Creadas:

1. **Script de conversión automática** (`scripts/excel-to-json.py`)
   - Convierte Excel a JSON/TypeScript
   - Valida contenido
   - Fácil de reusar

2. **Estructura optimizada**
   - JSON limpio y estructurado
   - Tipos TypeScript completos
   - Fácil de integrar con base de datos futura

## 🎨 Cómo Agregar Nuevas Conversaciones

### Opción 1: Agregar bloque en pestaña existente

1. Abre el Excel
2. Ve a la pestaña del perfil deseado
3. Encuentra una columna vacía (ej: columnas 8-9)
4. Copia la estructura de bloques existente
5. Completa con tu contenido
6. Ejecuta `python3 scripts/excel-to-json.py`

### Opción 2: Agregar nuevo perfil

1. Abre `scripts/excel-to-json.py`
2. Agrega la configuración en `PROFILE_CONFIG`:
```python
'Nuevo Perfil': {
    'icon': '🎯',
    'description': 'Descripción del perfil',
    'caracteristica': 'nueva_caracteristica',
    'grupo': 'nuevo_grupo'
}
```
3. Crea la pestaña en el Excel con el mismo nombre
4. Ejecuta el script

## 🎯 Conversaciones Abiertas (No Lineales)

Actualmente, el sistema usa **conversaciones abiertas**, lo que significa:

✅ El usuario puede navegar libremente entre topics
✅ Los CTAs permiten saltar de un tema a otro
✅ No hay un flujo fijo predefinido
✅ Cada interacción lleva al siguiente bloque de conversación

### Ejemplo de flujo:
```
Usuario → Trabajo Solo
  ↓
Agente: "Genial, estás aquí por trabajo..."
  ↓
Usuario hace clic en CTA: "3 días"
  ↓
Agente muestra siguiente conversación: "¿CÓMO LLEGAR?"
  ↓
Usuario hace clic en CTA: "Habitaciones"
  ↓
...
```

## 📝 Notas Importantes

1. **Excel es la fuente de verdad**: Siempre edita el Excel, no los archivos .ts/.json
2. **Regenera después de cambios**: Ejecuta el script cada vez que actualices el Excel
3. **Valida CTAs**: Los CTAs se separan con "/" (ej: "Opción 1 / Opción 2 / Opción 3")
4. **Campos opcionales**: `imagen` y `proximo_paso` pueden estar vacíos

## 🚀 Próximos Pasos Sugeridos

1. **Completar bloques faltantes**
   - Descanso Grupo: agregar 1 conversación más
   - Aventura Grupo: agregar 1 conversación más

2. **Agregar imágenes**
   - Completar el campo `Imagen / Video` con URLs

3. **Expandir contenido**
   - Agregar más topics (SERVICIOS, GASTRONOMÍA, etc.)
   - Crear conversaciones más profundas

4. **Migrar a base de datos**
   - Cuando el contenido esté estable, migrar a PostgreSQL
   - Mantener el Excel para presentaciones a cliente

## 🆘 Solución de Problemas

### El script no encuentra el Excel
```bash
# Verifica que estás en la raíz del proyecto
pwd
# Debe mostrar: /home/user/humano-web
```

### Falta openpyxl
```bash
pip3 install openpyxl
```

### Los cambios no se reflejan en /demo
1. Verifica que ejecutaste el script
2. Recarga la página (Ctrl+Shift+R)
3. Verifica que no haya errores en consola

### Un perfil tiene menos conversaciones
- Revisa que todos los bloques tengan `titulo` y `contenido` completos
- El script solo extrae bloques con contenido válido

## 📞 Contacto

Para preguntas o soporte, contacta al equipo de desarrollo.

---

**Última actualización:** 2026-01-21
**Versión del script:** 1.0
