import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api'
import AuthShell from '../components/AuthShell'
import Toast from '../components/Toast'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setToast(null)
    
    try {
      const { body } = await login(form)
      if (body?.success) {
        setToast({ type: 'success', msg: 'Welcome back! Redirecting...' })
        setTimeout(() => navigate('/dashboard'), 1200)
      } else {
        setToast({ type: 'error', msg: body?.message || 'Login failed.' })
      }
    } catch (err) {
      setToast({ type: 'error', msg: 'Network error — cannot reach backend.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Welcome Back" subtitle="Sign in to LEO.">
      {toast && <Toast type={toast.type} msg={toast.msg} />}

      <form onSubmit={submit} autoComplete="off">
        <div className="form-group anim-item">
          <label className="form-label">Email Address</label>
          <div className="input-wrap">
            <input id="login-email" className="form-input" type="email" placeholder="john@example.com"
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
          <label className="form-label">Password</label>
          <div className="input-wrap">
            <input id="login-password" className="form-input" type="password" placeholder="Enter password"
              value={form.password} onChange={set('password')} required />
            <span className="input-icon" aria-hidden>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" />
                <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </div>
        
        <div className="forgot-row anim-item">
          <Link to="/forgot" className="form-link">Forgot password?</Link>
        </div>

        <button id="login-submit" className="btn-primary anim-item" type="submit" disabled={loading}>
          {loading ? <><span className="spinner" /> Signing in…</> : 'Sign In →'}
        </button>
      </form>

      <div className="form-footer anim-item">
        Don't have an account?&nbsp;
        <Link to="/register" className="form-link">Create one</Link>
      </div>
    </AuthShell>
  )
}
