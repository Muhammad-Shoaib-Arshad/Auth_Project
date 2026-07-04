import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const TYPE_CLASS = {
  success: 'toast-success',
  error:   'toast-error',
  info:    'toast-info',
  warn:    'toast-warn',
}

const ICON = { success: '✓', error: '✕', info: 'ℹ', warn: '⚠' }

export default function Toast({ type = 'info', msg }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    gsap.to(el, { opacity: 1, y: 0, duration: 0.35, ease: 'expo.out' })
    return () => gsap.to(el, { opacity: 0, y: -6, duration: 0.2 })
  }, [msg])

  return (
    <div ref={ref} className={`toast ${TYPE_CLASS[type] || 'toast-info'}`} style={{ opacity: 0, transform: 'translateY(-8px)' }}>
      <span style={{ fontWeight: 700, flexShrink: 0 }}>{ICON[type]}</span>
      <span>{msg}</span>
    </div>
  )
}
