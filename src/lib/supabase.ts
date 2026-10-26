import { createClient } from "@supabase/supabase-js";

// Read Supabase credentials from environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.includes("placeholder")
);

// Fallback configuration allows the client to instantiate cleanly even before custom keys are added
const effectiveUrl = isSupabaseConfigured ? supabaseUrl : "https://placeholder-tradex.supabase.co";
const effectiveKey = isSupabaseConfigured ? supabaseKey : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tradex-demo-key";

export const supabase = createClient(
  effectiveUrl,
  effectiveKey,
  {
    auth: {
      flowType: "pkce",
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
