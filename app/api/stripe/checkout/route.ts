import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { planId } = await req.json()

  const { data: plan } = await supabaseAdmin
    .from('plans')
    .select('stripe_price_id')
    .eq('id', planId)
    .single()

  if (!plan?.stripe_price_id)
    return NextResponse.json({ error: 'Plan not found' }, { status: 404 })

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: plan.stripe_price_id, quantity: 1 }],
    customer_email: user.email,
    metadata: { userId: user.id, planId },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/upgrade`,
  })

  return NextResponse.json({ url: session.url })
}