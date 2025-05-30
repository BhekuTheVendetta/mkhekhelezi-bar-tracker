import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'postgresql://postgres.dyejpbjdhunrnogirvjo:[Mkhekhelezi#1728]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5ZWpwYmpkaHVucm5vZ2lydmpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MTM1NDksImV4cCI6MjA2NDE4OTU0OX0.XPgg5n_cj21tlj_I5OlBrl48LT5Ly4sKg_e9A8RmeJA';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;