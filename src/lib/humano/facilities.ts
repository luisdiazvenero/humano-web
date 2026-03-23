import humanoDataRaw from "@/data/humano.json"
import type { ConserjeData } from "@/lib/humano/types"

const humanoData = humanoDataRaw as ConserjeData

export type HumanoFacilityCard = {
  id: string
  nombre: string
  categoria: string
  meta: Array<{
    label: string
    kind: "time" | "feature"
  }>
  descripcion: string
  imagen: string | null
}

const featuredFacilityConfig: Record<
  string,
  {
    nombre: string
    meta: (item: ConserjeData["items"][number]) => HumanoFacilityCard["meta"]
  }
> = {
  INST_LOBBY: {
    nombre: "Lobby",
    meta: (item) => [
      {
        label:
          item.horario_apertura === "24h"
            ? "24h"
            : `${item.horario_apertura} - ${item.horario_cierre}`,
        kind: "time",
      },
      {
        label: "Áreas de espera",
        kind: "feature",
      },
    ],
  },
  INST_RESTAURANTE_ENT: {
    nombre: "Restaurante Entrañable",
    meta: (item) => [
      {
        label: `${item.horario_apertura} - ${item.horario_cierre}`,
        kind: "time",
      },
      {
        label: "Parrillas",
        kind: "feature",
      },
    ],
  },
  INST_PISCINA: {
    nombre: "Piscina",
    meta: (item) => [
      {
        label: `${item.horario_apertura} - ${item.horario_cierre}`,
        kind: "time",
      },
      {
        label: "Uso recreativo",
        kind: "feature",
      },
    ],
  },
}

export function getHumanoFeaturedFacilities(): HumanoFacilityCard[] {
  return Object.entries(featuredFacilityConfig)
    .map(([id, config]) => {
      const item = humanoData.items.find((entry) => entry.id === id)
      if (!item) return null

      return {
        id,
        nombre: config.nombre,
        categoria: item.categoria || "Instalación",
        meta: config.meta(item).filter((entry) => Boolean(entry.label)).slice(0, 2),
        descripcion:
          id === "INST_RESTAURANTE_ENT"
            ? item.desc_factual
            : item.desc_experiencial || item.desc_factual,
        imagen: item.imagenes_url?.[0] ?? null,
      }
    })
    .filter((item): item is HumanoFacilityCard => Boolean(item))
}
