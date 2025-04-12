
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Use the actual Supabase project URL and publishable key
const supabaseUrl = "https://cmhkggqgsfwfntayfaly.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtaGtnZ3Fnc2Z3Zm50YXlmYWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NzQ3OTAsImV4cCI6MjA2MDA1MDc5MH0.l2rO-JgkzFqpRUv4XQIsTMLCx63GBMXyFV1gCxmlvJQ";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
