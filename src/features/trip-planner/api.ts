import { tripPlanSchema, type TripDetails, type TripPlan } from './types'

export async function createTripPlan(trip: TripDetails): Promise<TripPlan> {
  const response = await fetch('/api/trip-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trip),
  })

  const payload: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const message = typeof payload === 'object' && payload !== null && 'error' in payload && typeof payload.error === 'string'
      ? payload.error
      : 'We could not plan your trip right now. Please try again.'
    throw new Error(message)
  }

  return tripPlanSchema.parse(payload)
}