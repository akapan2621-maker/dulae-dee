import { createBrowserClient as _createBrowserClient } from '@supabase/ssr'

/**
 * Create a Supabase client for use in browser (Client Components).
 * Uses @supabase/ssr for cookie-based auth persistence.
 */
export function createClient() {
  return _createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
