import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getSkills() {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getProjects() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getCertificates() {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) return null;
    return data;
  } catch {
    return null;
  }
}

