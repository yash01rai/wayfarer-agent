import { ArrowDown, ArrowUpRight, CloudSun, Plane, Sparkles } from 'lucide-react'
import type { BookingType, TripDetails, TripPlan } from './types'

interface ResultsScreenProps {
  trip: TripDetails
  plan: TripPlan
  onBook: (type: BookingType) => void
}

function formatDate(value: string) {
  if (!value) return 'Date to be decided'
  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: '2-digit' }).format(new Date(`${value}T12:00:00`))
}

export function ResultsScreen({ trip, plan, onBook }: ResultsScreenProps) {
  return (
    <section className="results-screen">
      <div className="results-heading">
        <p className="eyebrow"><span className="eyebrow-dot" /> A FIRST LOOK AT YOUR GETAWAY</p>
        <h1>Your trip,<br /><em>taking shape.</em></h1>
      </div>
      <div className="itinerary-strip">
        <div className="route-summary">
          <span className="route-city">{trip.origin}</span><span className="route-mark"><Plane size={16} /><span /></span><span className="route-city">{trip.destination}</span>
        </div>
        <div className="route-meta"><span>{formatDate(trip.fromDate)} <ArrowDown size={12} /> {formatDate(trip.toDate)}</span><span>{trip.travellers} {trip.travellers === 1 ? 'traveller' : 'travellers'} · ${trip.budget.toLocaleString()} budget</span></div>
      </div>
      <div className="recommendation-intro"><span><Sparkles size={16} /> THE SHORTLIST</span><span>BASED ON YOUR BRIEF</span></div>
      <div className="recommendation-list">
        <article className="recommendation weather-recommendation">
          <div className="recommendation-title"><span className="recommendation-icon"><CloudSun size={20} /></span><div><span className="card-kicker">CURRENT IN {plan.weather.location.toUpperCase()}</span><h2>{plan.weather.condition}</h2></div></div>
          <p>{plan.weather.advice}</p>
          <div className="weather-temperatures"><strong>{Math.round(plan.weather.lowC)}° <span>LOW</span></strong><span className="weather-divider" /><strong>{Math.round(plan.weather.highC)}° <span>HIGH</span></strong><span className="weather-label">NOW {Math.round(plan.weather.temperatureC)}°C</span></div>
        </article>
        <article className="recommendation">
          <div className="recommendation-title"><span className="recommendation-icon"><Plane size={20} /></span><div><span className="card-kicker">FLIGHTS · MOCK PICK</span><h2>{plan.flight.title}</h2></div></div>
          <p>{plan.flight.description}</p>
          <button type="button" className="book-button" onClick={() => onBook('flight')}>Book this flight <ArrowUpRight size={15} /></button>
        </article>
        <article className="recommendation">
          <div className="recommendation-title"><span className="recommendation-icon hotel-icon">⌂</span><div><span className="card-kicker">HOTEL · MOCK PICK</span><h2>{plan.hotel.title}</h2></div></div>
          <p>{plan.hotel.description}</p>
          <button type="button" className="book-button" onClick={() => onBook('hotel')}>Book this stay <ArrowUpRight size={15} /></button>
        </article>
      </div>
      <div className="results-footnote"><span>YOUR PLAN IS A STARTING POINT, NOT A RULEBOOK.</span><span>✳</span></div>
    </section>
  )
}