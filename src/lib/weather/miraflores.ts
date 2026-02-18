export type WeatherSource = "live" | "fallback"

export type WeatherApiResponse = {
  location: "Miraflores"
  tempC: number | null
  tempLabel: string
  description: string
  weatherCode: number | null
  isDay: boolean | null
  source: WeatherSource
  updatedAt: string
}

export function formatTemperature(celsius: number): string {
  if (!Number.isFinite(celsius)) return "--°C"
  return `${Math.round(celsius)}°C`
}

export function mapWeatherCodeToSpanish(code: number, isDay: boolean): string {
  switch (code) {
    case 0:
      return isDay ? "Cielo despejado" : "Noche despejada"
    case 1:
      return isDay ? "Mayormente despejado" : "Mayormente despejado"
    case 2:
      return "Parcialmente nublado"
    case 3:
      return "Nublado"
    case 45:
    case 48:
      return "Neblina"
    case 51:
    case 53:
    case 55:
      return "Llovizna"
    case 56:
    case 57:
      return "Llovizna helada"
    case 61:
    case 63:
    case 65:
      return "Lluvia"
    case 66:
    case 67:
      return "Lluvia helada"
    case 71:
    case 73:
    case 75:
      return "Nieve"
    case 77:
      return "Granos de nieve"
    case 80:
    case 81:
    case 82:
      return "Chubascos"
    case 85:
    case 86:
      return "Chubascos de nieve"
    case 95:
      return "Tormenta"
    case 96:
    case 99:
      return "Tormenta con granizo"
    default:
      return "Clima no disponible"
  }
}

export function createFallbackWeather(): WeatherApiResponse {
  return {
    location: "Miraflores",
    tempC: null,
    tempLabel: "--°C",
    description: "Clima no disponible",
    weatherCode: null,
    isDay: null,
    source: "fallback",
    updatedAt: new Date().toISOString(),
  }
}
