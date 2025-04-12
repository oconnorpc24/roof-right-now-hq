
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Add fallback values for development - replace these with your actual Supabase project values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Check if we have required values
if (!supabaseUrl || supabaseUrl === 'https://your-project-url.supabase.co') {
  console.error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey || supabaseAnonKey === 'your-anon-key') {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
