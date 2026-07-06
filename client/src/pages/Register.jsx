import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../api'
import AuthShell from '../components/AuthShell'
import Toast from '../components/Toast'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setToast(null)

    try {
      const { body } = await register(form)
      if (body?.success) {
        setToast({ type: 'success', msg: 'Account created — redirecting to login…' })
        setTimeout(() => navigate('/login'), 1200)
      } else {
        setToast({ type: 'error', msg: body?.message || 'Registration failed.' })
      }
    } catch (err) {
      setToast({ type: 'error', msg: 'Network error — cannot reach backend.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="Secure sign‑up for teams and builders.">
      {toast && <Toast type={toast.type} msg={toast.msg} />}

      <form onSubmit={submit} autoComplete="off">
        <div className="form-group anim-item">
          <label className="form-label">Full name</label>
          <div className="input-wrap">
            <input className="form-input" value={form.name} onChange={update('name')} placeholder="Full name" required />
            <span className="input-icon" aria-hidden>
              <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zM4 21v-1c0-2.8 2.2-5 5-5h6c2.8 0 5 2.2 5 5v1H4z" fill="currentColor"/></svg>
            </span>
          </div>
        </div>

        <div className="form-group anim-item">
          <label className="form-label">Email address</label>
          <div className="input-wrap">
            <input className="form-input" value={form.email} onChange={update('email')} type="email" placeholder="you@example.com" required />
            <span className="input-icon" aria-hidden>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6.5V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 6.5l-9 6-9-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </div>
        </div>

        <div className="form-group anim-item">
          <label className="form-label">Password</label>
          <div className="input-wrap">
            <input className="form-input" value={form.password} onChange={update('password')} type="password" placeholder="Min. 8 characters" required minLength={8} />
            <span className="input-icon" aria-hidden>
              <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" fill="none"/><path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            </span>
          </div>
        </div>

        <button className="btn-primary anim-item" type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create Account'}</button>
      </form>

      <div className="form-footer anim-item">
        Already have an account?&nbsp;<Link to="/login" className="form-link">Sign in</Link>
      </div>
    </AuthShell>
  )
}
