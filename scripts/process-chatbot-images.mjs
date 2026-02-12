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
const conserjeJsonPath = path.join(projectRoot, "src", "data", "conserje.json")

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

async function updateConserjeJson(imagesByFolder, warnings) {
  const raw = await fs.readFile(conserjeJsonPath, "utf8")
  const data = JSON.parse(raw)

  let replacements = 0
  for (const item of data.items || []) {
    if (!Array.isArray(item.imagenes_url)) continue

    const updatedUrls = []
    let changed = false

    for (const value of item.imagenes_url) {
      if (typeof value !== "string" || !value.startsWith("LINK_IMAGENES_")) {
        updatedUrls.push(value)
        continue
      }

      const mappedFolder = placeholderFolderMap[value]
      if (!mappedFolder) {
        warnings.push(`Placeholder sin mapeo: ${value} (item: ${item.nombre_publico || item.id})`)
        updatedUrls.push(value)
        continue
      }

      const mappedImages = imagesByFolder.get(mappedFolder) || []
      if (mappedImages.length === 0) {
        warnings.push(
          `Sin imágenes para ${value} -> ${mappedFolder} (item: ${item.nombre_publico || item.id})`
        )
        updatedUrls.push(value)
        continue
      }

      uniquePush(updatedUrls, mappedImages)
      changed = true
    }

    if (changed) {
      item.imagenes_url = updatedUrls
      replacements += 1
    }
  }

  if (!dryRun) {
    await fs.writeFile(conserjeJsonPath, `${JSON.stringify(data, null, 2)}\n`, "utf8")
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

  const replacements = await updateConserjeJson(imagesByFolder, warnings)

  console.log(`Modo: ${dryRun ? "dry-run" : "write"}`)
  console.log(`Imágenes detectadas: ${sourceFiles.length}`)
  console.log(`Items de conserje con reemplazo: ${replacements}`)

  if (!dryRun) {
    const saved = totalInputBytes - totalOutputBytes
    const pct = totalInputBytes > 0 ? (saved / totalInputBytes) * 100 : 0
    console.log(`Peso total entrada: ${formatBytes(totalInputBytes)}`)
    console.log(`Peso total salida: ${formatBytes(totalOutputBytes)}`)
    console.log(`Ahorro total: ${formatBytes(saved)} (${pct.toFixed(2)}%)`)
    console.log(`Salida optimizada: ${outputRoot}`)
  } else {
    console.log("Dry-run: no se escribieron archivos ni cambios en conserje.json")
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
