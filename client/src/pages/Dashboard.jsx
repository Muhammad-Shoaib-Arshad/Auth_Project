import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import gsap from 'gsap'
import { me, logout } from '../api'
import BgCanvas from '../BgCanvas'
import Toast from '../components/Toast'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)
  const headerRef = useRef(null)
  const bodyRef   = useRef(null)

  useEffect(() => {
    me().then(({ body }) => {
      if (!body?.success) return navigate('/login')
      setUser(body.user)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!user) return
    const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 0.8 } })
    tl.fromTo(headerRef.current, { opacity: 0, y: -30 }, { opacity: 1, y: 0 })
      .fromTo(bodyRef.current.querySelectorAll('.dash-anim'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1 },
        '-=0.5'
      )
  }, [user])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (loading) return (
    <div className="page-loader">
      <div className="loader-ring" />
      <span className="loader-text">Loading…</span>
    </div>
  )

  const joinedDate = user._id
    ? new Date(parseInt(user._id.toString().substring(0,8), 16) * 1000).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })
    : 'N/A'

  return (
    <>
      <BgCanvas />
      <div className="dashboard-wrap">
        {toast && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 200, width: 340 }}><Toast type={toast.type} msg={toast.msg} /></div>}

        <header className="dash-header" ref={headerRef}>
          <div className="dash-nav-brand">
            <span style={{ fontSize: 22, display: 'inline-flex', alignItems: 'center' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" style={{ marginRight: 8 }} xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="g2" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0" stopColor="#4f8eff" />
                    <stop offset="1" stopColor="#a259ff" />
                  </linearGradient>
                </defs>
                <rect x="1" y="2" width="22" height="20" rx="5" fill="url(#g2)" />
              </svg>
            </span>
            LEO
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {!user.isAccountVerified && (
              <Link to="/verify" className="btn-ghost" style={{ fontSize: 13, padding: '8px 14px' }}>
                ⚠ Verify Email
              </Link>
            )}
            <button id="logout-btn" className="btn-ghost" onClick={handleLogout} style={{ fontSize: 13 }}>
              Sign Out
            </button>
          </div>
        </header>

        <main className="dash-body" ref={bodyRef}>
          <div className="dash-anim">
            <h1 className="dash-welcome">
              Hello, <span>{user.name?.split(' ')[0] || 'User'}</span> 👋
            </h1>
            <p className="dash-sub">Your LEO account is active and secured.</p>
          </div>

          <div className="stats-grid">
            {[
              { icon: '🔐', cls: 'blue',   label: 'Auth Status',     value: 'Authenticated' },
              { icon: '✅', cls: 'green',  label: 'Email Status',    value: user.isAccountVerified ? 'Verified' : 'Pending' },
              { icon: '📅', cls: 'purple', label: 'Member Since',    value: joinedDate },
              { icon: '⚡', cls: 'gold',   label: 'Security Level',  value: 'Standard' },
            ].map((s, i) => (
              <div key={i} className="stat-card dash-anim">
                <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value" style={{ fontSize: 16, marginTop: 4 }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div className="info-panel dash-anim">
            <div className="info-panel-title">
              <span>🪪</span> Account Details
            </div>
            <div className="info-row">
              <span className="info-row-key">Display Name</span>
              <span className="info-row-val">{user.name}</span>
            </div>
            <div className="info-row">
              <span className="info-row-key">Email Address</span>
              <span className="info-row-val">{user.email}</span>
            </div>
            <div className="info-row">
              <span className="info-row-key">Account ID</span>
              <span className="info-row-val" style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{user._id}</span>
            </div>
            <div className="info-row">
              <span className="info-row-key">Email Verification</span>
              <span>
                {user.isAccountVerified
                  ? <span className="badge badge-green">✓ Verified</span>
                  : <span className="badge badge-yellow">⚠ Not Verified</span>}
              </span>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
