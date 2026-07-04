// Empty string = relative URL → proxied through Vite to http://localhost:5000
const API_BASE = ''

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
export const forgot = (payload) => request('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify(payload) })
export const reset = (payload) => request('/api/auth/reset-password', { method: 'POST', body: JSON.stringify(payload) })

export default { register, login, logout, me, sendVerify, verify, forgot, reset }
