import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendVerify, verify } from '../api'
import AuthShell from '../components/AuthShell'
import Toast from '../components/Toast'

export default function Verify() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)

  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[i] = val
    setOtp(next)
    if (val && i < 5) document.getElementById(`otp-${i+1}`)?.focus()
  }

  const handleOtpKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0)
      document.getElementById(`otp-${i-1}`)?.focus()
  }

  const sendOtp = async () => {
    setSending(true)
    setToast(null)
    const { body } = await sendVerify()
    setSending(false)
    if (body?.success) {
      setToast({ type: 'success', msg: body.message })
    } else {
      setToast({ type: 'error', msg: body?.message || 'Failed to send OTP.' })
    }
  }

  const doVerify = async (e) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) return setToast({ type: 'warn', msg: 'Enter all 6 digits.' })
    setLoading(true)
    setToast(null)
    const { body } = await verify({ otp: code })
    setLoading(false)
    if (body?.success) {
      setToast({ type: 'success', msg: 'Email verified! Redirecting…' })
      setTimeout(() => navigate('/dashboard'), 1500)
    } else {
      setToast({ type: 'error', msg: body?.message || 'Verification failed.' })
    }
  }

  return (
    <AuthShell title="Verify Email" subtitle="Enter the 6-digit code sent to your email.">
      {toast && <Toast type={toast.type} msg={toast.msg} />}

      <div className="anim-item" style={{ marginBottom: 22, textAlign: 'center' }}>
        <button id="send-otp-btn" className="btn-ghost" onClick={sendOtp} disabled={sending} type="button">
          {sending ? <><span className="spinner" style={{borderTopColor:'var(--accent)'}} /> Sending…</> : '📨 Send OTP to Email'}
        </button>
      </div>

      <form onSubmit={doVerify}>
        <div className="otp-row anim-item">
          {otp.map((v, i) => (
            <input key={i} id={`otp-${i}`} className="otp-input"
              type="text" inputMode="numeric" maxLength={1}
              value={v} onChange={e => handleOtpChange(i, e.target.value)}
              onKeyDown={e => handleOtpKey(i, e)} />
          ))}
        </div>

        <button id="verify-submit" className="btn-primary anim-item" type="submit" disabled={loading}>
          {loading ? <><span className="spinner" /> Verifying…</> : 'Verify Email →'}
        </button>
      </form>

      <div className="form-footer anim-item" style={{ marginTop: 16 }}>
        <Link to="/dashboard" className="form-link">← Back to Dashboard</Link>
      </div>
    </AuthShell>
  )
}
