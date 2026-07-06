import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgot } from '../api'
import AuthShell from '../components/AuthShell'
import Toast from '../components/Toast'

export default function Forgot() {
  const [email, setEmail] = useState('')
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [devOtp, setDevOtp] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setToast(null)
    const { body } = await forgot({ email })
    setLoading(false)
    if (body?.success) {
      setSent(true)
      setToast({ type: 'success', msg: body.message || 'Reset code sent!' })
      if (body.otp) setDevOtp(body.otp)
    } else {
      setToast({ type: 'error', msg: body?.message || 'Request failed.' })
    }
  }

  return (
    <AuthShell title="Reset Password" subtitle="We'll send a reset code to your inbox.">
      {toast && <Toast type={toast.type} msg={toast.msg} />}

      {!sent ? (
        <form onSubmit={submit}>
          <div className="form-group anim-item">
            <label className="form-label">Email Address</label>
            <div className="input-wrap">
              <input id="forgot-email" className="form-input" type="email" placeholder="john@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} required />
                <span className="input-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6.5V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 6.5l-9 6-9-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
            </div>
          </div>
          <button id="forgot-submit" className="btn-primary anim-item" type="submit" disabled={loading}>
            {loading ? <><span className="spinner" /> Sending…</> : 'Send Reset Code →'}
          </button>
        </form>
      ) : (
          <div className="anim-item" style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }} aria-hidden>
            <svg viewBox="0 0 64 64" width="56" height="56" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="18" width="52" height="34" rx="4" fill="#a8b84a" />
              <rect x="10" y="22" width="44" height="22" rx="3" fill="#fff" />
            </svg>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
            A reset code was sent to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>.
            Check your inbox and use it on the next step.
          </p>
          {devOtp && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'inline-block', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: 10, fontWeight: 700 }}>{devOtp}</div>
              <div style={{ fontSize: 12, color: '#bfc9ad', marginTop: 6 }}>Development OTP (shown because email not configured)</div>
            </div>
          )}
          <Link to={`/reset?email=${encodeURIComponent(email)}${devOtp ? `&otp=${devOtp}` : ''}`} className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', padding: '13px 28px', borderRadius: 'var(--radius-sm)', color: '#fff', fontWeight: 600, fontFamily: 'var(--font-head)' }}>
            Enter Reset Code →
          </Link>
        </div>
      )}

      <div className="form-footer anim-item">
        <Link to="/login" className="form-link">← Back to Login</Link>
      </div>
    </AuthShell>
  )
}
