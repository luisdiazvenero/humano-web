#!/usr/bin/env node

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, "..")

const args = new Set(process.argv.slice(2))
const dryRun = args.has("--dry-run")

const inputRoot = path.join(projectRoot, "IMAGENES")
const outputRoot = path.join(projectRoot, "public", "chatbot", "imagenes")
const dataJsonPaths = [
  path.join(projectRoot, "src", "data", "conserje.json"),
  path.join(projectRoot, "src", "data", "humano.json"),
]

const maxEdge = 1280
const webpQuality = 72
const supportedExts = new Set([".jpg", ".jpeg", ".png", ".webp"])

const placeholderFolderMap = {
  LINK_IMAGENES_SUPERIOR_KING: "hab/superior_king",
  LINK_IMAGENES_SUPERIOR_DOUBLE: "hab/superior_doble",
  LINK_IMAGENES_DELUXE_KING: "hab/deluxe_king",
  LINK_IMAGENES_ACCESIBLE_ROOM: "hab/accesible_room",
  LINK_IMAGENES_FAMILY_ROOM: "hab/family_room",
  LINK_IMAGENES_FAMILY_DELUXE: "hab/family_deluxe",
  LINK_IMAGENES_JUNIOR_SUITE: "hab/junior_suite",
  LINK_IMAGENES_SIGNATURE_SUITE: "hab/signature_suite",

  LINK_IMAGENES_TRANSFER: "serv/transfer",
  LINK_IMAGENES_MASCOTAS: "serv/mascotas",
  LINK_IMAGENES_ROOM_SERVICE: "serv/room_service",
  LINK_IMAGENES_LAVANDERIA: "serv/lavanderia",
  LINK_IMAGENES_ESTACIONAMIENTO: "serv/estacionamiento",
  LINK_IMAGENES_WIFI: "serv/wifi",
  LINK_IMAGENES_LIMPIEZA: "serv/limpieza",
  LINK_IMAGENES_CONCIERGE: "serv/concierge",

  LINK_IMAGENES_LOBBY: "inst/lobby",
  LINK_IMAGENES_DESAYUNO: "inst/desayuno",
  LINK_IMAGENES_RESTAURANTE_ENT: "inst/restaurante_entranable",
  LINK_IMAGENES_CDL: "inst/restaurante_cdl",
  LINK_IMAGENES_COWORKING: "inst/coworking",
  LINK_IMAGENES_GIMNASIO: "inst/gimnasio",
  LINK_IMAGENES_PISCINA: "inst/piscina",
  LINK_IMAGENES_SALAS: "inst/salas_de_reuniones",

  LINK_IMAGENES_MALECON: "rec/malecon_miraflores",
  LINK_IMAGENES_PARQUE_KENNEDY: "rec/parque_kennedy",
  LINK_IMAGENES_LARCOMAR: "rec/larcomar",
  LINK_IMAGENES_RUNNING_MALECON: "rec/running_malecon",
  LINK_IMAGENES_CAFES: "rec/cafes_miraflores",
  LINK_IMAGENES_HUACA: "rec/huaca",
  LINK_IMAGENES_PARAPENTE: "rec/parapente",
  LINK_IMAGENES_TEATROS: "rec/teatros",
}

