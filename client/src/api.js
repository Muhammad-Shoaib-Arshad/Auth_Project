// During development, Vite proxy can sometimes behave unexpectedly when using 127.0.0.1.
// Use direct backend origin when running the frontend on port 5173 to avoid proxy issues.
let API_BASE = ''
try {
  if (typeof window !== 'undefined' && window.location && window.location.port === '5173') {
    API_BASE = 'http://127.0.0.1:5000'
  }
} catch (e) { /* ignore */ }

async function request(path, opts = {}) {
  try {
    const res = await fetch(API_BASE + path, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      ...opts
    })
    const text = await res.text()
    try { return { status: res.status, body: JSON.parse(text) } }
    catch { return { status: res.status, body: text } }
  } catch (error) {
    console.error('Fetch error:', error);
    return { status: 0, body: { success: false, message: `Network/Fetch Error: ${error.message}` } }
  }
}

export const register = (payload) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) })
export const login = (payload) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) })
export const logout = () => request('/api/auth/logout', { method: 'POST' })
export const me = () => request('/api/auth/me')
export const sendVerify = () => request('/api/auth/send-verify-otp', { method: 'POST' })
export const verify = (payload) => request('/api/auth/verify-email', { method: 'POST', body: JSON.stringify(payload) })
export const verifyPublic = (payload) => request('/api/auth/verify-email-public', { method: 'POST', body: JSON.stringify(payload) })
export const forgot = (payload) => request('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify(payload) })
export const reset = (payload) => request('/api/auth/reset-password', { method: 'POST', body: JSON.stringify(payload) })

export default { register, login, logout, me, sendVerify, verify, forgot, reset }
