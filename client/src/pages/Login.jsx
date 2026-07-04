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
    <AuthShell title="Welcome Back" subtitle="Sign in to your NEXUS account.">
      {toast && <Toast type={toast.type} msg={toast.msg} />}

      <form onSubmit={submit} autoComplete="off">
        <div className="form-group anim-item">
          <label className="form-label">Email Address</label>
          <div className="input-wrap">
            <input id="login-email" className="form-input" type="email" placeholder="john@example.com"
              value={form.email} onChange={set('email')} required />
            <span className="input-icon">✉</span>
          </div>
        </div>

        <div className="form-group anim-item">
          <label className="form-label">Password</label>
          <div className="input-wrap">
            <input id="login-password" className="form-input" type="password" placeholder="Enter password"
              value={form.password} onChange={set('password')} required />
            <span className="input-icon">🔒</span>
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
