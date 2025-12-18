import { createClient } from '@supabase/supabase-js';

// Для серверного рендеринга используем process.env (в production) и import.meta.env (в dev)
const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL || 'https://baze-supabase.crv1ic.easypanel.host';
const supabaseKey = import.meta.env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseKey) {
  console.error('❌ SUPABASE_ANON_KEY is not set!');
  console.error('Available env vars:', Object.keys(import.meta.env));
}

export const supabase = createClient(supabaseUrl, supabaseKey);
