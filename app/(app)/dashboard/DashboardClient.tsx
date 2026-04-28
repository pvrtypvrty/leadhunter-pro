'use client'
import { useState } from 'react'

export default function DashboardClient({ user, subscription }: any) {
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const plan = subscription?.plans?.name || 'Starter'
  const used = subscription?.searches_used || 0
  const limit = subscription?.plans?.searches_limit ?? 2
  const isEnterprise = subscription?.plan_id === 'enterprise'
  const remaining = isEnterprise ? 'Unlimited' : `${limit - used} remaining`

  async function runSearch() {
    if (!location || !category) return
    setLoading(true)
    setError('')
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location, category })
    })
    const data = await res.json()
    if (res.status === 403) {
      setError('Search limit reached. Upgrade your plan to continue.')
    } else if (data.leads) {
      setLeads(data.leads)
    }
    setLoading(false)
  }

  async function getPitch(lead: any) {
    const res = await fetch('/api/pitch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: lead.place.name,
        category: lead.place.types?.[0] || category,
        address: lead.place.formatted_address,
        phone: lead.place.formatted_phone_number,
        score: lead.score
      })
    })
    const data = await res.json()
    if (data.pitch) alert(`CALL SCRIPT:\n\n${data.pitch.call}\n\n---\nEMAIL SUBJECT: ${data.pitch.emailSubject}\n\n${data.pitch.email}\n\n---\nSMS:\n${data.pitch.sms}`)
  }

  const s: any = {
    page: { minHeight: '100vh', background: '#0a0b0d', color: '#e8eaf0', fontFamily: 'system-ui, sans-serif' },
    nav: { padding: '0 28px', height: '54px', background: 'rgba(10,11,13,.95)', borderBottom: '1px solid rgba(255,255,255,.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    logo: { fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '700', color: '#e8eaf0' },
    pill: { padding: '3px 10px', background: 'rgba(201,168,76,.1)', border: '1px solid rgba(201,168,76,.2)', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px', color: '#c9a84c' },
    main: { maxWidth: '1100px', margin: '0 auto', padding: '40px 28px' },
    card: { background: '#111318', border: '1px solid rgba(255,255,255,.07)', borderRadius: '8px', padding: '24px', marginBottom: '24px' },
    label: { fontFamily: 'monospace', fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase' as const, color: '#4a5568', marginBottom: '6px', display: 'block' },
    input: { width: '100%', padding: '10px 14px', background: '#181c23', border: '1px solid rgba(255,255,255,.11)', borderRadius: '6px', color: '#e8eaf0', fontSize: '14px', outline: 'none' },
    btn: { padding: '11px 24px', background: '#c9a84c', border: 'none', borderRadius: '6px', color: '#0a0b0d', fontSize: '14px', fontWeight: '700', cursor: 'pointer' },
    leadCard: { background: '#181c23', border: '1px solid rgba(255,255,255,.07)', borderRadius: '8px', padding: '18px', marginBottom: '12px' },
  }

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.logo}>LeadHunter <span style={{ color: '#c9a84c' }}>Pro</span></div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={s.pill}>{plan} · {remaining}</span>
          <span style={{ fontSize: '13px', color: '#8a93a8' }}>{user.email}</span>
        </div>
      </nav>
      <div style={s.main}>
        <div style={s.card}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: '#e8eaf0', marginBottom: '20px' }}>Find Leads</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={s.label}>Location</label>
              <input style={s.input} value={location} onChange={e => setLocation(e.target.value)} placeholder="Miami, FL" />
            </div>
            <div>
              <label style={s.label}>Business Type</label>
              <input style={s.input} value={category} onChange={e => setCategory(e.target.value)} placeholder="barbershop" />
            </div>
          </div>
          {error && <p style={{ color: '#f87171', fontSize: '13px', marginBottom: '12px' }}>{error} <a href="/upgrade" style={{ color: '#c9a84c' }}>Upgrade →</a></p>}
          <button style={{ ...s.btn, opacity: loading ? .6 : 1 }} onClick={runSearch} disabled={loading}>
            {loading ? 'Scanning...' : 'Run Lead Scan'}
          </button>
        </div>
        {leads.length > 0 && (
          <div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#e8eaf0', marginBottom: '16px' }}>{leads.length} Leads Found</h3>
            {leads.map((lead, i) => (
              <div key={i} style={s.leadCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#e8eaf0', marginBottom: '3px' }}>{lead.place.name}</div>
                    <div style={{ fontSize: '12px', color: '#8a93a8' }}>{lead.place.formatted_address}</div>
                    {lead.place.formatted_phone_number && <div style={{ fontSize: '12px', color: '#8a93a8', marginTop: '2px' }}>{lead.place.formatted_phone_number}</div>}
                  </div>
                  <span style={{ ...s.pill, fontSize: '12px' }}>Score: {lead.score} · {lead.confidence}</span>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  {lead.reasons.map((r: string, j: number) => (
                    <div key={j} style={{ fontSize: '12px', color: '#8a93a8', marginBottom: '3px' }}>-- {r}</div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {lead.place.formatted_phone_number && (
                    <a href={`tel:${lead.place.formatted_phone_number}`} style={{ ...s.btn, fontSize: '12px', padding: '7px 14px', textDecoration: 'none', display: 'inline-block' }}>Call</a>
                  )}
                  <button onClick={() => getPitch(lead)} style={{ ...s.btn, background: 'rgba(201,168,76,.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,.2)', fontSize: '12px', padding: '7px 14px' }}>
                    Get Pitch
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
