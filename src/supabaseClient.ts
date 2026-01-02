import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient;

/**
 * Initialize and return the Supabase client
 * @returns {SupabaseClient} Initialized Supabase client
 */
export const getSupabaseClient = (): SupabaseClient => {
  if (!supabase) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Missing Supabase credentials. Please check SUPABASE_URL and SUPABASE_ANON_KEY in your .env file',
      );
    }

    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabase;
};

export default getSupabaseClient;
