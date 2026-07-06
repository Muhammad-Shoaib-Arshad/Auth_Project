import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import BgCanvas from '../BgCanvas'

export default function AuthShell({ children, title, subtitle }) {
  const cardRef = useRef(null)
  const brandRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 0.9 } })
    tl.fromTo(brandRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0 }
    )
    .fromTo(cardRef.current,
      { opacity: 0, y: 40, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1 },
      '-=0.5'
    )
    .fromTo(cardRef.current.querySelectorAll('.anim-item'),
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, stagger: 0.07 },
      '-=0.6'
    )
  }, [title])

  return (
    <>
      <BgCanvas />
      <div className="page-wrap split">
        <div className="hero" aria-hidden>
          <div className="hero-inner">
            <div className="hero-copy">
              <h1>Grow with LEO — Identity That Grows With You</h1>
              <p className="lead">Enterprise-grade security, delightfully simple. Built for teams who want secure auth without the complexity.</p>

              <ul className="hero-features">
                <li>Passwordless &amp; traditional auth</li>
                <li>Built-in email verification</li>
                <li>Scales instantly</li>
              </ul>

              <div className="hero-ctas">
                <Link to="/register" className="btn-primary">Create Free Account</Link>
                <Link to="/register" className="btn-ghost" style={{ marginLeft: 12 }}>See How It Works</Link>
              </div>

              <p className="hero-trust">Trusted by startups and teams — SOC2-ready practices • Encrypted by default.</p>
              <p className="hero-terms">By creating an account you agree to our <a href="#" className="form-link">Terms</a> &amp; <a href="#" className="form-link">Privacy</a>.</p>
            </div>
          </div>
        </div>

        <div className="content">
          <div className="brand" ref={brandRef}>
            <div className="brand-icon" aria-hidden>
              <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="LEO logo">
                <defs>
                  <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0" stopColor="#a8b84a" />
                    <stop offset="1" stopColor="#70823a" />
                  </linearGradient>
                </defs>
                <rect x="4" y="8" width="56" height="48" rx="10" fill="url(#g1)" opacity="0.98" />
                <path d="M20 36c4-6 12-10 12-10s8 4 12 10c-6 6-18 6-24 0z" fill="rgba(255,255,255,0.92)" opacity="0.92" />
                <circle cx="26" cy="28" r="2" fill="#071007" />
                <circle cx="38" cy="28" r="2" fill="#071007" />
              </svg>
            </div>
            <span className="brand-name">LEO</span>
          </div>

          <div className="glass-card" ref={cardRef}>
            <h1 className="card-title anim-item">{title}</h1>
            {subtitle && <p className="card-subtitle anim-item">{subtitle}</p>}
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
