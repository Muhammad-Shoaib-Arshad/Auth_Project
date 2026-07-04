import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../api'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus('Sending registration...')

    try {
      const { body } = await register(form)
      setStatus(JSON.stringify(body, null, 2))
      if (body?.success) {
        setTimeout(() => navigate('/login'), 1200)
      }
    } catch (err) {
      setStatus('Network error: cannot reach backend.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input value={form.name} onChange={update('name')} placeholder="Full name" required />
        <input value={form.email} onChange={update('email')} type="email" placeholder="Email" required />
        <input value={form.password} onChange={update('password')} type="password" placeholder="Password" required minLength={8} />
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
      </form>
      <div className="info">Already have an account? <Link to="/login">Login</Link></div>
      <pre>{status}</pre>
    </div>
  )
}
