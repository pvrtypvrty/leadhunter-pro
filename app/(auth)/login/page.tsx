'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    })
    if (!error) setSent(true)
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0b0d', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '700', color: '#e8eaf0', marginBottom: '8px' }}>
            LeadHunter <span style={{ color: '#c9a84c' }}>Pro</span>
          </div>
          <p style={{ fontSize: '14px', color: '#8a93a8' }}>Sign in to your account</p>
        </div>
        {sent ? (
          <div style={{ padding: '20px', background: '#111318', border: '1px solid rgba(74,222,128,.2)', borderRadius: '8px', color: '#4ade80', fontSize: '14px', lineHeight: '1.6' }}>
            Check your email. We sent a sign-in link to <strong>{email}</strong>.
          </div>
        ) : (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#4a5568' }}>Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required
                style={{ padding: '10px 14px', background: '#181c23', border: '1px solid rgba(255,255,255,.11)', borderRadius: '6px', color: '#e8eaf0', fontSize: '14px', outline: 'none' }} />
            </div>
            <button type="submit" disabled={loading}
              style={{ padding: '12px', background: '#c9a84c', border: 'none', borderRadius: '6px', color: '#0a0b0d', fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .6 : 1 }}>
              {loading ? 'Sending...' : 'Send sign-in link'}
            </button>
          </form>
        )}
        <p style={{ marginTop: '20px', fontSize: '12px', color: '#4a5568', textAlign: 'center' }}>No password needed. We email you a secure link.</p>
      </div>
    </div>
  )
}
