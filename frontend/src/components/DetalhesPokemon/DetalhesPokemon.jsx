import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useEffect } from "react";
import { ATRIBUTOS } from "../../config/tiposConfig";
import ImagemPokemon from "../ImagemPokemon";
import BarraAtributo from "../BarraAtributo/BarraAtributo";
import EtiquetaTipo from "../EtiquetaTipo/EtiquetaTipo";
import "./DetalhesPokemon.css";

function DetalhesPokemon({
  pokemon,
  onFechar,
  onNavegar,
  onEditar,
  onExcluir,
  removendo,
}) {
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
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Detalhes de ${pokemon.name}`}
        className={`modal type-${tipoPrincipal}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal__close" onClick={onFechar} aria-label="Fechar">
          <X size={20} />
        </button>

        <div className="modal__top">
          <small>#{String(pokemon.id).padStart(3, "0")}</small>
          <h2>{pokemon.name}</h2>
          <ImagemPokemon key={pokemon.id} id={pokemon.id} nome={pokemon.name} />
          <div className="badges">
            {pokemon.types.map((t) => (
              <EtiquetaTipo key={t.id} nome={t.name} />
            ))}
          </div>
        </div>

        <div className="modal__body">
          {ATRIBUTOS.map(([chave, rotulo]) => (
            <BarraAtributo
              key={chave}
              rotulo={rotulo}
              valor={pokemon.stats[chave]}
            />
          ))}
          <p className="modal__total">
            Total: <b>{total}</b>
          </p>
          <div className="form-actions">
            <button className="btn" onClick={onEditar}>
              Editar Pokémon
            </button>
            <button
              className="btn danger"
              disabled={removendo}
              onClick={onExcluir}
            >
              {removendo ? "Excluindo…" : "Excluir Pokémon"}
            </button>
          </div>
          <div className="modal__nav">
            <button className="btn" onClick={() => onNavegar(-1)}>
              <ArrowLeft className="icone" size={16} /> Anterior
            </button>
            <button className="btn" onClick={() => onNavegar(1)}>
              Próximo <ArrowRight className="icone" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalhesPokemon;
