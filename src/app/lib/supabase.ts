import { createClient } from "@supabase/supabase-js";

// Ces deux valeurs identifient le projet Supabase d'ELITEWAY.
// La clé "publishable" (anciennement "anon") est prévue par Supabase pour
// vivre dans le code envoyé au navigateur — elle n'est pas secrète tant que
// la sécurité au niveau des lignes (Row Level Security) est active sur les
// tables, ce qui est le cas ici (voir supabase/schema.sql).
const SUPABASE_URL = "https://jycmbpkrwpvwvcoojuib.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_boHqHjDHE4U4cLqk6HD2VQ_VIDho4zv";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
