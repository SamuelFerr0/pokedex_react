const API = import.meta.env.VITE_API_URL || "";

export async function requisicao(caminho, options = {}) {
  let response;
  try {
    response = await fetch(`${API}/api/${caminho}`, options);
  } catch {
    throw new Error(
      "Não foi possível conectar à API. Confira se o backend está iniciado.",
    );
  }
  if (!response.ok) {
    const erro = await response.json().catch(() => ({}));
    throw new Error(erro.mensagem || `A operação falhou (${response.status}).`);
  }
  return response.status === 204 ? null : response.json();
}
export const listarPokemons = () => requisicao("pokemons");
export const buscarPokemon = (id) => requisicao(`pokemons/${id}`);
export const listarTipos = () => requisicao("tipos");
export const listarTreinadores = () => requisicao("treinadores");
export const salvarPokemon = (dados, editando) =>
  requisicao(editando ? `pokemons/${dados.id}` : "pokemons", {
    method: editando ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
export const excluirPokemon = (id) =>
  requisicao(`pokemons/${id}`, { method: "DELETE" });
