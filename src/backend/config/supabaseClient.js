//Handles Supabase connection setup (URL, anon key)

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env variables --check .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: localStorage,
    flowType: 'pkce'           // mandatory for magic links
  }
});

// Magic Link
export async function sendMagicLink(email) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: { 
      emailRedirectTo: window.location.origin + '/welcome' 
    }
  });
  if (error) throw error;
  return data;
}