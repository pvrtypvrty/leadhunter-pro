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

  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY!,
      'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.id,places.types'
    },
    body: JSON.stringify({ textQuery: `${category} in ${location}`, maxResultCount: 20 })
  })

  const data = await res.json()
  const places = data.places || []

  // Social media / booking-only domains that are NOT real websites
  const FAKE_WEBSITES = [
    'facebook.com', 'fb.com', 'instagram.com', 'linktr.ee', 'linktree',
    'twitter.com', 'yelp.com', 'google.com', 'maps.google',
    'vagaro.com', 'booksy.com', 'squareup.com', 'square.site',
    'getsquire.com', 'fresha.com', 'mindbodyonline.com',
    'appointy.com', 'schedulicity.com', 'genbook.com',
    'wheree.com', 'squarespace.com/booking', 'wixsite.com/booking',
    'youcanbook.me', 'calendly.com'
  ]

  function hasRealWebsite(websiteUri: string | undefined): boolean {
    if (!websiteUri) return false
    return !FAKE_WEBSITES.some(fake => websiteUri.includes(fake))
  }

  function scoreAndClassify(place: any) {
    const website = place.websiteUri
    const reasons: string[] = []
    let score = 0
    let isLead = false

    if (!website) {
      // No website at all - best lead
      score = 50
      reasons.push('No website in Google Places listing')
      isLead = true
    } else if (website.includes('facebook.com') || website.includes('fb.com')) {
      score = 45
      reasons.push('Website field links to Facebook only')
      isLead = true
    } else if (website.includes('instagram.com')) {
      score = 45
      reasons.push('Website field links to Instagram only')
      isLead = true
    } else if (website.includes('linktr.ee')) {
      score = 40
      reasons.push('Website is a Linktree page, no real site')
      isLead = true
    } else if (
      website.includes('vagaro.com') || website.includes('booksy.com') ||
      website.includes('squareup.com') || website.includes('square.site') ||
      website.includes('getsquire.com') || website.includes('fresha.com') ||
      website.includes('wheree.com') || website.includes('appointy.com')
    ) {
      score = 35
      reasons.push('Website is only a booking platform link, no real site')
      isLead = true
    } else {
      // Has a real website - NOT a lead
      return null
    }

    // Bonus scoring
    if (place.userRatingCount > 50) { score += 10; reasons.push('Established business with strong review count') }
    if (place.userRatingCount > 100) score += 10
    if (place.rating >= 4.5) score += 5

    score = Math.min(score, 100)
    const confidence = score >= 70 ? 'HIGH' : score >= 50 ? 'MED-HIGH' : 'MEDIUM'

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
      score, confidence, reasons, isLead
    }
  }

  // Filter to ONLY leads (businesses without real websites)
  const leads = places
    .map((p: any) => scoreAndClassify(p))
    .filter(Boolean)
    .sort((a: any, b: any) => b.score - a.score)

  // Save search to Supabase
  const { data: search } = await supabaseAdmin
    .from('searches')
    .insert({ user_id: user.id, type: 'leads', location, category, results_count: leads.length })
    .select().single()

  if (search && leads.length > 0) {
    await supabaseAdmin.from('leads').insert(
      leads.map(({ place, score, confidence, reasons }: any) => ({
        search_id: search.id, user_id: user.id,
        name: place.name, address: place.formatted_address,
        phone: place.formatted_phone_number,
        score, confidence, reasons, raw_data: place
      }))
    )
  }

  await incrementSearchCount(user.id)
  return NextResponse.json({ leads, searchId: search?.id, total_scanned: places.length })
}
