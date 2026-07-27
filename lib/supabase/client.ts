import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';

export function createClient() {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  // Sanitize url: strip trailing slashes or /rest/v1 /auth/v1 paths if accidentally included in env
  url = url.replace(/\/(rest|auth)\/v\d+\/?$/, '').replace(/\/+$/, '');

  return createBrowserClient<Database>(
    url,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
