// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lbigovudnpakkkrtkmxl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiaWdvdnVkbnBha2trcnRrbXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE5MzA0OTAsImV4cCI6MjAxNzUwNjQ5MH0.89jCT4lPa6U0uBRCIO4rbR9GlwQhQbfVMWDKH_cDrwo';

const supabase = createClient(supabaseUrl, supabaseKey);
const storage = supabase.storage; // Access the storage functionality

export { supabase, storage };
export const auth = supabase.auth;
// export default supabase;;
