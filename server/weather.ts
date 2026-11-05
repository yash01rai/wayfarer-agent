import { z } from 'zod'
import type { WeatherDetails } from '../src/features/trip-planner/types.js'

const weatherResponseSchema = z.object({
  name: z.string().optional(),
  weather: z.array(z.object({ description: z.string().min(1) })).min(1),
  main: z.object({
    temp: z.number(),
    temp_min: z.number(),
    temp_max: z.number(),
  }),
})

export async function getWeather(location: string): Promise<Omit<WeatherDetails, 'advice'>> {
  const endpoint = process.env.WEATHER_API_URL ?? 'https://apis.scrimba.com/openweathermap/data/2.5/weather'
  const url = new URL(endpoint)
  url.searchParams.set('q', location)
  url.searchParams.set('units', 'metric')

  const response = await fetch(url, { signal: AbortSignal.timeout(10_000) })
  if (!response.ok) {
    throw new Error(`Weather provider returned ${response.status}`)
  }

  const weather = weatherResponseSchema.parse(await response.json())
  return {
    location: weather.name || location,
    condition: weather.weather[0]?.description ?? 'Conditions unavailable',
    temperatureC: weather.main.temp,
    lowC: weather.main.temp_min,
    highC: weather.main.temp_max,
  }
}