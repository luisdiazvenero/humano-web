#!/usr/bin/env node
// Refresca src/data/tripadvisor.json con la calificación y el número de
// opiniones que publica el widget de Tripadvisor.
//
//   node scripts/update-tripadvisor.mjs
//   node scripts/update-tripadvisor.mjs --ranking 7 --ranking-total 298
//
// El ranking no viene en el widget: se pasa por bandera cuando cambie.

import { readFile, writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"

const LOCATION_ID = "34049476"
const EMBED_URL = `https://www.tripadvisor.es/WidgetEmbed-cdsratingsonlynarrow?locationId=${LOCATION_ID}&display_version=2&uniq=148&lang=es&border=false`

const dataPath = resolve(dirname(fileURLToPath(import.meta.url)), "../src/data/tripadvisor.json")

function flag(name) {
  const index = process.argv.indexOf(`--${name}`)
  if (index === -1) return null
  const value = Number(process.argv[index + 1])
  return Number.isFinite(value) ? value : null
}

function parse(body) {
  const rating = body.match(/bubble_(\d{2})\b/)
  const reviews = body.match(/([\d.,]+)\s*(?:opiniones|opini[óo]n|reviews|review)\b/i)
  if (!rating || !reviews) return null
  return {
    rating: Number(rating[1]) / 10,
    reviews: Number(reviews[1].replace(/[.,]/g, "")),
  }
}

const response = await fetch(EMBED_URL, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36",
    "Accept-Language": "es-ES,es;q=0.9",
  },
})

if (!response.ok) {
  console.error(`Tripadvisor respondió ${response.status}. No se actualizó nada.`)
  process.exit(1)
}

const parsed = parse(await response.text())

if (!parsed) {
  console.error("No se pudo leer la calificación en la respuesta. No se actualizó nada.")
  process.exit(1)
}

const current = JSON.parse(await readFile(dataPath, "utf8"))
const next = {
  ...current,
  ...parsed,
  ranking: flag("ranking") ?? current.ranking,
  rankingTotal: flag("ranking-total") ?? current.rankingTotal,
  updatedAt: new Date().toISOString().slice(0, 10),
}

await writeFile(dataPath, `${JSON.stringify(next, null, 2)}\n`)

console.log(
  `Tripadvisor: ${next.rating} · ${next.reviews} opiniones · N.º ${next.ranking} de ${next.rankingTotal}`
)
