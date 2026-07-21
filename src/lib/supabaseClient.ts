import { createClient } from '@supabase/supabase-js';

const importMeta = import.meta as any;

// Expose variables for client-side and server-side environments
const rawSupabaseUrl = 
  (typeof window !== 'undefined' ? (importMeta.env?.NEXT_PUBLIC_SUPABASE_URL || importMeta.env?.VITE_SUPABASE_URL) : undefined) || 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.VITE_SUPABASE_URL || 
  '';

// Clean up URL if it contains trailing '/rest/v1/' or trailing slash
let cleanedUrl = rawSupabaseUrl.trim();
if (cleanedUrl) {
  cleanedUrl = cleanedUrl.replace(/\/rest\/v1\/?$/, '');
  if (cleanedUrl.endsWith('/')) {
    cleanedUrl = cleanedUrl.slice(0, -1);
  }
}
const supabaseUrl = cleanedUrl;

const supabaseAnonKey = 
  (typeof window !== 'undefined' ? (importMeta.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || importMeta.env?.VITE_SUPABASE_ANON_KEY) : undefined) || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.VITE_SUPABASE_ANON_KEY || 
  '';

const isConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isConfigured) {
  console.warn(
    '⚠ Supabase client initialized with missing URL or Anon Key. Please make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
  );
}

// Client-side / Standard Client (uses placeholder when not configured to avoid initialization crash)
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : createClient('https://placeholder-project-id.supabase.co', 'placeholder-anon-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });

// Lazy server-side / Admin Client with Service Role Key (NEVER exposed to frontend)
let supabaseAdminClient: any = null;

export function getSupabaseAdmin() {
  if (typeof window !== 'undefined') {
    throw new Error('Security violation: Cannot initialize Supabase Admin on the client-side.');
  }

  if (!supabaseAdminClient) {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required for server admin operations.');
    }
    supabaseAdminClient = createClient(supabaseUrl, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });
  }
  return supabaseAdminClient;
}
