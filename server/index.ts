import 'dotenv/config'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { ZodError } from 'zod'
import { createTripPlan, TripPlanningConfigurationError } from './tripPlanner.js'
import { tripDetailsSchema } from '../src/features/trip-planner/types.js'

const app = express()
const port = Number(process.env.PORT ?? 8787)

app.disable('x-powered-by')
app.use(helmet())
app.use(express.json({ limit: '10kb' }))

const planLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})

app.post('/api/trip-plan', planLimiter, async (request, response) => {
  const parsed = tripDetailsSchema.safeParse(request.body)
  if (!parsed.success) {
    response.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Trip details are invalid.' })
    return
  }

  try {
    response.json(await createTripPlan(parsed.data))
  } catch (error) {
    if (error instanceof TripPlanningConfigurationError) {
      response.status(503).json({ error: error.message })
      return
    }
    const upstreamStatus = typeof error === 'object' && error !== null && 'status' in error
      ? error.status
      : undefined
    if (upstreamStatus === 401) {
      response.status(503).json({ error: 'OpenRouter rejected the API key. Check OPENROUTER_API_KEY in .env and restart the dev server.' })
      return
    }
    const upstreamCode = typeof error === 'object' && error !== null && 'code' in error
      ? error.code
      : undefined
    const upstreamMessage = error instanceof Error ? error.message.toLowerCase() : ''
    if (upstreamStatus === 402 || upstreamStatus === 429) {
      const noCredits = upstreamCode === 'insufficient_quota' || upstreamMessage.includes('no credits remaining')
      response.status(503).json({
        error: noCredits
          ? 'Your OpenRouter account has no credits remaining. Add credits to your OpenRouter account, then try again.'
          : 'OpenRouter is rate-limiting requests. Wait a little and try again.',
      })
      return
    }
    if (error instanceof ZodError) {
      response.status(502).json({ error: 'The assistant returned a trip plan in an unexpected format.' })
      return
    }

    console.error('Trip plan request failed:', error instanceof Error ? error.message : 'Unknown error')
    response.status(502).json({ error: 'We could not create your trip plan. Please try again.' })
  }
})

app.listen(port, '127.0.0.1', () => {
  console.log(`Trip planning API listening on http://127.0.0.1:${port}`)
})