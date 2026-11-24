import { useCallback, useEffect, useRef, useState } from "react";
import { temSupabase } from "../lib/supabase";
import { alternarNoBanco, buscarFavoritos } from "../services/favoritosService";

export default function useFavoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [erro, setErro] = useState(null);
  const salvando = useRef(new Set());

  useEffect(() => {
    if (!temSupabase) return;
    let montado = true;

    buscarFavoritos()
      .then((ids) => montado && setFavoritos(ids))
      .catch((e) => montado && setErro(`Não deu para carregar os favoritos: ${e.message}`));

    return () => {
      montado = false;
    };
  }, []);

  const alternarFavorito = useCallback(async (id) => {
    if (!temSupabase || salvando.current.has(id)) return;
    salvando.current.add(id);

    try {
      const favoritou = await alternarNoBanco(id);
      setFavoritos((lista) => {
        const resto = lista.filter((x) => x !== id);
        return favoritou ? [...resto, id] : resto;
      });
      setErro(null);
    } catch (e) {
      setErro(`Não deu para salvar o favorito: ${e.message}`);
    } finally {
      salvando.current.delete(id);
    }
  }, []);

  return { favoritos, alternarFavorito, habilitado: temSupabase, erro };
}
