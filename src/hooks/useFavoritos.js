import { useCallback, useEffect, useState } from "react";

const CHAVE = "pokedex:favoritos";

function carregar() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) ?? [];
  } catch {
    return [];
  }
}

export default function useFavoritos() {
  const [favoritos, setFavoritos] = useState(carregar);

  useEffect(() => {
    localStorage.setItem(CHAVE, JSON.stringify(favoritos));
  }, [favoritos]);

  const alternarFavorito = useCallback(
    (id) => setFavoritos((atual) => (atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id])),
    []
  );

  return { favoritos, alternarFavorito };
}
