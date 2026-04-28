'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      window.location.href = '/dashboard'
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      window.location.href = '/dashboard'
    }
    setLoading(false)
  }

  const s: any = {
    page: { minHeight: '100vh', background: '#0a0b0d', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' },
    box: { width: '100%', maxWidth: '400px' },
    logo: { fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '700', color: '#e8eaf0', marginBottom: '8px' },
    sub: { fontSize: '14px', color: '#8a93a8', marginBottom: '32px' },
    label: { fontFamily: 'monospace', fontSize: '11px', letterSpacing: '.1em', textTransform: 'uppercase' as const, color: '#4a5568', marginBottom: '6px', display: 'block' },
    input: { width: '100%', padding: '10px 14px', background: '#181c23', border: '1px solid rgba(255,255,255,.11)', borderRadius: '6px', color: '#e8eaf0', fontSize: '14px', outline: 'none', marginBottom: '12px' },
    btn: { width: '100%', padding: '12px', background: '#c9a84c', border: 'none', borderRadius: '6px', color: '#0a0b0d', fontSize: '14px', fontWeight: '700', cursor: 'pointer' },
    toggle: { marginTop: '16px', textAlign: 'center' as const, fontSize: '13px', color: '#8a93a8' },
    link: { color: '#c9a84c', cursor: 'pointer', textDecoration: 'underline' },
    err: { color: '#f87171', fontSize: '13px', marginBottom: '12px', padding: '10px', background: 'rgba(248,113,113,.1)', borderRadius: '6px', border: '1px solid rgba(248,113,113,.2)' },
  }

  return (
    <div style={s.page}>
      <div style={s.box}>
        <div style={s.logo}>LeadHunter <span style={{ color: '#c9a84c' }}>Pro</span></div>
        <p style={s.sub}>{mode === 'login' ? 'Sign in to your account' : 'Create your account'}</p>
        <form onSubmit={handleSubmit}>
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
          {error && <div style={s.err}>{error}</div>}
          <button style={{ ...s.btn, opacity: loading ? .6 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <div style={s.toggle}>
          {mode === 'login' ? (
            <>No account? <span style={s.link} onClick={() => setMode('signup')}>Sign up free</span></>
          ) : (
            <>Already have an account? <span style={s.link} onClick={() => setMode('login')}>Sign in</span></>
          )}
        </div>
      </div>
    </div>
  )
}
