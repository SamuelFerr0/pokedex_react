export const urlImagem = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export {
  listarPokemons,
  buscarPokemon,
  listarTipos,
  listarTreinadores,
  salvarPokemon,
  excluirPokemon,
} from "./api";

export function filtrarPokemons(
  pokemons,
  { busca, tipoId, ordem, favoritos, apenasFavoritos },
) {
  const texto = busca.trim().toLowerCase().replace("#", "");

  const lista = pokemons.filter((p) => {
    const naBusca =
      !texto || p.name.toLowerCase().includes(texto) || String(p.id) === texto;
    const noTipo = !tipoId || p.types.some((t) => String(t.id) === tipoId);
    const favorito = !apenasFavoritos || favoritos.includes(p.id);
    return naBusca && noTipo && favorito;
  });

  return lista.sort((a, b) => {
    if (ordem === "name") return a.name.localeCompare(b.name);
    if (ordem === "id" || !ordem) return a.id - b.id;
    return b.stats[ordem] - a.stats[ordem];
  });
}
