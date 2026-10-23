import { useEffect } from "react";
import { ATRIBUTOS } from "../../config/tiposConfig";
import { urlImagem } from "../../services/pokedexService";
import BarraAtributo from "../BarraAtributo/BarraAtributo";
import EtiquetaTipo from "../EtiquetaTipo/EtiquetaTipo";
import "./DetalhesPokemon.css";

function DetalhesPokemon({ pokemon, onFechar, onNavegar }) {
  useEffect(() => {
    const aoTeclar = (e) => {
      if (e.key === "Escape") onFechar();
      if (e.key === "ArrowLeft") onNavegar(-1);
      if (e.key === "ArrowRight") onNavegar(1);
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [onFechar, onNavegar]);

  const total = Object.values(pokemon.stats).reduce((soma, v) => soma + v, 0);
  const tipoPrincipal = pokemon.types[0].name.toLowerCase();

  return (
    <div className="overlay" onClick={onFechar}>
      <div className={`modal type-${tipoPrincipal}`} onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onFechar} aria-label="Fechar">
          ✕
        </button>

        <div className="modal__top">
          <small>#{String(pokemon.id).padStart(3, "0")}</small>
          <h2>{pokemon.name}</h2>
          <img src={urlImagem(pokemon.id)} alt={pokemon.name} />
          <div className="badges">
            {pokemon.types.map((t) => (
              <EtiquetaTipo key={t.id} nome={t.name} />
            ))}
          </div>
        </div>

        <div className="modal__body">
          {ATRIBUTOS.map(([chave, rotulo]) => (
            <BarraAtributo key={chave} rotulo={rotulo} valor={pokemon.stats[chave]} />
          ))}
          <p className="modal__total">
            Total: <b>{total}</b>
          </p>
          <div className="modal__nav">
            <button className="btn" onClick={() => onNavegar(-1)}>
              ← Anterior
            </button>
            <button className="btn" onClick={() => onNavegar(1)}>
              Próximo →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalhesPokemon;
