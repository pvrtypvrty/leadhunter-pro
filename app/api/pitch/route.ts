import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { businessName, category, address, phone, score } = await req.json()

  const prompt = `Write a pitch pack for a web developer selling a website to ${businessName} (${category}) at ${address}. Phone: ${phone}. No-website score: ${score}/100.
Return ONLY a JSON object with these exact keys: call (150 word call script with [PAUSE] and [Owner Name]), email (under 100 words), emailSubject (subject line), sms (under 35 words).`

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }]
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const clean = text.replace(/```json\n?|\n?```/g, '').trim()

  try {
    const pitch = JSON.parse(clean)
    return NextResponse.json({ pitch })
  } catch {
    return NextResponse.json({ error: 'Failed to parse pitch' }, { status: 500 })
  }
}
