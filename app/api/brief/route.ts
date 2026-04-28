import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { businessName, category, address, reviews } = await req.json()

  const topReviews = (reviews || []).slice(0, 3).map((r: any) => r.text).join(' | ')

  const prompt = `You are a senior web developer. Write a Lovable.dev project brief for building a website for a local business with no current web presence.

Business: ${businessName}
Category: ${category}
Address: ${address}
Top customer reviews: ${topReviews || 'None available'}

Write a complete project brief covering:
1. Project objective (2 sentences)
2. Pages needed (Home, Services, About, Contact)
3. Must-have features (click-to-call, maps embed, reviews, booking form)
4. Design direction (warm, local, photography-forward)
5. Technical requirements (mobile-first, SSL, schema markup, sub-2s load)
6. SEO setup (title tag format, meta description, LocalBusiness schema)
7. Scope and timeline (4-page site, 5-7 days, $800-$1500)

Format as clean markdown. Be specific and actionable.`

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }]
  })

  const brief = message.content[0].type === 'text' ? message.content[0].text : ''
  return NextResponse.json({ brief })
}