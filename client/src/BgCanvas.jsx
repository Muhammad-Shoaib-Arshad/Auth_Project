import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function BgCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let W, H

    const orbs = []
    const particles = []

    function resize() {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Create floating orbs
    const orbDefs = [
      { x: 0.12, y: 0.25, r: 320, color: [168, 184, 74] },
      { x: 0.78, y: 0.6,  r: 220, color: [112, 130, 58] },
      { x: 0.45, y: 0.85, r: 180, color: [98, 128, 90] },
    ]
    orbDefs.forEach(d => orbs.push({
      ...d, vx: (Math.random()-0.5)*0.12, vy: (Math.random()-0.5)*0.12,
      phase: Math.random() * Math.PI * 2
    }))

    // Create star particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random(), y: Math.random(),
        r: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.6 + 0.1,
        speed: Math.random() * 0.0002 + 0.0001
      })
    }

    let t = 0
    function draw() {
      t += 0.005
      ctx.clearRect(0, 0, W, H)

      // Dark gradient base
      const bg = ctx.createRadialGradient(W*0.5, H*0.5, 0, W*0.5, H*0.5, Math.max(W,H))
      bg.addColorStop(0,   'rgba(8,13,26,1)')
      bg.addColorStop(1,   'rgba(4,6,12,1)')
      ctx.fillStyle = bg
      ctx.fillRect(0,0,W,H)

      // Draw orbs
      orbs.forEach(o => {
        o.phase += 0.004
        const cx = (o.x + Math.sin(o.phase) * 0.06) * W
        const cy = (o.y + Math.cos(o.phase * 0.8) * 0.04) * H
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, o.r)
        const [r, gv, b] = o.color
        g.addColorStop(0, `rgba(${r},${gv},${b},0.11)`)
        g.addColorStop(0.5,`rgba(${r},${gv},${b},0.04)`)
        g.addColorStop(1,  `rgba(${r},${gv},${b},0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(cx, cy, o.r, 0, Math.PI*2)
        ctx.fill()
      })

      // Draw particles
      particles.forEach(p => {
        p.y -= p.speed
        if (p.y < 0) p.y = 1
        const alpha = p.alpha * (0.5 + 0.5 * Math.sin(t + p.phase || 0))
        ctx.beginPath()
        ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI*2)
        ctx.fillStyle = `rgba(180, 210, 255, ${alpha})`
        ctx.fill()
      })

      // Grid lines (subtle)
      ctx.strokeStyle = 'rgba(79,142,255,0.025)'
      ctx.lineWidth = 1
      const gridStep = 80
      for (let x = 0; x < W; x += gridStep) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }
      for (let y = 0; y < H; y += gridStep) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} id="bg-canvas" />
}
