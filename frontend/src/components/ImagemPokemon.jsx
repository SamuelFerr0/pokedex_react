import { useState } from "react";
import { urlImagem } from "../services/pokedexService";
export default function ImagemPokemon({ id, nome = "", ...props }) {
  const [falhou, setFalhou] = useState(false);
  return falhou ? (
    <span
      className="sem-imagem"
      role="img"
      aria-label={`Sem ilustração para ${nome || id}`}
    >
      Sem ilustração
    </span>
  ) : (
    <img
      {...props}
      src={urlImagem(id)}
      alt={nome}
      onError={() => setFalhou(true)}
    />
  );
}
