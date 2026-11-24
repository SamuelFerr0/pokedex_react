import dados from "../data/pokedex-data.json";

const tipoSemTipo = dados.types.find((tipo) => tipo.name === "Typeless");
const pokemons = dados.pokemon.map((pokemon) => ({
  ...pokemon,
  types: pokemon.types.length ? pokemon.types : [tipoSemTipo],
}));
const tipos = dados.types.filter((t) => pokemons.some((p) => p.types.some((pt) => pt.id === t.id)));
const porId = new Map(pokemons.map((p) => [p.id, p]));

export const urlImagem = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export const listarPokemons = () => pokemons;

export const listarTipos = () => tipos;

export const listarTreinadores = () =>
  dados.trainers.map((t) => ({
    id: t.id,
    nome: t.name,
    insignias: t.badges,
    pokemons: t.pokemonIds.map((id) => porId.get(id)).filter(Boolean),
  }));

export function filtrarPokemons({ busca, tipoId, ordem, favoritos, apenasFavoritos }) {
  const texto = busca.trim().toLowerCase().replace("#", "");

  const lista = pokemons.filter((p) => {
    const naBusca = !texto || p.name.toLowerCase().includes(texto) || String(p.id) === texto;
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
