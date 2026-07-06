import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { reset } from '../api'
import AuthShell from '../components/AuthShell'
import Toast from '../components/Toast'

export default function Reset() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', otp: '', newPassword: '' })
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    if (form.newPassword.length < 8) return setToast({ type: 'warn', msg: 'Password must be at least 8 characters.' })
    setLoading(true)
    setToast(null)
    const { body } = await reset(form)
    setLoading(false)
    if (body?.success) {
      setToast({ type: 'success', msg: 'Password reset! Redirecting to login…' })
      setTimeout(() => navigate('/login'), 1600)
    } else {
      setToast({ type: 'error', msg: body?.message || 'Reset failed.' })
    }
  }

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const qEmail = params.get('email') || ''
      const qOtp = params.get('otp') || ''
      if (qEmail || qOtp) setForm(f => ({ ...f, email: qEmail, otp: qOtp }))
    } catch (e) {
      // ignore
    }
  }, [])

  return (
    <AuthShell title="New Password" subtitle="Enter your reset code and choose a new password.">
      {toast && <Toast type={toast.type} msg={toast.msg} />}

      <form onSubmit={submit}>
        <div className="form-group anim-item">
          <label className="form-label">Email Address</label>
          <div className="input-wrap">
            <input id="reset-email" className="form-input" type="email" placeholder="john@example.com"
              value={form.email} onChange={set('email')} required />
            <span className="input-icon" aria-hidden>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6.5V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 6.5l-9 6-9-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </div>

        <div className="form-group anim-item">
          <label className="form-label">Reset Code (OTP)</label>
          <div className="input-wrap">
            <input id="reset-otp" className="form-input" placeholder="6-digit code"
              value={form.otp} onChange={set('otp')} required />
            <span className="input-icon" aria-hidden>
              <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a5 5 0 0 0-5 5v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/><rect x="3" y="10" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" fill="none"/></svg>
            </span>
          </div>
        </div>

        <div className="form-group anim-item">
          <label className="form-label">New Password</label>
          <div className="input-wrap">
            <input id="reset-password" className="form-input" type="password" placeholder="Min. 8 characters"
              value={form.newPassword} onChange={set('newPassword')} required minLength={8} />
            <span className="input-icon" aria-hidden>
              <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" fill="none"/><path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            </span>
          </div>
        </div>

        <button id="reset-submit" className="btn-primary anim-item" type="submit" disabled={loading}>
          {loading ? <><span className="spinner" /> Resetting…</> : 'Reset Password →'}
        </button>
      </form>

      <div className="form-footer anim-item">
        <Link to="/forgot" className="form-link">← Resend code</Link>
      </div>
    </AuthShell>
  )
}
