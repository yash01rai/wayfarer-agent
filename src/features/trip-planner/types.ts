import { z } from 'zod'

export const tripDetailsSchema = z.object({
  travellers: z.number().int().min(1).max(12),
  origin: z.string().trim().min(2).max(100),
  destination: z.string().trim().min(2).max(100),
  fromDate: z.string().date(),
  toDate: z.string().date(),
  budget: z.number().finite().min(1).max(10_000_000),
}).refine((trip) => trip.toDate >= trip.fromDate, {
  message: 'Return date must be on or after departure.',
  path: ['toDate'],
})

export type TripDetails = z.infer<typeof tripDetailsSchema>

export const weatherDetailsSchema = z.object({
  location: z.string().min(1),
  condition: z.string().min(1),
  temperatureC: z.number().finite(),
  lowC: z.number().finite(),
  highC: z.number().finite(),
  advice: z.string().min(1).max(240),
})

export const tripRecommendationSchema = z.object({
  title: z.string().min(1).max(90),
  description: z.string().min(1).max(320),
})

export const tripPlanSchema = z.object({
  weather: weatherDetailsSchema,
  flight: tripRecommendationSchema,
  hotel: tripRecommendationSchema,
})

export type WeatherDetails = z.infer<typeof weatherDetailsSchema>
export type TripRecommendation = z.infer<typeof tripRecommendationSchema>
export type TripPlan = z.infer<typeof tripPlanSchema>
export type BookingType = 'flight' | 'hotel'