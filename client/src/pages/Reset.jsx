import { useState } from 'react'
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

  return (
    <AuthShell title="New Password" subtitle="Enter your reset code and choose a new password.">
      {toast && <Toast type={toast.type} msg={toast.msg} />}

      <form onSubmit={submit}>
        <div className="form-group anim-item">
          <label className="form-label">Email Address</label>
          <div className="input-wrap">
            <input id="reset-email" className="form-input" type="email" placeholder="john@example.com"
              value={form.email} onChange={set('email')} required />
            <span className="input-icon">✉</span>
          </div>
        </div>

        <div className="form-group anim-item">
          <label className="form-label">Reset Code (OTP)</label>
          <div className="input-wrap">
            <input id="reset-otp" className="form-input" placeholder="6-digit code"
              value={form.otp} onChange={set('otp')} required />
            <span className="input-icon">🔑</span>
          </div>
        </div>

        <div className="form-group anim-item">
          <label className="form-label">New Password</label>
          <div className="input-wrap">
            <input id="reset-password" className="form-input" type="password" placeholder="Min. 8 characters"
              value={form.newPassword} onChange={set('newPassword')} required minLength={8} />
            <span className="input-icon">🔒</span>
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
