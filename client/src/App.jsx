import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Register  from './pages/Register'
import Login     from './pages/Login'
import Verify    from './pages/Verify'
import Forgot    from './pages/Forgot'
import Reset     from './pages/Reset'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/"          element={<Navigate to="/login" replace />} />
      <Route path="/register"  element={<Register />} />
      <Route path="/login"     element={<Login />} />
      <Route path="/verify"    element={<Verify />} />
      <Route path="/forgot"    element={<Forgot />} />
      <Route path="/reset"     element={<Reset />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}
