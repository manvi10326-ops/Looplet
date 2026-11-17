import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_PROJECT_ID = 'inizjboarjuilsosnyma';
export const DEFAULT_SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;

let cachedClient: SupabaseClient | null = null;
let cachedConfigKey = '';

function cleanEnvValue(value: string | undefined): string {
  const trimmed = (value || '').trim();
  if (!trimmed || trimmed.startsWith('MY_SUPABASE_')) return '';
  return trimmed;
}

export function getSupabaseConfig() {
  const url =
    cleanEnvValue(process.env.SUPABASE_URL) ||
    cleanEnvValue(process.env.VITE_SUPABASE_URL) ||
    DEFAULT_SUPABASE_URL;

  const key =
    cleanEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY) ||
    cleanEnvValue(process.env.SUPABASE_KEY) ||
    cleanEnvValue(process.env.SUPABASE_ANON_KEY) ||
    cleanEnvValue(process.env.VITE_SUPABASE_ANON_KEY);

  return { url, key };
}

export function getSupabaseServerClient(): SupabaseClient {
  const { url, key } = getSupabaseConfig();
  if (!key) {
    throw new Error('MISSING_SUPABASE_KEY');
  }

  const configSignature = `${url}::${key.slice(0, 12)}`;
  if (!cachedClient || cachedConfigKey !== configSignature) {
    cachedClient = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    cachedConfigKey = configSignature;
  }

  return cachedClient;
}
