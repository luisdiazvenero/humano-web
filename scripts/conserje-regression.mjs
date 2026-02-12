#!/usr/bin/env node
import fs from "node:fs/promises"
import path from "node:path"

const API_URL = process.env.CONSERJE_API_URL || "http://localhost:3000/api/conserje"

function normalize(text = "") {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function overlapRatio(a, b) {
  const tokensA = normalize(a).split(" ").filter((t) => t.length >= 4)
  const tokensB = new Set(normalize(b).split(" ").filter((t) => t.length >= 4))
  if (!tokensA.length || !tokensB.size) return 0
  let overlap = 0
  for (const token of tokensA) if (tokensB.has(token)) overlap += 1
  return overlap / tokensA.length
}

function assert(condition, message, details = {}) {
  if (!condition) {
    const error = new Error(message)
    error.details = details
    throw error
  }
}

async function post(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const text = await res.text()
  let json = null
  try {
    json = JSON.parse(text)
  } catch {
    throw new Error(`Respuesta no JSON: ${text}`)
  }
  assert(res.ok, `HTTP ${res.status}`, { payload, response: json })
  return json
}

async function loadData() {
  const filePath = path.resolve(process.cwd(), "src/data/conserje.json")
  return JSON.parse(await fs.readFile(filePath, "utf-8"))
}

async function run() {
  const data = await loadData()
  const byId = new Map(data.items.map((item) => [item.id, item]))
  const failures = []
  const pass = (name) => console.log(`PASS: ${name}`)
  const fail = (name, error) => {
    failures.push({ name, error: error.message, details: error.details || {} })
    console.error(`FAIL: ${name}\n`, error.message)
  }

  const baseState = { dates: null, guests: null, profile: "pareja", intent: "trabajo" }

  const tests = [
    async () => {
      const name = "Post-card Habitaciones no repite card"
      try {
        const payload = {
          message: "Deluxe King",
          history: [{ role: "user", content: "Habitaciones" }],
          contextTopic: "Habitaciones",
          activeItemId: "HAB_DELUXE_KING",
          activeItemLabel: "Deluxe King",
          source: "menu",
          state: baseState,
        }
        const res = await post(payload)
        const item = byId.get("HAB_DELUXE_KING")
        assert(Array.isArray(res.items) && res.items[0]?.id === "HAB_DELUXE_KING", "Debe devolver card", { res })
        assert(overlapRatio(res.reply || "", item.desc_factual || "") < 0.45, "Reply repite factual", { reply: res.reply })
        pass(name)
      } catch (error) {
        fail(name, error)
      }
    },
    async () => {
      const name = "Post-card Servicios no repite card"
      try {
        const payload = {
          message: "Pet friendly",
          history: [{ role: "user", content: "Servicios" }],
          contextTopic: "Servicios",
          activeItemId: "SERV_MASCOTAS",
          activeItemLabel: "Pet friendly",
          source: "menu",
          state: baseState,
        }
        const res = await post(payload)
        const item = byId.get("SERV_MASCOTAS")
        assert(Array.isArray(res.items) && res.items[0]?.id === "SERV_MASCOTAS", "Debe devolver card", { res })
        assert(overlapRatio(res.reply || "", item.desc_factual || "") < 0.45, "Reply repite factual", { reply: res.reply })
        pass(name)
      } catch (error) {
        fail(name, error)
      }
    },
    async () => {
      const name = "Exploración dentro del hotel abre menú interno"
      try {
        const payload = {
          message: "algo dentro del hotel",
          history: [
            { role: "assistant", content: "Family Room funciona muy bien... Cuando quieras, te recomiendo algo dentro del hotel o un plan corto por Miraflores." },
            { role: "user", content: "algo dentro del hotel" },
          ],
          contextTopic: "Habitaciones",
          activeItemId: "HAB_FAMILY_ROOM",
          activeItemLabel: "Family Room",
          source: "user",
          state: baseState,
        }
        const res = await post(payload)
        assert(Array.isArray(res.menu) && res.menu.length >= 3, "Debe devolver menú interno", { res })
        const menuIds = res.menu.map((m) => m.id)
        const mapped = menuIds.map((id) => byId.get(id))
        const hasServicios = mapped.some((item) => item?.tipo === "Servicios")
        const hasInstalaciones = mapped.some((item) => item?.tipo === "Instalaciones")
        assert(hasServicios && hasInstalaciones, "Menú debe mezclar servicios + instalaciones", { menu: res.menu })
        pass(name)
      } catch (error) {
        fail(name, error)
      }
    },
    async () => {
      const name = "Sí en pregunta exploratoria avanza a card (sin loop)"
      try {
        const payload = {
          message: "si",
          history: [
            { role: "assistant", content: "Para trabajar sin salir del hotel, pueden usar nuestro Coworking, disponible las 24 horas. ¿Les gustaría más información sobre el espacio?" },
            { role: "user", content: "si" },
          ],
          contextTopic: "Instalaciones",
          activeItemId: "INST_COWORKING",
          activeItemLabel: "Coworking",
          source: "user",
          state: baseState,
        }
        const res = await post(payload)
        assert(Array.isArray(res.items) && res.items[0]?.id === "INST_COWORKING", "Debe mostrar card de Coworking", { res })
        pass(name)
      } catch (error) {
        fail(name, error)
      }
    },
  ]

  for (const test of tests) {
    await test()
  }

  if (failures.length > 0) {
    console.error("\nResumen fallas:")
    for (const f of failures) {
      console.error(`- ${f.name}: ${f.error}`)
      if (Object.keys(f.details || {}).length) {
        console.error(JSON.stringify(f.details, null, 2))
      }
    }
    process.exit(1)
  }

  console.log("\nTodas las regresiones de conserje pasaron.")
}

run().catch((error) => {
  console.error("Error ejecutando regresión:", error)
  process.exit(1)
})
