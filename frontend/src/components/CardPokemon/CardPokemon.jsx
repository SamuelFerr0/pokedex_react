import { Star } from "lucide-react";
import { urlImagem } from "../../services/pokedexService";
import EtiquetaTipo from "../EtiquetaTipo/EtiquetaTipo";
import "./CardPokemon.css";

function CardPokemon({ pokemon, favorito, onFavoritar, onSelecionar }) {
  const { id, name, stats, types } = pokemon;
  const resumo = [
    ["HP", stats.hp],
    ["ATK", stats.attack],
    ["DEF", stats.defense],
    ["SP.A", stats.specialAttack],
    ["SP.D", stats.specialDefense],
    ["SPD", stats.speed],
  ];

  return (
    <article className={`card type-${types[0].name.toLowerCase()}`} onClick={() => onSelecionar(pokemon)}>
      <span className="card__id">#{String(id).padStart(3, "0")}</span>
      <button
        className={`card__fav ${favorito ? "on" : ""}`}
        title="Favoritar"
        onClick={(e) => {
          e.stopPropagation();
          onFavoritar(id);
        }}
      >
        <Star size={22} fill={favorito ? "currentColor" : "none"} />
      </button>
      <img src={urlImagem(id)} alt={name} loading="lazy" />
      <h3>{name}</h3>
      <div className="badges">
        {types.map((t) => (
          <EtiquetaTipo key={t.id} nome={t.name} />
        ))}
      </div>
      <div className="card__stats">
        {resumo.map(([rotulo, valor]) => (
          <span key={rotulo}>
            {rotulo}
            <b>{valor}</b>
          </span>
        ))}
      </div>
    </article>
  );
}

export default CardPokemon;
