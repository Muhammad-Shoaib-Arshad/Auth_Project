import { useEffect, useRef } from 'react'
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
      <div className="page-wrap">
        <div className="brand" ref={brandRef}>
          <div className="brand-icon">⬡</div>
          <span className="brand-name">NEXUS</span>
        </div>

        <div className="glass-card" ref={cardRef}>
          <h1 className="card-title anim-item">{title}</h1>
          {subtitle && <p className="card-subtitle anim-item">{subtitle}</p>}
          {children}
        </div>
      </div>
    </>
  )
}
