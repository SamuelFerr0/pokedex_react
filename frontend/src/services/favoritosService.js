import { requisicao } from "./api";
import { tokenDoNavegador } from "../utils/tokenDoNavegador";

function headers() {
  return { "X-Pokedex-Token": tokenDoNavegador() };
}

export function buscarFavoritos() {
  return requisicao("favoritos", { headers: headers() });
}

export function salvarFavorito(pokemonId, favoritar) {
  return requisicao(`favoritos/${pokemonId}`, {
    method: favoritar ? "PUT" : "DELETE",
    headers: headers(),
  });
}
