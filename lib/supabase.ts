import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const createSupabaseClient = () =>
  createClientComponentClient()

export async function getUserSubscription(userId: string) {
  const { data } = await supabaseAdmin
    .from('subscriptions')
    .select('*, plans(*)')
    .eq('user_id', userId)
    .single()
  return data
}

export async function canRunSearch(userId: string) {
  const sub = await getUserSubscription(userId)
  if (!sub) return false
  if (sub.plan_id === 'enterprise') return true
  const limit = sub.plans?.searches_limit ?? 0
  return sub.searches_used < limit
}

export async function incrementSearchCount(userId: string) {
  const sub = await getUserSubscription(userId)
  if (!sub) return
  await supabaseAdmin
    .from('subscriptions')
    .update({ searches_used: (sub.searches_used || 0) + 1 })
    .eq('user_id', userId)
}