import { supabase } from './client'

// Reuse the shared Supabase client (avoids multiple GoTrueClient instances)
export const adminClient = supabase

// ============ AUTH ============
export async function signIn(email: string, password: string) {
  if (!adminClient) throw new Error('Supabase not configured')
  const { data, error } = await adminClient.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  if (!adminClient) return
  await adminClient.auth.signOut()
}

export async function getSession() {
  if (!adminClient) return null
  const { data } = await adminClient.auth.getSession()
  return data.session
}

// ============ GENERIC CRUD ============
async function fetchAll(table: string) {
  if (!adminClient) return []
  const { data, error } = await adminClient.from(table).select('*').order('id')
  if (error) throw error
  return data || []
}

async function fetchOne(table: string, id: string | number) {
  if (!adminClient) return null
  const { data, error } = await adminClient.from(table).select('*').eq('id', id).single()
  if (error) throw error
  return data
}

async function insertRow(table: string, row: Record<string, unknown>) {
  if (!adminClient) throw new Error('Supabase not configured')
  const { data, error } = await adminClient.from(table).insert(row).select()
  if (error) throw error
  if (!data || data.length === 0) {
    throw new Error('Insert failed – check Supabase RLS policies (authenticated INSERT permission required)')
  }
  return data[0]
}

async function updateRow(table: string, id: string | number, updates: Record<string, unknown>) {
  if (!adminClient) throw new Error('Supabase not configured')
  const { data, error } = await adminClient.from(table).update(updates).eq('id', id).select()
  if (error) throw error
  if (!data || data.length === 0) {
    throw new Error('Update failed – check Supabase RLS policies (authenticated UPDATE + SELECT permission required)')
  }
  return data[0]
}

async function deleteRow(table: string, id: string | number) {
  if (!adminClient) throw new Error('Supabase not configured')
  const { error } = await adminClient.from(table).delete().eq('id', id)
  if (error) throw error
  // Verify deletion
  const { data: check } = await adminClient.from(table).select('id').eq('id', id)
  if (check && check.length > 0) {
    throw new Error('Delete failed – check Supabase RLS policies (authenticated DELETE permission required)')
  }
}

async function upsertSingleton(table: string, row: Record<string, unknown>) {
  if (!adminClient) throw new Error('Supabase not configured')
  // For tables with only one row (hero, footer, cta)
  const { data: existing } = await adminClient.from(table).select('id').limit(1)
  if (existing && existing.length > 0) {
    const { data, error } = await adminClient.from(table).update(row).eq('id', existing[0].id).select()
    if (error) throw error
    if (!data || data.length === 0) {
      throw new Error('Update failed – check Supabase RLS policies (authenticated UPDATE + SELECT permission required)')
    }
    return data[0]
  } else {
    const { data, error } = await adminClient.from(table).insert(row).select()
    if (error) throw error
    if (!data || data.length === 0) {
      throw new Error('Insert failed – check Supabase RLS policies (authenticated INSERT permission required)')
    }
    return data[0]
  }
}

// ============ HERO ============
export const heroAdmin = {
  get: () => fetchAll('hero').then(rows => rows[0] || null),
  save: (data: Record<string, unknown>) => upsertSingleton('hero', data),
}

// ============ SERVICES ============
export const servicesAdmin = {
  getAll: () => fetchAll('services'),
  get: (id: string | number) => fetchOne('services', id),
  create: (data: Record<string, unknown>) => insertRow('services', data),
  update: (id: string | number, data: Record<string, unknown>) => updateRow('services', id, data),
  delete: (id: string | number) => deleteRow('services', id),
}

// ============ PRODUCTS ============
export const productsAdmin = {
  getAll: () => fetchAll('products'),
  get: (id: string | number) => fetchOne('products', id),
  create: (data: Record<string, unknown>) => insertRow('products', data),
  update: (id: string | number, data: Record<string, unknown>) => updateRow('products', id, data),
  delete: (id: string | number) => deleteRow('products', id),
}

