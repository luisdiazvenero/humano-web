import { NextResponse } from "next/server"
import {
  createFallbackWeather,
  formatTemperature,
  mapWeatherCodeToSpanish,
  type WeatherApiResponse,
} from "@/lib/weather/miraflores"

const MIRAFLORES_LAT = -12.1211
const MIRAFLORES_LON = -77.0297
const CACHE_SECONDS = 600

type OpenMeteoResponse = {
  current?: {
    temperature_2m?: number
    weather_code?: number
    is_day?: number
  }
}

function toJsonResponse(payload: WeatherApiResponse) {
  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=1200`,
    },
  })
}

export async function GET() {
  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast")
    url.searchParams.set("latitude", `${MIRAFLORES_LAT}`)
    url.searchParams.set("longitude", `${MIRAFLORES_LON}`)
    url.searchParams.set("current", "temperature_2m,weather_code,is_day")
    url.searchParams.set("timezone", "America/Lima")

    const response = await fetch(url.toString(), {
      next: { revalidate: CACHE_SECONDS },
    })

    if (!response.ok) {
      throw new Error(`Open-Meteo error: ${response.status}`)
    }

    const data = (await response.json()) as OpenMeteoResponse
    const temperature = data.current?.temperature_2m
    const weatherCode = data.current?.weather_code
    const isDay = data.current?.is_day

    if (
      typeof temperature !== "number" ||
      !Number.isFinite(temperature) ||
      typeof weatherCode !== "number" ||
      !Number.isFinite(weatherCode) ||
      (isDay !== 0 && isDay !== 1)
    ) {
      throw new Error("Open-Meteo payload inválido")
    }

    const isDayFlag = isDay === 1

    const payload: WeatherApiResponse = {
      location: "Miraflores",
      tempC: temperature,
      tempLabel: formatTemperature(temperature),
      description: mapWeatherCodeToSpanish(weatherCode, isDayFlag),
      weatherCode,
      isDay: isDayFlag,
      source: "live",
      updatedAt: new Date().toISOString(),
    }

    return toJsonResponse(payload)
  } catch (error) {
    console.error("[/api/weather] No se pudo obtener clima en vivo para Miraflores", error)
    return toJsonResponse(createFallbackWeather())
  }
}
