// Supabase client — imported by store.js only.
// Never import this directly from pages; always go through store.js.
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE } from "./config.js";

export const db = createClient(SUPABASE.url, SUPABASE.anonKey);
