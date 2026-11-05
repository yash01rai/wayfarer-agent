import { ArrowUpRight } from 'lucide-react'

interface WelcomeScreenProps {
  onBegin: () => void
}

function TravelCat() {
  return (
    <svg className="travel-cat" viewBox="0 0 300 270" role="img" aria-label="A cat ready to travel with a suitcase">
      <circle cx="145" cy="126" r="94" fill="#b7e9e7" />
      <circle cx="145" cy="126" r="82" fill="none" stroke="#0b3d48" strokeWidth="3" opacity=".55" />
      <path d="M77 105h18M187 89h14M74 144h18M197 137h17M96 69h11M181 171h17" stroke="#f5ffff" strokeWidth="6" strokeLinecap="round" />
      <circle cx="106" cy="119" r="4" fill="#f5ffff" /><circle cx="190" cy="112" r="3" fill="#f5ffff" />
      <path d="M91 195c-20 1-28 11-21 17 11 8 41 5 54 0M171 202c22 8 48 10 54 3 5-6-4-10-19-11" fill="#8ac9c8" stroke="#0b3d48" strokeWidth="4" strokeLinecap="round" />
      <path d="M121 183c-12 9-17 20-16 29 1 7 11 9 18 2l12-15 12 16c7 8 18 5 17-3-1-11-6-22-17-30" fill="#e9ffff" stroke="#0b3d48" strokeWidth="4" strokeLinejoin="round" />
      <path d="M122 91 108 62c-2-5 2-9 7-6l27 13 27-13c5-2 9 2 7 7l-14 29" fill="#e9ffff" stroke="#0b3d48" strokeWidth="4" strokeLinejoin="round" />
      <path d="m117 71 14 7-12 13zM169 78l13-8-3 19z" fill="#f49b91" />
      <ellipse cx="145" cy="111" rx="37" ry="34" fill="#f3ffff" stroke="#0b3d48" strokeWidth="4" />
      <path d="M135 111c0 3-2 5-5 5s-5-2-5-5 2-5 5-5 5 2 5 5ZM166 111c0 3-2 5-5 5s-5-2-5-5 2-5 5-5 5 2 5 5Z" fill="#0b3d48" />
      <path d="m141 122 4 3 4-3M145 125c-4 5-9 5-12 2M145 125c4 5 9 5 12 2M126 124l-10-2m10 7-11 2m49-7 10-2m-10 7 11 2" fill="none" stroke="#0b3d48" strokeWidth="3" strokeLinecap="round" />
      <path d="M123 144c-7 15-10 38-7 58 2 10 13 11 18 2l11-20 11 20c5 9 16 8 18-2 3-20 0-43-7-58" fill="#f3ffff" stroke="#0b3d48" strokeWidth="4" strokeLinejoin="round" />
      <path d="M130 198v10m29-10v10" stroke="#0b3d48" strokeWidth="4" strokeLinecap="round" />
      <rect x="207" y="160" width="36" height="52" rx="5" fill="#43d2ac" stroke="#0b3d48" strokeWidth="4" />
      <path d="M216 160v-8c0-7 18-7 18 0v8m-9 12v18m-6-12 6-6 6 6" fill="none" stroke="#0b3d48" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="149" cy="218" rx="79" ry="10" fill="#0b3d48" opacity=".12" />
    </svg>
  )
}

export function WelcomeScreen({ onBegin }: WelcomeScreenProps) {
  return (
    <section className="welcome-screen" id="home">
      <div className="welcome-copy">
        <p className="eyebrow"><span className="eyebrow-dot" /> YOUR PERSONAL TRAVEL PLANNER</p>
        <h1>Somewhere<br /><em>starts here.</em></h1>
        <p className="welcome-description">A little inspiration, a clever plan, and a trip that feels like yours.</p>
        <button className="primary-button welcome-button" onClick={onBegin} type="button">
          Let’s begin <ArrowUpRight size={19} aria-hidden="true" />
        </button>
      </div>
      <div className="welcome-art-wrap">
        <div className="art-caption"><span>YOUR NEXT ADVENTURE</span><span>NO. 001</span></div>
        <TravelCat />
        <div className="art-footnote"><span>Curiosity looks good on you.</span><span>✳</span></div>
      </div>
      <div className="welcome-footer"><span>MADE FOR THE WAY YOU WANDER</span><span>SCROLL LESS. GO FURTHER.</span></div>
    </section>
  )
}