import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { canRunSearch, incrementSearchCount, supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
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

  const allowed = await canRunSearch(user.id)
  if (!allowed) return NextResponse.json({ error: 'Search limit reached. Upgrade to continue.', upgrade: true }, { status: 403 })

  const { location, category } = await req.json()

  // Use Places API (New) - Text Search
  const res = await fetch(
    `https://places.googleapis.com/v1/places:searchText`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY!,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.id,places.types'
      },
      body: JSON.stringify({
        textQuery: `${category} in ${location}`,
        maxResultCount: 20
      })
    }
  )

  const data = await res.json()
  const places = data.places || []

  const scored = places.map((place: any) => {
    let score = 0
    const reasons: string[] = []
    if (!place.websiteUri) { score += 50; reasons.push('No website in Google Places listing') }
    if (place.websiteUri?.includes('facebook.com')) { score += 30; reasons.push('Website links to Facebook only') }
    if (place.websiteUri?.includes('instagram.com')) { score += 30; reasons.push('Website links to Instagram only') }
    if (place.websiteUri?.includes('linktr.ee')) { score += 25; reasons.push('Website is a Linktree page') }
    if (place.userRatingCount > 20) score += 10
    score = Math.min(score, 100)
    const confidence = score >= 80 ? 'HIGH' : score >= 60 ? 'MED-HIGH' : 'MEDIUM'
    return {
      place: {
        name: place.displayName?.text,
        formatted_address: place.formattedAddress,
        formatted_phone_number: place.nationalPhoneNumber,
        website: place.websiteUri,
        rating: place.rating,
        user_ratings_total: place.userRatingCount,
        types: place.types
      },
      score, confidence, reasons
    }
  }).sort((a: any, b: any) => b.score - a.score)

  const { data: search } = await supabaseAdmin
    .from('searches')
    .insert({ user_id: user.id, type: 'leads', location, category, results_count: scored.length })
    .select().single()

  if (search && scored.length > 0) {
    await supabaseAdmin.from('leads').insert(
      scored.map(({ place, score, confidence, reasons }: any) => ({
        search_id: search.id, user_id: user.id,
        name: place.name, address: place.formatted_address,
        phone: place.formatted_phone_number,
        score, confidence, reasons, raw_data: place
      }))
    )
  }

  await incrementSearchCount(user.id)
  return NextResponse.json({ leads: scored, searchId: search?.id })
}
