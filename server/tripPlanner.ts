import OpenAI from 'openai'
import { zodFunction } from 'openai/helpers/zod'
import { z } from 'zod'
import {
  tripRecommendationSchema,
  type TripDetails,
  type TripPlan,
} from '../src/features/trip-planner/types.js'
import { getWeather } from './weather.js'

const weatherArgumentsSchema = z.object({ location: z.string().min(1).max(100) })
const recommendationsSchema = z.object({
  weatherAdvice: z.string().min(1).max(240),
  flight: tripRecommendationSchema,
  hotel: tripRecommendationSchema,
})

const instructions = `You are a practical travel-planning assistant. You must call check_weather exactly once for the destination in the trip details. Do not use any other weather source and do not invent weather facts. After receiving the tool result, provide one short weatherAdvice grounded in that result, exactly one flight recommendation, and one hotel recommendation. These are mock suggestions, not live inventory or guaranteed prices. Respect the travel dates, party size, and budget. Return only a JSON object with this shape: {"weatherAdvice":"...","flight":{"title":"...","description":"..."},"hotel":{"title":"...","description":"..."}}. Keep each description concise.`

export class TripPlanningConfigurationError extends Error {}

export async function createTripPlan(trip: TripDetails): Promise<TripPlan> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new TripPlanningConfigurationError('Trip planning is not configured. Add OPENROUTER_API_KEY to the root .env file.')
  }

  const client = new OpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': process.env.OPENROUTER_HTTP_REFERER ?? 'http://localhost:5173',
      'X-OpenRouter-Title': 'Wayfarer Travel Planner',
    },
  })
  let weather: Awaited<ReturnType<typeof getWeather>> | undefined
  const runner = client.chat.completions.runTools({
    model: process.env.OPENROUTER_MODEL ?? 'openai/gpt-4o-mini',
    messages: [
      { role: 'system', content: instructions },
      { role: 'user', content: JSON.stringify(trip) },
    ],
    tools: [zodFunction({
      name: 'check_weather',
      description: 'Fetch current weather for the trip destination. Use the destination exactly as given in the trip details.',
      parameters: weatherArgumentsSchema,
      function: async (_arguments) => {
        weather ??= await getWeather(trip.destination)
        return weather
      },
    })],
    parallel_tool_calls: false,
    maxChatCompletions: 4,
  })

  const content = await runner.finalContent()
  if (!weather) {
    throw new Error('The assistant did not request destination weather.')
  }

  let recommendations: unknown
  try {
    recommendations = JSON.parse(content ?? '')
  } catch {
    throw new Error('The assistant returned an invalid trip plan.')
  }

  const parsedRecommendations = recommendationsSchema.parse(recommendations)
  return {
    weather: { ...weather, advice: parsedRecommendations.weatherAdvice },
    flight: parsedRecommendations.flight,
    hotel: parsedRecommendations.hotel,
  }
}