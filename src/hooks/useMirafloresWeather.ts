"use client"

import { useEffect, useState } from "react"
import { createFallbackWeather, type WeatherApiResponse } from "@/lib/weather/miraflores"

type UseMirafloresWeatherOptions = {
  enabled?: boolean
  refreshMs?: number
}

type UseMirafloresWeatherResult = {
  weather: WeatherApiResponse | null
  isLoading: boolean
  isError: boolean
}

export function useMirafloresWeather(
  options: UseMirafloresWeatherOptions = {}
): UseMirafloresWeatherResult {
  const { enabled = true, refreshMs = 600_000 } = options
  const [weather, setWeather] = useState<WeatherApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (!enabled) return

    let cancelled = false

    const fetchWeather = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/weather", {
          method: "GET",
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error(`Weather API error: ${response.status}`)
        }

        const data = (await response.json()) as WeatherApiResponse
        if (cancelled) return
        setWeather(data)
        setIsError(false)
      } catch {
        if (cancelled) return
        setIsError(true)
        setWeather((prev) => prev ?? createFallbackWeather())
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void fetchWeather()
    const intervalId = window.setInterval(() => {
      void fetchWeather()
    }, refreshMs)

    return () => {
      cancelled = true
      window.clearInterval(intervalId)
    }
  }, [enabled, refreshMs])

  return { weather, isLoading, isError }
}
