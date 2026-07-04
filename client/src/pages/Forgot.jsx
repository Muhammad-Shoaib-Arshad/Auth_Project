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

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setToast(null)
    const { body } = await forgot({ email })
    setLoading(false)
    if (body?.success) {
      setSent(true)
      setToast({ type: 'success', msg: body.message || 'Reset code sent!' })
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
              <span className="input-icon">✉</span>
            </div>
          </div>
          <button id="forgot-submit" className="btn-primary anim-item" type="submit" disabled={loading}>
            {loading ? <><span className="spinner" /> Sending…</> : 'Send Reset Code →'}
          </button>
        </form>
      ) : (
        <div className="anim-item" style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
            A reset code was sent to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>.
            Check your inbox and use it on the next step.
          </p>
          <Link to="/reset" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', padding: '13px 28px', borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg,#4f8eff,#6b5fff)', color: '#fff', fontWeight: 600, fontFamily: 'var(--font-head)' }}>
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
