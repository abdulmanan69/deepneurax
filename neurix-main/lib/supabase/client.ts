import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Single shared Supabase client instance (avoids multiple GoTrueClient warnings)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createSupabaseClient(supabaseUrl, supabaseAnonKey)
  : null as any // During build without env vars

// Re-export createClient — returns the SAME singleton, never creates duplicates
export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured')
    return null
  }
  return supabase
}

// Helper function to get public URL for storage files
export function getStorageUrl(bucket: string, path: string | null | undefined): string | null {
  if (!path) return null
  
  // If it's already a full URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  if (!supabase) return null
  
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
