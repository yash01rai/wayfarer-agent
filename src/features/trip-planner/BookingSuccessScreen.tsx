import { ArrowUpRight, Check } from 'lucide-react'
import type { BookingType } from './types'

interface BookingSuccessScreenProps {
  bookingType: BookingType
  onReturnHome: () => void
}

export function BookingSuccessScreen({ bookingType, onReturnHome }: BookingSuccessScreenProps) {
  const itemName = bookingType === 'flight' ? 'flight' : 'hotel stay'

  return (
    <section className="booking-success" aria-live="polite">
      <div className="success-mark"><Check size={30} strokeWidth={2.5} /></div>
      <p className="eyebrow"><span className="eyebrow-dot" /> BOOKING CONFIRMED</p>
      <h1>Consider it<br /><em>on the list.</em></h1>
      <p className="success-copy">Your {itemName} has been added to this demo itinerary. No payment has been taken.</p>
      <div className="success-countdown"><span>Returning to your starting point</span><span>5 seconds</span><div className="countdown-track"><span /></div></div>
      <button className="text-action" type="button" onClick={onReturnHome}>Return home now <ArrowUpRight size={15} aria-hidden="true" /></button>
    </section>
  )
}