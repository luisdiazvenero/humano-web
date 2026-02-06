export type ConserjeItemType =
  | "Habitaciones"
  | "Servicios"
  | "Instalaciones"
  | "Recomendaciones_Locales"

export interface ConserjeItem {
  id: string
  nombre_publico: string
  categoria: string
  desc_factual: string
  desc_experiencial: string
  intenciones: string[]
  perfil_ideal: string[]
  restricciones_requisitos: string[]
  condiciones_servicio: string[]
  imagenes_url: string[]
  frases_sugeridas: string[]
  ctas: string[]
  horario_apertura: string | null
  horario_cierre: string | null
  tipo: ConserjeItemType
}

export interface ReglaGobierno {
  regla_id: string
  regla_clave: string
  descripcion_practica: string
}

export interface ConserjeData {
  items: ConserjeItem[]
  reglas: ReglaGobierno[]
}
