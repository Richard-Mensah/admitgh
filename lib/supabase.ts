// lib/supabase.ts
// Supabase client — server (service role) and browser (anon) variants

import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * Browser-safe client — uses anon key, respects RLS.
 * Use in Client Components and API routes that don't need admin access.
 */
export function createBrowserClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Server-only client — uses service role key, bypasses RLS.
 * Use ONLY in API routes and Server Components that need full DB access.
 * NEVER expose this to the browser.
 */
export function createServerClient() {
  if (!supabaseServiceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set — server client unavailable")
  }
  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Default export for convenience in Server Components.
 * Equivalent to createServerClient() — uses service role.
 */
export const supabase = () => createServerClient()
