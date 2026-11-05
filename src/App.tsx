import { useEffect, useState } from 'react'
import { ArrowLeft, Plane } from 'lucide-react'
import { BookingSuccessScreen } from './features/trip-planner/BookingSuccessScreen'
import { ResultsScreen } from './features/trip-planner/ResultsScreen'
import { TripFormScreen } from './features/trip-planner/TripFormScreen'
import { WelcomeScreen } from './features/trip-planner/WelcomeScreen'
import { createTripPlan } from './features/trip-planner/api'
import type { BookingType, TripDetails, TripPlan } from './features/trip-planner/types'
import './features/trip-planner/trip-planner.css'

type Screen = 'welcome' | 'form' | 'results' | 'booking-success'

const emptyTrip: TripDetails = {
  travellers: 1,
  origin: '',
  destination: '',
  fromDate: '',
  toDate: '',
  budget: 0,
}

function App() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [trip, setTrip] = useState<TripDetails>(emptyTrip)
  const [plan, setPlan] = useState<TripPlan | null>(null)
  const [bookingType, setBookingType] = useState<BookingType>('flight')

  useEffect(() => {
    if (screen !== 'booking-success') return
    const timer = window.setTimeout(() => {
      setScreen('welcome')
      setTrip(emptyTrip)
      setPlan(null)
    }, 5000)
    return () => window.clearTimeout(timer)
  }, [screen])

  function goBack() {
    setScreen((current) => current === 'results' ? 'form' : 'welcome')
  }

  async function handleTripSubmit(details: TripDetails) {
    const result = await createTripPlan(details)
    setTrip(details)
    setPlan(result)
    setScreen('results')
  }

  function returnHome() {
    setScreen('welcome')
    setTrip(emptyTrip)
    setPlan(null)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        {screen !== 'welcome' && screen !== 'booking-success' ? (
          <button className="back-button" onClick={goBack} type="button" aria-label="Go back">
            <ArrowLeft size={19} aria-hidden="true" />
            <span>Back</span>
          </button>
        ) : <span className="topbar-spacer" />}
        <a className="brand" href="#home" onClick={(event) => { event.preventDefault(); setScreen('welcome') }}>
          <span className="brand-icon"><Plane size={16} aria-hidden="true" /></span>
          <span className="brand-name">wayfarer</span>
          <span className="brand-agent">agent</span>
        </a>
        <span className="step-indicator">{screen === 'welcome' ? '01' : screen === 'form' ? '02' : screen === 'results' ? '03' : 'DONE'} <span>{screen === 'booking-success' ? '' : '/ 03'}</span></span>
      </header>

      {screen === 'welcome' && <WelcomeScreen onBegin={() => setScreen('form')} />}
      {screen === 'form' && (
        <TripFormScreen
          initialTrip={trip}
          onSubmit={handleTripSubmit}
        />
      )}
      {screen === 'results' && plan && <ResultsScreen trip={trip} plan={plan} onBook={(type) => { setBookingType(type); setScreen('booking-success') }} />}
      {screen === 'booking-success' && <BookingSuccessScreen bookingType={bookingType} onReturnHome={returnHome} />}
    </main>
  )
}

export default App