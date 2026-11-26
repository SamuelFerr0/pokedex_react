import { useCallback, useEffect, useRef, useState } from "react";
import { salvarFavorito, buscarFavoritos } from "../services/favoritosService";

export default function useFavoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [pronto, setPronto] = useState(false);
  const [erro, setErro] = useState(null);
  const salvando = useRef(new Set());

  useEffect(() => {
    let montado = true;

    buscarFavoritos()
      .then((ids) => {
        if (montado) {
          setFavoritos(ids);
          setPronto(true);
        }
      })
      .catch(
        (e) =>
          montado &&
          setErro(`Não deu para carregar os favoritos: ${e.message}`),
      );

    return () => {
      montado = false;
    };
  }, []);

  const alternarFavorito = useCallback(async (id) => {
    if (!pronto || salvando.current.has(id)) return;
    salvando.current.add(id);

    try {
      const favoritou = !favoritos.includes(id);
      await salvarFavorito(id, favoritou);
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
  }, [favoritos, pronto]);

  return { favoritos, alternarFavorito, erro };
}
