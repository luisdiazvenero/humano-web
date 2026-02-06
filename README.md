# Humano Web

Plataforma conversacional del Hotel Humano (Miraflores). Incluye demos y el conserje basado en Excel como fuente de verdad.

## Rutas principales

1. `/conserje`  
Conserje conversacional basado en `SOURCE OF TRUTH.xlsx`. Responde con IA pero valida todo con el Excel.

2. `/demoai`  
Demo de IA previa (se mantiene para comparación).

3. `/demo`  
Demo conversacional con contenidos predefinidos desde `doc/microsite-faqs.xlsx`.

## Datos y scripts

**Conserje (Excel → JSON)**

- Fuente: `SOURCE OF TRUTH.xlsx` (ruta libre, se pasa como argumento).
- Script: `scripts/excel-to-conserje-json.py`
- Output: `src/data/conserje.json`

```bash
python3 scripts/excel-to-conserje-json.py /ruta/a/SOURCE\ OF\ TRUTH.xlsx
```

**Demo (Excel → JSON/TS)**

- Fuente: `doc/microsite-faqs.xlsx`
- Script: `scripts/excel-to-json.py`
- Output: `src/app/demo/conversations-data.json` y `src/app/demo/conversations-data.ts`

```bash
python3 scripts/excel-to-json.py
```

## API

1. `POST /api/conserje`
   - Usa embeddings + recuperación semántica.
   - “Planner LLM” decide intención y siguiente paso.
   - “Validador Excel” corrige conflictos (restricciones, perfiles, etc.).
   - Nunca inventa datos fuera del Excel.

2. `POST /api/chat`
   - Endpoint histórico de la demo AI (se mantiene si se requiere).

## Desarrollo local

```bash
npm install
```

Crear `.env.local`:

```env
OPENAI_API_KEY=tu_api_key
```

Arrancar:

```bash
npm run dev
```

## Despliegue

Despliega en Vercel o tu proveedor preferido. Asegura `OPENAI_API_KEY` en variables de entorno.

## Notas importantes

- `/conserje` es independiente de `/demoai`.
- El Excel es la fuente factual. La IA solo completa tono o conecta piezas.
- Si cambias el Excel, regenera el JSON antes de probar.