const itemFolderMap = {
  HAB_SUPERIOR_KING: "hab/superior_king",
  HAB_SUPERIOR_DOUBLE: "hab/superior_doble",
  HAB_DELUXE_KING: "hab/deluxe_king",
  HAB_ACCESIBLE_ROOM: "hab/accesible_room",
  HAB_FAMILY_ROOM: "hab/family_room",
  HAB_FAMILY_DELUXE: "hab/family_deluxe",
  HAB_JUNIOR_SUITE: "hab/junior_suite",
  HAB_SIGNATURE_SUITE: "hab/signature_suite",

  SERV_TRANSFER_AEROPUERTO: "serv/transfer",
  SERV_MASCOTAS: "serv/mascotas",
  SERV_ROOM_SERVICE: "serv/room_service",
  SERV_LAVANDERIA: "serv/lavanderia",
  SERV_ESTACIONAMIENTO: "serv/estacionamiento",
  SERV_WIFI: "serv/wifi",
  SERV_LIMPIEZA: "serv/limpieza",
  SERV_CONCIERGE: "serv/concierge",

  INST_LOBBY: "inst/lobby",
  INST_DESAYUNO: "inst/desayuno",
  INST_RESTAURANTE_ENT: "inst/restaurante_entranable",
  INST_RESTAURANTE_CDL: "inst/restaurante_cdl",
  INST_COWORKING: "inst/coworking",
  INST_GIMNASIO: "inst/gimnasio",
  INST_PISCINA: "inst/piscina",
  INST_SALAS_REUNIONES: "inst/salas_de_reuniones",
  INST_BAR: "inst/bar",

  REC_MALECON_MIRAFLORES: "rec/malecon_miraflores",
  REC_PARQUE_KENNEDY: "rec/parque_kennedy",
  REC_LARCOMAR: "rec/larcomar",
  REC_RUNNING_MALECON: "rec/running_malecon",
  REC_CAFES_MIRAFLORES: "rec/cafes_miraflores",
  REC_RUTA_DEL_CAFE: "rec/cafes_miraflores",
  REC_HUACA: "rec/huaca",
  REC_PARAPENTE: "rec/parapente",
  REC_TEATROS: "rec/teatros",
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return "0 B"
  if (bytes < 1024) return `${bytes} B`
  const units = ["KB", "MB", "GB"]
  let value = bytes / 1024
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }
  return `${value.toFixed(2)} ${units[unitIndex]}`
}

function toSnakeAscii(value) {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase()

  return normalized || "item"
}

function uniquePush(list, values) {
  for (const value of values) {
    if (!list.includes(value)) list.push(value)
  }
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false
  return a.every((value, index) => value === b[index])
}

function normalizeItemId(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase()
}

function inferFolderFromExistingUrls(urls) {
  for (const value of urls) {
    if (typeof value !== "string") continue
    if (value.startsWith("LINK_IMAGENES_")) {
      const mappedFolder = placeholderFolderMap[value]
      if (mappedFolder) return mappedFolder
      continue
    }
    if (!value.startsWith("/chatbot/imagenes/")) continue

    const trimmed = value.slice("/chatbot/imagenes/".length)
    const parts = trimmed.split("/").filter(Boolean)
    if (parts.length >= 2) {
      return parts.slice(0, -1).join("/")
    }
  }

  return null
}

function inferFolderForItem(item) {
  const urls = Array.isArray(item.imagenes_url) ? item.imagenes_url : []
  const fromUrls = inferFolderFromExistingUrls(urls)
  if (fromUrls) return fromUrls

  const normalizedId = normalizeItemId(item.id || "")
  return itemFolderMap[normalizedId] || null
}

async function collectImageFiles(rootPath) {
  const files = []

  async function walk(currentPath, relativeParts) {
    const entries = await fs.readdir(currentPath, { withFileTypes: true })
    entries.sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }))

    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue
      const nextPath = path.join(currentPath, entry.name)
      if (entry.isDirectory()) {
        await walk(nextPath, [...relativeParts, entry.name])
        continue
      }
      if (!entry.isFile()) continue
      const ext = path.extname(entry.name).toLowerCase()
      if (!supportedExts.has(ext)) continue
      files.push({
        inputPath: nextPath,
        relativeParts: [...relativeParts, entry.name],
      })
    }
  }

  await walk(rootPath, [])
  return files
}

function makeOutputPath(relativeParts, usedNamesByDir) {
  const originalFilename = relativeParts[relativeParts.length - 1]
  const originalDirParts = relativeParts.slice(0, -1)
  const extension = path.extname(originalFilename)
  const baseName = originalFilename.slice(0, originalFilename.length - extension.length)

  const normalizedDirParts = originalDirParts.map(toSnakeAscii)
  const folderKey = normalizedDirParts.join("/")
  const normalizedBase = toSnakeAscii(baseName)

  const dirKey = folderKey
  if (!usedNamesByDir.has(dirKey)) {
    usedNamesByDir.set(dirKey, new Set())
  }
  const usedNames = usedNamesByDir.get(dirKey)

  let candidate = normalizedBase
  let counter = 2
  while (usedNames.has(candidate)) {
    candidate = `${normalizedBase}_${counter}`
    counter += 1
  }
  usedNames.add(candidate)

  const relativeOutputPath = path.posix.join(...normalizedDirParts, `${candidate}.webp`)
  const absoluteOutputPath = path.join(outputRoot, ...normalizedDirParts, `${candidate}.webp`)
  const webPath = `/chatbot/imagenes/${relativeOutputPath}`

  return {
    folderKey,
    absoluteOutputPath,
    webPath,
  }
}

