import { supabase } from "../lib/supabase";
import { tokenDoNavegador } from "../utils/tokenDoNavegador";

async function chamar(funcao, parametros) {
  const { data, error } = await supabase.rpc(funcao, { p_token: tokenDoNavegador(), ...parametros });
  if (error) throw new Error(error.message);
  return data;
}

export async function buscarFavoritos() {
  const linhas = await chamar("listar_favoritos");
  return (linhas ?? []).map((linha) => linha.pokemon_id);
}

export async function alternarNoBanco(pokemonId) {
  return (await chamar("alternar_favorito", { p_pokemon_id: pokemonId })) === true;
}