// ============ METRICS ============
export const metricsAdmin = {
  getAll: () => fetchAll('metrics'),
  get: (id: string | number) => fetchOne('metrics', id),
  create: (data: Record<string, unknown>) => insertRow('metrics', data),
  update: (id: string | number, data: Record<string, unknown>) => updateRow('metrics', id, data),
  delete: (id: string | number) => deleteRow('metrics', id),
}

// ============ CASE STUDIES ============
export const caseStudiesAdmin = {
  getAll: () => fetchAll('case_studies'),
  get: (id: string | number) => fetchOne('case_studies', id),
  create: (data: Record<string, unknown>) => insertRow('case_studies', data),
  update: (id: string | number, data: Record<string, unknown>) => updateRow('case_studies', id, data),
  delete: (id: string | number) => deleteRow('case_studies', id),
}

// ============ TESTIMONIALS ============
export const testimonialsAdmin = {
  getAll: () => fetchAll('testimonials'),
  get: (id: string | number) => fetchOne('testimonials', id),
  create: (data: Record<string, unknown>) => insertRow('testimonials', data),
  update: (id: string | number, data: Record<string, unknown>) => updateRow('testimonials', id, data),
  delete: (id: string | number) => deleteRow('testimonials', id),
}

// ============ BLOG POSTS ============
export const blogAdmin = {
  getAll: () => fetchAll('blog_posts'),
  get: (id: string | number) => fetchOne('blog_posts', id),
  create: (data: Record<string, unknown>) => insertRow('blog_posts', data),
  update: (id: string | number, data: Record<string, unknown>) => updateRow('blog_posts', id, data),
  delete: (id: string | number) => deleteRow('blog_posts', id),
}

// ============ CTA ============
export const ctaAdmin = {
  get: () => fetchAll('cta').then(rows => rows[0] || null),
  save: (data: Record<string, unknown>) => upsertSingleton('cta', data),
}

// ============ FOOTER ============
export const footerAdmin = {
  get: () => fetchAll('footer').then(rows => rows[0] || null),
  save: (data: Record<string, unknown>) => upsertSingleton('footer', data),
}

// ============ SPHERE SHOWCASE (Section Settings) ============
export const sphereShowcaseAdmin = {
  get: () => fetchAll('sphere_showcase').then(rows => rows[0] || null),
  save: (data: Record<string, unknown>) => upsertSingleton('sphere_showcase', data),
}

// ============ SPHERE SHOWCASE ITEMS ============
export const sphereShowcaseItemsAdmin = {
  getAll: async () => {
    if (!adminClient) return []
    const { data, error } = await adminClient.from('sphere_showcase_items').select('*').order('order', { ascending: true })
    if (error) throw error
    return data || []
  },
  get: (id: string | number) => fetchOne('sphere_showcase_items', id),
  create: (data: Record<string, unknown>) => insertRow('sphere_showcase_items', data),
  update: (id: string | number, data: Record<string, unknown>) => updateRow('sphere_showcase_items', id, data),
  delete: (id: string | number) => deleteRow('sphere_showcase_items', id),
}

// ============ CONTACT SUBMISSIONS ============
export const contactSubmissionsAdmin = {
  getAll: async () => {
    if (!adminClient) return []
    const { data, error } = await adminClient.from('contact_submissions').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },
  get: (id: string | number) => fetchOne('contact_submissions', id),
  update: (id: string | number, data: Record<string, unknown>) => updateRow('contact_submissions', id, data),
  delete: (id: string | number) => deleteRow('contact_submissions', id),
}

// ============ TABLE COUNTS (for dashboard) ============
export async function getTableCounts() {
  if (!adminClient) return {}
  const tables = ['hero', 'services', 'products', 'metrics', 'case_studies', 'testimonials', 'blog_posts', 'footer', 'cta', 'sphere_showcase', 'sphere_showcase_items', 'contact_submissions']
  const counts: Record<string, number> = {}
  
  await Promise.all(
    tables.map(async (table) => {
      const { data } = await adminClient.from(table).select('id')
      counts[table] = data?.length || 0
    })
  )
  
  return counts
}
