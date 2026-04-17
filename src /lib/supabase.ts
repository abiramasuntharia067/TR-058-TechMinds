import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase credentials
const SUPABASE_URL = 'https://ricnpzagoyrrjmhjxouw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpY25wemFnb3lycmptaGp4b3V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNjI0OTAsImV4cCI6MjA5MTkzODQ5MH0.B3Hjjat6JO4JuRNZjqxnc3VD35Ox2Nnwq7NFYtRA-K8';

// SQL to run in Supabase SQL Editor:
//
// CREATE TABLE waste_analyses (
//   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
//   created_at timestamp with time zone DEFAULT now(),
//   waste_type text NOT NULL,
//   weight_kg numeric NOT NULL,
//   is_verified boolean,
//   verification_confidence integer,
//   parameters jsonb,
//   recommended_methods text[],
//   best_method text,
//   energy_output_kwh numeric,
//   estimated_revenue_inr numeric,
//   co2_saved_kg numeric
// );
// ALTER TABLE waste_analyses ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Allow all" ON waste_analyses FOR ALL USING (true) WITH CHECK (true);

const isConfigured =
  SUPABASE_URL.startsWith("http") && SUPABASE_ANON_KEY.length > 10;

export const supabase = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export type WasteAnalysis = {
  id?: string;
  created_at?: string;
  waste_type: string;
  weight_kg: number;
  is_verified: boolean | null;
  verification_confidence: number | null;
  parameters: { money: boolean; environment: boolean; time: boolean; power: boolean };
  recommended_methods: string[];
  best_method: string;
  energy_output_kwh: number;
  estimated_revenue_inr: number;
  co2_saved_kg: number;
};

export async function saveWasteAnalysis(data: WasteAnalysis) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data: result, error } = await supabase
    .from('waste_analyses').insert([data]).select().single();
  if (error) throw error;
  return result;
}

export async function fetchWasteAnalyses() {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase
    .from('waste_analyses').select('*')
    .order('created_at', { ascending: false }).limit(50);
  if (error) throw error;
  return data as WasteAnalysis[];
}

