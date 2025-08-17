import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL as string;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY as string;

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (console.warn('[Supabase] Variables REACT_APP_SUPABASE_URL/REACT_APP_SUPABASE_ANON_KEY no definidas. Usando modo local.'), null as any);


