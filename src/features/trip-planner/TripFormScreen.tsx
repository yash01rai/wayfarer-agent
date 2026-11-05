import { useState, type FormEvent } from 'react'
import { Minus, Plus } from 'lucide-react'
import type { TripDetails } from './types'

interface TripFormScreenProps {
  initialTrip: TripDetails
  onSubmit: (trip: TripDetails) => Promise<void>
}

function localDateString(date: Date) {
  return [date.getFullYear(), `${date.getMonth() + 1}`.padStart(2, '0'), `${date.getDate()}`.padStart(2, '0')].join('-')
}

const today = localDateString(new Date())

export function TripFormScreen({ initialTrip, onSubmit }: TripFormScreenProps) {
  const [trip, setTrip] = useState(initialTrip)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  function update<K extends keyof TripDetails>(key: K, value: TripDetails[K]) {
    setTrip((current) => ({ ...current, [key]: value }))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await onSubmit(trip)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'We could not plan your trip. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="form-screen">
      <div className="section-heading">
        <p className="eyebrow"><span className="eyebrow-dot" /> THE GOOD PART BEGINS</p>
        <h1>Let’s make<br /><em>a plan.</em></h1>
        <p className="section-intro">A few details are all we need to get going.</p>
      </div>
      <form className="trip-form" onSubmit={submit}>
        <div className="field-group travellers-field">
          <div className="field-label-row"><label>Who’s coming along?</label><span className="field-note">01 / PEOPLE</span></div>
          <div className="stepper" aria-label="Number of travellers">
            <button type="button" onClick={() => update('travellers', Math.max(1, trip.travellers - 1))} aria-label="Remove a traveller" disabled={trip.travellers <= 1}><Minus size={16} /></button>
            <output aria-live="polite">{trip.travellers} <span>{trip.travellers === 1 ? 'traveller' : 'travellers'}</span></output>
            <button type="button" onClick={() => update('travellers', Math.min(12, trip.travellers + 1))} aria-label="Add a traveller" disabled={trip.travellers >= 12}><Plus size={16} /></button>
          </div>
        </div>

        <div className="form-grid">
          <div className="field-group">
            <label htmlFor="origin">Flying from</label>
            <input id="origin" value={trip.origin} onChange={(event) => update('origin', event.target.value)} placeholder="e.g. New York City" autoComplete="address-level2" required />
          </div>
          <div className="field-group">
            <label htmlFor="destination">Flying to</label>
            <input id="destination" value={trip.destination} onChange={(event) => update('destination', event.target.value)} placeholder="e.g. Paris" required />
          </div>
          <div className="field-group">
            <label htmlFor="from-date">Leaving on</label>
            <input id="from-date" type="date" min={today} value={trip.fromDate} onChange={(event) => {
              update('fromDate', event.target.value)
              if (trip.toDate < event.target.value) update('toDate', event.target.value)
            }} required />
          </div>
          <div className="field-group">
            <label htmlFor="to-date">Coming back</label>
            <input id="to-date" type="date" min={trip.fromDate || today} value={trip.toDate} onChange={(event) => update('toDate', event.target.value)} required />
          </div>
        </div>
        <div className="field-group budget-field">
          <div className="field-label-row"><label htmlFor="budget">Your trip budget</label><span className="field-note">02 / ALL IN</span></div>
          <div className="budget-input"><span aria-hidden="true">$</span><input id="budget" type="number" min="1" step="1" placeholder="5,000" value={trip.budget || ''} onChange={(event) => update('budget', Number(event.target.value))} required /><span className="budget-currency">USD</span></div>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="primary-button plan-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Putting your plan together…' : 'Find my trip'} <span aria-hidden="true">↗</span></button>
        <p className="form-note">Your details stay yours. We just use them to shape the plan.</p>
      </form>
      <div className="screen-index"><span>02</span><span>TRIP DETAILS</span><span className="index-line" /></div>
    </section>
  )
}