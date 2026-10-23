import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const chave = import.meta.env.VITE_SUPABASE_KEY;

const preenchido = (valor) => Boolean(valor) && !valor.startsWith("COLE_");

function apenasOrigem(valor) {
  try {
    return new URL(valor.trim()).origin;
  } catch {
    return null;
  }
}

const urlLimpa = preenchido(url) ? apenasOrigem(url) : null;

export const temSupabase = Boolean(urlLimpa) && preenchido(chave);

export const supabase = temSupabase
  ? createClient(urlLimpa, chave.trim(), { auth: { persistSession: false } })
  : null;