async function updateDataJson(jsonPath, imagesByFolder, warnings) {
  const raw = await fs.readFile(jsonPath, "utf8")
  const data = JSON.parse(raw)

  let replacements = 0
  for (const item of data.items || []) {
    const mappedFolder = inferFolderForItem(item)
    if (!mappedFolder) continue

    const mappedImages = imagesByFolder.get(mappedFolder) || []
    if (mappedImages.length === 0) {
      warnings.push(
        `Sin imágenes para ${mappedFolder} (item: ${item.nombre_publico || item.id}, archivo: ${path.basename(jsonPath)})`
      )
      continue
    }

    const currentUrls = Array.isArray(item.imagenes_url)
      ? item.imagenes_url.filter((value) => typeof value === "string")
      : []

    if (!arraysEqual(currentUrls, mappedImages)) {
      item.imagenes_url = [...mappedImages]
      replacements += 1
    }
  }

  if (!dryRun) {
    await fs.writeFile(jsonPath, `${JSON.stringify(data, null, 2)}\n`, "utf8")
  }

  return replacements
}

async function main() {
  const warnings = []
  const usedNamesByDir = new Map()
  const imagesByFolder = new Map()
  let totalInputBytes = 0
  let totalOutputBytes = 0

  try {
    await fs.access(inputRoot)
  } catch {
    console.error(`No se encontró la carpeta de entrada: ${inputRoot}`)
    process.exit(1)
  }

  const sourceFiles = await collectImageFiles(inputRoot)

  if (!dryRun) {
    await fs.rm(outputRoot, { recursive: true, force: true })
    await fs.mkdir(outputRoot, { recursive: true })
  }

  for (const source of sourceFiles) {
    const sourceStats = await fs.stat(source.inputPath)
    totalInputBytes += sourceStats.size

    const output = makeOutputPath(source.relativeParts, usedNamesByDir)
    if (!imagesByFolder.has(output.folderKey)) {
      imagesByFolder.set(output.folderKey, [])
    }
    imagesByFolder.get(output.folderKey).push(output.webPath)

    if (dryRun) continue

    await fs.mkdir(path.dirname(output.absoluteOutputPath), { recursive: true })

    await sharp(source.inputPath)
      .rotate()
      .resize({
        width: maxEdge,
        height: maxEdge,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: webpQuality })
      .toFile(output.absoluteOutputPath)

    const outputStats = await fs.stat(output.absoluteOutputPath)
    totalOutputBytes += outputStats.size
  }

  for (const [folder, urls] of imagesByFolder.entries()) {
    urls.sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }))
    imagesByFolder.set(folder, urls)
  }

  const replacementResults = []
  for (const jsonPath of dataJsonPaths) {
    const replacements = await updateDataJson(jsonPath, imagesByFolder, warnings)
    replacementResults.push({
      file: path.relative(projectRoot, jsonPath),
      replacements,
    })
  }

  console.log(`Modo: ${dryRun ? "dry-run" : "write"}`)
  console.log(`Imágenes detectadas: ${sourceFiles.length}`)
  for (const result of replacementResults) {
    console.log(`Items actualizados en ${result.file}: ${result.replacements}`)
  }

  if (!dryRun) {
    const saved = totalInputBytes - totalOutputBytes
    const pct = totalInputBytes > 0 ? (saved / totalInputBytes) * 100 : 0
    console.log(`Peso total entrada: ${formatBytes(totalInputBytes)}`)
    console.log(`Peso total salida: ${formatBytes(totalOutputBytes)}`)
    console.log(`Ahorro total: ${formatBytes(saved)} (${pct.toFixed(2)}%)`)
    console.log(`Salida optimizada: ${outputRoot}`)
  } else {
    console.log("Dry-run: no se escribieron archivos ni cambios en los JSON")
  }

  if (warnings.length > 0) {
    console.log(`Warnings (${warnings.length}):`)
    for (const warning of warnings) {
      console.log(`- ${warning}`)
    }
  }
}

main().catch((error) => {
  console.error("Error ejecutando pipeline de imágenes:", error)
  process.exit(1)
})
