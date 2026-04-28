import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { businessName, category, address, phone, score } = await req.json()

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    messages: [{ role: 'user', content: `Write a pitch pack for \${businessName} (\${category}) at \${address}. Score: \${score}/100. Return JSON with keys: call, email, emailSubject, sms.` }]
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  try {
    const pitch = JSON.parse(text)
    return NextResponse.json({ pitch })
  } catch {
    return NextResponse.json({ error: 'Failed to parse pitch' }, { status: 500 })